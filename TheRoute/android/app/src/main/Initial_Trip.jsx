import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Python } from 'chaquopy';

const TripPlanner = () => {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fuelCost, setFuelCost] = useState('');
  const [accommodationCost, setAccommodationCost] = useState('');
  const [foodCost, setFoodCost] = useState('');
  const [otherCost, setOtherCost] = useState('');
  const [message, setMessage] = useState('');

  const handlePlanTrip = async () => {
    try {
      const result = await Python.run('Intial_Trip.plan_trip', {
        args: [
          location, destination, vehicleMake, vehicleModel, startDate, endDate, 
          fuelCost, accommodationCost, foodCost, otherCost
        ]
      });
      setMessage(result);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {step === 1 && (
        <>
          <Text style={styles.title}>Step 1: Location and Dates</Text>
          <TextInput placeholder="Start Location" value={location} onChangeText={setLocation} style={styles.input} />
          <TextInput placeholder="Destination" value={destination} onChangeText={setDestination} style={styles.input} />
          <TextInput placeholder="Start Date (YYYY-MM-DD)" value={startDate} onChangeText={setStartDate} style={styles.input} />
          <TextInput placeholder="End Date (YYYY-MM-DD)" value={endDate} onChangeText={setEndDate} style={styles.input} />
          <Button title="Next" onPress={() => setStep(2)} />
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.title}>Step 2: Vehicle Information</Text>
          <TextInput placeholder="Vehicle Make" value={vehicleMake} onChangeText={setVehicleMake} style={styles.input} />
          <TextInput placeholder="Vehicle Model" value={vehicleModel} onChangeText={setVehicleModel} style={styles.input} />
          <Button title="Next" onPress={() => setStep(3)} />
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.title}>Step 3: Budget Details</Text>
          <TextInput placeholder="Fuel Cost" value={fuelCost} onChangeText={setFuelCost} style={styles.input} />
          <TextInput placeholder="Accommodation Cost" value={accommodationCost} onChangeText={setAccommodationCost} style={styles.input} />
          <TextInput placeholder="Food Cost" value={foodCost} onChangeText={setFoodCost} style={styles.input} />
          <TextInput placeholder="Other Costs" value={otherCost} onChangeText={setOtherCost} style={styles.input} />
          <Button title="Review Trip" onPress={() => setStep(4)} />
        </>
      )}

      {step === 4 && (
        <>
          <Text style={styles.title}>Step 4: Review and Confirm</Text>
          <Text>Starting Location: {location}</Text>
          <Text>Destination: {destination}</Text>
          <Text>Vehicle: {vehicleMake} {vehicleModel}</Text>
          <Text>Start Date: {startDate}</Text>
          <Text>End Date: {endDate}</Text>
          <Text>Fuel Cost: {fuelCost}</Text>
          <Text>Accommodation Cost: {accommodationCost}</Text>
          <Text>Food Cost: {foodCost}</Text>
          <Text>Other Costs: {otherCost}</Text>
          <Button title="Confirm and Save" onPress={handlePlanTrip} />
          {message && <Text>{message}</Text>}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
    width: '100%',
  },
});

export default TripPlanner;