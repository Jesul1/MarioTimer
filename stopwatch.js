const totalTimeStopwatch = document.getElementById('total-time-stopwatch')
const totalGametimeStopwatch = document.getElementById('total-gametime-stopwatch')
//const splitTimeStopwatch = document.getElementById('splitTimeStopwatch')

var startTime = Date.now()
var totalTimeElapsed = 0

var startTimeAfterPause = Date.now()
var totalTimePlayed = 0

var timeElapsed = 0
var timerPaused = true

var currentGame = 0
var games = [
    document.getElementById('sm64'),
    document.getElementById('sms'),
    document.getElementById('smg'),
    document.getElementById('smg2'),
    document.getElementById('sm3dw'),
    document.getElementById('smo')
]

changeActiveGame()

document.addEventListener('keyup', toggleTimer)
document.addEventListener('keyup', nextSplit)
document.addEventListener('keyup', previousSplit)
document.getElementById('timer-toggle-button').onclick = toggleTimer;
document.getElementById('next-split-button').onclick = nextSplit;

setInterval(updateStopwatches, 10)

function updateStopwatches() {
    totalTimeElapsed = Date.now() - startTime
    if (timerPaused == false) {
        timeElapsed = Date.now() - startTimeAfterPause
    }

    totalTimeStopwatch.innerText = (totalTimeElapsed / 1000).toFixed(2)
    totalGametimeStopwatch.innerText = (timeElapsed / 1000).toFixed(2)
}

function toggleTimer(event) {
    // spacebar
    if (event.keyCode == 32 || event.pointerType == "mouse") {
        timerPaused = !timerPaused
        changeTitle()
        if (timerPaused == false) {
            startTimeAfterPause = Date.now() - totalTimePlayed
        } else {
            totalTimePlayed = timeElapsed
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
        games[i].className = 'split-container';
    }
    games[currentGame].className = 'split-active'
    changeTitle()
}

function changeTitle() {
    var title
    if (timerPaused) {
        title = '3D Mario timer | Paused ' + games[currentGame].innerText
    } else {
        title = '3D Mario timer | Currently playing ' + games[currentGame].innerText
    }
    
    window.electronAPI.setTitle(title)
}