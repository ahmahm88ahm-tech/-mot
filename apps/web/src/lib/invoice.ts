export function formatSAR(n: number): string {
  return new Intl.NumberFormat('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

// مولّد مصفوفة QR للعرض البصري (تمثيلي). الـ payload الزكوي الحقيقي = qrBase64 من الـ API.
// في الإنتاج استبدل بمكتبة qrcode حقيقية ترسم الـ base64.
function mulberry32(a: number) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashStr(s: string): number { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

export function qrMatrix(payload: string, size = 25): boolean[][] {
  const rnd = mulberry32(hashStr(payload));
  const inFinder = (r: number, c: number) => {
    const blk = (or: number, oc: number) => r >= or && r < or + 7 && c >= oc && c < oc + 7;
    return blk(0, 0) || blk(0, size - 7) || blk(size - 7, 0);
  };
  const finderOn = (r: number, c: number) => {
    const ring = (or: number, oc: number) => { const lr = r - or, lc = c - oc; return lr === 0 || lr === 6 || lc === 0 || lc === 6 || (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4); };
    if (r < 7 && c < 7) return ring(0, 0);
    if (r < 7 && c >= size - 7) return ring(0, size - 7);
    if (r >= size - 7 && c < 7) return ring(size - 7, 0);
    return false;
  };
  const m: boolean[][] = [];
  for (let r = 0; r < size; r++) { const row: boolean[] = []; for (let c = 0; c < size; c++) row.push(inFinder(r, c) ? finderOn(r, c) : rnd() > 0.5); m.push(row); }
  return m;
}
