const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const functionButtons = document.querySelectorAll('[data-function]');

const formatter = new Intl.NumberFormat('se');

const maxAmountOfNumbers = 9;
const maxAmountOfOperators = 4;
let amountOfNumbers = 1;
let amountOfOperators = 0;

let numbersAdded = [];
let numbers = [0];
let result = 0;
let operators = [];
let previousIsOperator = false;
let displayText = ['0'];
let isDecimal = false;
let decimalPos = 0; 

let clearOnInput = false;

numberButtons.forEach(button => { //Add numbers to calculation
    button.addEventListener('click', function() {
        if (amountOfNumbers > maxAmountOfNumbers) return;
        if (numbers[numbers.length] === 0 && numberToAdd === 0) return; //Exit early if user is adding 0 to 0 (it's useless)
        amountOfNumbers ++;

        if (clearOnInput) {
            clear();
        } 

        let numberToAdd = parseInt(button.innerHTML); //Convert button name to number
        numbersAdded.push(numberToAdd); //save number for later
        let lastPos = numbers.length - 1;

        if (previousIsOperator) { //Add first number after operator
            numbers.push(numberToAdd);
            displayText.push(numberToAdd);
            previousIsOperator = false;
        } else {   //Increase current number 
            if (isDecimal) {
                decimalPos ++;
                numbers[lastPos] = numbers[lastPos] + numberToAdd / 10 ** decimalPos; 
                //Seperate format for decimals
                displayText[displayText.length-1] = numbers[lastPos].toLocaleString('se-SV', {minimumFractionDigits: decimalPos});
            } else {
                numbers[lastPos] = numbers[lastPos] * 10 + numberToAdd;
                displayText[displayText.length-1] = formatter.format(numbers[lastPos]);
            }
        } 
        updateDisplay(); 
        console.log(numberToAdd);
    });   
});
operatorButtons.forEach(button => { //Add operators to calculation
    button.addEventListener('click', function() {
        if (previousIsOperator) return;
        if (amountOfOperators >= maxAmountOfOperators) return;

        if (clearOnInput) {
            clear();
            numbers[0] = result;
            displayText[0] = numbers[0];
            updateDisplay();
        }
        if (button.innerHTML === ',') { //Decimal operator
            if (isDecimal) return;
            isDecimal = true;
            updateDisplay(','); //insert "fake" comma
        } else {
            operators.push(button.innerHTML);
            console.log(button.innerHTML);
            displayText.push(button.innerHTML);
            updateDisplay();  
            previousIsOperator = true;
            amountOfOperators ++;
            isDecimal = false; //reset values
            decimalPos = 0;
            amountOfNumbers = 1;
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
                clear();
                break;
            case 'DEL':
                removePosition();
                break;
        }
    });   
});


function calculate() {
    if (operators.length < 1) return;
    if (numbers.length === 1) {
        numbers[1] = numbers[0]; //if only one number exists, calculate itself
    }
    let sum = numbers[0];
    let operator = '';
    for (let i = 1; i < numbers.length; i++) {
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
    showResult(result);
}

function updateDisplay(str2 = '') {
    const display = document.getElementById('input-display');
    let str = '';
    displayText.forEach(text => {
       str += text + ' ';  
    });
    display.innerHTML = str + str2;
}
function clear() {
    numbers = [0];
    operators = [];
    displayText = ['0'];
    numbersAdded = [];
    amountOfNumbers = 1;
    isDecimal = false;
    decimalPos = 0;
    clearOnInput = false;
    previousIsOperator = false;

    const display = document.getElementById('input-display');
    const resultDisplay = document.getElementById('result-display');
    display.innerHTML = displayText[0]; 
    resultDisplay.innerHTML = '0'; 
    console.log('Cleared');
}
function removePosition() { //TODO: Doesn't work correctly with decimal numbers (yet)
    if (previousIsOperator) {
        operators.pop();
        displayText.pop();
        previousIsOperator = false;
        amountOfNumbers = maxAmountOfNumbers; //reset 
        console.log('Operator removed');
    } else {
        numbersAdded.pop();
        amountOfNumbers --;
        let lastPos = numbers.length-1;
        isDecimal = !Number.isInteger(numbers[lastPos]);
        console.log(isDecimal);
        if (numbers[lastPos] < 10 && !isDecimal) {
            if (numbers.length > 1) {
                numbers.pop();
                displayText.pop();
                previousIsOperator = true;
            } else {
                clear();
                previousIsOperator = false;    
            }
        } else {
            let previousNumberAdded = numbersAdded[numbersAdded.length-1];
            if (!isDecimal) {
                numbers[lastPos] = Math.ceil(numbers[lastPos] / 10) - Math.ceil(previousNumberAdded / 10);
                displayText[displayText.length-1] = formatter.format(numbers[lastPos]);
            } else {
                numbers[lastPos] = numbers[lastPos] - previousNumberAdded / (10 ** decimalPos);
                decimalPos --;
                displayText[displayText.length-1] = numbers[lastPos].toLocaleString('se-SV', {minimumFractionDigits: decimalPos});
            }
        }
        console.log('Number removed');
    }
    updateDisplay(); 
}
function showResult() {
    const inputdisplay = document.getElementById('input-display');   
    const resultDisplay = document.getElementById('result-display');     
    inputdisplay.innerHTML += ' ='
    resultDisplay.innerHTML = formatter.format(result);
    clearOnInput = true;

    console.log('result: ' + result);
}
