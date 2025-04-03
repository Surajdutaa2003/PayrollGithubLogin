import { expect, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

// Vitest ko Jest-style mocks support karne ke liye
global.expect = expect;
global.jest = vi;
