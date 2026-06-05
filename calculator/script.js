const display = document.getElementById('display');

function appendValue(val) {
    if (display.value === '0' && val !== '.') {
        display.value = val;
    } else {
        display.value += val;
    }
}

function clearDisplay() {
    display.value = '';
}

function calculate() {
    try {
        const expression = display.value;
        // Strict whitelist: only allow digits, basic math operators, decimals, parentheses, and spaces.
        if (/[^0-9+\-*/(). ]/.test(expression)) {
            throw new Error("Invalid characters in expression");
        }
        // Safely evaluate the sanitized expression
        display.value = new Function('return ' + expression)();
    } catch (error) {
        display.value = "Error";
        console.error("Calculation error:", error);
    }
}