import { Router } from 'express';

export function createServiceRequestRoutes(useCases) {
  const router = Router();

  router.get('/', async (_req, res) => {
    res.json(await useCases.list());
  });

  router.post('/', async (req, res) => {
    try {
      const created = await useCases.create(req.body);
      res.status(201).json(created);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.patch('/:id', async (req, res) => {
    try {
      const updated = await useCases.changeStatus(req.params.id, req.body.status);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      await useCases.remove(req.params.id);
      res.json({ message: 'Solicitud eliminada correctamente.' });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  });

  return router;
}