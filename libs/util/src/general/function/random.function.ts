export const randomDigits = (n: number = 7, initial?: string) => {
  const numbers = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let digit = initial || '';
  for (let i = 1; n >= i; i++) {
    const rand = Math.abs(Math.round(Math.random() * numbers.length - 1));
    digit += numbers[rand];
  }

  return digit;
};
