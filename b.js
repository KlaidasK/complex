// SOLID: Single Responsibility - kiekviena funkcija turi vieną aiškią užduotį
// GRASP: Information Expert - duomenų apdorojimas susitelkęs ties duomenimis

// Helper funkcijos UI atnaujinimui (Single Responsibility)
function showProgress(progressSection, progressText, message) {
    progressSection.style.display = "block";
    progressSection.textContent = message;
}

function hideProgress(progressSection) {
    progressSection.style.display = "none";
}

// Duomenų gavimo funkcija (DRY principle)
async function fetchProgressData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch data`);
    }
    return response.json();
}

// Progreso formatavimo funkcijos
function formatWeightProgress(userData, latestWeightData, isLosing) {
    const initial = userData.weight;
    const latest = latestWeightData.weight;
    const diff = isLosing ? initial - latest : latest - initial;
    const status = diff > 0 ? `${diff}kg ${isLosing ? 'lost' : 'gained'}` : "No progress yet";
    
    return `Initial Weight: ${initial}kg, Latest Weight: ${latest}kg, Progress: ${status}.`;
}

function formatStepProgress(data) {
    const direction = data.progress > 0 ? 'increased' : 'decreased';
    return `Initial Steps: ${data.initialSteps}, Latest Steps: ${data.latestSteps}, Progress: ${Math.abs(data.progress)} steps ${direction}.`;
}

function formatCalorieProgress(data) {
    return `Initial Calories: ${data.initialCalories} kcal, Latest Calories: ${data.latestCalories} kcal, Progress: ${Math.abs(data.progress)} ${data.progress > 0 ? 'kcal' : 'calorie progress'}.`;
}

function formatWorkoutProgress(data) {
    return `Total completed Workouts: ${data.totalCompletedWorkouts}, Completed workouts per Week: ${data.averageWorkoutsPerWeek}`;
}

// Okremės progreso gavimo funkcijos
async function getWeightProgress(goal) {
    const userData = await fetchUserData();
    const latestWeightData = await fetchLatestWeight();
    
    if (!userData || !latestWeightData) return null;
    
    return formatWeightProgress(userData, latestWeightData, goal === "Lose weight");
}

async function getStepProgress(username) {
    const data = await fetchProgressData(`/get-step-progress?username=${username}`);
    return data.success ? formatStepProgress(data) : null;
}

async function getCalorieProgress(username) {
    const data = await fetchProgressData(`/get-calories-intake?username=${username}`);
    return data.success ? formatCalorieProgress(data) : null;
}

async function getWorkoutProgress(username) {
    const data = await fetchProgressData(`/get-workout-progress?username=${username}`);
    return data.success ? formatWorkoutProgress(data) : null;
}

// Pagrindinė funkcija su ankstyvais returns (Guard Clauses)
async function displayProgress(goal, username) {
    try {
        let message = null;
        
        // Weight goals
        if (goal === "Lose weight" || goal === "Gain weight") {
            message = await getWeightProgress(goal);
        }
        // Step goal
        else if (goal === "Increase step count") {
            message = await getStepProgress(username);
        }
        // Calorie goal
        else if (goal === "Track daily calories") {
            message = await getCalorieProgress(username);
        }
        // Workout goal
        else if (goal === "Increase fitness (workout repetition)") {
            message = await getWorkoutProgress(username);
        }
        
        // Display result
        if (message) {
            showProgress(progressSection, progressText, message);
        } else {
            hideProgress(progressSection);
        }
        
    } catch (error) {
        console.error(`Error displaying progress:`, error);
        hideProgress(progressSection);
    }
}
