const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const TripRepository = require('./TripRepository'); // Import the repository

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API route to add a new trip
app.post('/api/trips', async (req, res) => {
  console.log('Received data:', req.body); // Debug: Check incoming data
  try {
    const tripId = await TripRepository.addTrip(req.body); // Use the repository to add a trip
    console.log('Trip saved successfully with ID:', tripId);
    res.status(201).json({ message: 'Trip saved successfully!', tripId });
  } catch (error) {
    res.status(500).json({ message: 'Error saving trip', error });
  }
});

// API route to get all trips
app.get('/api/trips', async (req, res) => {
  try {
    const trips = await TripRepository.getAllTrips(); // Use the repository to get all trips
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving trips', error });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
