
if (location.pathname === '/' || location.pathname === '/index' || location.pathname === 'index.html') {

    const baseAmount = document.querySelector('#base-currency-amt');
    const quoteAmount = document.querySelector('#quote-currency-amt');
    const baseCurrency = document.querySelector('#base-currency');
    const quoteCurrency = document.querySelector('#quote-currency');
    const convertButton = document.querySelector('#convert-button');

    function validator() {
        if (!baseCurrency.value) {
            M.toast({ html: 'Please select a base currency' });
            return false;
        } else if (!quoteCurrency.value) {
            M.toast({ html: 'Please select a quote currency' });
            return false;
        } else if (!baseAmount.value && !quoteAmount.value) {
            M.toast({ html: 'Please enter an amount to convert' });
            return false;
        }
        return true;
    }
    convertButton.addEventListener('click', () => {
        
        activateProgressBar();

        if (validator()) {
            let amount = baseAmount.value || quoteAmount.value;
            let resultBox = baseAmount.value ? quoteAmount : baseAmount;
            let url = `/api/convert?from=${baseCurrency.value}&to=${quoteCurrency.value}&amount=${amount}`;
            
            fetch(url).then(response => response.json())
            .then((data) => {
                document.querySelector('.determinate').style.width = '100%';
                data = JSON.parse(data);
                resultBox.focus();
                resultBox.value = Number(data.amount);
            });
        }
    });

} else if (location.pathname === '/rates' || location.pathname === '/rates.html') {

    const baseCurrencySelector = document.querySelector('#base-currency-select');
    baseCurrencySelector.addEventListener('change', fetchRates);

    const refreshButton = document.querySelector('#refresh-btn');
    refreshButton.addEventListener('click', fetchRates);


    function fetchRates() {
        console.log('fired');
        if (baseCurrencySelector.value === '') return;
        console.log('fefefef' + baseCurrencySelector.value);
        activateProgressBar();
    
        // let baseCurrency = baseCurrencySelector.value;
        let url = `/api/rates?base=${baseCurrencySelector.value}`;
        
        const collection = document.querySelector('#rates-collection');
        fetch(url).then(response => response.json())
        .then((data) => {
            document.querySelector('.determinate').style.width = '100%';
            data = JSON.parse(data);
            // destroy old collections
            while (collection.firstChild) {
                collection.removeChild(collection.firstChild);
            }
            // add new collections i.e rates
            for (let itemKey in data.rates) {
                collection.appendChild(createCurrencyCollectionElement(itemKey, data.rates[itemKey]));
            }
        });
    }
}


function activateProgressBar() {
    const progressBar = document.querySelector('.determinate');
    progressBar.style.width = '0%';
    let currentWidth = 0;
    const timer = setInterval(() => {
        currentWidth += 1;
        progressBar.style.width += currentWidth + '%';
    }, 100);
    if (currentWidth === 90) {
        clearInterval(timer);
    }
}
