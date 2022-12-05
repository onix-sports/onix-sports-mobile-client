const isNumeric = (str) => {
  return str !== '' && !isNaN(str);
};

export const round = (value, decimals = 0) => {
  if (!isNumeric(value)) return 0;

  return value && value !== Infinity ? Number(`${Math.round(Number(`${value}e${decimals}`))}e-${decimals}`) : 0;
};

const numberHelpers = {
  isNumeric,
  round
};

export { numberHelpers };
