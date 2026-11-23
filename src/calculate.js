export function calculate(first, second, operator) {
  // Safe fixed-operator dispatch (no dynamic code execution) — fixes CWE-95.
  switch (operator) {
    case "+":
      return first + second;
    case "-":
      return first - second;
    case "*":
      return first * second;
    case "/":
      if (second === 0) {
        return "Error";
      }
      return first / second;
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}
