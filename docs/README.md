# 📚 MOTANAQIL — دليل الوثائق

> **المشروع:** MOTANAQIL (مُتنقِّل) — منصة نقل وتركيب الأثاث في المملكة العربية السعودية  
> **الإصدار الحالي:** v3.13.0  
> **الملف المرجعي الموحّد:** [`MOTANAQIL-Complete-Dev-Guide.md`](./MOTANAQIL-Complete-Dev-Guide.md)

---

## 🗂️ هيكل الوثائق

```
docs/
├── 00-Preface/                          # المقدمة والسياسات العامة
├── 04-Technical-Architecture/           # المعمارية التقنية ونموذج النطاق
├── 05-Database-Design/                  # تصميم قاعدة البيانات (Prisma Schema)
├── 06-API-Specification/                # مواصفات REST API
├── 07-UI-UX/                            # مواصفات الصفحات والتجربة البصرية
├── 08-SEO-Strategy/                     # استراتيجية SEO والـ 7000+ صفحة
├── 09-Security/                         # الأدوار، الصلاحيات، والأمان
├── 10-Testing-Strategy/                 # استراتيجية الاختبارات
├── 11-Deployment/                       # دليل النشر (Railway/Vercel)
├── 12-Coding-Standards/                 # معايير الكود
├── 13-Release-Management/               # إدارة الإصدارات
├── 14-User-Manual/                      # دليل المستخدم
├── 15-Executive-Docs/                   # وثائق الإدارة والمتطلبات
├── 17-Admin-Panel/                      # مواصفات لوحة الإدارة
├── 18-Order-Workflow/                   # State Machine لدورة الطلب
├── 19-Notifications/                    # نظام الإشعارات متعدد القنوات
├── 20-Analytics/                        # تكامل Analytics (GA4 + Pixel)
├── 21-Maps-Location/                    # تكامل الخرائط والموقع
├── 23-Engineering-Decision-Records/     # ADRs — قرارات هندسية موثّقة
├── 26-Requirements-Traceability-Matrix/ # مصفوفة تتبع المتطلبات
├── 27-Development-Kickoff/              # قرارات الإدارة والمراحل التنفيذية
├── 28-Frontend-Integration/             # تكامل Frontend-API (End-to-End)
├── 29-Docker-DevOps/                    # Docker Compose + Makefile + DevOps
├── 30-Payment-Cash-Transfer/            # نظام الدفع: نقد/تحويل (لا بوابة)
└── MOTANAQIL-Complete-Dev-Guide.md      # ← الملف المرجعي الموحّد (أضف هنا فقط)
```

---

## 📋 فهرس المجلدات التفصيلي

### 00 — المقدمة
| الملف | المحتوى |
|-------|---------|
| `00.01-Document-Control.md` | سياسة التحكم في الوثائق |
| `00.02-No-Assumptions-Policy.md` | سياسة "لا افتراضات" |
| `00.03-Glossary.md` | قاموس المصطلحات |
| `00.04-Revision-History.md` | سجل التعديلات |

### 04 — المعمارية التقنية
| الملف | المحتوى |
|-------|---------|
| `04.01-Domain-Model.md` | نموذج النطاق (Domain Model) |
| `04.02-Bounded-Context.md` | السياقات المحدودة (Bounded Contexts) |

### 05 — تصميم قاعدة البيانات
| الملف | المحتوى |
|-------|---------|
| `05.01-ER-Diagram.md` | مخطط العلاقات (ER Diagram) |
| `05.02-Core-Tables.md` | الجداول الأساسية وحقولها |
| `05.03-Relations-Map.md` | خريطة العلاقات بين الجداول |
| `05.05-Naming-Convention.md` | اتفاقيات تسمية قاعدة البيانات |
| `05.06-Unified-Schema-Seed-Storage.md` | Schema موحّد + Seed + Storage |

### 06 — مواصفات API
| الملف | المحتوى |
|-------|---------|
| `06.01-REST-API.md` | مواصفات REST API الكاملة |

### 07 — UI/UX
| الملف | المحتوى |
|-------|---------|
| `07.03-Pages-Specification.md` | مواصفات الصفحات (كل صفحة بالتفصيل) |

### 09 — الأمان
| الملف | المحتوى |
|-------|---------|
| `09.01-Roles-Permissions-Matrix.md` | مصفوفة الأدوار والصلاحيات |
| `09.02-Security-Specification.md` | مواصفات الأمان الإلزامية |
| `09.03-Common-Infrastructure-Auth-Module.md` | وحدة المصادقة المشتركة |

### 17 — لوحة الإدارة
| الملف | المحتوى |
|-------|---------|
| `17.01-Admin-Panel-Specification.md` | مواصفات لوحة الإدارة الكاملة |

### 18 — دورة الطلب
| الملف | المحتوى |
|-------|---------|
| `18.01-State-Machine.md` | آلة الحالة (State Machine) لدورة الطلب |
| `18.02-Orders-Backend-Implementation.md` | تنفيذ Backend لنظام الطلبات |

### 19 — الإشعارات
| الملف | المحتوى |
|-------|---------|
| `19.01-Notifications-System.md` | مواصفات نظام الإشعارات |
| `19.02-Notifications-Backend-Implementation.md` | تنفيذ Backend للإشعارات |

### 23 — قرارات هندسية (ADRs)
| الملف | القرار |
|-------|--------|
| `23.01-ADR-0001-Architecture.md` | Monorepo + NestJS + Next.js |
| `23.02-ADR-0002-Database.md` | PostgreSQL + Prisma |
| `23.03-ADR-0003-Authentication.md` | JWT + Refresh Tokens |
| `23.04-ADR-0004-Notifications.md` | قنوات الإشعارات |
| `23.05-ADR-0005-Caching.md` | Redis Caching |
| `23.06-ADR-0006-Payment.md` | **لا بوابة — نقد/تحويل بعد الخدمة** |
| `23.07-ADR-0007-Replit-Build-Pragmatics.md` | قرارات البناء على Replit |

### 27 — قرارات الإدارة والمراحل
| الملف | المحتوى |
|-------|---------|
| `27.00-PM-001-Management-Decision.md` | قرار الإدارة: الانطلاق للتنفيذ |
| `27.01-PM-002-Sprint0-Foundation.md` | Sprint 0: الأساس |
| `27.02-Phase5-Notifications.md` | المرحلة 5: الإشعارات |
| `27.03-Phase6-Performance-Security.md` | المرحلة 6: الأداء والأمان |
| `27.04-Phase7-Testing-Staging.md` | المرحلة 7: الاختبارات والنشر |
| `27.05-PM-003-Minimum-Buildable-Product.md` | MBP: الحد الأدنى القابل للبناء |
| `27.06-PM-004-Backend-Stability.md` | استقرار Backend |
| `27.07-PM-005-Frontend-Rebuild.md` | إعادة بناء Frontend |
| `27.08-PM-006-First-Real-Order.md` | أول طلب حقيقي |
| `27.09-PM-007-Payment-After-Service.md` | الدفع بعد الخدمة |
| `27.10-PM-008-Workspace-Fix.md` | إصلاح بيئة العمل |
| `27.11-PM-009-Cinematic-Hero.md` | Hero سينمائي |

### 28-30 — تكامل وعمليات
| الملف | المحتوى |
|-------|---------|
| `28.01-Frontend-API-Integration.md` | تكامل Frontend-API (14 ملف، 8 فجوات) |
| `29.01-Docker-Compose-DevOps.md` | Docker Compose + Makefile |
| `30.01-Payment-No-Gateway-Implementation.md` | تنفيذ الدفع النقدي/التحويل |

---

## 📌 قواعد الإضافة للوثائق

1. **الملف المرجعي الموحّد** هو `MOTANAQIL-Complete-Dev-Guide.md` — أضف المراحل الجديدة هنا فقط
2. **الوثائق الفردية** (05، 06، ...) — أضف إن لم يكن موجوداً، لا تحذف
3. **الإصدار الأعلى دائماً يسود** — كل ZIP جديد برقم إصدار أعلى
4. **الكود منفصل عن الوثائق** — ملفات الكود في `apps/` وليس مضمّنة في الوثائق

---

## 🔗 الكود المقابل

| الوثيقة | الكود المقابل |
|---------|--------------|
| `05-Database-Design/` | `apps/api/prisma/schema.prisma` |
| `06-API-Specification/` | `apps/api/src/modules/` |
| `07-UI-UX/` | `apps/web/src/app/` |
| `09-Security/` | `apps/api/src/common/guards/` |
| `18-Order-Workflow/` | `apps/api/src/modules/orders/` |
| `23-ADRs/` | قرارات مطبّقة في الكود الحالي |
