app.post('/log-weight', async (req, res) => {

  const { username, logDate, weight } = req.body;

  if (!username || !weight) {

    return res.status(400).json({ error: 'Username and weight are required.' });

  }

  try {

    // Normalize log date to UTC

    const weightDate = logDate ? new Date(logDate) : new Date();

    const normalizedDate = new Date(weightDate.setUTCHours(0, 0, 0, 0));

    console.log('Normalized Date:', normalizedDate);

    // Check if a log already exists for the same user and date

    const existingLog = await weightLog.findOne({

      username,

      date: normalizedDate,

    });

    if (existingLog) {

      console.log('Existing Log:', existingLog);

      // Use updateOne to update the log

      const result = await weightLog.
1
2
updateOne
(

Change this code to not construct database queries directly from user-controlled data.

        { username, date: normalizedDate },  // Find the existing log

        { $set: { weight } }  // Update the weight field

      );

      if (result.nModified === 0) {

        return res.status(400).json({ error: 'Weight value is the same as the existing one. No update needed.' });

      }

      return res.status(200).json({

        success: true,

        message: 'Weight log updated successfully.',

      });

    } else {

      // Create a new log

      const newLog = new weightLog({

        username,

        date: normalizedDate,

        weight,

      });

      const savedLog = await newLog.save();

      return res.status(201).json({

        success: true,

        message: 'Weight log created successfully.',

        savedLog,

      });

    }

  } catch (error) {

    console.error('Error logging weight:', error);

    return res.status(500).json({ error: 'Server error while logging weight.' });

  }

});
