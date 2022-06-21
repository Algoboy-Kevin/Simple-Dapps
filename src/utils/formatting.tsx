import numeral from "numeral";

const currency = (number:Number) => {
  return numeral(number).format('$0,0.00');
}

const currencyNoComma = (number:Number) => {
  return numeral(number).format('$0,0');
}

const index = (number:Number) => {
  return numeral(number).format('0.00') + 'x';
}

const percentage = (number:Number) => {
  return numeral(number).format('0.00%');
}

const fourDigitsComma = (number:Number) => {
  return numeral(number).format('0.0000');
}

const format = {
  currency: (number:Number) => currency(number),
  currencyNoComma: (number:Number) => currencyNoComma(number),
  index: (number:Number) => index(number),
  percentage: (number:Number) => percentage(number),
  fourDigitsComma: (number:Number) => fourDigitsComma(number),
}

export default format;