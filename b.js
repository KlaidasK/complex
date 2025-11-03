// SOLID & GRASP: Single Responsibility, Information Expert

// UI helpers
const showProgress = (section, text, message) => {
    section.style.display = "block";
    text.textContent = message;
};

const hideProgress = (section) => section.style.display = "none";

// Fetch helper
const fetchProgressData = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch data`);
    return response.json();
};

// Formatters
const formatters = {
    weight: (user, latest, isLosing) => {
        const diff = isLosing ? user.weight - latest.weight : latest.weight - user.weight;
        const status = diff > 0 ? `${diff}kg ${isLosing ? 'lost' : 'gained'}` : "No progress yet";
        return `Initial Weight: ${user.weight}kg, Latest Weight: ${latest.weight}kg, Progress: ${status}.`;
    },
    steps: (data) => {
        const dir = data.progress > 0 ? 'increased' : 'decreased';
        return `Initial Steps: ${data.initialSteps}, Latest Steps: ${data.latestSteps}, Progress: ${Math.abs(data.progress)} steps ${dir}.`;
    },
    calories: (data) => `Initial Calories: ${data.initialCalories} kcal, Latest Calories: ${data.latestCalories} kcal, Progress: ${Math.abs(data.progress)} ${data.progress > 0 ? 'kcal' : 'calorie progress'}.`,
    workouts: (data) => `Total completed Workouts: ${data.totalCompletedWorkouts}, Completed workouts per Week: ${data.averageWorkoutsPerWeek}`
};

// Unified weight fetcher
const fetchWeightProgress = async (isLosing) => {
    const user = await fetchUserData();
    const latest = await fetchLatestWeight();
    return (user && latest) ? formatters.weight(user, latest, isLosing) : null;
};

// Fetchers mapping
const progressFetchers = {
    "Lose weight": () => fetchWeightProgress(true),
    "Gain weight": () => fetchWeightProgress(false),
    "Increase step count": (username) => fetchProgressData(`/get-step-progress?username=${username}`)
                                .then(data => data.success ? formatters.steps(data) : null),
    "Track daily calories": (username) => fetchProgressData(`/get-calories-intake?username=${username}`)
                                .then(data => data.success ? formatters.calories(data) : null),
    "Increase fitness (workout repetition)": (username) => fetchProgressData(`/get-workout-progress?username=${username}`)
                                .then(data => data.success ? formatters.workouts(data) : null)
};

// Branch-free main function
const displayProgress = async (goal, username) => {
    try {
        const fetcher = progressFetchers[goal];
        const message = fetcher ? await fetcher(username) : null;
        message ? showProgress(progressSection, progressText, message)
                : hideProgress(progressSection);
    } catch (err) {
        console.error("Error displaying progress:", err);
        hideProgress(progressSection);
    }
};
