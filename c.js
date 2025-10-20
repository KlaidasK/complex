app.get('/get-weekly-nutrients', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ success: false, error: 'Username is required' });
  }

  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Get date for one week ago

    // Fetch the nutrient logs for the past week
    const logs = await NutrientLog.find({
      username: username,
      date: { $gte: oneWeekAgo },
    }).sort({ date: 1 });

    // Calculate the weekly averages for protein, carbs, and fats
    let totalProtein = 0, totalCarbs = 0, totalFat = 0;
    logs.forEach(log => {
      totalProtein += log.protein;
      totalCarbs += log.carbohydrates;
      totalFat += log.fats;
    });

    const averageProtein = totalProtein / logs.length;
    const averageCarbs = totalCarbs / logs.length;
    const averageFat = totalFat / logs.length;

    return res.json({
      success: true,
      averages: {
        protein: averageProtein,
        carbs: averageCarbs,
        fat: averageFat,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Error fetching weekly nutrients' });
  }
});

app.get('/get-monthly-nutrients', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ success: false, error: 'Username is required' });
  }

  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);  // Get date for one month ago

    // Fetch the nutrient logs for the past month
    const logs = await NutrientLog.find({
      username: username,
      date: { $gte: oneMonthAgo },
    }).sort({ date: 1 });

    // Calculate the monthly averages for protein, carbs, and fats
    let totalProtein = 0, totalCarbs = 0, totalFat = 0;
    logs.forEach(log => {
      totalProtein += log.protein;
      totalCarbs += log.carbohydrates;
      totalFat += log.fats;
    });

    const averageProtein = totalProtein / logs.length;
    const averageCarbs = totalCarbs / logs.length;
    const averageFat = totalFat / logs.length;

    return res.json({
      success: true,
      averages: {
        protein: averageProtein,
        carbs: averageCarbs,
        fat: averageFat,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Error fetching monthly nutrients' });
  }
});
