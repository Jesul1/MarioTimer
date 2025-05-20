const totalTimeStopwatch = document.getElementById('totalTimeStopwatch')
const totalGametimeStopwatch = document.getElementById('totalGametimeStopwatch')
//const splitTimeStopwatch = document.getElementById('splitTimeStopwatch')

var startTime = Date.now()
var totalTimeElapsed = 0

var startTimeAfterPause = Date.now()
var totalTimePlayed = 0

var timeElapsed = 0
var timerPaused = false

var currentGame = 0
var games = [
    document.getElementById('sm64'),
    document.getElementById('sms'),
    document.getElementById('smg'),
    document.getElementById('smg2'),
    document.getElementById('sm3dw'),
    document.getElementById('smo')
]

document.addEventListener('keyup', toggleTimer)
document.addEventListener('keyup', nextSplit)
document.addEventListener('keyup', previousSplit)
document.getElementById('timerToggleButton').onclick = toggleTimer;
document.getElementById('nextSplitButton').onclick = nextSplit;

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
            resetSplitClasses()
            currentGame -= 1
            games[currentGame].className = 'splitActive'
        }
    }
}

function nextSplit(event) {
    // enter
    console.log(event)
    if (event.keyCode == 13 || event.pointerType == "mouse") {
        if (currentGame < games.length - 1) {
            resetSplitClasses()
            currentGame += 1
            games[currentGame].className = 'splitActive'
        }
    }
}

function resetSplitClasses() {
    for (i = 0; i < games.length; i++) {
        games[i].className = 'split';
    }
}