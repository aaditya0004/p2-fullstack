// Import necessary libraries
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors'); 
const userRoutes = require('./routes/userRoutes.js');
const planRoutes = require('./routes/planRoutes.js'); 
const subscriptionRoutes = require('./routes/subscriptionRoutes.js');
const invoiceRoutes = require('./routes/invoiceRoutes.js');

// Load environment variables from .env file
dotenv.config();

// --- Database Connection ---
const connectDB = async () => {
  try {
    // Try to connect to the database using the URI from our environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`MongoDB Connected: ${conn.connection.name}`);
  } catch (error) {
    // If there's an error, log it and exit the process
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Call the function to connect to the database
connectDB();

// Initialize the Express app
const app = express();
app.use(cors());
app.use(express.json());

// Define a simple route for testing
// This means when someone visits our server's root URL, we send back a JSON response.
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Osto Billing API!' });
});

// Use the user routes
// Any URL starting with '/api/users' will be handled by our userRoutes file.
app.use('/api/users', userRoutes);

// Use the plan routes
app.use('/api/plans', planRoutes);

// Use the subscription routes
app.use('/api/subscriptions', subscriptionRoutes);

app.use('/api/invoices', invoiceRoutes);

// Get the port from environment variables, with a default of 5000
const PORT = process.env.PORT || 5000;

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
