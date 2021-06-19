// variables and constants

let deckId = ''
const warClock = document.querySelector('.middle')
const shuffleBtn = document.querySelector('#shuffle')
const playerOneDisplay = document.querySelector('.playerOne')
const playerTwoDisplay = document.querySelector('.playerTwo')
const cards = Array.from(document.querySelectorAll('.card'))
const playerOneCardCount = document.querySelector('#p1CardCount')
const playerTwoCardCount = document.querySelector('#p2CardCount')
const p1Span = document.querySelector('#p1Span')
const p2Span = document.querySelector('#p2Span')
const playerOneCard = document.querySelector('#playerOneCard')
const playerTwoCard = document.querySelector('#playerTwoCard')
const playerOneWonCards = document.querySelector('.p1WonCards')
const playerTwoWonCards = document.querySelector('.p2WonCards')
const winner = document.querySelector('#winner')


class Game {
  constructor(isWar, cardOneVal, cardTwoVal, warCards, warFlips) {
    this.isWar = isWar;
    this.cardOneVal = cardOneVal;
    this.cardTwoVal = cardTwoVal;
    this.warCards = warCards;
    this.warFlips = warFlips;
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
    playerOneDisplay.innerHTML = playerOne.name = prompt('Player 1: Enter Your Name...') || 'Player 1'
    playerTwoDisplay.innerHTML = playerTwo.name = prompt('Player 2: Enter Your Name...') || 'Player 2'
    playerOneCardCount.innerText = `${playerOne.name} Card Count: ${playerOne.playerScore}`
    playerTwoCardCount.innerText = `${playerTwo.name} Card Count: ${playerTwo.playerScore}`
    shuffleBtn.innerText = 'FLIP CARDS'
    shuffleBtn.removeEventListener('click', war.newGame)
    shuffleBtn.addEventListener('click', war.flipCards)
    war.newDeck()
  }

  flipCards() {
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    .then(res => res.json()) // parse response as JSON
    .then(data => {

      p1Span.innerText = ''
      p2Span.innerText = ''
      warClock.innerText = ''
      winner.innerText = ''
      shuffleBtn.style.display = ''
      cards.forEach(cards => cards.classList.add('fx'));

      if (data.remaining === 0) {
        war.pickGameWinner()

      } else if (war.isWar === true) {
        p1Span.innerText = ''
        p2Span.innerText = ''
        war.cardOneVal = war.calcCardVal(data.cards[0].value);
        war.cardTwoVal = war.calcCardVal(data.cards[1].value);

        playerOneCard.src = data.cards[0].image;
        playerTwoCard.src = data.cards[1].image;
        war.warCards.push(data.cards[0].image, data.cards[1].image)

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

  war() {
    war.isWar = true;
    shuffleBtn.style.display = 'none'
  
    setTimeout(function() {
      warClock.innerText = '1'
      war.flipCards()
      war.warFlips++
    }, 2000)
  
    setTimeout(function() {
      warClock.innerText = '2'
      war.flipCards()
      war.warFlips++
    }, 4000)
  
    setTimeout(function() {
      warClock.innerText = '3'
      war.flipCards()
      war.warFlips++
    }, 6000)
  
    setTimeout(function() {
      warClock.innerText = '4'
      war.flipCards()
      war.warFlips++
      shuffleBtn.style.display = ''
    }, 8000)

    setTimeout(function() {
      warClock.innerText = ''
      shuffleBtn.style.display = ''
      war.warPickWinner(war.cardOneVal, war.cardTwoVal)
      war.isWar = false
    }, 10000)
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

    // PlayerOne Wins
     if (val1 > val2) {
      winner.innerText = `${playerOne.name} Wins the Round!`
      p1Span.innerText = 'WINNER!'
      playerOne.updatePlayerScore(2)
      playerOneCardCount.innerText = `${playerOne.name} Card Count: ${playerOne.playerScore}`
      playerOne.cardsWon.push(playerOneCard.src, playerTwoCard.src)
      playerOne.appendPlayerCards(playerOne)
    
    // PlayerTwo Wins
    } else if (val1 < val2) {
      winner.innerText = `${playerTwo.name} Wins the Round!`
      p2Span.innerText = 'WINNER!'
      playerTwo.updatePlayerScore(2)
      playerTwoCardCount.innerText = `${playerTwo.name} Card Count: ${playerTwo.playerScore}`
      playerTwo.cardsWon.push(playerOneCard.src, playerTwoCard.src)
      playerTwo.appendPlayerCards(playerTwo)

    // Tie... or War...
    } else {
      winner.innerText = `It's War!`
      war.warCards.push(playerOneCard.src, playerTwoCard.src)
      war.war()
    }
   
  }

  warPickWinner(val1, val2) {
    if (val1 > val2) {
      p1Span.innerText = 'WINNER!'
      winner.innerText = `${playerOne.name} Wins the War!`
      playerOne.updatePlayerScore(10)
      playerOneCardCount.innerText = `${playerOne.name} Card Count: ${playerOne.playerScore}`
      playerOne.cardsWon.push(...war.warCards)
      playerOne.appendPlayerCards(playerOne)
      war.warCards = []
      war.warFlips = 0
      

    } else if (val1 < val2) {
      p2Span.innerText = 'WINNER!'
      winner.innerText = `${playerTwo.name} Wins the War!`
      playerTwo.updatePlayerScore(10)
      playerTwoCardCount.innerText = `${playerTwo.name} Card Count: ${playerTwo.playerScore}`
      playerTwo.cardsWon.push(...war.warCards)
      playerTwo.appendPlayerCards(playerTwo)
      war.warCards = []
      war.warFlips = 0

    } else {
      winner.innerText = `It's War!`
      war.warFlips = 0
      war.war()
    }
  }

  pickGameWinner() {
    if (playerOne.playerScore > playerTwo.playerScore) {
      alert(`${playerOne.name} WINS THE GAME!`)
      playerOne.updatePlayerScore(2)
    } else {
      alert(`${playerTwo.name} WINS THE GAME!`)
      playerTwo.updatePlayerScore(2)
    }
  }
 
}

class Player {
  constructor(assignment, name, playerScore, cardsWon, warWins) {
    this.assignment = assignment;
    this.name = name;
    this.playerScore = playerScore;
    this.cardsWon = cardsWon;
    this.warWins = warWins;
  }
  
  calculateScore = () => {
     playerOneCardCount.innerText = `Card Count: ${playerOne.playerScore}`
     playerTwoCardCount.innerText = `Card Count: ${playerTwo.playerScore}`
  }

  updatePlayerScore(value) {
    this.playerScore += value
  }

  appendPlayerCards = (player) => {
      if (player === playerOne) {
        playerOneWonCards.innerText = ''
        this.cardsWon.forEach(card => {
          const newImg = document.createElement('img')
          newImg.src = card
          playerOneWonCards.appendChild(newImg)
        })
      } else if (player === playerTwo) {
        playerTwoWonCards.innerText = ''
        this.cardsWon.forEach(card => {
          const newImg = document.createElement('img')
          newImg.src = card
          playerTwoWonCards.appendChild(newImg)
        })
      }
    }
}

const war = new Game(false, 0, 0, [])
const playerOne = new Player('playerOne', 'Player 1', 0, [], [], 0, 0)
const playerTwo = new Player('playerTWo', 'Player 2', 0, [], [], 0)
const players = [playerOne, playerTwo]

shuffleBtn.addEventListener('click', war.newGame)
// shuffleBtn.addEventListener('click', war.flipCards)
cards.forEach(card => card.addEventListener('transitionend', removeTransition))


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


function pickWinner() {
  if (playerOneCards > playerTwoCards) {
    alert(`${playerOne} WINS THE GAME!`)
  } else {
    alert(`${playerTwo} WINS THE GAME!`)
  }
}

// function cardCount() {
//   p1CardCount.innerText = `Card Count: ${playerOneCards}`
//   p2CardCount.innerText = `Card Count: ${playerTwoCards}`
// }

function removeTransition(e) {
  if (e.propertyName !== 'transform') return;
  e.target.classList.remove('fx');
}
