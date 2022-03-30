/*
CONSTRUINDO UMA APLICAO DE CONVERSOR DE MOEDAS

Segue os passos abaixo :

[x] -- 1 -- 
Quando a página for carregada: 
Popule os <select> com tags <option> que contém as moedas que podem ser 
convertidas. "BRL" para real brasileiro, "EUR" para euro, "USD" para dollar 
dos Estados Unidos, etc.

[x] -- 2 --
O option selecionado por padrão no 1º <select> deve ser "USD" 
e o option no 2º <select> deve ser "BRL";
      
[x] -- 3 -- 
O parágrafo com data-js="convertedValue" deve exibir o resultado da 
conversão de 1 USD para 1 BRL;

[x] -- 4 --
Quando um novo número for inserido no input com data-js="currencyOneTimes", 
o parágrafo do item acima deve atualizar seu valor;

[x] -- 5 -- 
O parágrafo com data-js="conversionPrecision" deve conter a conversão 
apenas x1. Exemplo: 1 USD = 5.0615 BRL;
       
[x] -- 6 -- 
O conteúdo do parágrafo do item acima deve ser atualizado à cada 
mudança nos selects;
     
[x] -- 7 --
O conteúdo do parágrafo data-js="converted-value" deve ser atualizado à
cada mudança nos selects e/ou no input com data-js="currency-one-times";
      
[x] -- 8 --
Para que o valor contido no parágrafo do item acima não tenha mais de 
dois dígitos após o ponto, você pode usar o método toFixed: 
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
    
[X] -- 9 --
Para obter as moedas com os valores já convertidos, use a Exchange rate 
API: https://www.exchangerate-api.com/;
    
[X] -- 10 -- 
Para obter a key e fazer requests, você terá que fazer login e escolher
o plano free. Seus dados de cartão de crédito não serão solicitados.

[ ] -- 11 --
Tornar a Moeda Base dinâmica, vindo da API, e fazer que venha como um parametro de uma funcao.
*/

//CODING ...

const state = (() => {

    let exchangeRate = {}

    return {
        getExchangeRate: () => exchangeRate,
        setExchangeRate: newExchangeRate => {
            if(!newExchangeRate.conversion_rates) {
                console.log('Preciso ter uma propridade conversion_rates.')
                return 
            }
            exchangeRate = newExchangeRate
            return exchangeRate
        }
    }
})()


const currencyOneEl = document.querySelector('[data-js="currencyOne"]')
const currencyTwoEl = document.querySelector('[data-js="currencyTwo"]')
const msgErrorEl = document.querySelector('.msgError')
const convertValueEl = document.querySelector('[ data-js="convertedValue"]')
const valuePrecisionEl = document.querySelector('[data-js="conversionPrecision"]')
const inputValueEL = document.querySelector('[data-js="currencyValue"]')

//let internalExchangeRate = {}

const getUrl = currencyBase => `https://v6.exchangerate-api.com/v6/9fc45ef280197701627202b7/latest/${currencyBase}` //Key API

const getErrorMessage = errorType => ({ 
    'unsupported-code'  : 'A moeda NAO existe em nossa base de dados.',
    'malformed-request' : 'Seu pedido deve seguir essa estrutura https://v6.exchangerate-ap.com/v6/YOUR-API-KEY/latest/USD', 
    'invalid-key'       : 'A chave da API NAO e valida.',
    'inactive-account'  : 'Seu endereco de email NAO foi confirmado.', 
    'quota-reached'     : 'Sua conta alcancou o limite de REQUEST permitido em seu plano. '
})[errorType] || 'NAO foi possivel obter as informacoes.'

// Function Msg Error to DOM
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

//Function to feth Exchange
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

//Function initial information 
const showInitialInfo = exchangeRate => {
    const getOptions = selectCurrency => Object.keys(exchangeRate.conversion_rates)
            .map(currency => `<option ${currency === selectCurrency ? 'selected': ''}> ${currency} </option>`)
            .join('')
    
        currencyOneEl.innerHTML = getOptions('USD')
        currencyTwoEl.innerHTML = getOptions('BRL')
        convertValueEl.textContent = exchangeRate.conversion_rates.BRL.toFixed(2)
        valuePrecisionEl.textContent = `1 ${currencyOneEl.value} = ${exchangeRate.conversion_rates.BRL} BRL`
}

//Function Initial to app
const init = async () => {
    const exchangeRate = state.setExchangeRate(await fetchExchangeRate(getUrl('USD')))

    if(exchangeRate.conversion_rates) {
        showInitialInfo(exchangeRate)
    }
}

//Function Updates to selected
const showUpdateRates = () => {
    convertValueEl.textContent = inputValueEL.value * (internalExchangeRate.conversion_rates[currencyTwoEl.value]).toFixed(2)
    valuePrecisionEl.textContent = `1 ${currencyOneEl.value} = ${1 * internalExchangeRate.conversion_rates[currencyTwoEl.value]} ${currencyTwoEl.value}`
}

//Entry fo values
inputValueEL.addEventListener('input', event => {
    convertValueEl.textContent = (event.target.value * internalExchangeRate.conversion_rates[currencyTwoEl.value]).toFixed(2)
})

//Select 01    
//aqui vai ter de obter um novo feth, pois a taxa vai ser baseada em uma
//nova moeda, ou seja vai ter de fazer um novo request. por padrao a API a moeda base é o "USD" 
currencyOneEl.addEventListener('input', async event => {
    internalExchangeRate = {...(await fetchExchangeRate(getUrl(await event.target.value))) } 
    showUpdateRates()
  
})   

//Select 02
currencyTwoEl.addEventListener('input', showUpdateRates)

init()
