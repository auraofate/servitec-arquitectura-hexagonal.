// Puerto: contrato que debe cumplir cualquier sistema de almacenamiento.
export class ServiceRequestRepository {
  async findAll() { throw new Error('Método findAll no implementado'); }
  async create(request) { throw new Error('Método create no implementado'); }
  async updateStatus(id, status) { throw new Error('Método updateStatus no implementado'); }
  async delete(id) { throw new Error('Método delete no implementado'); }
}