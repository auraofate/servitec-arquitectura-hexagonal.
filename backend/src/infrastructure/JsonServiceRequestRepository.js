import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ServiceRequestRepository } from '../application/ServiceRequestRepository.js';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const dataFile = path.resolve(currentDir, '../../data/requests.json');

// Adaptador secundario: implementa el puerto usando un archivo JSON.
export class JsonServiceRequestRepository extends ServiceRequestRepository {
  constructor() {
    super();
    this.file = dataFile;
  }

  async read() {
    try {
      const content = await fs.readFile(this.file, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      throw error;
    }
  }

  async write(items) {
    await fs.mkdir(path.dirname(this.file), { recursive: true });
    await fs.writeFile(this.file, JSON.stringify(items, null, 2), 'utf8');
  }

  async findAll() {
    return this.read();
  }

  async create(request) {
    const items = await this.read();
    const nextId = items.length ? Math.max(...items.map(item => item.id)) + 1 : 1;
    const created = {
      ...request,
      id: nextId,
      createdAt: new Date().toISOString()
    };
    items.unshift(created);
    await this.write(items);
    return created;
  }

  async updateStatus(id, status) {
    const items = await this.read();
    const item = items.find(entry => entry.id === Number(id));
    if (!item) throw new Error('Solicitud no encontrada.');
    item.status = status;
    await this.write(items);
    return item;
  }

  async delete(id) {
    const items = await this.read();
    const filtered = items.filter(entry => entry.id !== Number(id));
    if (filtered.length === items.length) throw new Error('Solicitud no encontrada.');
    await this.write(filtered);
    return true;
  }
}