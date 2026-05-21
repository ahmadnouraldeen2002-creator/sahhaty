# استخدام صورة ووردبريس الرسمية كأساس
FROM wordpress:latest

# نسخ ملفات المجلد الحالي (القالب) إلى مجلد القوالب داخل الحاوية
COPY . /var/www/html/wp-content/themes/sahhaty-app

# ضبط الصلاحيات لتتمكن ووردبريس من التعامل مع الملفات
RUN chown -R www-data:www-data /var/www/html/wp-content/themes/sahhaty-app