const TicketService = require("../services/TicketService");
const HttpError = require("../utils/HttpError");
const service = new TicketService();

const parsePositiveInt = (value, defaultValue, fieldName) => {
  if (value === undefined) return defaultValue;
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1) {
    throw new HttpError(400, `El parámetro '${fieldName}' debe ser un número entero mayor a 0`);
  }
  return number;
};

exports.create = (req, res) => {
  const ticket = service.createTicket(req.body);
  res.status(201).json(ticket);
};

exports.list = (req, res) => {
  const page = parsePositiveInt(req.query.page, 1, "page");
  const limit = parsePositiveInt(req.query.limit, 5, "limit");
  res.status(200).json(service.list(page, limit));
};

exports.assign = (req, res) => {
  const { id } = req.params;
  const { user } = req.body;
  const ticket = service.assignTicket(id, user);
  res.status(200).json(ticket);
};

exports.changeStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const ticket = service.changeStatus(id, status);
  res.status(200).json(ticket);
};

exports.listNotifications = (req, res) => {
  const notifications = service.listNotifications(req.params.id);
  res.status(200).json(notifications);
};

exports.delete = (req, res) => {
  service.deleteTicket(req.params.id);
  res.json({ message: "Ticket eliminado correctamente" });
};
