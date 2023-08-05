const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator-keys');
const display = document.querySelector('.calculator-screen');

keys.addEventListener('click', e => {
  if (e.target.matches('button')) {
      const key = e.target
      const action = key.dataset.action
      const keyContent = key.textContent
      const displayedNum = display.value
      const previousKeyType = calculator.dataset.previousKeyType
      
      if (!action) {
          if (displayedNum === '0' || previousKeyType === 'operator') {
              display.value = keyContent
          } else {
              display.value = displayedNum + keyContent
          }
      }
      
      if (action === 'decimal') {
          if (!displayedNum.includes('.')) {
              display.value = displayedNum + '.'
          } else if (previousKeyType === 'operator') {
              display.value = '0.'
          }
          
          calculator.dataset.previousKeyType = 'decimal'
      }
      
      if (action === 'all-clear') {
          display.value = '0'
          calculator.dataset.previousKeyType = 'all-clear'
      }
      
      if (key.classList.contains('operator')) {
          key.classList.add('is-depressed')
          calculator.dataset.previousKeyType = 'operator'
          calculator.dataset.firstValue = displayedNum
          calculator.dataset.operator = action
      }
      
      if (action === '=') {
          const firstValue = calculator.dataset.firstValue
          const operator = calculator.dataset.operator
          const secondValue = displayedNum
          
          display.value = calculate(firstValue, operator, secondValue)
      }
      
  } 
});

function calculate(n1, operator, n2) {
  let result = ''
  
  if (operator === '+') {
    result = parseFloat(n1) + parseFloat(n2)
  } else if (operator === '-') {
    result = parseFloat(n1) - parseFloat(n2)
  } else if (operator === '*') {
    result = parseFloat(n1) * parseFloat(n2)
  } else if (operator === '/') {
    result = parseFloat(n1) / parseFloat(n2)
  }
  
  return result
}
