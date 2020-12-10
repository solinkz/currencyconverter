const API_KEY = '11f6d60c37403855141b';
let currencyUrl = 'https://free.currconv.com/api/v7/currencies?apiKey='+API_KEY;

const selectForms = document.querySelectorAll('.select-form');
const currencyFrom = document.querySelector('#currency-from');
const currencyTo= document.querySelector('#currency-to');
const fromValue = document.querySelector('#from-value');
const toValue = document.querySelector('#to-value');

/**
 * We will get the currencies
 * store convert from, store convert to
 * fetch conversion value from api
 * then use it calculate the conversion 
 */

 class CurrencyConverter{

     constructor(convertFrom, convertTo){
        this.convertFrom = convertFrom;
        this.convertTo = convertTo;
        this.convertionValue = 0;
        this.conversionResult = 0;

     }

     static async fetchCurrencies(){
        //  for getting currencies
        const response = await fetch(currencyUrl);
        const currencies = await response.json();
        return currencies;
     }

     async fetchConversionValue(){
        let url = `https://free.currconv.com/api/v7/convert?q=${this.convertFrom}_${this.convertTo}&compact=ultra&apiKey=${API_KEY}`;
        const response = await fetch(url);
        const rate = await  response.json();

        for (const key in rate) {
            if (rate.hasOwnProperty(key)) {
                this.convertionValue = rate[key];
                this.insertValueInFields();
            }
        }
     }

     insertValueInFields(){
        fromValue.value = 1;
        toValue.value = this.convertionValue.toFixed(2);
     }

     calculateConversion(){
        //  calculate conversion
     }

     get valueIsSet(){
         return (this.convertFrom !== undefined && this.convertTo !== undefined) ? true : false;
     }

 }

let currencyConverter = new CurrencyConverter();

/**  
 * building the options in a the convert_from and to select form 
 */
function buildCurrencySelect(currencies){
    // console.log(currencies);
    for (const currency in currencies) {
        if (currencies.hasOwnProperty(currency)) {
            selectForms.forEach(form => {
                let option = `<option value="${currencies[currency].id}">${currencies[currency].id} </option>`;
                form.innerHTML += option;
            })
        }
    }
}

/**
 * Fetch currencies
 * @return object
 * Add currencies to build method
 */
CurrencyConverter.fetchCurrencies().then(response => {
    const currencies = response.results;
    buildCurrencySelect(currencies);
});

// add from value to object
currencyFrom.addEventListener('change', function(){
    currencyConverter.convertFrom = this.value;
    currencyConverter.valueIsSet ? currencyConverter.fetchConversionValue() : '';
});

// add to value to object
currencyTo.addEventListener('change', function(){
    currencyConverter.convertTo = this.value;
    currencyConverter.valueIsSet ? currencyConverter.fetchConversionValue() : '';
});


fromValue.addEventListener('change', function(){
    let result = this.value * currencyConverter.convertionValue;
    toValue.value = result.toFixed(2);
})

toValue.addEventListener('change', function(){
    let result = this.value / currencyConverter.convertionValue;
    fromValue.value = result.toFixed(2);
})

