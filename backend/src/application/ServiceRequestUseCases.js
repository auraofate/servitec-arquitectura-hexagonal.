import { ServiceRequest } from '../domain/ServiceRequest.js';

const VALID_STATUSES = ['Pendiente', 'En reparación', 'Entregado'];

export class ServiceRequestUseCases {
  // Inyección de dependencia: recibe el puerto, no conoce el almacenamiento.
  constructor(repository) {
    this.repository = repository;
  }

  list() {
    return this.repository.findAll();
  }

  async create(data) {
    const fields = ['customer', 'phone', 'device', 'problem'];
    for (const field of fields) {
      if (!String(data?.[field] ?? '').trim()) {
        throw new Error('Completa todos los campos del formulario.');
      }
    }

    const request = new ServiceRequest({
      customer: data.customer.trim(),
      phone: data.phone.trim(),
      device: data.device.trim(),
      problem: data.problem.trim()
    });

    return this.repository.create(request);
  }

  async changeStatus(id, status) {
    if (!VALID_STATUSES.includes(status)) {
      throw new Error('El estado seleccionado no es válido.');
    }
    return this.repository.updateStatus(id, status);
  }

  remove(id) {
    return this.repository.delete(id);
  }
}