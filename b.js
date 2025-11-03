// SOLID & GRASP: Each function has a single responsibility

// UI helpers
function showProgress(progressSection, progressText, message) {
    progressSection.style.display = "block";
    progressText.textContent = message;
}

function hideProgress(progressSection) {
    progressSection.style.display = "none";
}

// Fetch helper
async function fetchProgressData(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch data`);
    return response.json();
}

// Formatters
const formatters = {
    weight: (userData, latestWeightData, isLosing) => {
        const initial = userData.weight;
        const latest = latestWeightData.weight;
        const diff = isLosing ? initial - latest : latest - initial;
        const status = diff > 0 ? `${diff}kg ${isLosing ? 'lost' : 'gained'}` : "No progress yet";
        return `Initial Weight: ${initial}kg, Latest Weight: ${latest}kg, Progress: ${status}.`;
    },
    steps: (data) => {
        const direction = data.progress > 0 ? 'increased' : 'decreased';
        return `Initial Steps: ${data.initialSteps}, Latest Steps: ${data.latestSteps}, Progress: ${Math.abs(data.progress)} steps ${direction}.`;
    },
    calories: (data) => {
        return `Initial Calories: ${data.initialCalories} kcal, Latest Calories: ${data.latestCalories} kcal, Progress: ${Math.abs(data.progress)} ${data.progress > 0 ? 'kcal' : 'calorie progress'}.`;
    },
    workouts: (data) => `Total completed Workouts: ${data.totalCompletedWorkouts}, Completed workouts per Week: ${data.averageWorkoutsPerWeek}`
};

// Progress fetchers
const progressFetchers = {
    "Lose weight": async () => {
        const user = await fetchUserData();
        const latest = await fetchLatestWeight();
        if (!user || !latest) return null;
        return formatters.weight(user, latest, true);
    },
    "Gain weight": async () => {
        const user = await fetchUserData();
        const latest = await fetchLatestWeight();
        if (!user || !latest) return null;
        return formatters.weight(user, latest, false);
    },
    "Increase step count": async (username) => {
        const data = await fetchProgressData(`/get-step-progress?username=${username}`);
        return data.success ? formatters.steps(data) : null;
    },
    "Track daily calories": async (username) => {
        const data = await fetchProgressData(`/get-calories-intake?username=${username}`);
        return data.success ? formatters.calories(data) : null;
    },
    "Increase fitness (workout repetition)": async (username) => {
        const data = await fetchProgressData(`/get-workout-progress?username=${username}`);
        return data.success ? formatters.workouts(data) : null;
    }
};

// Main function
async function displayProgress(goal, username) {
    try {
        const fetcher = progressFetchers[goal];
        if (!fetcher) return hideProgress(progressSection);

        const message = await fetcher(username);
        if (message) showProgress(progressSection, progressText, message);
        else hideProgress(progressSection);

    } catch (error) {
        console.error(`Error displaying progress:`, error);
        hideProgress(progressSection);
    }
}
