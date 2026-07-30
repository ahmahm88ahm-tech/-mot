import { Injectable, Logger } from '@nestjs/common';

export interface NotificationPayload {
  to: string;           // رقم الجوال أو Device token
  orderNumber: string;
  status: string;
  statusLabel: string;
  message?: string;
}

/**
 * R6 — Notifications Service
 *
 * في بيئة التطوير: يُسجَّل الإشعار في الـ logs فقط.
 * في الإنتاج: استبدل sendSms() / sendPush() بـ SDK حقيقي (Unifonic، Twilio، FCM…).
 *
 * لإضافة provider حقيقي:
 *   1. تثبيت SDK المطلوب (npm install unifonic-sdk أو @firebase/admin)
 *   2. حقن ConfigService واستخراج المفاتيح
 *   3. استبدال الـ logger.log() بالاستدعاء الفعلي
 */
@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly isProd = process.env.NODE_ENV === 'production';

  /** إشعار SMS عبر أي provider (stub قابل للاستبدال) */
  async sendSms(phone: string, body: string): Promise<void> {
    if (this.isProd) {
      // TODO: استبدل بـ SDK حقيقي في الإنتاج
      // await unifonic.send({ to: phone, body });
      this.logger.warn(`[SMS-PROD] → ${phone}: ${body}`);
    } else {
      this.logger.log(`[SMS-DEV] → ${phone}: ${body}`);
    }
  }

  /** إشعار Push عبر FCM أو APNs (stub قابل للاستبدال) */
  async sendPush(deviceToken: string, title: string, body: string): Promise<void> {
    if (this.isProd) {
      // TODO: استبدل بـ Firebase Admin SDK في الإنتاج
      // await firebaseAdmin.messaging().send({ token: deviceToken, notification: { title, body } });
      this.logger.warn(`[PUSH-PROD] → ${deviceToken.slice(0, 8)}…: ${title} — ${body}`);
    } else {
      this.logger.log(`[PUSH-DEV] → ${deviceToken.slice(0, 8)}…: ${title} — ${body}`);
    }
  }

  /** إشعار موحَّد: يُرسل SMS إذا توفَّر الجوال، ويُرسل Push إذا توفَّر الـ token */
  async notifyOrderStatus(payload: NotificationPayload): Promise<void> {
    const { to, orderNumber, statusLabel, message } = payload;
    const text = message || `طلبك ${orderNumber} — ${statusLabel}`;

    // إذا يبدو رقم جوال (يبدأ بـ + أو 05)
    if (/^(\+966|05)\d+/.test(to)) {
      await this.sendSms(to, text);
    } else {
      // نفترض أنه Device token
      await this.sendPush(to, `مُتنقِّل — تحديث طلبك`, text);
    }
  }
}
