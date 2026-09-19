const { v4: uuidv4 } = require("uuid");
const TicketRepository = require("../repositories/TicketRepository");
const NotificationService = require("./NotificationService");
const HttpError = require("../utils/HttpError");

const isBlank = (value) => typeof value !== "string" || value.trim() === "";

class TicketService {
  constructor() {
    this.repo = new TicketRepository();
    this.notificationService = new NotificationService();
  }

  createTicket(data) {
    if (!data || isBlank(data.title) || isBlank(data.description)) {
      throw new HttpError(400, "Los campos 'title' y 'description' son obligatorios");
    }

    const ticket = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      status: "nuevo",
      priority: data.priority || "medium",
      assignedUser: null
    };

    this.repo.save(ticket);
    this.notificationService.create("email", `Nuevo ticket creado: ${ticket.title}`, ticket.id);

    return ticket;
  }

  assignTicket(id, user) {
    if (isBlank(user)) {
      throw new HttpError(400, "El campo 'user' es obligatorio");
    }

    const ticket = this.repo.update(id, { assignedUser: user });
    if (!ticket) {
      throw new HttpError(404, "Ticket no encontrado");
    }

    this.notificationService.create("email", `El ticket ${ticket.id} fue asignado a ${user}`, ticket.id);
    return ticket;
  }

  changeStatus(id, newStatus) {
    if (isBlank(newStatus)) {
      throw new HttpError(400, "El campo 'status' es obligatorio");
    }

    const ticket = this.repo.update(id, { status: newStatus });
    if (!ticket) {
      throw new HttpError(404, "Ticket no encontrado");
    }

    this.notificationService.create("push", `El ticket ${ticket.id} cambió a ${newStatus}`, ticket.id);
    return ticket;
  }

  list(page = 1, limit = 5) {
    const tickets = this.repo.findAll();
    const total = tickets.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;

    return {
      page,
      limit,
      total,
      totalPages,
      data: tickets.slice(start, start + limit)
    };
  }

  listNotifications(id) {
    const ticket = this.repo.findById(id);
    if (!ticket) {
      throw new HttpError(404, "Ticket no encontrado");
    }
    return this.notificationService.listByTicket(id);
  }

  deleteTicket(id) {
    const deleted = this.repo.delete(id);
    if (!deleted) {
      throw new HttpError(404, "Ticket no encontrado");
    }
    return true;
  }
}

module.exports = TicketService;
