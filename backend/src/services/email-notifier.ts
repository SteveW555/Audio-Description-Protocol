import nodemailer from 'nodemailer';
import type { EmailNotification } from '../types/index.js';

/**
 * Email notification service using Nodemailer + Gmail SMTP
 * Sends limit notifications per FR-019
 */
class EmailNotifier {
  private transporter: nodemailer.Transporter | null = null;
  private initialized = false;

  /**
   * Initializes email transporter
   */
  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // TLS
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Verify connection
      await this.transporter.verify();
      this.initialized = true;
      console.log('Email notifier initialized successfully');
    } catch (error) {
      console.error('Failed to initialize email notifier:', error);
      // Don't block app startup if email fails
      this.initialized = false;
    }
  }

  /**
   * Sends limit notification email per FR-019
   */
  public async sendLimitNotification(
    notification: EmailNotification
  ): Promise<void> {
    if (!this.transporter) {
      console.error('Email transporter not initialized');
      return;
    }

    try {
      const subject = `Audio Protocol Wizard - API ${notification.limitType === 'rate' ? 'Rate' : 'Cost'} Limit Reached`;

      const text = `
Audio Protocol Wizard - API Usage Limit Notification

Limit Type: ${notification.limitType === 'rate' ? 'Rate Limit' : 'Cost Limit'}
Current Value: ${notification.details.current}
Threshold: ${notification.details.threshold}
Limit: ${notification.details.limit}
${notification.details.sessionId ? `Session ID: ${notification.details.sessionId}` : ''}
Timestamp: ${notification.details.timestamp}

This notification was automatically generated when an API usage limit was reached.
`;

      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.NOTIFY_EMAIL || 'joeyfoursheds@gmail.com',
        subject,
        text,
      });

      console.log('Limit notification email sent successfully');
    } catch (error) {
      console.error('Failed to send limit notification email:', error);
      // Don't throw - email failure shouldn't block phrase generation
    }
  }

  /**
   * Sends rate limit notification
   */
  public async notifyRateLimit(
    limitType: 'minute' | 'hour' | 'concurrent',
    current: number,
    limit: number,
    sessionId?: string
  ): Promise<void> {
    const notification: EmailNotification = {
      to: process.env.NOTIFY_EMAIL || 'joeyfoursheds@gmail.com',
      subject: 'API Rate Limit Reached',
      text: '',
      limitType: 'rate',
      details: {
        limit,
        current,
        threshold: limit,
        sessionId,
        timestamp: new Date().toISOString(),
      },
    };

    await this.sendLimitNotification(notification);
  }

  /**
   * Sends cost limit notification
   */
  public async notifyCostLimit(
    limitType: 'session' | 'daily',
    current: number,
    limit: number,
    sessionId?: string
  ): Promise<void> {
    const notification: EmailNotification = {
      to: process.env.NOTIFY_EMAIL || 'joeyfoursheds@gmail.com',
      subject: 'API Cost Limit Reached',
      text: '',
      limitType: 'cost',
      details: {
        limit,
        current,
        threshold: limit,
        sessionId,
        timestamp: new Date().toISOString(),
      },
    };

    await this.sendLimitNotification(notification);
  }
}

// Singleton instance
export const emailNotifier = new EmailNotifier();

// Export class for testing
export { EmailNotifier };
