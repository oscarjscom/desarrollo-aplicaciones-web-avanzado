const { v4: uuidv4 } = require("uuid");
const NotificationRepository = require("../repositories/NotificationRepository");
const EmailService = require("./email/EmailService");

class NotificationService {
  constructor() {
    this.repo = new NotificationRepository();
    this.emailService = new EmailService();
  }

  create(type, message, ticketId) {
    const notification = {
      id: uuidv4(),
      type,
      message,
      status: "pending",
      ticketId
    };

    if (type == "email") {
      this.emailService.sendEmail({
        to: process.env.MAILER_TO,
        subject: "API RESTful - Alertas del sistema de Tickets",
        htmlBody: "<h1>" + message + " </h1><p>El envío con nodemailer funciona.</p>"
      });
    }

    return this.repo.save(notification);
  }

  list() {
    return this.repo.findAll();
  }

  listByTicket(ticketId) {
    return this.repo.findAll().filter(n => n.ticketId === ticketId);
  }
}
module.exports = NotificationService;
