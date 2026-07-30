#!/bin/sh
# نقطة دخول الإنتاج: الهجرة أولاً، ثم الإقلاع.
# فصلهما يعني: إن فشلت الهجرة لا يقلع خادم بنصف حالة.
set -e

echo "▸ تطبيق migrations الإنتاجية (prisma migrate deploy)..."
npx prisma migrate deploy

echo "▸ إقلاع الخادم..."
# يتحمّل كلا مسارَي البناء (dist/main أو dist/src/main)
if [ -f dist/main.js ]; then
  exec node dist/main.js
else
  exec node dist/src/main.js
fi
