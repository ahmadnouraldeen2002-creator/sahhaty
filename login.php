<?php
/* Template Name: Sahhaty Login */

if (is_user_logged_in()) {
  wp_redirect(home_url('/'));
  exit;
}

$err = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

  // تسجيل دخول
  if (isset($_POST['do_login'])) {
    $creds = [
      'user_login'    => sanitize_text_field($_POST['email']),
      'user_password' => $_POST['password'],
      'remember'      => true,
    ];

    $user = wp_signon($creds, false);

    if (is_wp_error($user)) {
      $err = 'بيانات الدخول غير صحيحة';
    } else {
      wp_redirect(home_url('/'));
      exit;
    }
  }

  // إنشاء حساب
  if (isset($_POST['do_register'])) {
    $email = sanitize_email($_POST['reg_email']);
    $pass  = $_POST['reg_password'];
    $fname = sanitize_text_field($_POST['first_name']);
    $lname = sanitize_text_field($_POST['last_name']);

    if (!is_email($email)) {
      $err = 'البريد غير صحيح';
    } elseif (email_exists($email)) {
      $err = 'هذا البريد مستخدم بالفعل';
    } elseif (strlen($pass) < 6) {
      $err = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    } else {
      $user_id = wp_create_user($email, $pass, $email);
      wp_update_user([
        'ID' => $user_id,
        'first_name' => $fname,
        'last_name'  => $lname,
        'display_name' => $fname . ' ' . $lname,
      ]);

      // بعد التسجيل يرجع لصفحة الدخول
      wp_redirect(home_url('/login?registered=1'));
      exit;
    }
  }
}
?>
<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SAHHATY - Login</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style> body{font-family:'Cairo',sans-serif;} </style>
</head>
<body class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 px-4">

<div class="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
  <h1 class="text-3xl font-black text-center text-slate-900">SAHHATY</h1>
  <p class="text-center text-gray-500 font-bold mt-1">Smart Health Coach</p>

  <?php if ($err): ?>
    <div class="mt-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-bold text-sm text-center">
      <?php echo esc_html($err); ?>
    </div>
  <?php endif; ?>

  <?php if (isset($_GET['registered'])): ?>
    <div class="mt-6 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 font-bold text-sm text-center">
      تم إنشاء الحساب ✅ يمكنك تسجيل الدخول الآن
    </div>
  <?php endif; ?>

  <div class="mt-8">
    <!-- Login -->
    <form method="POST" class="space-y-4">
      <input name="email" type="text" placeholder="البريد الإلكتروني" class="w-full p-4 rounded-xl border-2 border-gray-200 font-bold bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none" />
      <input name="password" type="password" placeholder="كلمة المرور" class="w-full p-4 rounded-xl border-2 border-gray-200 font-bold bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none" />
      <button name="do_login" class="w-full py-4 rounded-xl font-black text-white bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-lg hover:scale-[1.02] transition">
        تسجيل الدخول
      </button>
    </form>

    <div class="my-6 text-center text-gray-400 font-bold">أو</div>

    <!-- Register -->
    <form method="POST" class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <input name="first_name" type="text" placeholder="الاسم" class="w-full p-4 rounded-xl border-2 border-gray-200 font-bold bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none" />
        <input name="last_name" type="text" placeholder="اللقب" class="w-full p-4 rounded-xl border-2 border-gray-200 font-bold bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none" />
      </div>
      <input name="reg_email" type="email" placeholder="البريد الإلكتروني" class="w-full p-4 rounded-xl border-2 border-gray-200 font-bold bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none" />
      <input name="reg_password" type="password" placeholder="إنشاء كلمة مرور" class="w-full p-4 rounded-xl border-2 border-gray-200 font-bold bg-gray-50 focus:bg-white focus:border-emerald-500 outline-none" />

      <button name="do_register" class="w-full py-4 rounded-xl font-black text-white bg-slate-900 shadow-lg hover:bg-black transition">
        إنشاء حساب جديد
      </button>
    </form>
  </div>
</div>

</body>
</html>
