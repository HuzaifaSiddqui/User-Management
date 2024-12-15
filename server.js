const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const PORT = 3008;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser("secret"));
app.use(session({
  secret: 'Huzaifa',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }

}));

app.get('/', (req, res) => {
  console.log(req.session);
  console.log(req.session);
  res.cookie('name', 'Huzaifa');
  res.status(200).send({ msg : 'Cookie has been set'});
});

app.get('/set-cookie', (req, res) => {
  res.cookie('name', 'Huzaifa', { maxAge: 900000, signed: true });
  res.send('Cookie has been set');
});

app.get('/get-cookie', (req, res) => {
  const name = req.signedCookies.name;
  res.send(`Cookie value: ${name}`);
});

mongoose.connect('mongodb://localhost:27017/user_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});