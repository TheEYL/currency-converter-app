const apiURL ='https://free.currencyconverterapi.com';
const currenciesListUrl  =`${apiURL}/api/v5/currencies`;
const convertUrl = `${apiURL}/api/v5/convert?q=`;

const inputSelector = document.querySelector('#inputCurrency');
const outputSelector = document.querySelector('#outputCurrency');
// console.log(outputSelector);

const responseButton = document.querySelector('#response');
window.addEventListener('load', e => {
 updateSelectors();
 });

async function updateSelectors() {
  const res = await fetch(currenciesListUrl);
  const currencies = await res.json();
  // console.log(currencies.results);
  const currencyList = [];


  for (let curr in currencies.results){
    // console.log(currencies.results[curr]);
    currencyList.push(curr);
  }

  currencyList.sort(function (a,b) {
 return a.localeCompare(b);
  })
  inputSelector.innerHTML = currencyList
    .map(src => `<option value="${src}"> ${src}</option>`)
    .join('\n');

  outputSelector.innerHTML = inputSelector.innerHTML;

}

async function queryFunction() {
  const inputCurrency = encodeURIComponent(inputSelector.options[inputSelector.selectedIndex].value);
  const outputCurrency = encodeURIComponent(outputSelector.options[outputSelector.selectedIndex].value);
;
  let amount = document.getElementById('amount').value;
  // console.log(`${inputCurrency} && ${outputCurrency}`);
  // console.log( (inputCurrency && outputCurrency) );
  // console.log(amount);

  const query =  `${inputCurrency}_${outputCurrency}`;
  const res = await fetch (`${convertUrl}${query}&compact=ultra`);

  const resp = await res.json();
  const val = resp[query];

  if (val) {
   const total = val * amount;
   responseButton.innerHTML = Math.round(total * 100) / 100
;
  }

}
