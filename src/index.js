const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const functionButtons = document.querySelectorAll('[data-function]');

const formatter = new Intl.NumberFormat('se');

const maxAmountOfNumbers = 14;
let amountOfNumbers = 0;

let numbers = [0];
let operators = [];
let previousIsOperator = false;
let displayText = ['0'];
let isDecimal = false;
let decimalPos = 0; 
let previousNumberAdded = 0;

let clearOnInput = false;

numberButtons.forEach(button => { //Add numbers to calculation
    button.addEventListener('click', function() {
        if (amountOfNumbers > maxAmountOfNumbers) return;
        if (numbers[numbers.length] === 0 && numberToAdd === 0) return; //Exit early if 0 has duplicates
        amountOfNumbers ++;

        if (clearOnInput) {
            clearDisplays();
        }

        let numberToAdd = parseInt(button.innerHTML);
        let lastPos = numbers.length - 1;

        if (previousIsOperator) {
            numbers.push(numberToAdd);
            displayText.push(numbers[numbers.length - 1]);
        } else {  
            if (isDecimal) {
                decimalPos ++;
                numbers[lastPos] = numbers[lastPos] + numberToAdd / 10 ** decimalPos; 
                displayText[displayText.length-1] = numbers[lastPos].toFixed(decimalPos);
            } else {
                numbers[lastPos] = numbers[lastPos] * 10 + numberToAdd;
                displayText[displayText.length-1] = formatter.format(numbers[lastPos]);
            }
        } 
        updateDisplay(); 
        previousIsOperator = false;
        previousNumberAdded = numberToAdd;
        console.log(numbers);
    });   
});
operatorButtons.forEach(button => { //Add operators to calculation
    button.addEventListener('click', function() {
        if (previousIsOperator) return;
        if (clearOnInput) return;

        if (button.innerHTML === ',') { //Decimal operator
            isDecimal = true;
        } else {
            operators.push(button.innerHTML);
            console.log(button.innerHTML);
            displayText.push(button.innerHTML);
            updateDisplay();  
            previousIsOperator = true;
            isDecimal = false;
            decimalPos = 0;
        }
    });   
});

functionButtons.forEach(button => { //Handle function buttons
    button.addEventListener('click', function() {
        switch(button.innerHTML) {
            case '=':
                if (!clearOnInput) calculate();
                break;
            case 'C': 
                clearDisplays();
                break;
            case 'DEL':
                removePosition();
                break;
        }
    });   
});


function calculate() {
    if (operators.length < 1) return;

    let result = numbers[0];
    let operator = '';
    for (let i = 1; i < numbers.length; i++) {
        operator = operators[i-1];
        switch(operator) {
            case '+': result += numbers[i]; break;
            case '-': result -= numbers[i]; break;
            case '÷': result /= numbers[i]; break;
            case 'x': result *= numbers[i]; break;
            case '^': result **= numbers[i]; break;
            case '%': result %= numbers[i]; break;
            default: break;
        }	
    }
    showResult(result);
}

function updateDisplay() {
    const display = document.getElementById('input-display');
    let str = '';
    displayText.forEach(text => {
       str += text + ' ';  
    });
    display.innerHTML = str;
}
function clearDisplays() {
    numbers = [0];
    operators = [];
    displayText = ['0'];
    amountOfNumbers = 0;
    isDecimal = false;
    decimalPos = 0;
    clearOnInput = false;

    const display = document.getElementById('input-display');
    const resultDisplay = document.getElementById('result-display');
    display.innerHTML = displayText[0]; 
    resultDisplay.innerHTML = '0'; 
    console.log('Displays Cleared');
}
function removePosition() {
    if (numbers[0] === 0) return;

    if (previousIsOperator) {
        operators.pop();
        displayText.pop();
        previousIsOperator = false;
        console.log('operator removed');
    } else {
        let lastPos = numbers.length-1;
        if (numbers[lastPos] < 10) {
            if (numbers.length > 1) {
                numbers.pop();
                displayText.pop();
                previousIsOperator = false;
            } else {
                clearDisplays();
                previousIsOperator = false;    
            }
        } else {
            if (!isDecimal) { 
                numbers[lastPos] = Math.ceil(numbers[lastPos] / 10) - Math.ceil(previousNumberAdded / 10);
                displayText[displayText.length-1] = formatter.format(numbers[lastPos]);
            } else {

            }
        }
        amountOfNumbers --;
        console.log('number removed');
    }
    updateDisplay(); 
}
function showResult(result) {
    const inputdisplay = document.getElementById('input-display');   
    const resultDisplay = document.getElementById('result-display');     
    inputdisplay.innerHTML += ' ='
    resultDisplay.innerHTML = formatter.format(result);
    clearOnInput = true;

    console.log('result: ' + result);
}