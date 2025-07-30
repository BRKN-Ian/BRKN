const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

const MONGO_URI = process.env.MONGODB_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

const OrderSchema = new mongoose.Schema({
  productType: String,
  traits: [String],
  imageBase64: String,
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', OrderSchema);

app.post('/api/orders', async (req, res) => {
  const { productType, traits, imageBase64 } = req.body;
  try {
    const order = new Order({ productType, traits, imageBase64 });
    await order.save();
    res.status(201).send({ success: true, message: 'Order saved' });
  } catch (err) {
    res.status(500).send({ success: false, message: 'Error saving order' });
  }
});

app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
