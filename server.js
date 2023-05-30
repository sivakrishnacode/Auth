// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Set up Express
const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin-siva:admin-siva@cluster0.a8xkzs5.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect : MongoDB:', err));

// Define the User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);




// Register a new user
app.post('/register', async (req, res) => {
  
  const { email, password } = req.body;
  

  // Check if the email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: 'Email already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(hashedPassword);
  

  // Create a new user

  const user = new User({ email, password: hashedPassword });
  await user.save();

  res.status(201).json({ message: 'User registered successfully' });
});

//get method
app.get('/register', (res, req) => {
  req.sendFile('/home/skravichandran/Desktop/project/auth/index.html')
})








// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Email not Found' });
  }

  // Compare the provided password with the stored password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Password not match' });
  }

  // Generate JWT
  const token = jwt.sign({ userId: user._id }, 'secret-key', { expiresIn: '1h' });

  res.json({ token });
});

app.get('/login', (req, res) => {
  res.sendFile('/home/skravichandran/Desktop/project/auth/index.html')
})

// Start the server
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});

