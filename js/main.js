// player names...
let playerOne = prompt('ENTER NAME PLAYER 1') || 'Player 1'
document.querySelector('.playerOne').innerText = playerOne
document.querySelector('.p1StatBar').innerText = `${playerOne}'s SCORE`

let playerTwo = prompt('ENTER NAME PLAYER 2') || 'Player 2'
document.querySelector('.playerTwo').innerText = playerTwo
document.querySelector('.p2StatBar').innerText = `${playerTwo}'s SCORE`

let playerOneCards = 0
let playerTwoCards = 0

let playerOneSavedCards = []
let playerTwoSavedCards = []
let warCards = []

let itsWar = false
let warCount = 0

let warClock = document.querySelector('.middle')
const shuffleBtn = document.querySelector('#shuffle')
const cards = Array.from(document.querySelectorAll('.card'))
const p1CardCount = document.querySelector('#p1CardCount')
const p2CardCount = document.querySelector('#p2CardCount')
const p1Span = document.querySelector('#p1Span')
const p2Span = document.querySelector('#p2Span')
const p1WonCards = document.querySelector('.p1WonCards')
const p2WonCards = document.querySelector('.p2WonCards')

let deckId = ''


  fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        deckId = data.deck_id

      })
      .catch(err => {
          console.log(`error ${err}`)
      });

document.querySelector('button').addEventListener('click', getFetch)
cards.forEach(card => card.addEventListener('transitionend', removeTransition))

function getFetch() {
  
  fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
      .then(res => res.json()) // parse response as JSON
      .then(data => {

        console.log(data.remaining)
        console.log(data)
        cards.forEach(cards => cards.classList.add('fx'));
        p1Span.innerText = ''
        p2Span.innerText = ''
        appendPlayerCards(playerOne)
        appendPlayerCards(playerTwo)
        playerOneSavedCards = []
        playerTwoSavedCards = []

        if (data.remaining === 0) {
          pickWinner()
        } else { 

          let val1 = cardValue( data.cards[0].value );
          let val2 = cardValue( data.cards[1].value );
          
          document.querySelector('#playerOne').src = data.cards[0].image;
          document.querySelector('#playerTwo').src = data.cards[1].image;

          // PLAYER 1 WINS
          if (val1 > val2) {
            if (itsWar === true && warCount === 3) {
              document.querySelector('#winner').innerText = `${playerOne} Wins the War!`
              p1Span.innerText = 'WINNER!'
              playerOneCards += 8
              warCards.push(data.cards[0].image, data.cards[1].image)
              warCards.forEach(card => playerOneSavedCards.push(card))
              // playerOneSavedCards.push(data.cards[0].image, data.cards[1].image)
              warCards = []
              cardCount()
              itsWar = false
              warCount = 0
              shuffleBtn.style.display = ''
            
            } else if (itsWar === true) {
              document.querySelector('#winner').innerText = `${playerOne} Wins!`
              warCards.push(data.cards[0].image, data.cards[1].image)

            } else {
              document.querySelector('#winner').innerText = `${playerOne} Wins!`
              p1Span.innerText = 'WINNER!'
              playerOneCards += 2
              cardCount()
              playerOneSavedCards.push(data.cards[0].image, data.cards[1].image)     
           }
            
          // PLAYER 2 WINS
          } else if (val1 < val2) {
            if (itsWar === true && warCount === 3) {
              document.querySelector('#winner').innerText = `${playerTwo} Wins the War!`
              p2Span.innerText = 'WINNER!'
              playerTwoCards += 8
              warCards.push(data.cards[0].image, data.cards[1].image)
              warCards.forEach(card => playerTwoSavedCards.push(card))
              // playerTwoSavedCards.push(data.cards[0].image, data.cards[1].image)
              warCards = []
              cardCount()
              itsWar = false
              warCount = 0
              shuffleBtn.style.display = ''
            
            } else if (itsWar === true) {
              document.querySelector('#winner').innerText = `${playerTwo} Wins!`
              warCards.push(data.cards[0].image, data.cards[1].image)
                          
            } else {
              document.querySelector('#winner').innerText = `${playerTwo} Wins!`
              p2Span.innerText = 'WINNER!'
              playerTwoCards += 2
              cardCount()
              playerTwoSavedCards.push(data.cards[0].image, data.cards[1].image) 
           }
          
          // TIE ... WAR!
          } else {
            document.querySelector('#winner').innerText = 'WAR!'
            warCards.push(data.cards[0].image, data.cards[1].image)
            war()
        }
        } 

        function war() {
          itsWar = true;
          shuffleBtn.style.display = 'none'
        
          setTimeout(function() {
            warClock.innerText = '1'
            getFetch()
            warCount++
          }, 2000)
        
          setTimeout(function() {
            warClock.innerText = '2'
            getFetch()
            warCount++
          }, 4000)
        
          setTimeout(function() {
            warClock.innerText = '3'
            getFetch()
            warCount++
          }, 6000)
        
          setTimeout(function() {
            warClock.innerText = ''
          }, 8000)
        }

        function appendPlayerCards(player) {
          
            if (player === playerOne) {
              playerOneSavedCards.forEach(card => {
                const newImg = document.createElement('img')
                newImg.src = card
                p1WonCards.appendChild(newImg)
              })
            } else {
              playerTwoSavedCards.forEach(card => {
                const newImg = document.createElement('img')
                newImg.src = card
                p2WonCards.appendChild(newImg)
              })
            }
            // playerOneSavedCards = []
            // playerTwoSavedCards = []
          
        }

      })
      .catch(err => {
          console.log(`error ${err}`);
      });
}

function cardValue(val) {
  if (val === 'ACE') {
    return 14;
  } else if (val === 'KING') {
    return 13;
  } else if (val === 'QUEEN') {
    return 12;
  } else if (val === 'JACK') {
    return 11;
  } else {
    return Number(val);
  }
}

// function war() {
//   itsWar = true;
//   shuffleBtn.style.display = 'none'

//   setTimeout(function() {
//     warClock.innerText = '1'
//     getFetch()
//     warCards.push(data.cards[0].image, data.cards[1].image)
//     warCount++
//   }, 2000)

//   setTimeout(function() {
//     warClock.innerText = '2'
//     getFetch()
//     warCards.push(data.cards[0].image, data.cards[1].image)
//     warCount++
//   }, 4000)

//   setTimeout(function() {
//     warClock.innerText = '3'
//     getFetch()
//     warCards.push(data.cards[0].image, data.cards[1].image)
//     warCount++
//   }, 6000)

//   setTimeout(function() {
//     warClock.innerText = ''
//   }, 8000)
// }

function pickWinner() {
  if (playerOneCards > playerTwoCards) {
    alert(`${playerOne} WINS THE GAME!`)
  } else {
    alert(`${playerTwo} WINS THE GAME!`)
  }
}

function cardCount() {
  p1CardCount.innerText = `Card Count: ${playerOneCards}`
  p2CardCount.innerText = `Card Count: ${playerTwoCards}`
}

function removeTransition(e) {
  if (e.propertyName !== 'transform') return;
  e.target.classList.remove('fx');
}
