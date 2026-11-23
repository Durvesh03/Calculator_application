import { describe, it, expect } from "vitest";
import { calculate } from "../src/calculate.js";

describe("calculate", () => {
  it("adds two numbers", () => {
    expect(calculate(2, 3, "+")).toBe(5);
  });

  it("subtracts two numbers", () => {
    expect(calculate(10, 4, "-")).toBe(6);
  });

  it("multiplies two numbers", () => {
    expect(calculate(6, 7, "*")).toBe(42);
  });

  it("divides two numbers", () => {
    expect(calculate(8, 2, "/")).toBe(4);
  });

  it("returns 'Error' when dividing a nonzero number by zero", () => {
    expect(calculate(5, 0, "/")).toBe("Error");
  });

  it("returns 'Error' when dividing zero by zero", () => {
    expect(calculate(0, 0, "/")).toBe("Error");
  });

  it("throws for an unrecognized operator", () => {
    expect(() => calculate(1, 2, "%")).toThrow();
  });
});
