const totalTimeStopwatch = document.getElementById('total-time-stopwatch')
const totalGametimeStopwatch = document.getElementById('total-gametime-stopwatch')
const currentGameStopwatch = document.getElementById('current-game-stopwatch')
const totalDeathsCounter = document.getElementById('total-deaths-counter')

var startTime = Date.now()
var totalTimeElapsed = 0

var timerPaused = true
var currentGame = 0

var games = [
    {"title": "Super Mario 64 (PC co-op)", "time": 0, "startTime": 0, "deaths": 0, "element": document.getElementById('sm64')},
    {"title": "Super Mario Sunshine (Switch)", "time": 0, "startTime": 0, "deaths": 0, "element": document.getElementById('sms')},
    {"title": "Super Mario Galaxy (Switch)", "time": 0, "startTime": 0, "deaths": 0, "element": document.getElementById('smg')},
    {"title": "Super Mario Galaxy 2 (Wii U)", "time": 0, "startTime": 0, "deaths": 0, "element": document.getElementById('smg2')},
    {"title": "Super Mario 3D World (Wii U)", "time": 0, "startTime": 0, "deaths": 0, "element": document.getElementById('sm3dw')},
    {"title": "Super Mario Odyssey (Switch)", "time": 0, "startTime": 0, "deaths": 0, "element": document.getElementById('smo')}
]

loadTimesFromStorage()
updateDeathCounters()
changeActiveGame(0)

// add event listeners for keybinds and buttons
document.addEventListener('keyup', toggleTimer)
document.addEventListener('keyup', nextSplit)
document.addEventListener('keyup', previousSplit)
document.addEventListener('keyup', addDeath)

document.getElementById('timer-toggle-button').onclick = toggleTimer;
document.getElementById('next-split-button').onclick = nextSplit;
document.getElementById('death-counter-button').onclick = addDeath;

setInterval(updateStopwatches, 10)
setInterval(saveTimesToStorage, 5000, false)

// event listeners for app menu options
window.electronAPI.saveTimes((close) => {
    saveTimesToStorage(close)
})

window.electronAPI.resetTime((game) => {
    resetTime(game)
})

window.electronAPI.resetTimes(() => {
    resetAllTimes()
})

window.electronAPI.removeDeath(() => {
    if (games[currentGame]['deaths'] > 0) {
        games[currentGame]['deaths'] -= 1;
        updateDeathCounters();
    }
})

function updateStopwatches() {
    totalTimeElapsed = Date.now() - startTime
    if (timerPaused == false) {
        games[currentGame]['time'] = Date.now() - games[currentGame]['startTime']
    }

    var totalTimePlayed = games.reduce((a, b) => a + b['time'], 0)
    
    totalTimeStopwatch.innerText = formatTime(totalTimeElapsed)
    totalGametimeStopwatch.innerText = formatTime(totalTimePlayed)
    currentGameStopwatch.innerText = formatTime(games[currentGame]['time'])
    
    for (i = 0; i < games.length; i++) {
        games[i]['element'].querySelector('.split-timer').innerText = formatTime(games[i]['time'])
    }
}

function formatTime(milliseconds) {
    var days = Math.floor(milliseconds / 86400000); // lol
    var date = new Date(milliseconds);

    var time = "";
    if (days == 1) {
        time = days.toString() + " day, ";
    } else if (days > 0) {
        time = days.toString() + " days, ";
    }

    time += date.toISOString().slice(11, 21);

    return(time);
}

function toggleTimer(event) {
    // spacebar
    if (event.keyCode == 32 || event.pointerType == "mouse" || event == 'manual') {
        timerPaused = !timerPaused
        if (timerPaused == false) {
            games[currentGame]['startTime'] = Date.now() - games[currentGame]['time']
            
            document.getElementById('timer-toggle-button').querySelector('.timer-button-front').innerText = 'l l' // lol

            games[currentGame]['element'].querySelector('.split-timer').style.color = 'white';
            totalGametimeStopwatch.style.color = 'white';
            currentGameStopwatch.style.color = 'white';
        } else {
            document.getElementById('timer-toggle-button').querySelector('.timer-button-front').innerText = 'Start timer'
        }

        changeTitle()
    }
}

function previousSplit(event) {
    // backspace
    if (event.keyCode == 8 || event.pointerType == "mouse") {
        if (currentGame > 0) {
            changeActiveGame(-1)
            window.scrollBy(0, -180);
        }
    }
}

function nextSplit(event) {
    // enter
    if (event.keyCode == 13 || event.pointerType == "mouse") {
        if (currentGame < games.length - 1) {
            changeActiveGame(1)

            // worst code ever but cant be bothered lol
            if (currentGame > 1) {
                window.scrollBy(0, 180);
            }
        } else {
            // if next game/enter is pressed on last split, stop timer and make last split timer green
            toggleTimer('manual');
            if (timerPaused) {
                games[currentGame]['element'].querySelector('.split-timer').style.color = 'chartreuse';
                totalGametimeStopwatch.style.color = 'chartreuse';
                currentGameStopwatch.style.color = 'chartreuse';
            }            
        }
    }
}

function changeActiveGame(direction) {
    currentGame += direction
    if (timerPaused == false) {
        games[currentGame]['startTime'] = Date.now() - games[currentGame]['time']
    }
    
    for (i = 0; i < games.length; i++) {
        games[i]['element'].className = 'split-container';

        if (i < currentGame) {
            games[i]['element'].querySelector('.split-timer').style.color = 'chartreuse';
        }
    }
    games[currentGame]['element'].className = 'split-container-active'
    games[currentGame]['element'].querySelector('.split-timer').style.color = 'white';

    changeTitle();
}

function addDeath(event) {
    // keybind is g temporarily
    if (event.pointerType == 'mouse' || event.keyCode == 16) {
        games[currentGame]['deaths'] += 1
        updateDeathCounters()
    }
}

function updateDeathCounters() {
    for (i = 0; i < games.length; i++) {
        games[i]['element'].querySelector('.split-death-counter').innerText = games[i]['deaths'] + ' deaths'
    }

    var totalDeaths = games.reduce((a, b) => a + b['deaths'], 0);
    totalDeathsCounter.innerText = totalDeaths;
}

function changeTitle() {
    var title;
    if (timerPaused) {
        title = '3D Mario timer | Paused ' + games[currentGame]['title'];
    } else {
        title = '3D Mario timer | Currently playing ' + games[currentGame]['title'];
    }
    
    window.electronAPI.setTitle(title)
}

function resetTime(game) {
    // -1 is total playtime and all games
    if (game == -1) {
        for (i = 0; i < games.length; i++) {
            games[i]['time'] = 0
            games[i]['deaths'] = 0
        }
    } else {
        games[game]["time"] = 0
        games[game]['deaths'] = 0
    }
    updateDeathCounters()
}

function resetAllTimes() {
    // clear times field from localstorage and close app. resets ALL times
    localStorage.removeItem('times')
    window.electronAPI.closeApp()
}

function loadTimesFromStorage() {
    var times = localStorage.getItem('times')
    console.log(times)
    if (times == null) {
        console.log('No times in storage')
        return
    }

    var times_json = JSON.parse(times)
    // 🧊🧊🥶
    currentGame = times_json['currentGame'] || 0
    startTime = times_json['startTime'] || startTime
    totalTimeElapsed = times_json['totalTimeElapsed'] || 0

    for (i = 0; i < games.length; i++) {
        games[i]['time'] = times_json['gameTimes'][i] || 0
        games[i]['deaths'] = times_json['gameDeaths'][i] || 0
    }

    console.log('Loaded times')
}

function saveTimesToStorage(close) {
    gameTimes = []
    gameDeaths = []
    for (i = 0; i < games.length; i++) {
        gameTimes.push(games[i]['time'])
        gameDeaths.push(games[i]['deaths'])
    }

    var times = {
        "currentGame": currentGame,
        "startTime": startTime,
        "totalTimeElapsed": totalTimeElapsed,
        "gameTimes": gameTimes,
        "gameDeaths": gameDeaths
    }

    localStorage.setItem('times', JSON.stringify(times))

    if (close) {
        window.electronAPI.closeApp()
    }

    console.log('Saved times')
}