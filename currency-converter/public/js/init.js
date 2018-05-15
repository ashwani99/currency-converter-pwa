const currencies = [
  'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 
  'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTN', 'BWP', 
  'BYN', 'BZD', 'CAD', 'CDF', 'CHF', 'CLP', 'CNY', 'COP', 'CRC', 'CUP', 'CVE', 
  'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 
  'GBP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 
  'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 
  'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 
  'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 
  'MRO', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 
  'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 
  'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 
  'SLL', 'SOS', 'SRD', 'STD', 'SVC', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 
  'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'UYU', 'UZS', 'VEF', 
  'VND', 'VUV', 'WST', 'XAF', 'BTC', 'XCD', 'XDR', 'XOF', 'XPF', 'YER', 'ZAR', 
  'ZMW', 'ZWD'
];
const flagsIconBasePath = '../flags/';



if (location.pathname === '/' || location.pathname === '/index' || location.pathname === 'index.html') {
  
  (function initAutocomplete() {
    // define options for currency selection autocomplete
    // map flag icons to autocomplete options
    let data = {};
    for (let currency of currencies) {
        data[currency] = flagsIconBasePath.concat(currency.toLowerCase()).concat('.png');
    }
    const options = {
        data: data
    };

    // invoke instances when document is loaded
    document.addEventListener('DOMContentLoaded', function() {
        let elems = document.querySelectorAll('.autocomplete');
        // console.log(elems);
        let instances = M.Autocomplete.init(elems, options);
    });
  })();

} else if (location.pathname === '/rates' || location.pathname === '/rates.html') {

  (function initBaseCurrencyDropdown() {
    
    const elem = document.querySelector('#base-currency-select');
    document.addEventListener('DOMContentLoaded', function() {
      let instances = M.FormSelect.init(elem, {});
    });
    
    for (let currency of currencies) {
      let newOption = document.createElement('option');
      newOption.text = newOption.value = currency;
      elem.add(newOption);
    }

    const collection = document.querySelector('#rates-collection');
    for (currency of currencies) {
      collection.appendChild(createCurrencyCollectionElement(currency, '0.0'));
    }
  })();

  function createCurrencyCollectionElement(currency, rate) {
        
    // generate new nodes
    const newItem = document.createElement('li');
    const flagAvatar = document.createElement('img');
    const currencyString = document.createElement('p');
    const rateNode = document.createElement('span');

    // add classes and id
    newItem.className = 'collection-item avatar flow-text';
    rateNode.className = 'secondary-content';

    // initiate nodes
    flagAvatar.src = flagsIconBasePath.concat(currency.toLowerCase()).concat('.png');
    currencyString.textContent = currency;
    rateNode.textContent = rate;

    // set up node hierarchy
    newItem.appendChild(flagAvatar);
    newItem.appendChild(currencyString);
    newItem.appendChild(rateNode);

    return newItem;

  }
}


// init side navigation
(function($){
  $(function(){

    $('.sidenav').sidenav();

  }); // end of document ready
})(jQuery); // end of jQuery name space


// register service worker
(function registerServiceWorker() {
  if (!navigator.serviceWorker) return;

  navigator.serviceWorker.register('/sw/index.js').then(function(reg) {
    console.log('Service Worker registered');
    // if (reg.waiting) {
    //   indexController._updateReady(reg.waiting);
    //   return;
    // }

    // if (reg.installing) {
    //   indexController._trackInstalling(reg.installing);
    //   return;
    // }

    // reg.addEventListener('updatefound', function() {
    //   indexController._trackInstalling(reg.installing);
    // });
  });
})();