#!/usr/bin/env bash
# فحص ما قبل النشر: يتحقق من المتغيرات المطلوبة ويطبع ✅/❌.
# لا يفشل البناء — يُحذّر فقط، حتى لا يكسر شيئاً.
# الاستخدام: bash scripts/deploy-check.sh [ملف-env]   (افتراضي: apps/api/.env.production)
ENV_FILE="${1:-apps/api/.env.production}"
G=$'\033[0;32m'; R=$'\033[0;31m'; Y=$'\033[0;33m'; N=$'\033[0m'; B=$'\033[1m'

echo "${B}▸ فحص متغيرات الإنتاج:${N} $ENV_FILE"
[ -f "$ENV_FILE" ] || { echo "${R}✕ الملف غير موجود — أنشئه من .env.production.example${N}"; exit 0; }

# تحميل المتغيرات (تجاهل التعليقات والسطور الفارغة)
set -a; . "$ENV_FILE" 2>/dev/null; set +a

MISS=0
need(){ if [ -z "${!1}" ]; then echo "${R}✕ $1 مفقود${N}"; MISS=$((MISS+1)); else echo "${G}✓ $1${N}"; fi; }
warn(){ if [ -z "${!1}" ]; then echo "${Y}⚠ $1 فارغ (مؤجَّل/اختياري)${N}"; else echo "${G}✓ $1${N}"; fi; }

echo "${B}── إلزامي ──${N}"
need DATABASE_URL; need JWT_SECRET; need MFA_ENCRYPTION_KEY; need CORS_ORIGIN

echo "${B}── مؤجَّل (يُفعَّل في مسار ج) ──${N}"
warn ZATCA_VAT_NUMBER; warn UNIFONIC_APP_KEY; warn WHATSAPP_ACCESS_TOKEN

echo
if [ "$MISS" -eq 0 ]; then echo "${G}${B}✓ كل الإلزامي حاضر — جاهز للنشر تقنياً.${N}"
else echo "${R}${B}✕ $MISS متغيّر إلزامي مفقود — أصلحه قبل النشر.${N}"; fi
exit 0   # لا نفشل أبداً — فحصٌ استشاري فقط
