// backend/TripRepository.js
const db = require('./db'); // Assuming you have a db.js for connection

class TripRepository {
  // Add a new trip
  static async addTrip(tripData) {
    const { startLocation, endLocation, tripDistance, tripDate, email, vehicleInfo, expenses, plannedLocations } = tripData;
    const query = 'INSERT INTO trips (startLocation, endLocation, tripDistance, tripDate, email, vehicleInfo, expenses, plannedLocations) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
    return new Promise((resolve, reject) => {
      db.query(query, [startLocation, endLocation, tripDistance, tripDate, email, vehicleInfo, expenses, plannedLocations], (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result.insertId);
      });
    });
  }

  // Fetch all trips
  static async getAllTrips() {
    const query = 'SELECT * FROM trips';
    
    return new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  }
}

module.exports = TripRepository;
