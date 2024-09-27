import sqlite3

# Connect to the SQLite database
connection = sqlite3.connect('theroute.db')
cursor = connection.cursor()

# Drop the trips table if it exists
cursor.execute('DROP TABLE IF EXISTS trips')

# Create the trips table with more detailed budget columns
cursor.execute('''
    CREATE TABLE IF NOT EXISTS trips (
        id INTEGER PRIMARY KEY,
        start_location TEXT NOT NULL,
        destination TEXT NOT NULL,
        vehicle_make TEXT NOT NULL,
        vehicle_model TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        fuel_cost REAL NOT NULL,
        accommodation_cost REAL NOT NULL,
        food_cost REAL NOT NULL,
        other_cost REAL NOT NULL,
        total_budget REAL NOT NULL
    )
''')

# Function to calculate total budget
def calculate_total_budget(fuel_cost, accommodation_cost, food_cost, other_cost):
    return fuel_cost + accommodation_cost + food_cost + other_cost

# Function to plan a trip with or without detailed budget breakdown
def plan_trip(start_location, destination, vehicle_make, vehicle_model, start_date, end_date, budget_choice):
    if budget_choice == 'yes':
        # Ask for budget details if user opts in
        fuel_cost = float(input("Enter the fuel cost: "))
        accommodation_cost = float(input("Enter the accommodation cost: "))
        food_cost = float(input("Enter the food cost: "))
        other_cost = float(input("Enter other costs: "))
        total_budget = calculate_total_budget(fuel_cost, accommodation_cost, food_cost, other_cost)
    else:
        # Default budget values to zero
        fuel_cost = 0.0
        accommodation_cost = 0.0
        food_cost = 0.0
        other_cost = 0.0
        total_budget = 0.0

    # Trip summary review
    print(f"\nTrip Summary:")
    print(f"Starting Location: {start_location}")
    print(f"Destination(s): {destination} (From: {start_date} to {end_date})")
    print(f"Vehicle: {vehicle_make}, {vehicle_model}")
    print(f"Budget Breakdown:")
    print(f"Fuel: ${fuel_cost}")
    print(f"Accommodation: ${accommodation_cost}")
    print(f"Food: ${food_cost}")
    print(f"Other: ${other_cost}")
    print(f"Total Budget: ${total_budget}")
    
    confirm = input("\nDo you confirm this trip? (yes/no): ").strip().lower()
    
    if confirm == 'yes':
        # Insert trip details into the database
        cursor.execute('''
            INSERT INTO trips (start_location, destination, vehicle_make, vehicle_model, start_date, end_date, fuel_cost, accommodation_cost, food_cost, other_cost, total_budget)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (start_location, destination, vehicle_make, vehicle_model, start_date, end_date, fuel_cost, accommodation_cost, food_cost, other_cost, total_budget))
        connection.commit()
        return "Trip planned and saved successfully."
    else:
        return "Trip not saved."

# Function to close the connection when done
def close_connection():
    connection.close()

# Example usage
if __name__ == "__main__":
    start_location = input("Enter the start location: ")
    destination = input("Enter the destination: ")
    vehicle_make = input("Enter the vehicle make: ")
    vehicle_model = input("Enter the vehicle model: ")
    start_date = input("Enter the start date (YYYY-MM-DD): ")
    end_date = input("Enter the end date (YYYY-MM-DD): ")
    
    # Ask if the user wants to create a detailed budget
    budget_choice = input("Would you like to create a budget plan? (yes/no): ").strip().lower()
    
    # Plan the trip based on user input
    print(plan_trip(start_location, destination, vehicle_make, vehicle_model, start_date, end_date, budget_choice))
    
    close_connection()

