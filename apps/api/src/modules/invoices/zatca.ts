// ترميز الفاتورة المبسّطة وفق المرحلة الأولى من ZATCA:
// خمسة حقول TLV (Tag-Length-Value) تُشفَّر base64.
// Tag 1 = اسم البائع، 2 = الرقم الضريبي، 3 = التاريخ/الوقت، 4 = الإجمالي شامل الضريبة، 5 = الضريبة.

function tlv(tag: number, value: string): Buffer {
  const buf = Buffer.from(value, 'utf8');
  return Buffer.concat([Buffer.from([tag, buf.length]), buf]);
}

export function buildZatcaBase64(input: {
  sellerName: string;
  vatNumber: string;
  timestamp: string;     // ISO
  totalWithVat: string;  // نصّي بنقطتين عشريتين
  vatAmount: string;
}): string {
  const parts = [
    tlv(1, input.sellerName),
    tlv(2, input.vatNumber),
    tlv(3, input.timestamp),
    tlv(4, input.totalWithVat),
    tlv(5, input.vatAmount),
  ];
  return Buffer.concat(parts).toString('base64');
}
