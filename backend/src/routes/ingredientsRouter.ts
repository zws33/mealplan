import {Router} from 'express';

export const ingredientsRouter = Router();

ingredientsRouter.post('/', async (req, res) => {
  res.send('POST /ingredients');
});

ingredientsRouter.get('/:id', async (req, res) => {
  res.send('GET /ingredients/:id');
});
