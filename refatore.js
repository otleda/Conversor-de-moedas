//CODING ...

// DECLARATION VARIABLES
const currencyOneEl = document.querySelector('[data-js="currencyOne"]')
const currencyTwoEl = document.querySelector('[data-js="currencyTwo"]')
const msgErrorEl = document.querySelector('.msgError')
const convertValueEl = document.querySelector('[ data-js="convertedValue"]')
const valuePrecisionEl = document.querySelector('[data-js="conversionPrecision"]')
const inputValueEL = document.querySelector('[data-js="currencyValue"]')

// FUNCTION DISPlAY ALERT ON DOM
const showAlert = err => {
    const divMsg = document.createElement('div')
    divMsg.classList.add('message_alert')
    
    const paragraph = document.createElement('p')
    divMsg.appendChild(paragraph)
    
    const buttonClosed = document.createElement('button')

    buttonClosed.classList.add('btn_close')
    buttonClosed.innerText = 'x'
    buttonClosed.setAttribute('type','button')
    buttonClosed.addEventListener('click', () => divMsg.remove())
    
    paragraph.innerText = err.message
    
    divMsg.appendChild(buttonClosed)
    msgErrorEl.insertAdjacentElement('afterend', divMsg)
}

// IIFE e CLOSURE APLICATION STATE
const state = (() => {
    let exchangeRate = {}
    return {
        getExchangeRate: () => exchangeRate,
        setExchangeRate: newExchange => {
            if(!newExchange.conversion_rates) {
                showAlert({ message : 'Preciso ter a propriedade conversion_rate'})
                return 
            }
            exchangeRate = newExchange
            return exchangeRate
        }
    }
})()

// FUNCTION RECEIVES URL FROM API
const getUrl = currencyBase => `https://v6.exchangerate-api.com/v6/9fc45ef280197701627202b7/latest/${currencyBase}` //Key API

// MENSAGEE ERROR TYPE
const getErrorMessage = errorType => ({ 
    'unsupported-code'  : 'A moeda NAO existe em nossa base de dados.',
    'malformed-request' : 'Seu pedido deve seguir essa estrutura https://v6.exchangerate-ap.com/v6/YOUR-API-KEY/latest/USD', 
    'invalid-key'       : 'A chave da API NAO e valida.',
    'inactive-account'  : 'Seu endereco de email NAO foi confirmado.', 
    'quota-reached'     : 'Sua conta alcancou o limite de REQUEST permitido em seu plano. '
})[errorType] || 'NAO foi possivel obter as informacoes.'

// FETCH EXCHANGE RATE AND FORMATTING TO JSON 
const fetchExchangeRate = async url => {
    try {
        const response = await fetch(url)
        const exchangeRateData = await response.json()
       
        if(exchangeRateData.result === 'error') {
            throw new Error(getErrorMessage(exchangeRateData['error-type']))
        }
        return exchangeRateData
        
    } catch (err) {
        showAlert(err)
    }
}

const showInitialInfo = ({ conversion_rates }) => { 
    const getOptions = selectCurrency => Object.keys(conversion_rates)
            .map(currency => `<option ${currency === selectCurrency ? 'selected': ''}> ${currency} </option>`)
            .join('')
    
        currencyOneEl.innerHTML = getOptions('USD')
        currencyTwoEl.innerHTML = getOptions('BRL')
        convertValueEl.textContent = conversion_rates.BRL.toFixed(2)
        valuePrecisionEl.textContent = `1 ${currencyOneEl.value} = ${conversion_rates.BRL} BRL`
}

// FUNCTION INITIAL
const init = async () => {
    const url = getUrl('USD')
    const fetchExchageRateAPI = await fetchExchangeRate(url)
    const exchangeRate = state.setExchangeRate(fetchExchageRateAPI)

    if(exchangeRate && exchangeRate.conversion_rates) {
        showInitialInfo(exchangeRate)
    }
}

const getMultipierExchangeRate = conversion_rates => {
    const currencyTwo = conversion_rates[currencyTwoEl.value]
    return (inputValueEL.value * currencyTwo).toFixed(2)

}

const getPrecisionExchangeRate = conversion_rates => {
    const currencTwo = conversion_rates[currencyTwoEl.value]
    return `1 ${currencyOneEl.value} = ${1 * currencTwo} ${currencyTwoEl.value}`
}

// DATA UPDATE ON CURRENCY EXCHANGE
const showUpdateRates = ({ conversion_rates }) => {
    convertValueEl.textContent = getMultipierExchangeRate(conversion_rates)
    valuePrecisionEl.textContent = getPrecisionExchangeRate(conversion_rates) 
}

//IMPUT
inputValueEL.addEventListener('input', () => {
    const { conversion_rates } = state.getExchangeRate()
    convertValueEl.textContent = getMultipierExchangeRate(conversion_rates)
})

// 01 SELECT 
currencyOneEl.addEventListener('input', async event => {
    const url = getUrl(event.target.value)
    const newExchangeRate = await fetchExchangeRate(url)
    const exchangeRate = state.setExchangeRate(newExchangeRate)
    
    showUpdateRates(exchangeRate)
})   

// 02 SELECT
currencyTwoEl.addEventListener('input', () => {
    const exchangeRate = state.getExchangeRate()

    showUpdateRates(exchangeRate)
})

init()
