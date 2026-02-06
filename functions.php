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
  // If you define SAHHATY_API_KEY in wp-config.php, the AI features will work.
 $key = defined('SAHHATY_GEMINI_API_KEY') ? SAHHATY_GEMINI_API_KEY : '';

  $key_js = json_encode($key, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

  echo "<script>window.process = window.process || { env: {} }; window.process.env = window.process.env || {}; window.process.env.API_KEY = {$key_js};</script>\n";
  
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
    "@google/genai": "https://esm.sh/@google/genai@^1.34.0",
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
  $entry = get_stylesheet_directory_uri() . '/assets/app/index.js';
  echo "<script type=\"module\" src=\"{$entry}\"></script>\n";
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

  if (!$data) {
    wp_send_json_error('invalid_data', 400);
  }

  update_user_meta($user_id, 'sahhaty_user_data', wp_json_encode($data));

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

  wp_send_json_success([
    'data' => json_decode($saved, true)
  ]);
});
