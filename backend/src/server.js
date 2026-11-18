import express from 'express';
import cors from 'cors';
import { JsonServiceRequestRepository } from './infrastructure/JsonServiceRequestRepository.js';
import { ServiceRequestUseCases } from './application/ServiceRequestUseCases.js';
import { createServiceRequestRoutes } from './adapters/http/serviceRequestRoutes.js';

const app = express();
const PORT = 5000;

// Composición de dependencias: aquí se conectan los adaptadores.
const repository = new JsonServiceRequestRepository();
const useCases = new ServiceRequestUseCases(repository);

app.use(cors());
app.use(express.json());
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'ServiTec API funcionando' });
});
app.use('/api/requests', createServiceRequestRoutes(useCases));

app.listen(PORT, () => {
  console.log(`ServiTec backend disponible en http://localhost:${PORT}`);
});