const display = document.getElementById('display');
const history = document.getElementById('history');
const buttons = document.querySelectorAll('.key');

let expression = '';
let justEvaluated = false;

function render() {
  display.textContent = expression || '0';
  history.textContent = expression ? expression : '\u00A0';
}

function isOperator(value) {
  return ['+', '-', '*', '/', '%'].includes(value);
}

function appendValue(value) {
  if (justEvaluated && !isOperator(value)) {
    expression = '';
  }

  const lastChar = expression.slice(-1);

  if (isOperator(value) && isOperator(lastChar)) {
    expression = expression.slice(0, -1) + value;
  } else {
    expression += value;
  }

  justEvaluated = false;
  render();
}

function clearAll() {
  expression = '';
  justEvaluated = false;
  render();
}

function deleteLast() {
  expression = expression.slice(0, -1);
  justEvaluated = false;
  render();
}

function calculate() {
  if (!expression) {
    return;
  }

  try {
    const result = Function(`"use strict"; return (${expression});`)();
    expression = Number.isFinite(result) ? String(result) : 'Error';
    justEvaluated = true;
    render();
  } catch {
    expression = 'Error';
    justEvaluated = true;
    render();
  }
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const { action, value } = button.dataset;

    if (action === 'clear') {
      clearAll();
      return;
    }

    if (action === 'delete') {
      deleteLast();
      return;
    }

    if (action === 'equals') {
      calculate();
      return;
    }

    appendValue(value);
  });
});

document.addEventListener('keydown', (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key) || ['+', '-', '*', '/', '%', '.'].includes(key)) {
    appendValue(key);
    return;
  }

  if (key === 'Enter' || key === '=') {
    event.preventDefault();
    calculate();
    return;
  }

  if (key === 'Backspace') {
    deleteLast();
    return;
  }

  if (key === 'Escape') {
    clearAll();
  }
});

render();