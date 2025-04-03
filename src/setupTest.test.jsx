import { expect, vi } from "vitest";

it("global.expect should be defined", () => {
  expect(global.expect).toBeDefined();
});

it("global.jest should support mocks", () => {
  const mockFn = vi.fn();
  mockFn();
  expect(mockFn).toHaveBeenCalled();
});
