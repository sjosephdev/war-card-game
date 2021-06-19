// variables and constants

let deckId = ''
const warClock = document.querySelector('.middle')
const shuffleBtn = document.querySelector('#shuffle')
const cards = Array.from(document.querySelectorAll('.card'))
const p1CardCount = document.querySelector('#p1CardCount')
const p2CardCount = document.querySelector('#p2CardCount')
const p1Span = document.querySelector('#p1Span')
const p2Span = document.querySelector('#p2Span')
const playerOneCard = document.querySelector('#playerOneCard')
const playerTwoCard = document.querySelector('#playerTwoCard')
const p1WonCards = document.querySelector('.p1WonCards')
const p2WonCards = document.querySelector('.p2WonCards')
const winner = document.querySelector('#winner')

// class declarations

class Game {
  constructor(isWar, cardOneVal, cardTwoVal) {
    this.isWar = isWar;
    this.cardOneVal = cardOneVal;
    this.cardTwoVal = cardTwoVal;
  }

  newDeck() {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      deckId = data.deck_id
    })
    .catch(err => {
        console.log(`error ${err}`)
    });
  }

  newGame() {
    playerOne.name = prompt('Player 1: Enter Your Name...' || 'Player 1')
    playerTwo.name = prompt('Player 2: Enter Your Name...' || 'Player 2')
    shuffleBtn.innerText = 'FLIP CARDS'
    shuffleBtn.removeEventListener('click', war.newGame)
    shuffleBtn.addEventListener('click', war.flipCards)
    war.newDeck()
  }

  flipCards() {
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    .then(res => res.json()) // parse response as JSON
    .then(data => {

      cards.forEach(cards => cards.classList.add('fx'));

      if (data.remaining === 0) {
        war.pickGameWinner()
      } else {
        war.cardOneVal = war.calcCardVal(data.cards[0].value);
        war.cardTwoVal = war.calcCardVal(data.cards[1].value);

        playerOneCard.src = data.cards[0].image;
        playerTwoCard.src = data.cards[1].image;
        war.pickRoundWinner(war.cardOneVal, war.cardTwoVal)
      }  
    })
    .catch(err => {
        console.log(`error ${err}`);
    }); 
  }

  calcCardVal(val) {
    switch (val) {
      case 'ACE':
        return 14;
        break;
      case 'KING':
        return 13;
        break;
      case 'QUEEN':
        return 12;
        break;
      case 'JACK':
        return 11;
      default:
        return Number(val);
        break;
    }
  }

  pickRoundWinner(val1, val2) {
    if (val1 > val2) {

      winner.innerText = `${playerOne.name} Wins the Round!`
      p1Span.innerText = 'WINNER!'
      playerOne.playerScore += 2
      playerOne.cardsWon.push(data.cards[0].image, data.cards[1].image)

    } else if (val1 < val2) {

      winner.innerText = `${playerTwo.name} Wins the Round!`
      p2Span.innerText = 'WINNER!'
      playerTwo.playerScore += 2
      playerTwo.cardsWon.push(data.cards[0].image, data.cards[1].image)
    

    }

    p1CardCount.innerText = `Card Count: ${playerOne.playerScore}`
    p2CardCount.innerText = `Card Count: ${playerTwo.playerScore}`

  }

  pickGameWinner() {
    if (playerOneCards > playerTwoCards) {
      alert(`${playerOne.name} WINS THE GAME!`)
    } else {
      alert(`${playerTwo.name} WINS THE GAME!`)
    }
  }
 
}

class Player {
  constructor(name, playerScore, cardsWon) {
    this.name = name;
    this.playerScore = playerScore;
    this.cardsWon = cardsWon;
  }
  
  get calculateScore() {
    return this.playerScore;
  }
}

// creating game objects from our classes

const war = new Game()
const playerOne = new Player('Player 1', 0, [])
const playerTwo = new Player('Player 2', 0, [])

// event listeners

shuffleBtn.addEventListener('click', war.newGame)
// shuffleBtn.addEventListener('click', war.flipCards)
cards.forEach(card => card.addEventListener('transitionend', removeTransition))

// misc functions

function removeTransition(e) {
  if (e.propertyName !== 'transform') return;
  e.target.classList.remove('fx');
}
