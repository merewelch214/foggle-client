window.addEventListener('DOMContentLoaded', function() {

    const letterArrays = [
        ['A', 'A', 'E', 'E', 'G', 'N'],
        ['C', 'I', 'M', 'O', 'T', 'U'],
        ['D', 'I', 'S', 'T', 'T', 'Y'],
        ['A', 'B', 'B', 'J', 'O', 'O'],
        ['E', 'H', 'R', 'T', 'V', 'W'],
        ['D', 'E', 'L', 'R', 'V', 'Y'],
        ['E', 'I', 'O', 'S', 'S', 'T'],
        ['E', 'L', 'R', 'T', 'T', 'Y'],
        ['A', 'C', 'H', 'O', 'P', 'S'],
        ['H', 'I', 'M', 'N', 'Q', 'U'],
        ['E', 'E', 'I', 'N', 'S', 'U'],
        ['A', 'F', 'F', 'K', 'P', 'S'],
        ['H', 'L', 'N', 'N', 'R', 'Z'],
        ['E', 'E', 'G', 'H', 'N', 'W'],
        ['A', 'O', 'O', 'T', 'T', 'W'],
        ['D', 'E', 'I', 'L', 'R', 'X']
    ]

    const mainContainer = document.getElementById('main-container')
    const startTimerButton = document.getElementById('start-timer')
    const homeContainer = document.getElementById('home-container')
    const timerContainer = document.getElementById('timer-container')
    const board = document.getElementById('board-container')
    const letterBar = document.getElementById('letter')
    const clearBoardButton = document.getElementById('clear-board')
    const addWordButton = document.getElementById('add-word')
    const submittedWordsUl = document.getElementById('submitted-words-ul')
    const otherFeaturesDiv = document.getElementById('other-features-buttons')
    const score = document.getElementById("score")
    const scoreSpan = document.getElementById('score-num')
    const undoButton = document.getElementById('undo')
    const wordControlButtons = document.getElementById('word-control-buttons')
    const gameContainer = document.getElementById('game-container')
    let allWordsArray = []
    let currentWordContainer = document.getElementById('current-word-container')
    let timerInnerP = document.createElement('p')
    let letterCoordinates = []
    let time;
    let game_id;
    let interval;

    homeContainer.addEventListener('click', function(e) {
        if (e.target === startTimerButton) {
            e.preventDefault()
            mainContainer.replaceChild(gameContainer, homeContainer)
            gameContainer.style.visibility = 'visible'            
            time = 60
            timerInnerP.innerHTML = `${time}`
            timerContainer.appendChild(timerInnerP)
            interval = setInterval(countDown, 1000)
            createBoard()

            let username = e.target.parentNode.username.value
            fetch('http://localhost:3000/api/v1/games', {
                    method: "POST",
                    headers: {
                        'content-type': 'application/json',
                        accepts: 'application/json'
                    },
                    body: JSON.stringify({ username })
                })
                .then(resp => resp.json())
                .then(userData => {
                    game_id = userData.id
                })
        }
    })

    wordControlButtons.addEventListener('click', function(e) {
        if (time > 0) {
            if (e.target === clearBoardButton) {
                letterCoordinates = []
                letterBar.innerText = ''
                let allItems = document.getElementsByClassName('item')
                Array.from(allItems).forEach(item => item.style.backgroundColor = '#80CBC4')
            } else if (e.target === addWordButton) {
                if (letterBar.innerText.length < 3) {
                    alert('must be longer than 3')
                } else {
                    allWordsArray.push(letterBar.innerText)
                    createWordLi(letterBar.innerText)
                    letterBar.innerText = ''
                    let allItems = document.getElementsByClassName('item')
                    Array.from(allItems).forEach(item => item.style.backgroundColor = '#80CBC4')
                    letterCoordinates = []
                }
            }
        }
    })

    function createWordLi(word) {
        let wordLi = document.createElement('li')
        wordLi.innerText = word
        submittedWordsUl.appendChild(wordLi)
    }


    function countDown() {
        if (time > 0) {
            time--
            timerInnerP.innerText = `${time}`
        } else if (time === 0) {
            score.style.display = 'visible';
            alert('Time\'s up!')
            time = -1
            timerContainer.replaceChild(startTimerButton, timerInnerP)
            currentWordContainer.style.visibility = 'hidden'
            let allItems = document.getElementsByClassName('item')
            Array.from(allItems).forEach(item => item.style.backgroundColor = '#80CBC4')
            showScore()
        }
    }

    board.addEventListener('click', function(e) {
        let letterXId = parseInt(e.target.dataset.xId)
        let letterYId = parseInt(e.target.dataset.yId)
        let letter = e.target.innerText
        if (isArrayItemExists(letterCoordinates, [letterXId, letterYId])) {
            alert('You\'ve already played this letter')
        } else if (letterCoordinates.length > 0 && (letterXId >= letterCoordinates[0][0] + 2 || letterYId >= letterCoordinates[0][1] + 2 || letterXId <= letterCoordinates[0][0] - 2 || letterYId <= letterCoordinates[0][1] - 2)) {
            alert('Can\'t click this')
        } else if (e.target.className === "item") {
            e.target.style.backgroundColor = '#379683'
            letterCoordinates.unshift([letterXId, letterYId])
            letterBar.innerText += letter
        }
    })

    function isArrayItemExists(array, item) {
        for (var i = 0; i < array.length; i++) {
            if (JSON.stringify(array[i]) == JSON.stringify(item)) {
                return true;
            }
        }
        return false;
    }

    function getRandomIndex() {
        return Math.floor(Math.random() * 6)
    }

    function createBoard() {
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                let currentLetterIndex = x + y;
                let currentLetter = letterArrays[currentLetterIndex][getRandomIndex()]
                board.innerHTML += `<div class="item" data-x-id=${x} data-y-id=${y}>${currentLetter}</div>`
            }
        }
    }

    otherFeaturesDiv.addEventListener('click', function(e) {
        if (e.target.id === 'done') {
            console.log('your score is')
            showScore()
        } else if (e.target.id === 'help') {
            console.log('show instructions')
        } else if (e.target.id === 'start-over') {
            console.log('start game over')
        }
    })

    function showScore() {
        score.style.display = 'visible';
        clearInterval(interval)
        timerInnerP.innerText = ''

        let submittedWords = {
            word: allWordsArray,
            game_id: game_id
        }

        fetch(`http://localhost:3000/api/v1/games/${game_id}/submitted_words`, {
                method: "POST",
                headers: {
                    'content-type': 'application/json',
                    accepts: 'application/json'
                },
                body: JSON.stringify(submittedWords)
            })
            .then(resp => resp.json())
            .then(userData => {
                let finalScore = userData.points
                scoreSpan.innerText = finalScore
            })
    }

    undoButton.addEventListener('click', function(e) {
            const [x, y] = letterCoordinates[0]
            const allItems = document.getElementsByClassName('item')
            const allItemsArray = Array.from(allItems)
            const target = allItemsArray.find(function(tile) {
                const tileX = parseInt(tile.dataset.xId)
                const tileY = parseInt(tile.dataset.yId)

                return tileX === x && tileY === y
            })
            target.style.backgroundColor = '#80CBC4'
            const newLetterBarText = letterBar.innerText.slice(0, -1)
            letterBar.innerText = newLetterBarText
            letterCoordinates.shift()
        }) 


})