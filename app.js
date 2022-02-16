/*
CONSTRUINDO UMA APLICAO DE CONVERSOR DE MOEDAS

Segue os passos abaixo :

[x] -- 1 -- 
Quando a página for carregada: 
Popule os <select> com tags <option> que contém as moedas que podem ser 
convertidas. "BRL" para real brasileiro, "EUR" para euro, "USD" para dollar 
dos Estados Unidos, etc.

[ ] -- 2 --
O option selecionado por padrão no 1º <select> deve ser "USD" 
e o option no 2º <select> deve ser "BRL";
      
[ ] -- 3 -- 
O parágrafo com data-js="convertedValue" deve exibir o resultado da 
conversão de 1 USD para 1 BRL;

[ ] -- 4 --
Quando um novo número for inserido no input com data-js="currencyOneTimes", 
o parágrafo do item acima deve atualizar seu valor;

[ ] -- 5 -- 
O parágrafo com data-js="conversionPrecision" deve conter a conversão 
apenas x1. Exemplo: 1 USD = 5.0615 BRL;
       
[ ] -- 6 -- 
O conteúdo do parágrafo do item acima deve ser atualizado à cada 
mudança nos selects;
     
[ ] -- 7 --
O conteúdo do parágrafo data-js="converted-value" deve ser atualizado à
cada mudança nos selects e/ou no input com data-js="currency-one-times";
      
[ ] -- 8 --
Para que o valor contido no parágrafo do item acima não tenha mais de 
dois dígitos após o ponto, você pode usar o método toFixed: 
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
    
[X] -- 9 --
Para obter as moedas com os valores já convertidos, use a Exchange rate 
API: https://www.exchangerate-api.com/;
    
[X] -- 10 -- 
Para obter a key e fazer requests, você terá que fazer login e escolher
o plano free. Seus dados de cartão de crédito não serão solicitados.
*/

//CODING ...

const getSelectCurrencyOneEl = document.querySelector('[data-js="currencyOne"]')
const getSelectCurrencyTwoEl = document.querySelector('[data-js="currencyTwo"]')

const url = 'https://v6.exchangerate-api.com/v6/9fc45ef280197701627202b7/latest/UD' //Key API


const getErrorMessage = errorType => ({
    'unsupported-code': 'A moeda NAO existe em nossa base de dados.',
    'malformed-request' : 'Seu pedido deve seguir essa estrutura https://v6.exchangerate-api.com/v6/YOUR-API-KEY/latest/USD', 
    'invalid-key'       : 'A chave da API NAO e valida.',
    'inactive-account'  : 'Seu endereco de email NAO foi confirmado.', 
    'quota-reached'     : 'Sua conta alcancou o limite de REQUEST permitido em seu plano. '
})[errorType] || 'NAO foi possivel obter as informacoes.'

const fetchExchangeRate = async () => { 
    try {
        const response = await fetch(url)
        const exChangeRateData = await response.json()

        if(exChangeRateData.result === 'error') {
            throw new Error(getErrorMessage('oi'))
        }

    } catch (err) {
        alert(err.message)
    }
}
fetchExchangeRate()

const optionTag = `<option>Moeda</option>`
getSelectCurrencyOneEl.innerHTML = optionTag
getSelectCurrencyTwoEl.innerHTML = optionTag

