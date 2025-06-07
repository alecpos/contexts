import express from 'express';
import { createCustomer, retrieveCustomer, deleteCustomer, createPaymentIntent } from '../services/stripe/http';

const app = express();
app.use(express.json());

app.post('/customers', async (req, res) => {
  try {
    const customer = await createCustomer(req.body.metadata, req.body.expand);
    res.json(customer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/customers/:id', async (req, res) => {
  try {
    const customer = await retrieveCustomer(req.params.id, req.query.expand as string[]);
    res.json(customer);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/customers/:id', async (req, res) => {
  try {
    const result = await deleteCustomer(req.params.id);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/payment_intents', async (req, res) => {
  const { amount, currency, customerId, metadata, expand } = req.body;
  try {
    const pi = await createPaymentIntent(amount, currency, customerId, metadata, expand);
    res.json(pi);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API server listening on ${port}`);
});
