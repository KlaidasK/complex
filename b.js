// SOLID principai: Single Responsibility - kiekviena klasė/funkcija turi vieną atsakomybę
// GRASP principai: Information Expert - duomenų apdorojimas perkeltas į atskiras funkcijas

// Strategijos klasės kiekvienam progreso tipui (Strategy Pattern + Single Responsibility)
class WeightProgressStrategy {
    constructor(goal) {
        this.goal = goal;
    }

    async calculate() {
        const userData = await fetchUserData();
        const latestWeightData = await fetchLatestWeight();

        if (!userData || !latestWeightData) {
            return null;
        }

        const initialWeight = userData.weight;
        const latestWeight = latestWeightData.weight;
        const isLosing = this.goal === "Lose weight";
        const progress = isLosing 
            ? initialWeight - latestWeight 
            : latestWeight - initialWeight;

        const progressText = progress > 0 
            ? `${progress}kg ${isLosing ? 'lost' : 'gained'}` 
            : "No progress yet";

        return `Initial Weight: ${initialWeight}kg, Latest Weight: ${latestWeight}kg, Progress: ${progressText}.`;
    }
}

class StepProgressStrategy {
    async calculate(username) {
        const response = await fetch(`/get-step-progress?username=${username}`);

        if (!response.ok) {
            throw new Error('Failed to fetch step progress');
        }

        const data = await response.json();

        if (!data.success) {
            return null;
        }

        const { initialSteps, latestSteps, progress } = data;
        const progressText = progress > 0 
            ? `${progress} steps increased` 
            : `${Math.abs(progress)} steps decreased`;

        return `Initial Steps: ${initialSteps}, Latest Steps: ${latestSteps}, Progress: ${progressText}.`;
    }
}

class CalorieProgressStrategy {
    async calculate(username) {
        const response = await fetch(`/get-calories-intake?username=${username}`);

        if (!response.ok) {
            throw new Error('Failed to fetch calorie intake data');
        }

        const data = await response.json();

        if (!data.success) {
            return null;
        }

        const { initialCalories, latestCalories, progress } = data;
        const progressText = progress > 0 
            ? `${progress} kcal` 
            : `${Math.abs(progress)} calorie progress`;

        return `Initial Calories: ${initialCalories} kcal, Latest Calories: ${latestCalories} kcal, Progress: ${progressText}.`;
    }
}

class WorkoutProgressStrategy {
    async calculate(username) {
        const response = await fetch(`/get-workout-progress?username=${username}`);

        if (!response.ok) {
            throw new Error('Failed to fetch workout progress data');
        }

        const data = await response.json();

        if (!data.success) {
            return null;
        }

        const { averageWorkoutsPerWeek, totalCompletedWorkouts } = data;

        return `Total completed Workouts: ${totalCompletedWorkouts}, Completed workouts per Week: ${averageWorkoutsPerWeek}`;
    }
}

// Factory Pattern - sukuria tinkamą strategiją pagal tikslą
class ProgressStrategyFactory {
    static create(goal) {
        const strategies = {
            "Lose weight": new WeightProgressStrategy(goal),
            "Gain weight": new WeightProgressStrategy(goal),
            "Increase step count": new StepProgressStrategy(),
            "Track daily calories": new CalorieProgressStrategy(),
            "Increase fitness (workout repetition)": new WorkoutProgressStrategy()
        };

        return strategies[goal] || null;
    }
}

// UI atnaujinimo logika (Single Responsibility)
class ProgressDisplay {
    constructor(progressSection, progressText) {
        this.progressSection = progressSection;
        this.progressText = progressText;
    }

    show(message) {
        this.progressSection.style.display = "block";
        this.progressText.textContent = message;
    }

    hide() {
        this.progressSection.style.display = "none";
    }
}

// Pagrindinė funkcija - dabar daug paprastesnė (sumažinta Cognitive Complexity)
async function displayProgress(goal, username) {
    const display = new ProgressDisplay(progressSection, progressText);
    const strategy = ProgressStrategyFactory.create(goal);

    if (!strategy) {
        display.hide();
        return;
    }

    try {
        const message = await strategy.calculate(username);
        
        if (message) {
            display.show(message);
        } else {
            display.hide();
        }
    } catch (error) {
        console.error(`Error displaying ${goal} progress:`, error);
        display.hide();
    }
}
