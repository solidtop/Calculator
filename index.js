const formatter = new Intl.NumberFormat('se');

const MAX_NUMBERS = 13; //JS goes freakin bananas att high and low number calculations
const MAX_OPERATORS = 8;
let amountOfNumbers = 1;

let record = [];
let caretPos = 0;

let numbersAdded = [];
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

numberButtons.forEach(button => {
    button.addEventListener('click', e => {
        if (clearOnInput) clear();

        const number = parseInt(e.target.innerHTML);
        addNumber(number);
    })
});

operatorButtons.forEach(button => {
    button.addEventListener('click', e => {
        addOperator(e.target.innerHTML);
    });
});

functionButtons.forEach(button => {
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
    if (numbers[numbers.length] === 0 && numberToAdd === 0) return; //WTF

    if (previousIsOperator) {

        numbers.push(numberToAdd);
        displayText.push(numberToAdd);
        previousIsOperator = false;
    
    } else {
        const lastPos = numbers.length-1;  numbers.at(-1)
        if (isDecimal) {
            decimalPos ++;
            numbers[lastPos] = numbers[lastPos] + numberToAdd / 10 ** decimalPos; 
            displayText[displayText.length-1] = numbers[lastPos].toLocaleString('se-SV', {minimumFractionDigits: decimalPos});
        } else {
            numbers[lastPos] = numbers[lastPos] * 10 + numberToAdd;
            displayText[displayText.length-1] = formatter.format(numbers[lastPos]);
        }
    }
    saveRecord(numberToAdd);
    updateDisplay();
    amountOfNumbers ++;
}
function addOperator(operator) {
    if (previousIsOperator) return;

    if (clearOnInput) {
        clear();
        numbers[0] = result;
        displayText[0] = result;
        updateDisplay();
    }

    if (operator === ',') {
        if (!isDecimal) {
            isDecimal = true;
            injectToDisplay(',');
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
    saveRecord();
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

    const previousNumber = record[caretPos-1].numberAdded;  //Get info from record array object
    decimalPos = record[caretPos-1].decimalPos;
    removeRecord(); //Remove current record from memory 

    if (previousIsOperator) { //Remove operator
        operators.pop();
        displayText.pop();
        updateDisplay(); 
        amountOfNumbers = MAX_NUMBERS;
        previousIsOperator = false;
        return;
    } 
    amountOfNumbers --;
    const lastPos = numbers.length - 1;

    isDecimal = !Number.isInteger(numbers[lastPos]);
    if (isDecimal) {
        numbers[lastPos] = numbers[lastPos] - previousNumber / (10 ** decimalPos);
        displayText[displayText.length-1] = numbers[lastPos].toLocaleString('se-SV', {minimumFractionDigits: decimalPos-1});
        decimalPos --;
        updateDisplay();

        if (numbers[0] === 0) clear();
        return;
    }

    if (numbers[lastPos] < 10) {
        if (numbers.length === 1) {
            clear();
            return;
        }
        numbers.pop();
        displayText.pop();
        previousIsOperator = true;
    } else {
        numbers[lastPos] = Math.ceil(numbers[lastPos] / 10) - Math.ceil(previousNumber / 10);
        displayText[displayText.length-1] = formatter.format(numbers[lastPos]);
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
    clearRecord();

    document.querySelector('#input-display').innerHTML = '0';
    document.querySelector('#result-display').innerHTML = '0';
}



function saveRecord(number = null) {
    record.push({
        numberAdded: number,
        operator: operators.at(-1),
        decimalPos: decimalPos,
    });
    caretPos = record.length;
}
function removeRecord() {
    record.pop();
    caretPos = record.length;
}
function clearRecord() {
    record = [];
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
