/*
CONSTRUINDO UMA APLICAO DE CONVERSOR DE MOEDAS

Segue os passos abaixo :

1 - Quando a página for carregada: 
    Popule os <select> com tags <option> que contém as moedas que podem ser 
    convertidas. "BRL" para real brasileiro, "EUR" para euro, "USD" para 
    dollar dos Estados Unidos, etc.

2 - O option selecionado por padrão no 1º <select> deve ser "USD" 
    e o option no 2º <select> deve ser "BRL";
      
3 - O parágrafo com data-js="convertedValue" deve exibir o resultado da 
    conversão de 1 USD para 1 BRL;

3 - Quando um novo número for inserido no input com 
    data-js="currencyOneTimes", o parágrafo do item acima deve atualizar 
    seu valor;

4 - O parágrafo com data-js="conversionPrecision" deve conter a conversão 
    apenas x1. Exemplo: 1 USD = 5.0615 BRL;
       
5 - O conteúdo do parágrafo do item acima deve ser atualizado à cada 
    mudança nos selects;
     
6 - O conteúdo do parágrafo data-js="converted-value" deve ser atualizado à
    cada mudança nos selects e/ou no input com data-js="currency-one-times";
      
7 - Para que o valor contido no parágrafo do item acima não tenha mais de 
    dois dígitos após o ponto, você pode usar o método toFixed: 
    https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
    
8 - Para obter as moedas com os valores já convertidos, use a Exchange rate 
    API: https://www.exchangerate-api.com/;
    
9 - Para obter a key e fazer requests, você terá que fazer login e escolher
    o plano free. Seus dados de cartão de crédito não serão solicitados.
*/


//CODING ...

const getSelectCurrencyOneEl = document.querySelector('[data-js="currencyOne"]')
const getSelectCurrencyTwoEl = document.querySelector('[data-js="currencyTwo"]')

console.log(getSelectCurrencyOneEl, getSelectCurrencyTwoEl);

getSelectCurrencyOneEl.innerHTML = `<option>BRL</option>`
getSelectCurrencyTwoEl.innerHTML = `<option>USD</option>`