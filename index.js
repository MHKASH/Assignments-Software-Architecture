const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mydatabase')
  .then(() => {
    console.log('MongoDB connected');
    seedCategories();
  })
  .catch(err => console.error('MongoDB connection error:', err));

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String
});

const Category = mongoose.model('Category', categorySchema);

async function seedCategories() {
  const categories = [
    { name: 'NIKE Shoes', description: 'High-quality sports shoes from NIKE' },
    { name: 'NIKE Sportswear', description: 'Premium sportswear collection from NIKE' },
    { name: 'NIKE Accessories', description: 'Accessories like caps, bags, and socks from NIKE' },
    { name: 'NIKE Running Gear', description: 'Top running gear including leggings, jackets, and shoes' },
    { name: 'NIKE Training Equipment', description: 'Training tools such as resistance bands and dumbbells' },
    { name: 'NIKE Football', description: 'Football boots, jerseys, and accessories for soccer lovers' },
    { name: 'NIKE Basketball', description: 'Basketball shoes, jerseys, and professional gear' }
  ];
  
  for (const cat of categories) {
    const exists = await Category.findOne({ name: cat.name });
    if (!exists) {
      await new Category(cat).save();
      console.log(`Category added: ${cat.name}`);
    }
  }
}

app.post('/categories', async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});