import { useState } from "react";
import "./App.css";

function App() {
  const [display, setDisplay] = useState("0");
  const [firstNumber, setFirstNumber] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForSecondNumber, setWaitingForSecondNumber] = useState(false);

  const inputNumber = (number) => {
    if (waitingForSecondNumber) {
      setDisplay(number);
      setWaitingForSecondNumber(false);
    } else {
      setDisplay(display === "0" ? number : display + number);
    }
  };

  const inputOperator = (nextOperator) => {
    const inputValue = parseFloat(display);

    if (operator && waitingForSecondNumber) {
      setOperator(nextOperator);
      return;
    }

    if (firstNumber === null) {
      setFirstNumber(inputValue);
    } else if (operator) {
      const result = calculate(firstNumber, inputValue, operator);

      setDisplay(String(result));
      setFirstNumber(result);
    }

    setWaitingForSecondNumber(true);
    setOperator(nextOperator);
  };

  const calculate = (first, second, operator) => {
    // Fixed: explicit operator dispatch instead of building/evaluating a string
    // expression (previously eval(`${first}${operator}${second}`) — CWE-95 code
    // injection). Numeric semantics (including division-by-zero -> Infinity/NaN)
    // are preserved.
    switch (operator) {
      case "+":
        return first + second;
      case "-":
        return first - second;
      case "*":
        return first * second;
      case "/":
        return first / second;
      default:
        return second;
    }
  };

  const handleEquals = () => {
    if (operator === null || firstNumber === null) {
      return;
    }

    const secondNumber = parseFloat(display);
    const result = calculate(firstNumber, secondNumber, operator);

    setDisplay(String(result));
    setFirstNumber(null);
    setOperator(null);
    setWaitingForSecondNumber(true);
  };

  const clearCalculator = () => {
    setDisplay("0");
    setFirstNumber(null);
    setOperator(null);
    setWaitingForSecondNumber(false);
  };

  const handleDecimal = () => {
    if (waitingForSecondNumber) {
      setDisplay("0.");
      setWaitingForSecondNumber(false);
      return;
    }

    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  return (
    <div className="calculator">
      <div className="display">{display}</div>

      <div className="buttons">
        <button className="clear" onClick={clearCalculator}>
          C
        </button>

        <button className="operator" onClick={() => inputOperator("/")}>÷</button>
        <button className="operator" onClick={() => inputOperator("*")}>×</button>

        <button className="digit" onClick={() => inputNumber("7")}>7</button>
        <button className="digit" onClick={() => inputNumber("8")}>8</button>
        <button className="digit" onClick={() => inputNumber("9")}>9</button>
        <button className="operator" onClick={() => inputOperator("-")}>−</button>

        <button className="digit" onClick={() => inputNumber("4")}>4</button>
        <button className="digit" onClick={() => inputNumber("5")}>5</button>
        <button className="digit" onClick={() => inputNumber("6")}>6</button>
        <button className="operator" onClick={() => inputOperator("+")}>+</button>

        <button className="digit" onClick={() => inputNumber("1")}>1</button>
        <button className="digit" onClick={() => inputNumber("2")}>2</button>
        <button className="digit" onClick={() => inputNumber("3")}>3</button>

        <button className="equals" onClick={handleEquals}>
          =
        </button>

        <button className="zero digit" onClick={() => inputNumber("0")}>
          0
        </button>

        <button className="digit" onClick={handleDecimal}>.</button>
      </div>
    </div>
  );
}

export default App;