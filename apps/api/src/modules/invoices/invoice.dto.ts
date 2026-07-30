export interface InvoiceLine {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;       // INV-YYYY-NNNNNN
  orderNumber: string;
  date: string;                // ISO
  time: string;                // HH:mm
  seller: { name: string; vatNumber: string };
  buyer: { name: string };
  lines: InvoiceLine[];
  subtotal: number;
  vatRate: number;             // 0.15
  vatAmount: number;
  total: number;
  currency: string;
  qrBase64: string;            // TLV base64 (ZATCA phase-1)
  paymentNote: string;         // «الدفع بعد الإكمال»
}
