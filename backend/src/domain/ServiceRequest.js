export class ServiceRequest {
  constructor({ id = null, customer, phone, device, problem, status = 'Pendiente', createdAt = null }) {
    this.id = id;
    this.customer = customer;
    this.phone = phone;
    this.device = device;
    this.problem = problem;
    this.status = status;
    this.createdAt = createdAt;
  }
}