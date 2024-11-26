const mockAchievements = {
    all: [
      { id: 1, key: 'first_login', name: 'First Login', description: 'Log in for the first time' },
      { id: 2, key: 'first_expense', name: 'First Expense', description: 'Add your first expense' },
      { id: 3, key: 'first_trip_planner', name: 'First Trip', description: 'Plan your first trip' },
    ],
    user: [{ achievement_id: 1 }, { achievement_id: 3 }], // User has obtained "First Login" and "First Trip"
  };
  
  export default mockAchievements;
  