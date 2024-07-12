export const getRandomInt = (max) => {
  return Math.floor(Math.random() * max) + 1;
};

export const sum = (numbers) => {
  return numbers.reduce((a, b) => a + b, 0);
};

export const newDicesResult = () => {
  const result = [];
  for (let i = 0; i < 3; i++) {
    result.push(getRandomInt(6));
  }
  return result;
};

export const isBig = (sum) => {
  return sum > 10;
};
