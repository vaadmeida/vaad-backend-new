export const randomDigits = (n: number = 7) => {
  const numbers = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ';
  let digit = '';
  for (let i = 1; n >= i; i++) {
    const rand = Math.abs(Math.round(Math.random() * numbers.length - 1));
    digit += numbers[rand];
  }

  return digit;
};
