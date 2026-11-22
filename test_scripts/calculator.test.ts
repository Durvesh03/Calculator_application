import { calculate } from "../src/calculator.js";

type TestCase = {
  name: string;
  first: number;
  second: number;
  operator: string;
  expected: number;
};

const cases: TestCase[] = [
  { name: "decimal addition", first: 1.5, second: 2.5, operator: "+", expected: 4 },
  { name: "subtraction", first: 9, second: 4, operator: "-", expected: 5 },
  { name: "multiplication", first: 6, second: 7, operator: "*", expected: 42 },
  { name: "division", first: 8, second: 2, operator: "/", expected: 4 },
  { name: "negative operand", first: -1.5, second: 2.5, operator: "+", expected: 1 },
  { name: "unsupported operator", first: 1, second: 2, operator: "%", expected: NaN },
];

for (const testCase of cases) {
  const actual = calculate(testCase.first, testCase.second, testCase.operator);

  if (!Object.is(actual, testCase.expected)) {
    throw new Error(`${testCase.name}: expected ${testCase.expected}, received ${actual}`);
  }

  console.log(`PASS: ${testCase.name}`);
}
