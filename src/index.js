import { newDicesResult, sum, isBig } from './dice.js';
import { defaultBet, doubleBet } from './bet.js';
import fs from 'fs';

const player = {
  active: false,
  money: 1000,
};

const gameNumbers = 5000;

const gameResults = [];

const shouldPlaceBet = (player) => {
  if (player.active === true) {
    return { shouldPlaceBet: true };
  }
  if (gameResults.length >= 3) {
    const previousGames = gameResults.slice(
      gameResults.length - 1 - 2,
      gameResults.length
    );

    const setResult = new Set(previousGames.map((g) => g.isBig));

    const shouldPlaceBet = setResult.size == 1;
    return {
      shouldPlaceBet,
      payload: shouldPlaceBet ? setResult.values().next().value : undefined,
    };
  }
  return { shouldPlaceBet: false };
};

for (let i = 0; i < gameNumbers; i++) {
  console.log(`game ${i} player.money`, player.money);
  if (player.money < 0) {
    console.log('Game over, player lose');
    break;
  }
  const currentBet = {};
  const shouldBet = shouldPlaceBet(player);
  if (!!shouldBet.shouldPlaceBet) {
    currentBet.isBig = player.nextIsBig || !shouldBet.payload;
    currentBet.betAmount = player.nextBetAmount || defaultBet;
    player.money = player.money - currentBet.betAmount;
    player.nextBetAmount = doubleBet(currentBet.betAmount);
  }
  const diceResult = newDicesResult();
  const bool = isBig(sum(diceResult));
  gameResults.push({
    index: i,
    diceResult,
    isBig: bool,
    currentBet,
    player: { ...player },
  });
  if (currentBet.betAmount) {
    const setResult = new Set(diceResult);
    if (bool === currentBet.isBig && setResult.size != 1) {
      player.money += doubleBet(currentBet.betAmount);
      player.nextBetAmount = undefined;
    }
  }
}

fs.writeFile('myjsonfile.json', JSON.stringify(gameResults), 'utf8', () => {
  console.log('done');
});
