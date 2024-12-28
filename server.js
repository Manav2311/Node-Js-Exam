require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { authenticate, authorize } = require('./middleware/auth');

const User = require('./models/User');
const Recipe = require('./models/Recipe');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => res.redirect('/recipes'));

app.get('/recipes', authenticate, async (req, res) => {
  const recipes = await Recipe.find().populate('createdBy');
  res.render('recipeList', { recipes });
});

app.get('/my-recipes', authenticate, async (req, res) => {
  const recipes = await Recipe.find({ createdBy: req.user.id });
  res.render('myRecipes', { recipes });
});

app.get('/recipe/new', authenticate, (req, res) => {
  res.render('recipeForm');
});

app.post('/recipe/new', authenticate, async (req, res) => {
  const recipe = new Recipe({ ...req.body, createdBy: req.user.id });
  await recipe.save();
  res.redirect('/my-recipes');
});

app.get('/register', (req, res) => res.render('register'));
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  res.redirect('/login');
});

app.get('/login', (req, res) => res.render('login'));
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await user.comparePassword(password)) {
    const token = user.generateToken();
    res.cookie('token', token, { httpOnly: true });
    return res.redirect('/recipes');
  }
  res.send('Invalid credentials');
});

app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

// Admin Route Example
app.get('/admin', authenticate, authorize('admin'), (req, res) => {
  res.send('Admin Panel');
});

// Start Server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
