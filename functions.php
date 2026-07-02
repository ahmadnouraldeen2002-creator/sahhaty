<?php
/**
 * Sahhaty Smart Health Coach - WordPress Theme
 */

add_action('wp_enqueue_scripts', function () {
  // Theme stylesheet
  wp_enqueue_style('sahhaty-style', get_stylesheet_uri(), [], '1.0.0');

  // Google Font (Cairo)
  wp_enqueue_style('sahhaty-cairo', 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap', [], null);

  // Tailwind CDN (for styling used by the app)
  wp_enqueue_script('sahhaty-tailwind', 'https://cdn.tailwindcss.com', [], null, false);
});

/**
 * Print Import Map + env shim in <head>.
 */
add_action('wp_head', function () {
  echo "<script>window.process = window.process || { env: {} }; window.process.env = window.process.env || {};</script>\n";

  // ✅ AdSense هنا مرة واحدة
  echo '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7231927079579766" crossorigin="anonymous"></script>' . "\n";


  $ajax = admin_url('admin-ajax.php');
  $nonce = wp_create_nonce('sahhaty_nonce');
  $loggedIn = is_user_logged_in() ? 'true' : 'false';

  echo "<script>
    window.SAHHATY_WP = {
      ajaxUrl: " . json_encode($ajax) . ",
      nonce: " . json_encode($nonce) . ",
      loggedIn: {$loggedIn}
    };
  </script>\n";


  echo '<script type="importmap">
{
  "imports": {
    "react/": "https://esm.sh/react@^19.2.3/",
    "react": "https://esm.sh/react@^19.2.3",
    "react-dom/": "https://esm.sh/react-dom@^19.2.3/",
    "recharts": "https://esm.sh/recharts@^3.6.0",
    "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
    "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
  }
}
</script>';
});

/**
 * Load the compiled app entry as an ES module in the footer.
 */
add_action('wp_footer', function () {
  $entry_path = get_stylesheet_directory() . '/assets/app/index.js';
  $entry_url = get_stylesheet_directory_uri() . '/assets/app/index.js';
  $entry_ver = file_exists($entry_path) ? filemtime($entry_path) : time();
  $entry = add_query_arg('ver', $entry_ver, $entry_url);
  echo "<script type=\"module\" src=\"" . esc_url($entry) . "\"></script>\n";
}, 100);
/* ===============================
   Sahhaty - User Data Save & Load
   =============================== */

// حفظ بيانات المستخدم
add_action('wp_ajax_sahhaty_save_data', function () {
  if (!is_user_logged_in()) {
    wp_send_json_error('not_logged_in', 401);
  }

  check_ajax_referer('sahhaty_nonce', 'nonce');

  $user_id = get_current_user_id();
  $raw = file_get_contents('php://input');
  $data = json_decode($raw, true);

  if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
    wp_send_json_error('invalid_data', 400);
  }

  update_user_meta($user_id, 'sahhaty_user_data', wp_json_encode($data, JSON_UNESCAPED_UNICODE));

  wp_send_json_success(['saved' => true]);
});

// جلب بيانات المستخدم
add_action('wp_ajax_sahhaty_load_data', function () {
  if (!is_user_logged_in()) {
    wp_send_json_error('not_logged_in', 401);
  }

  check_ajax_referer('sahhaty_nonce', 'nonce');

  $user_id = get_current_user_id();
  $saved = get_user_meta($user_id, 'sahhaty_user_data', true);

  if (!$saved) {
    wp_send_json_success(['data' => null]);
  }

  $decoded = json_decode($saved, true);
  if (json_last_error() !== JSON_ERROR_NONE) {
    $decoded = null;
  }

  wp_send_json_success(['data' => $decoded]);
});

add_action('wp_ajax_nopriv_sahhaty_save_data', function () {
  wp_send_json_success(['saved' => false]);
});

add_action('wp_ajax_nopriv_sahhaty_load_data', function () {
  wp_send_json_success(['data' => null]);
});

/* ===============================
   Sahhaty - Server-side Gemini proxy
   =============================== */

function sahhaty_read_env_file_key($var_name)
{
  $env_file = get_stylesheet_directory() . '/.env';
  if (!file_exists($env_file))
    return '';
  $lines = file($env_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  foreach ($lines as $line) {
    $line = trim($line);
    if ($line === '' || $line[0] === '#')
      continue;
    if (strpos($line, '=') === false)
      continue;
    list($name, $value) = explode('=', $line, 2);
    if (trim($name) === $var_name) {
      return trim($value);
    }
  }
  return '';
}

function sahhaty_get_gemini_api_key()
{
  $keys = [
    defined('SAHHATY_GEMINI_API_KEY') ? SAHHATY_GEMINI_API_KEY : '',
    defined('SAHHATY_API_KEY') ? SAHHATY_API_KEY : '',
    getenv('SAHHATY_GEMINI_API_KEY'),
    getenv('GEMINI_API_KEY'),
    getenv('GOOGLE_API_KEY'),
    getenv('SAHHATY_API_KEY'),
    // Fallback: read directly from theme .env file
    sahhaty_read_env_file_key('SAHHATY_GEMINI_API_KEY'),
    sahhaty_read_env_file_key('GEMINI_API_KEY'),
    sahhaty_read_env_file_key('SAHHATY_API_KEY'),
  ];

  foreach ($keys as $key) {
    $key = is_string($key) ? trim($key) : '';
    if ($key !== '' && stripos($key, 'put-your') === false && stripos($key, 'change-me') === false) {
      return $key;
    }
  }

  return '';
}

function sahhaty_get_client_ip()
{
  $ip = 'unknown';
  if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
    $ip = $_SERVER['HTTP_CLIENT_IP'];
  } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
    $ip = trim(end($ips));
  } elseif (!empty($_SERVER['REMOTE_ADDR'])) {
    $ip = $_SERVER['REMOTE_ADDR'];
  }
  $ip = sanitize_text_field(wp_unslash($ip));
  return preg_replace('/[^0-9a-fA-F:\.]/', '', $ip);
}

function sahhaty_ai_rate_limit($scope, $limit = 30, $window = HOUR_IN_SECONDS)
{
  $key = 'sahhaty_ai_' . md5($scope . '|' . sahhaty_get_client_ip());
  $count = (int) get_transient($key);

  if ($count >= $limit) {
    wp_send_json_error(['code' => 'rate_limited', 'message' => 'Too many AI requests. Try again later.'], 429);
  }

  set_transient($key, $count + 1, $window);
}

function sahhaty_gemini_generate()
{
  $nonce = isset($_REQUEST['nonce']) ? sanitize_text_field(wp_unslash($_REQUEST['nonce'])) : '';
  if (!wp_verify_nonce($nonce, 'sahhaty_nonce')) {
    wp_send_json_error(['code' => 'invalid_nonce', 'message' => 'Security check failed.'], 403);
  }
  sahhaty_ai_rate_limit('gemini_generate');

  $api_key = sahhaty_get_gemini_api_key();
  if ($api_key === '') {
    wp_send_json_error(['code' => 'missing_gemini_api_key', 'message' => 'Gemini API key is not configured.'], 500);
  }
  $debug_key = sprintf("Length: %d, Start: %s, End: %s", strlen($api_key), substr($api_key, 0, 8), substr($api_key, -8));

  $raw = file_get_contents('php://input');
  $data = json_decode($raw, true);
  if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
    wp_send_json_error(['code' => 'invalid_json', 'message' => 'Invalid JSON payload.'], 400);
  }

  $prompt = isset($data['prompt']) && is_string($data['prompt']) ? trim($data['prompt']) : '';
  if ($prompt === '' || strlen($prompt) > 30000) {
    wp_send_json_error(['code' => 'invalid_prompt', 'message' => 'Prompt is empty or too large.'], 400);
  }

  $response_mime = isset($data['responseMimeType']) && is_string($data['responseMimeType'])
    ? sanitize_text_field($data['responseMimeType'])
    : '';

  $model = defined('SAHHATY_GEMINI_MODEL') && SAHHATY_GEMINI_MODEL
    ? SAHHATY_GEMINI_MODEL
    : 'gemini-1.5-flash';

  $body = [
    'contents' => [
      [
        'role' => 'user',
        'parts' => [
          ['text' => $prompt],
        ],
      ],
    ],
  ];

  if ($response_mime !== '') {
    $body['generationConfig'] = ['response_mime_type' => $response_mime];
  }

  $url = 'https://generativelanguage.googleapis.com/v1/models/' . rawurlencode($model) . ':generateContent';
  $response = wp_remote_post($url, [
    'timeout' => 60,
    'headers' => [
      'Content-Type' => 'application/json',
      'x-goog-api-key' => $api_key,
    ],
    'body' => wp_json_encode($body, JSON_UNESCAPED_UNICODE),
  ]);

  if (is_wp_error($response)) {
    wp_send_json_error(['code' => 'gemini_http_error', 'message' => $response->get_error_message() . ' (Debug key: ' . $debug_key . ')'], 502);
  }

  $status = (int) wp_remote_retrieve_response_code($response);
  $response_body = json_decode(wp_remote_retrieve_body($response), true);

  if ($status < 200 || $status >= 300) {
    $message = isset($response_body['error']['message']) ? $response_body['error']['message'] : 'Gemini API request failed.';
    wp_send_json_error([
      'code' => 'gemini_api_error',
      'message' => $message . ' (Debug key: ' . $debug_key . ')',
      'response' => $response_body
    ], 502);
  }

  $text = $response_body['candidates'][0]['content']['parts'][0]['text'] ?? '';
  if (!is_string($text) || $text === '') {
    wp_send_json_error(['code' => 'empty_gemini_response', 'message' => 'Gemini returned an empty response.'], 502);
  }

  wp_send_json_success(['text' => $text]);
}

add_action('wp_ajax_sahhaty_gemini_generate', 'sahhaty_gemini_generate');
add_action('wp_ajax_nopriv_sahhaty_gemini_generate', 'sahhaty_gemini_generate');
