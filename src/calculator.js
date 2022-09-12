export default class Calculator {

    constructor() {
        const numberButtons = document.querySelectorAll('[data-number]');
        const operatorButtons = document.querySelectorAll('[data-operator]');
        const functionButtons = document.querySelectorAll('[data-function]');
        
        numberButtons.forEach(button => {
            button.addEventListener('click', this.addNumber(parseInt(button.value)));   
        });

        this.numbers = [];
        this.operators = [];
        thispreviousIsOperator = false;
    
    }

    addNumber(number) {
        this.numbers.pop(number);
        this.updateDisplay(number);
    }

    calculate(n1, n2, operator) {

    }

    updateDisplay(value) {
        const display = document.getElementsById('display');
        display.innerHTML += value; 
    }
}