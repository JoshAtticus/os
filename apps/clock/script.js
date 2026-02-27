document.addEventListener('DOMContentLoaded', () => {
    // --- Tabs Logic ---
    const tabs = document.querySelectorAll('.tab');
    const container = document.getElementById('view-container');
    const views = document.querySelectorAll('.view');
    
    // Update active tab on scroll
    container.addEventListener('scroll', () => {
        let index = Math.round(container.scrollLeft / container.clientWidth);
        tabs.forEach(t => t.classList.remove('active'));
        if(tabs[index]) tabs[index].classList.add('active');
    });

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
             views[index].scrollIntoView({ behavior: 'smooth' });
        });
    });

    // --- World Clock Logic ---
    function updateWorldClock() {
        const now = new Date();
        
        // Main Display
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const mainClock = document.getElementById('main-clock');
        if (mainClock) mainClock.textContent = `${hours}:${minutes}`;
        
        const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
        const dateDisplay = document.getElementById('date-display');
        if (dateDisplay) dateDisplay.textContent = now.toLocaleDateString('en-US', options);
    }
    setInterval(updateWorldClock, 1000);
    updateWorldClock();

    // --- Stopwatch Logic ---
    let swInterval;
    let swStartTime;
    let swElapsedTime = 0;
    let swRunning = false;

    const swDisplay = document.getElementById('sw-display');
    const swStartBtn = document.getElementById('sw-start');
    const swLapBtn = document.getElementById('sw-lap');
    const swLapsList = document.getElementById('sw-laps');

    function formatTime(ms) {
        const date = new Date(ms);
        const m = String(date.getUTCMinutes()).padStart(2, '0');
        const s = String(date.getUTCSeconds()).padStart(2, '0');
        const msDisplay = String(Math.floor(date.getUTCMilliseconds() / 10)).padStart(2, '0');
        return `${m}:${s}.${msDisplay}`;
    }

    if (swStartBtn) {
        swStartBtn.addEventListener('click', () => {
            if (!swRunning) {
                // Start
                swRunning = true;
                swStartTime = Date.now() - swElapsedTime;
                swInterval = setInterval(() => {
                    swElapsedTime = Date.now() - swStartTime;
                    swDisplay.textContent = formatTime(swElapsedTime);
                }, 10);
                swStartBtn.textContent = 'Stop';
                swStartBtn.classList.remove('btn-start');
                swStartBtn.classList.add('btn-stop');
                swLapBtn.disabled = false;
                swLapBtn.textContent = 'Lap';
            } else {
                // Stop
                swRunning = false;
                clearInterval(swInterval);
                swStartBtn.textContent = 'Start';
                swStartBtn.classList.remove('btn-stop');
                swStartBtn.classList.add('btn-start');
                swLapBtn.textContent = 'Reset';
            }
        });
    }

    if (swLapBtn) {
        swLapBtn.addEventListener('click', () => {
            if (swRunning) {
                // Lap
                const li = document.createElement('div');
                li.className = 'lap-item';
                const lapNum = swLapsList.children.length + 1;
                li.innerHTML = `<span>Lap ${lapNum}</span><span>${formatTime(swElapsedTime)}</span>`;
                swLapsList.prepend(li);
            } else {
                // Reset
                swElapsedTime = 0;
                swDisplay.textContent = "00:00.00";
                swLapsList.innerHTML = '';
                swLapBtn.textContent = 'Lap';
                swLapBtn.disabled = true;
            }
        });
    }

    // --- Timer Logic ---
    let timerInterval;
    let timerTime = 0;
    
    const timerH = document.getElementById('timer-h');
    const timerM = document.getElementById('timer-m');
    const timerS = document.getElementById('timer-s');
    const timerStartBtn = document.getElementById('timer-start');
    const timerSetup = document.getElementById('timer-setup');
    const timerDisplay = document.getElementById('timer-display');
    const timerControls = document.getElementById('timer-controls');
    const timerCancelBtn = document.getElementById('timer-cancel');

    function formatTimerDisplay(totalSeconds) {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    if (timerStartBtn) {
        timerStartBtn.addEventListener('click', () => {
            const h = parseInt(timerH.value) || 0;
            const m = parseInt(timerM.value) || 0;
            const s = parseInt(timerS.value) || 0;
            
            let totalSeconds = h * 3600 + m * 60 + s;
            
            if (totalSeconds > 0) {
                // Hide setup, show timer
                timerSetup.style.display = 'none';
                timerDisplay.classList.add('active');
                timerControls.style.display = 'flex';
                
                timerDisplay.textContent = formatTimerDisplay(totalSeconds);
                
                timerInterval = setInterval(() => {
                    totalSeconds--;
                    if (totalSeconds < 0) {
                        clearInterval(timerInterval);
                        alert("Timer Finished!");
                        // Play sound or notify via System API if available
                        if (window.parent && window.parent.System) {
                            // Example API usage: maybe flash the title bar or something
                        }
                        resetTimer();
                    } else {
                        timerDisplay.textContent = formatTimerDisplay(totalSeconds);
                    }
                }, 1000);
            }
        });
    }

    if (timerCancelBtn) {
        timerCancelBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            resetTimer();
        });
    }

    function resetTimer() {
        timerSetup.style.display = 'flex'; 
        
        timerDisplay.classList.remove('active');
        timerControls.style.display = 'none';
    }
});
 