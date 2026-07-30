# MOTANAQIL (مُتنقِّل)

منصة نقل وتركيب الأثاث في المملكة العربية السعودية — دفع بعد الإكمال، تتبع لحظي، وفنيون مدرّبون.

## Run & Operate

### API Backend (NestJS + Prisma)
```bash
cd apps/api
npm install
npx prisma generate
npx prisma db push        # أو migrate dev
npx prisma db seed
npm run start:dev         # يبدأ على المنفذ 4000
```

### Web Frontend (Next.js 14)
```bash
cd apps/web
npm install
npm run dev               # يبدأ على المنفذ 3000
```

### بيئة التطوير (Docker)
```bash
docker compose up -d      # PostgreSQL + Redis + MinIO + Mailhog
```

### متغيرات البيئة
```bash
cp .env.example .env      # ثم عدّل القيم
```

### فحص قبل النشر
```bash
bash scripts/deploy-check.sh   # يتحقق من المتغيرات الإلزامية
```

### Replit Workspace libs
```bash
pnpm run typecheck        # فحص TypeScript الكامل
pnpm --filter @workspace/api-spec run codegen  # توليد API hooks
```

## Stack

| الطبقة | التقنية |
|--------|---------|
| **Backend** | NestJS 10 + Prisma 5 + PostgreSQL 15 |
| **Frontend** | Next.js 14 (App Router) + TypeScript |
| **Auth** | JWT (15m) + Refresh Tokens (7d) |
| **Validation** | class-validator + class-transformer |
| **Storage** | MinIO (dev) / S3 (prod) |
| **Notifications** | SMS + Email + Push (FCM) |
| **Maps** | Google Maps Platform |
| **Build** | pnpm workspaces (Monorepo) |

## Where things live

```
motanaqil/
├── apps/
│   ├── api/                    # NestJS Backend (المنفذ 4000)
│   │   ├── prisma/
│   │   │   ├── schema.prisma   # ← مصدر الحقيقة لقاعدة البيانات
│   │   │   └── seed.ts         # بيانات تجريبية
│   │   └── src/
│   │       ├── modules/
│   │       │   ├── auth/       # تسجيل + دخول + JWT
│   │       │   ├── orders/     # إنشاء + تتبع الطلبات
│   │       │   ├── invoices/   # الفواتير + ZATCA
│   │       │   └── health/     # Health check
│   │       ├── common/         # Guards + Filters + Decorators
│   │       └── prisma/         # PrismaService
│   └── web/                    # Next.js Frontend (المنفذ 3000)
│       └── src/
│           ├── app/            # App Router صفحات
│           ├── components/     # مكونات قابلة للاستخدام
│           └── lib/            # api.ts + useInView hook
├── docs/                       # 40+ وثيقة تقنية وإدارية
│   ├── MOTANAQIL-Complete-Dev-Guide.md  ← الملف المرجعي الموحّد
│   └── README.md               # فهرس الوثائق
├── artifacts/                  # Replit artifacts (API Server + Canvas)
├── lib/                        # Shared libraries (OpenAPI codegen)
├── scripts/
│   ├── deploy-check.sh         # فحص متغيرات الإنتاج قبل النشر
│   └── post-merge.sh           # سكريبت ما بعد الدمج
├── docker-compose.prod.yml     # إعداد الإنتاج
└── .env.example                # قالب متغيرات البيئة
```

## Architecture decisions

- **ADR-0001:** Monorepo مع pnpm workspaces — NestJS للـ API، Next.js للـ Frontend
- **ADR-0002:** PostgreSQL + Prisma ORM — schema موحّد مصدر الحقيقة
- **ADR-0003:** JWT قصير العمر (15m) + Refresh Tokens طويلة العمر (7d) — مخزّنة مهاشة في DB
- **ADR-0006:** **لا بوابة دفع** — نقد للسائق أو تحويل بنكي بعد إتمام الخدمة
- **ADR-0007:** Replit Build Pragmatics — بيئة Replit لها قيود خاصة موثّقة

## Product

- **العميل:** يطلب نقل أثاث عبر Web أو PWA — يحدد المواقع، يتلقى سعراً تقديرياً، يدفع بعد الإكمال
- **السائق:** يستقبل الطلب، ينفّذ، يؤكد الإتمام
- **الإدارة:** لوحة تحكم كاملة — الطلبات، الفنيون، الخريطة الحية، التقارير
- **SEO:** 7000+ صفحة Programmatic SEO (مدن × أحياء × خدمات)

## User preferences

- الكود منفصل تماماً عن نصوص الوثائق
- كل ZIP جديد يُدمج بذكاء — لا حذف، فقط إضافة
- الملف المرجعي الموحّد: `docs/MOTANAQIL-Complete-Dev-Guide.md`
- الكود النظيف في: `apps/api/` و `apps/web/`
- إصدار أعلى دائماً يُضاف فوق السابق (لا استبدال)

## Gotchas

- `NEXT_PUBLIC_API_URL` يجب أن يشير إلى `http://localhost:4000/api/v1` (لا `/api/v1` فقط)
- Prisma seed يستخدم `bcryptjs` (ليس `bcrypt`) — انتبه للتوافق
- JWT_SECRET يجب أن يكون 32 حرفاً على الأقل — السر الافتراضي للتطوير فقط
- `bash scripts/deploy-check.sh` يُحذّر فقط — لا يفشل البناء

## Pointers

- وثائق المشروع: `docs/README.md`
- الملف المرجعي الموحّد: `docs/MOTANAQIL-Complete-Dev-Guide.md`
- Schema قاعدة البيانات: `apps/api/prisma/schema.prisma`
- قرارات هندسية: `docs/23-Engineering-Decision-Records/`
- مراحل التطوير: `docs/27-Development-Kickoff/`
- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
