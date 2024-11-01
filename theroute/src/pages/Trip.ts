// Trip.ts
export interface Trip {
    startLocation: string;
    endLocation: string;
    tripDistance: string;
    tripDate: string;
    email: string;
    vehicleInfo: string;
    expenses: string;
    plannedLocations: string;
  }
  
  export class TripBuilder {
    private trip: Partial<Trip> = {};
  
    setStartLocation(startLocation: string): TripBuilder {
      this.trip.startLocation = startLocation;
      return this;
    }
  
    setEndLocation(endLocation: string): TripBuilder {
      this.trip.endLocation = endLocation;
      return this;
    }
  
    setTripDistance(tripDistance: string): TripBuilder {
      this.trip.tripDistance = tripDistance;
      return this;
    }
  
    setTripDate(tripDate: string): TripBuilder {
      this.trip.tripDate = tripDate;
      return this;
    }
  
    setEmail(email: string): TripBuilder {
      this.trip.email = email;
      return this;
    }
  
    setVehicleInfo(vehicleInfo: string): TripBuilder {
      this.trip.vehicleInfo = vehicleInfo;
      return this;
    }
  
    setExpenses(expenses: string): TripBuilder {
      this.trip.expenses = expenses;
      return this;
    }
  
    setPlannedLocations(plannedLocations: string): TripBuilder {
      this.trip.plannedLocations = plannedLocations;
      return this;
    }
  
    build(): Trip {
      // Ensure required fields are set or throw an error
      if (!this.trip.startLocation || !this.trip.endLocation) {
        throw new Error('Start and end locations are required');
      }
      return this.trip as Trip;
    }
  }