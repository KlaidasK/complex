// SOLID: Single Responsibility - kiekviena funkcija turi vieną aiškią užduotį
// GRASP: Information Expert - duomenų apdorojimas susitelkęs ties duomenimis

// UI funkcijos (Single Responsibility)
function updateProgressUI(progressSection, progressText, message) {
    progressSection.style.display = message ? "block" : "none";
    if (message) progressText.textContent = message;
}

// Duomenų gavimo funkcija (DRY principle)
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch data`);
    return response.json();
}

// Formatavimo funkcijos (Information Expert)
function formatWeight(initial, latest, gained) {
    const diff = gained ? latest - initial : initial - latest;
    const status = diff > 0 ? `${diff}kg ${gained ? 'gained' : 'lost'}` : "No progress yet";
    return `Initial Weight: ${initial}kg, Latest Weight: ${latest}kg, Progress: ${status}.`;
}

function formatSteps(initial, latest, progress) {
    const direction = progress > 0 ? 'increased' : 'decreased';
    return `Initial Steps: ${initial}, Latest Steps: ${latest}, Progress: ${Math.abs(progress)} steps ${direction}.`;
}

function formatCalories(initial, latest, progress) {
    return `Initial Calories: ${initial} kcal, Latest Calories: ${latest} kcal, Progress: ${Math.abs(progress)} ${progress > 0 ? 'kcal' : 'calorie progress'}.`;
}

function formatWorkouts(total, avg) {
    return `Total completed Workouts: ${total}, Completed workouts per Week: ${avg}`;
}

// Progreso gavėjai
async function getWeightProgress(isGaining) {
    const userData = await fetchUserData();
    const latestData = await fetchLatestWeight();
    if (!userData || !latestData) return null;
    return formatWeight(userData.weight, latestData.weight, isGaining);
}

async function getStepProgress(username) {
    const data = await fetchData(`/get-step-progress?username=${username}`);
    if (!data.success) return null;
    return formatSteps(data.initialSteps, data.latestSteps, data.progress);
}

async function getCalorieProgress(username) {
    const data = await fetchData(`/get-calories-intake?username=${username}`);
    if (!data.success) return null;
    return formatCalories(data.initialCalories, data.latestCalories, data.progress);
}

async function getWorkoutProgress(username) {
    const data = await fetchData(`/get-workout-progress?username=${username}`);
    if (!data.success) return null;
    return formatWorkouts(data.totalCompletedWorkouts, data.averageWorkoutsPerWeek);
}

// Tikslo apdorojimas (Strategy Pattern)
async function processGoal(goal, username) {
    if (goal === "Lose weight") return await getWeightProgress(false);
    if (goal === "Gain weight") return await getWeightProgress(true);
    if (goal === "Increase step count") return await getStepProgress(username);
    if (goal === "Track daily calories") return await getCalorieProgress(username);
    if (goal === "Increase fitness (workout repetition)") return await getWorkoutProgress(username);
    return null;
}

// Pagrindinė funkcija - maksimaliai supaprastinta
async function displayProgress(goal, username) {
    try {
        const message = await processGoal(goal, username);
        updateProgressUI(progressSection, progressText, message);
    } catch (error) {
        console.error(`Error displaying progress:`, error);
        updateProgressUI(progressSection, progressText, null);
    }
}
