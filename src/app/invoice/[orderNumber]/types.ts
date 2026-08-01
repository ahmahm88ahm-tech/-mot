export interface InvoiceLine {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  orderNumber: string;
  date: string;
  time: string;
  seller: { name: string; vatNumber: string };
  buyer: { name: string };
  lines: InvoiceLine[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  currency: string;
  qrBase64: string;
  paymentNote: string;
}
