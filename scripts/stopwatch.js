const totalTimeStopwatch = document.getElementById('total-time-stopwatch')
const totalGametimeStopwatch = document.getElementById('total-gametime-stopwatch')
const currentGameStopwatch = document.getElementById('current-game-stopwatch')

var startTime = Date.now()
var totalTimeElapsed = 0

var timerPaused = true
var currentGame = 0

var games = [
    {"time": 0, "startTime": 0, "element": document.getElementById('sm64')},
    {"time": 0, "startTime": 0, "element": document.getElementById('sms')},
    {"time": 0, "startTime": 0, "element": document.getElementById('smg')},
    {"time": 0, "startTime": 0, "element": document.getElementById('smg2')},
    {"time": 0, "startTime": 0, "element": document.getElementById('sm3dw')},
    {"time": 0, "startTime": 0, "element": document.getElementById('smo')}
]

loadTimesFromStorage()
changeActiveGame()

// add event listeners for keybinds and buttons
document.addEventListener('keyup', toggleTimer)
document.addEventListener('keyup', nextSplit)
document.addEventListener('keyup', previousSplit)
document.getElementById('timer-toggle-button').onclick = toggleTimer;
document.getElementById('next-split-button').onclick = nextSplit;

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

function updateStopwatches() {
    totalTimeElapsed = Date.now() - startTime
    if (timerPaused == false) {
        games[currentGame]['time'] = Date.now() - games[currentGame]['startTime']
    }

    var totalTimePlayed = games.reduce((a, b) => a + b['time'], 0)
    
    totalTimeStopwatch.innerText = (totalTimeElapsed / 1000).toFixed(2)
    totalGametimeStopwatch.innerText = (totalTimePlayed / 1000).toFixed(2)
    currentGameStopwatch.innerText = (games[currentGame]['time'] / 1000).toFixed(2)

    for (i = 0; i < games.length; i++) {
        games[i]['element'].querySelector('.split-timer').innerText = (games[i]['time'] / 1000).toFixed(2)
    }
}

function toggleTimer(event) {
    // spacebar
    if (event.keyCode == 32 || event.pointerType == "mouse") {
        timerPaused = !timerPaused
        if (timerPaused == false) {
            games[currentGame]['startTime'] = Date.now() - games[currentGame]['time']
            
            document.getElementById('timer-toggle-button').innerText = 'Stop timer'
        } else {
            document.getElementById('timer-toggle-button').innerText = 'Start timer'
        }

        changeTitle()
    }
}

function previousSplit(event) {
    // backspace
    if (event.keyCode == 8 || event.pointerType == "mouse") {
        if (currentGame > 0) {
            currentGame -= 1
            changeActiveGame()
        }
    }
}

function nextSplit(event) {
    // enter
    if (event.keyCode == 13 || event.pointerType == "mouse") {
        if (currentGame < games.length - 1) {
            currentGame += 1
            changeActiveGame()
        }
    }
}

function changeActiveGame() {
    if (timerPaused == false) {
        games[currentGame]['startTime'] = Date.now() - games[currentGame]['time']
    }
    
    for (i = 0; i < games.length; i++) {
        games[i]['element'].className = 'split-container';
    }
    games[currentGame]['element'].className = 'split-container-active'
    //TODO Add game stuff here
    //document.body.style.backgroundImage = "url('./images/mario" + currentGame.toString() + ".jpg')" 
    
    changeTitle()
}

function changeTitle() {
    var title
    if (timerPaused) {
        title = '3D Mario timer | Paused ' + getSplitTitle(games[currentGame]['element'])
    } else {
        title = '3D Mario timer | Currently playing ' + getSplitTitle(games[currentGame]['element'])
    }
    
    window.electronAPI.setTitle(title)
}

function resetTime(game) {
    // -1 is total playtime and all games
    if (game == -1) {
        for (i = 0; i < games.length; i++) {
            games[i]['time'] = 0
        }
    } else {
        games[game]["time"] = 0
    }
}

function resetAllTimes() {
    // clear times field from localstorage and close app. resets ALL times
    localStorage.setItem('times', '')
    window.electronAPI.closeApp()
}

function loadTimesFromStorage() {
    var times = localStorage.getItem('times')
    if (times == '') {
        console.log('No times in storage')
        return
    }

    var times_json = JSON.parse(times)

    console.log(times_json)

    // bad fix but whatever
    try {
        currentGame = times_json['currentGame']
        startTime = times_json['startTime']
        totalTimeElapsed = times_json['totalTimeElapsed']

        for (i = 0; i < games.length; i++) {
            games[i]['time'] = times_json['gameTimes'][i]
        }

        console.log('Loaded times')
    }
    catch {
        console.log('Saved times corrupted, resetting')
        resetAllTimes()
    }
}

function saveTimesToStorage(close) {
    gameTimes = []
    for (i = 0; i < games.length; i++) {
        gameTimes.push(games[i]['time'])
    }

    var times = {
        "currentGame": currentGame,
        "startTime": startTime,
        "totalTimeElapsed": totalTimeElapsed,
        "gameTimes": gameTimes
    }

    localStorage.setItem('times', JSON.stringify(times))

    if (close) {
        window.electronAPI.closeApp()
    }

    console.log('Saved times')
}

function getSplitTitle(element) {
    title = element.querySelector('.split-title').innerText
    return(title)
}

function updateSplitTimer(element, value) {
    
}