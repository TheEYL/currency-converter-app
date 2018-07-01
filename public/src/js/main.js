const apiURL ='https://free.currencyconverterapi.com';
const currenciesListUrl  =`${apiURL}/api/v5/currencies`;
const convertUrl = `${apiURL}/api/v5/convert?q=`;
const queryValuesUrl  = `${apiURL}/api/v5/convert?q=`;

const inputSelector = document.querySelector('#inputCurrency');
const outputSelector = document.querySelector('#outputCurrency');
// console.log(outputSelector);
const responseButton = document.querySelector('#response');

const currencyList = [];
const queryList  = [];
window.addEventListener('load', e => {
 updateSelectors();
 });

async function updateSelectors() {
  const res = await fetch(currenciesListUrl);
  const currencies = await res.json();
  // console.log(currencies.results);


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
  let val = 0;
  try {
 const res = await fetch (`${convertUrl}${query}&compact=ultra`);

  const resp = await res.json();
  val = resp[query];

  } catch (err) {
    if ('indexedDB' in window){
       readData(query).
         then(function(data){
            console.log(data);
           val = data;
    var t = val * amount;
     responseButton.innerHTML = Math.round(t * 100) / 100

         })
     }
  }

  if (val) {
   const total = val * amount;
   responseButton.innerHTML = Math.round(total * 100) / 100
;
  } else {
    responseButton.innerHTML  = "NOT_FOUND";
  }
  //premium function: suppose you could make unlimited requests to this server.
  //then you won't have to store these queries gradually
//  saveAllCurrencyConversions();
   }
async function saveAllCurrencyConversions () {
  const today  = new Date();
   const ymd = today.toISOString().substring(0, 10);
    // let i =0;
       for (let item of currencyList ){
            // i++;
            if(i>5 ) break; //remove this to see full loop
            for (let jtem of currencyList) {
                     // queryList.push(`${item}_${jtem}`);
                  let res = await fetch (`${queryValuesUrl}${item}_${jtem},${jtem}_${item}&compact=ultra&date=${ymd}`);
                  let  resp = await res.json();

                  //save key-pair resp[`${item}_${jtem}`][ymd]
                    await writeData(resp[`${item}_${jtem}`][ymd], `${item}_${jtem}`);
             }
       }

  }

