// SOLID: Single Responsibility - kiekviena funkcija turi vieną aiškią užduotį
// GRASP: Information Expert - duomenų apdorojimas susitelkęs ties duomenimis

// Helper funkcijos UI atnaujinimui (Single Responsibility)
function showProgress(progressSection, progressText, message) {
    progressSection.style.display = "block";
    progressText.textContent = message;
}

function hideProgress(progressSection) {
    progressSection.style.display = "none";
}

// Duomenų gavimo funkcijos
async function fetchProgressData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
    }
    return response.json();
}

// Progreso skaičiavimo funkcijos kiekvienam tipui
function calculateWeightProgress(userData, latestWeightData, isLosing) {
    const initialWeight = userData.weight;
    const latestWeight = latestWeightData.weight;
    const progress = isLosing 
        ? initialWeight - latestWeight 
        : latestWeight - initialWeight;
    
    const progressText = progress > 0 
        ? `${progress}kg ${isLosing ? 'lost' : 'gained'}` 
        : "No progress yet";
    
    return `Initial Weight: ${initialWeight}kg, Latest Weight: ${latestWeight}kg, Progress: ${progressText}.`;
}

function formatStepProgress(data) {
    const { initialSteps, latestSteps, progress } = data;
    const progressText = progress > 0 
        ? `${progress} steps increased` 
        : `${Math.abs(progress)} steps decreased`;
    
    return `Initial Steps: ${initialSteps}, Latest Steps: ${latestSteps}, Progress: ${progressText}.`;
}

function formatCalorieProgress(data) {
    const { initialCalories, latestCalories, progress } = data;
    const progressText = progress > 0 
        ? `${progress} kcal` 
        : `${Math.abs(progress)} calorie progress`;
    
    return `Initial Calories: ${initialCalories} kcal, Latest Calories: ${latestCalories} kcal, Progress: ${progressText}.`;
}

function formatWorkoutProgress(data) {
    const { averageWorkoutsPerWeek, totalCompletedWorkouts } = data;
    return `Total completed Workouts: ${totalCompletedWorkouts}, Completed workouts per Week: ${averageWorkoutsPerWeek}`;
}

// Pagrindinės funkcijos kiekvienam tikslui
async function handleWeightProgress(goal) {
    const userData = await fetchUserData();
    const latestWeightData = await fetchLatestWeight();
    
    if (!userData || !latestWeightData) {
        return null;
    }
    
    const isLosing = goal === "Lose weight";
    return calculateWeightProgress(userData, latestWeightData, isLosing);
}

async function handleStepProgress(username) {
    const data = await fetchProgressData(`/get-step-progress?username=${username}`);
    return data.success ? formatStepProgress(data) : null;
}

async function handleCalorieProgress(username) {
    const data = await fetchProgressData(`/get-calories-intake?username=${username}`);
    return data.success ? formatCalorieProgress(data) : null;
}

async function handleWorkoutProgress(username) {
    const data = await fetchProgressData(`/get-workout-progress?username=${username}`);
    return data.success ? formatWorkoutProgress(data) : null;
}

// Strategy map (Strategy Pattern be klasių)
const progressHandlers = {
    "Lose weight": handleWeightProgress,
    "Gain weight": handleWeightProgress,
    "Increase step count": handleStepProgress,
    "Track daily calories": handleCalorieProgress,
    "Increase fitness (workout repetition)": handleWorkoutProgress
};

// Pagrindinė funkcija - maksimaliai supaprastinta
async function displayProgress(goal, username) {
    const handler = progressHandlers[goal];
    
    if (!handler) {
        hideProgress(progressSection);
        return;
    }
    
    try {
        const message = await handler(username);
        
        if (message) {
            showProgress(progressSection, progressText, message);
        } else {
            hideProgress(progressSection);
        }
    } catch (error) {
        console.error(`Error displaying ${goal} progress:`, error);
        hideProgress(progressSection);
    }
}
