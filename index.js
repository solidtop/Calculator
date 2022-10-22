const MAX_NUMBERS = 13; //JS goes freakin bananas att high and low number calculations
const MAX_OPERATORS = 8;

const formatter = new Intl.NumberFormat('sv-SE', {
    maximumSignificantDigits: MAX_NUMBERS,
});

let amountOfNumbers = 1;

let historyList = [];
let caretPos = 0; //Keeping track of history when deleting/adding numbers

let numbers = [0];
let operators = [];
let displayText = ['0'];
let result = 0;

let previousIsOperator = false;
let isDecimal = false;
let decimalPos = 0; 
let clearOnInput = false;

const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const functionButtons = document.querySelectorAll('[data-function]');

numberButtons.forEach(button => { //Number buttons
    button.addEventListener('click', e => {
        if (clearOnInput) clear();

        const number = parseInt(e.target.innerHTML);
        addNumber(number);
    })
});

operatorButtons.forEach(button => { //Operator buttons
    button.addEventListener('click', e => {
        addOperator(e.target.innerHTML);
    });
});

functionButtons.forEach(button => { //Function buttons
    button.addEventListener('click', () => {
        switch(button.innerHTML) {
            case '=':
                if (!clearOnInput) calculate();
                break;
            case 'C': 
                clear();
                break;
            case 'DEL':
                if (clearOnInput) 
                    clear();
                else 
                    remove();
                break;
        }
    });      
});


function addNumber(numberToAdd) {
    if (amountOfNumbers >= MAX_NUMBERS) return;
    if (caretPos === 0 && numberToAdd === 0 && !isDecimal) return; 

    if (previousIsOperator) {
        numbers.push(numberToAdd);
        displayText.push(numberToAdd);
        previousIsOperator = false;
    
    } else {
        const pos = numbers.length-1; 
        if (isDecimal) {
            decimalPos ++;
            numbers[pos] = numbers[pos] + numberToAdd / 10 ** decimalPos; 
            displayText[displayText.length-1] = formatter.format(numbers[pos]);6
        } else {
            numbers[pos] = numbers[pos] * 10 + numberToAdd;
            displayText[displayText.length-1] = formatter.format(numbers[pos]);
        }
    }
    amountOfNumbers ++;
    saveHistory();
    updateDisplay();
}
function addOperator(operator) {
    if (previousIsOperator) return;

    if (clearOnInput) {
        clear();
        numbers[0] = result;
        displayText[0] = result;
        updateDisplay();
    }

    if (operator === ',') { //Making next input decimal number
        if (!isDecimal) {
            isDecimal = true;
            injectToDisplay(','); //Show "," on display temporary
        }
        return;
    } 

    if (operators.length >= MAX_OPERATORS) return;
    amountOfNumbers = 1;

    operators.push(operator);
    displayText.push(operator);
    updateDisplay();

    previousIsOperator = true;
    isDecimal = false;
    decimalPos = 0;
    saveHistory();
}

function calculate() {
    let sum = numbers[0];
    let operator = '';
    for (let i = 0; i < numbers.length; i++) {
        operator = operators[i-1];
        switch(operator) {
            case '+': sum += numbers[i]; break;
            case '-': sum -= numbers[i]; break;
            case '÷': sum /= numbers[i]; break;
            case 'x': sum *= numbers[i]; break;
            case '^': sum **= numbers[i]; break;
            case '%': sum %= numbers[i]; break;
            default: break;
        }	
    }
    result = sum;
    showResult();
}

function remove() {
    if (caretPos === 0) return;

    if (caretPos === 1) {
        clear();
        return;
    }
    removeHistory();

    if (previousIsOperator) {
        operators.pop();
        displayText.pop();
        updateDisplay();
        previousIsOperator = false;
        return;
    }

    const i = caretPos-1;
    const number = historyList[i].number; //Get info from historyList
    const numberPos = historyList[i].numberPos;
    isDecimal = historyList[i].isDecimal;
    decimalPos = historyList[i].decimalPos;

    if (numberPos <= 1) {
        numbers.pop();
        displayText.pop();
        previousIsOperator = true;
    } else {
        numbers[numbers.length-1] = number;
        displayText[displayText.length-1] = formatter.format(number);
    }
    updateDisplay();
   
}

function clear() {
    amountOfNumbers = 1;

    numbers = [0];
    operators = [];
    displayText = ['0'];

    clearOnInput = false;
    previousIsOperator = false;
    isDecimal = false;
    decimalPos = 0;
    clearHistory();

    document.querySelector('#input-display').innerHTML = '0';
    document.querySelector('#result-display').innerHTML = '0';
}


function saveHistory() {
    const i = numbers.length - 1;
    const j = operators.length -1;
    historyList.push({
        number: numbers[i],
        operator: operators[j],
        numberPos: amountOfNumbers, 
        isDecimal: isDecimal,
        decimalPos: decimalPos,
    });
    caretPos = historyList.length;
}
function removeHistory() {
    historyList.pop();
    caretPos = historyList.length;
}
function clearHistory() {
    historyList = [];
    caretPos = 0;
}

//#region Display functions

function updateDisplay() {
    let text = '';
    displayText.forEach(str => {
        text += ' ' + str;
    });
    document.querySelector('#input-display').innerHTML = text;   
}
function injectToDisplay(char) {
    document.querySelector('#input-display').innerHTML += char;
}

function showResult() {
    document.querySelector('#result-display').innerHTML = formatter.format(result);
    document.querySelector('#input-display').innerHTML += ' =';
    clearOnInput = true;
}

//#endregion

