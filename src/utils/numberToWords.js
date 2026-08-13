// Indian Currency Number to Words converter

const singleDigits = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function convertThreeDigit(num) {
  let str = "";
  if (num >= 100) {
    str += singleDigits[Math.floor(num / 100)] + " Hundred ";
    num %= 100;
  }
  if (num >= 20) {
    str += tens[Math.floor(num / 10)] + " ";
    num %= 10;
  } else if (num >= 10) {
    str += teens[num - 10] + " ";
    num = 0;
  }
  if (num > 0) {
    str += singleDigits[num] + " ";
  }
  return str;
}

export function numberToWordsIndian(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) return "Zero Rupees Only";
  
  const totalAmount = Math.round(amount * 100) / 100;
  let rupees = Math.floor(totalAmount);
  let paise = Math.round((totalAmount - rupees) * 100);

  if (rupees === 0 && paise === 0) return "Zero Rupees Only";

  let words = "";

  const crore = Math.floor(rupees / 10000000);
  rupees %= 10000000;
  const lakh = Math.floor(rupees / 100000);
  rupees %= 100000;
  const thousand = Math.floor(rupees / 1000);
  rupees %= 1000;

  if (crore > 0) {
    words += convertThreeDigit(crore) + "Crore ";
  }
  if (lakh > 0) {
    words += convertThreeDigit(lakh) + "Lakh ";
  }
  if (thousand > 0) {
    words += convertThreeDigit(thousand) + "Thousand ";
  }
  if (rupees > 0) {
    words += convertThreeDigit(rupees);
  }

  words = words.trim();
  if (words.length > 0) {
    words += " Rupees";
  }

  if (paise > 0) {
    const paiseText = convertThreeDigit(paise).trim();
    if (words.length > 0) {
      words += " and " + paiseText + " Paise";
    } else {
      words += paiseText + " Paise";
    }
  }

  return words ? words + " Only" : "Zero Rupees Only";
}
