const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Nir01620622513', //  MySQL password
  database: 'tripdb', // The database created earlier
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// API route to add a new trip
app.post('/api/trips', (req, res) => {
    const { startLocation, endLocation, tripDistance, tripDate, email, vehicleInfo, expenses, plannedLocations } = req.body;
    const query = 'INSERT INTO trips (startLocation, endLocation, tripDistance, tripDate, email, vehicleInfo, expenses, plannedLocations) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
    db.query(query, [startLocation, endLocation, tripDistance, tripDate, email, vehicleInfo, expenses, plannedLocations], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving trip', error: err });
      }
      res.status(201).json({ message: 'Trip saved successfully!', tripId: result.insertId });
    });
  });
  

// API route to get all trips
app.get('/api/trips', (req, res) => {
  const query = 'SELECT * FROM trips';

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving trips', error: err });
    }
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
