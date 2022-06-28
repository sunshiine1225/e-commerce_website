import express from 'express';
import Product from '../models/productModel.js';
import data from '../data.js';

const seedRouter = express.Router();
seedRouter.get('/seed', async (req, res) => {
  await Product.remove({});
  const createdProducts = await Product.insertMany(data.products);
  console.log({createdProducts})
  res.send({ createdProducts });
});

export default seedRouter;