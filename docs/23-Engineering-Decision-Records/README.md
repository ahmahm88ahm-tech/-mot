# Engineering Decision Records — MOTANAQIL

**المهندس المعماري:** فريق Buytuk  
**آخر تحديث:** 24 يوليو 2026

---

## ما هو ADR؟

**ADR (Architecture Decision Record)** هو وثيقة قصيرة تلتقط قراراً معمارياً مهماً، السياق الذي اتُخذ فيه، البدائل التي نُظرت فيها، والنتائج المترتبة عليه.

### لماذا ADRs مهمة؟

> **"الكود يخبرك ماذا، لكن لا يخبرك لماذا."** — Simon Brown

بدون ADRs، كل قرار معماري يُنسى بعد 6 أشهر، ويُعاد نقاشه مع كل مبرمج جديد. ADRs تحفظ **السياق التاريخي** للقرارات.

### صيغة ADR (Michael Nygard)

كل ADR يحتوي على:

1. **Title** — عنوان القرار
2. **Status** — الحالة (Proposed / Accepted / Deprecated / Superseded)
3. **Context** — السياق والمشكلة
4. **Decision** — القرار المتخذ
5. **Consequences** — النتائج (إيجابية وسلبية)
6. **Compliance** — كيف نضمن الالتزام
7. **Notes** — ملاحظات إضافية

### قائمة القرارات

| # | العنوان | الحالة | التاريخ |
|---|--------|--------|--------|
| 0001 | اختيار البنية المعمارية (Modular Monolith) | ✅ Accepted | 2026-07-23 |
| 0002 | اختيار قاعدة البيانات (PostgreSQL + Prisma) | ✅ Accepted | 2026-07-23 |
| 0003 | اختيار نظام المصادقة (JWT + Refresh Tokens) | ✅ Accepted | 2026-07-23 |
| 0004 | اختيار نظام الإشعارات (Event-Driven + Multi-Channel) | ✅ Accepted | 2026-07-24 |
| 0005 | اختيار استراتيجية التخزين المؤقت (Redis + Multi-Layer) | ✅ Accepted | 2026-07-24 |

### كيف تُضاف ADR جديدة؟

1. انسخ `template.md` (في الأسفل)
2. املأ الحقول
3. راجع مع فريق Buytuk
4. احفظ في المجلد باسم `23.XX-ADR-NNNN-Title.md`
5. حدّث هذا الـ README

### حالات ADR

- **Proposed** — مقترح، قيد النقاش
- **Accepted** — مقبول، مُطبَّق
- **Deprecated** — مُهمل، لا يُستخدم في قرارات جديدة
- **Superseded** — مُستبدل بـ ADR أحدث

---

## Template

```markdown
# ADR-NNNN: [عنوان القرار]

**Status:** Proposed | Accepted | Deprecated | Superseded  
**Date:** YYYY-MM-DD  
**Deciders:** [أسماء]  
**Consulted:** [أسماء]  
**Informed:** [أسماء]

---

## Context

[ما المشكلة؟ ما السياق؟ ما القيود؟]

## Decision Drivers

[ما العوامل التي أثرت على القرار؟]

## Considered Options

1. [خيار 1]
2. [خيار 2]
3. [خيار 3]

## Decision Outcome

**Chosen option:** [الخيار المختار]

[لماذا هذا الخيار؟]

## Consequences

### إيجابية
- [نتيجة إيجابية 1]
- [نتيجة إيجابية 2]

### سلبية
- [نتيجة سلبية 1]
- [نتيجة سلبية 2]

### مخاطر
- [مخاطرة 1]
- [مخاطرة 2]

## Compliance

[كيف نضمن الالتزام بهذا القرار؟]

## Notes

[ملاحظات إضافية، روابط، مراجع]
```
