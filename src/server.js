const express = require('express');
require('dotenv').config();

const authRouter = require('./auth');

const app = express();

app.use(express.json());

// mount auth
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Server running...');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});