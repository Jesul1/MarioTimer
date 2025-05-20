const totalTimeStopwatch = document.getElementById('total-time-stopwatch')
const totalGametimeStopwatch = document.getElementById('total-gametime-stopwatch')
const splitTimeStopwatch = document.getElementById('split-time-stopwatch')

var startTime = Date.now()
var totalTimeElapsed = 0

var startTimeAfterPause = Date.now()
var totalTimePlayed = 0

var timerPaused = true

var currentGame = 0

var games = [
    {"element": document.getElementById('sm64'), "time": 0},
    {"element": document.getElementById('sms'), "time": 0},
    {"element": document.getElementById('smg'), "time": 0},
    {"element": document.getElementById('smg2'), "time": 0},
    {"element": document.getElementById('sm3dw'), "time": 0},
    {"element": document.getElementById('smo'), "time": 0}
]

loadTimesFromStorage()
changeActiveGame()

document.addEventListener('keyup', toggleTimer)
document.addEventListener('keyup', nextSplit)
document.addEventListener('keyup', previousSplit)
document.getElementById('timer-toggle-button').onclick = toggleTimer;
document.getElementById('next-split-button').onclick = nextSplit;

setInterval(updateStopwatches, 10)
setInterval(saveTimesToStorage, 5000, false)

window.electronAPI.saveTimes((close) => {
    saveTimesToStorage(close)
})

window.electronAPI.resetTime((game) => {
    // -1 is total playtime and all games
    if (game == -1) {
        totalTimePlayed = 0
        for (i = 0; i < games.length; i++) {
            games[i]['time'] = 0
        }
    } else {
        games[game]["time"] = 0
    }
})

window.electronAPI.resetTimes((game) => {
    resetAllTimes()
})

function updateStopwatches() {
    totalTimeElapsed = Date.now() - startTime
    if (timerPaused == false) {
        totalTimePlayed = Date.now() - startTimeAfterPause
    }

    totalTimeStopwatch.innerText = (totalTimeElapsed / 1000).toFixed(2)
    totalGametimeStopwatch.innerText = (totalTimePlayed / 1000).toFixed(2)
}

function toggleTimer(event) {
    // spacebar
    if (event.keyCode == 32 || event.pointerType == "mouse") {
        timerPaused = !timerPaused
        changeTitle()
        if (timerPaused == false) {
            startTimeAfterPause = Date.now() - totalTimePlayed
        }
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
    for (i = 0; i < games.length; i++) {
        games[i]['element'].className = 'split-container';
    }
    games[currentGame]['element'].className = 'split-container-active'
    changeTitle()
}

function changeTitle() {
    var title
    if (timerPaused) {
        title = '3D Mario timer | Paused ' + games[currentGame]['element'].innerText
    } else {
        title = '3D Mario timer | Currently playing ' + games[currentGame]['element'].innerText
    }
    
    window.electronAPI.setTitle(title)
}

function resetAllTimes() {
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

    currentGame = times_json['currentGame']
    startTime = times_json['startTime']
    totalTimeElapsed = times_json['totalTimeElapsed']
    totalTimePlayed = times_json['totalTimePlayed']

    for (i = 0; i < games.length; i++) {
        games[i]['time'] = times_json['gameTimes'][i]
    }

    console.log('Loaded times')
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
        "totalTimePlayed": totalTimePlayed,
        "gameTimes": gameTimes
    }

    localStorage.setItem('times', JSON.stringify(times))

    if (close) {
        window.electronAPI.closeApp()
    }

    console.log('Saved times')
}