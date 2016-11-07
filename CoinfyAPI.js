import request from 'superagent';

const URL = 'https://api.fixer.io/';

const NAME_LIST = {
  "USD": "US Dollar",
  "AUD": "Australian Dollar",
  "BGN": "Bulgarian Lev",
  "BRL": "Brazilian Real",
  "CAD": "Canadian Dollar",
  "CHF": "Swiss Franc",
  "CNY": "Chinese Yuan",
  "CZK": "Czech Republic Koruna",
  "DKK": "Danish Krone",
  "GBP": "British Pound",
  "HKD": "Hong Kong Dollar",
  "HRK": "Croatian Kuna",
  "HUF": "Hungarian Forint",
  "IDR": "Indonesian Rupiah",
  "INR": "Indian Rupee",
  "JPY": "Japanese Yen",
  "KRW": "South Korean Won",
  "MXN": "Mexican Peso",
  "MYR": "Malaysian Ringgit",
  "NOK": "Norwegian Krone",
  "NZD": "New Zealand Dollar",
  "PHP": "Philippine Peso",
  "PLN": "Polish Zloty",
  "RON": "Romanian Leu",
  "RUB": "Russian Ruble",
  "SEK": "Swedish Krona",
  "SGD": "Singapore Dollar",
  "THB": "Thai Baht",
  "TRY": "Turkish Lira",
  "ZAR": "South African Rand",
  "EUR": "Euro",
  "BRL IOF": "Brazilian Real with IOF"
};

const SYMBOL_LIST = {
  "USD": "$",
  "AUD": "$",
  "BGN": "лв",
  "BRL": "R$",
  "CAD": "$",
  "CHF": "CHF",
  "CNY": "¥",
  "CZK": "Kč",
  "DKK": "kr",
  "GBP": "£",
  "HKD": "$",
  "HRK": "kn",
  "HUF": "Ft",
  "IDR": "Rp",
  "INR": "",
  "JPY": "¥",
  "KRW": "₩",
  "MXN": "$",
  "MYR": "RM",
  "NOK": "kr",
  "NZD": "$",
  "PHP": "₱",
  "PLN": "zł",
  "RON": "lei",
  "RUB": "руб",
  "SEK": "kr",
  "SGD": "$",
  "THB": "฿",
  "TRY": "",
  "ZAR": "R",
  "EUR": "€"
};

const CURRENCIES_LIST = ["USD", "AUD", "BGN", "BRL", "CAD", "CHF", "CNY", "CZK", "DKK", "GBP", "HKD", "HRK", "HUF", "IDR", "INR", "JPY", "KRW", "MXN", "MYR", "NOK", "NZD", "PHP", "PLN", "RON", "RUB", "SEK", "SGD", "THB", "TRY", "ZAR", "EUR"]


class CoinfyAPI {
  static test(value) {
    return value;
  }

  static currencyList(base, callback) {
    request
      .get(`${URL}/latest`)
      .set('Accept', 'application/json')
      .query({ base })
      .end(function(err, res){
        callback(err, res.body);
      });
  }

  static getQuotation(list, coin) {
    const value = list[coin] ? list[coin] : 1;
    return String(Math.round(value * 100) / 100);
  }

  static getName(currency) {
    return NAME_LIST[currency];
  }

  static getSymbol(currency) {
    return SYMBOL_LIST[currency];
  }

  static getCurrencies() {
    return CURRENCIES_LIST;
  }
}

export default CoinfyAPI
