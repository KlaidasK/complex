app.get('/get-workout-progress', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ success: false, error: 'Username is required' });
  }

  try {
    // Fetch all completed workouts for the user
    const completedWorkouts = await WorkoutStatus.find({
      username: username,
      status: 'Yes',
    }).sort({ date: 1 }); // Sort by date in ascending order

    if (!completedWorkouts.length) {
      return res.json({ success: true, averageWorkoutsPerWeek: 0, totalCompletedWorkouts: 0 });
    }

    // Group workouts by week
    const weeklyWorkouts = {};
    const startOfWeek = (date) => {
      const d = new Date(date);
      d.setDate(d.getDate() - d.getDay()); // Set to the start of the week (Sunday)
      d.setHours(0, 0, 0, 0); // Clear time
      return d.toISOString();
    };

    for (const workout of completedWorkouts) {
      const week = startOfWeek(workout.date);
      if (!weeklyWorkouts[week]) {
        weeklyWorkouts[week] = 0;
      }
      weeklyWorkouts[week]++;
    }

    // Calculate the average workouts per week
    const totalWeeks = Object.keys(weeklyWorkouts).length;
    const totalCompletedWorkouts = completedWorkouts.length;
    const averageWorkoutsPerWeek = (totalCompletedWorkouts / totalWeeks).toFixed(2);

    return res.json({
      success: true,
      averageWorkoutsPerWeek: averageWorkoutsPerWeek,
      totalCompletedWorkouts: totalCompletedWorkouts,
      weeklyData: weeklyWorkouts,
    });
  } catch (error) {
    console.error('Error fetching average workouts per week:', error);
    return res.status(500).json({ success: false, error: 'Error fetching average workouts per week' });
  }
});