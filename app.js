// Mins and Secs
const minsDisplay = document.getElementById('minutes');
const secsDisplay = document.getElementById('seconds');

const originalMinutes = minsDisplay.textContent;
const originalSeconds = secsDisplay.textContent;

// Lottie Animation
let loadingDish;
let avatarContainer;

function initializeAnimations() {
    // Create Loading Dish Animation
    loadingDish = document.createElement('dotlottie-player');
    loadingDish.src = "https://lottie.host/30ff292f-a4c5-4ec1-b7f0-3a0ea7023070/VTdB7eQVgL.lottie";
    Object.assign(loadingDish.style, {
        width: "80%", height: "auto", margin: "0 auto", display: "none"
    });
    loadingDish.setAttribute("loop", "true");
    loadingDish.setAttribute("autoplay", "true");
    document.querySelector('.ingredient-img').appendChild(loadingDish);

    // Create Avatar Animation
    avatarContainer = document.createElement('dotlottie-player');
    avatarContainer.src = "https://lottie.host/a34586ee-e432-452f-b489-4d9609450160/vzb4SZ8JWd.lottie";
    avatarContainer.setAttribute("loop", "true");
    avatarContainer.setAttribute("autoplay", "true");
    document.querySelector('.avatar').appendChild(avatarContainer);
}

// Initialize animations
initializeAnimations();

// DOM selection
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const pauseBtn = document.getElementById('pause');
const msgDisplay = document.querySelector('.timer-message p');
const dishCountDisplay = document.getElementById('dish-count');
const dishImageSelector = document.querySelector('.dish');

// Functions

// Calculate initial time 
function getInitialTime() {
    return (parseInt(originalMinutes) * 60) + parseInt(originalSeconds);
}

// Get current displayed time in seconds
function getCurrentDisplayedTime() {
    const mins = parseInt(minsDisplay.textContent || "0");
    const secs = parseInt(secsDisplay.textContent || "0");
    console.log("Current displayed time:", mins, "minutes,", secs, "seconds");
    return (mins * 60) + secs;
}

// Update button visibility
function updateButtons() {
    startBtn.style.display = isPaused ? 'inline' : 'none';
    pauseBtn.style.display = isPaused ? 'none' : 'inline';
    resetBtn.style.display = 'inline';
}

// Update timer display
function updateDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    minsDisplay.textContent = String(mins).padStart(2, '0');
    secsDisplay.textContent = String(secs).padStart(2, '0');
}

// Update the message based on remaining time
function updateMessage() {
    if (timeLeft <= 10 && timeLeft > 0) {
        msgDisplay.textContent = "Plating up soon... just a little longer!";
    } else if (timeLeft > 10) {
        msgDisplay.textContent = "Stay focused...Cooking up something delicious!";
    }
}

// Timer countdown logic
function tick() {
    if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
        updateMessage();

        if (timeLeft === 0) {
            clearInterval(timerId);
            dishCount++;
            dishCountDisplay.textContent = dishCount;

            loadingDish.style.display = "none";
            dishImageSelector.style.display = "block";

            const randomIndex = Math.floor(Math.random() * finalDish.length);

            dishImageSelector.src = finalDish[randomIndex];
            msgDisplay.innerHTML = `You've cooked up a delicious <span style="font-weight: 800; color: #FF836C; margin-left: 4px"> ${dishName[randomIndex]}</span>. What's next?`;

            resetBtn.disabled = true;
            startBtn.style.display = 'inline';
            pauseBtn.style.display = 'none';
            resetBtn.style.display = 'inline';
        }
    }
}

// Reset timer to initial state
function resetTimer() {
    clearInterval(timerId);
    
    timeLeft = getInitialTime();
    isPaused = false;

    updateDisplay();
    
    msgDisplay.textContent = "Ready to cook up some focus?";
    dishImageSelector.src = initialDish;
    dishImageSelector.style.display = "block";
    loadingDish.style.display = "none";

    startBtn.style.display = 'inline';
    pauseBtn.style.display = 'none';
    resetBtn.style.display = 'inline';
    resetBtn.disabled = true;
    
}

// Constants and States
const initialDish = "assets/tomato.svg";
const finalDish = ["assets/caesar.svg", "assets/spaghetti.svg", "assets/pizza.svg"];
const dishName = ["Caesar Salad", "Spaghetti", "Pizza"];

let dishCount = parseInt(dishCountDisplay.textContent);
let timerId;
let isPaused = false;
let timeLeft = getInitialTime();

// Initial Setup
startBtn.style.display = 'inline';
resetBtn.style.display = 'inline';
pauseBtn.style.display = 'none';
resetBtn.disabled = true;
msgDisplay.textContent = "Ready to cook up some focus?";
dishImageSelector.src = initialDish;

// Event Listeners
// Start Timer
startBtn.addEventListener('click', () => {
    clearInterval(timerId);
    resetBtn.disabled = false;

    if (timeLeft <= 0) {
        timeLeft = getInitialTime();
        updateDisplay();
        dishImageSelector.src = initialDish;
    }
    
    if (timeLeft > 0) {
        isPaused = false;
        
        // Update message immediately before starting the timer
        updateMessage();
        
        timerId = setInterval(tick, 1000);
        dishImageSelector.style.display = "none";
        loadingDish.style.display = "block";
        updateButtons();
    } else {
        resetTimer();
    }
});

// Pause Timer
pauseBtn.addEventListener('click', () => {
    clearInterval(timerId);
    isPaused = true;
    msgDisplay.textContent = "Timer paused. Resume when you're ready!";
    updateButtons();
});

// Reset Timer
resetBtn.addEventListener('click', resetTimer);