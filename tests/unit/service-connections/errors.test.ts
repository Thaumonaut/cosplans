import { describe, expect, it } from "vitest";

import { translateError, type CosplansError } from "$lib/utils/errors";

describe("translateError", () => {
  it("maps known error codes to library metadata", () => {
    const input: CosplansError = {
      code: "AUTH_INVALID_SERVICE_KEY",
      severity: "warning",
      userMessage: "Invalid credentials provided",
      correlationId: "1234",
    };

    const result = translateError(input);

    expect(result.title).toBe("Invalid service credentials");
    expect(result.description).toMatch(/service key was rejected/i);
    expect(result.supportRecommendation).toMatch(/Rotate the service role key/i);
    expect(result.correlationId).toBe("1234");
    expect(result.retry).toBe(true);
  });

  it("falls back to operator recommendation when provided", () => {
    const input: CosplansError = {
      code: "CUSTOM_FAILURE",
      severity: "error",
      userMessage: "The diagnostics runner aborted",
      correlationId: "abcd",
      operatorContext: {
        supportRecommendation: "Check firewall rules and retry",
      },
    };

    const result = translateError(input);

    expect(result.title).toBe("Something went wrong");
    expect(result.description).toBe("The diagnostics runner aborted");
    expect(result.supportRecommendation).toBe("Check firewall rules and retry");
    expect(result.retry).toBe(true);
  });

  it("returns default message when error is unknown", () => {
    const result = translateError(new Error("Unexpected failure"));

    expect(result.title).toBe("Something went wrong");
    expect(result.description).toBe("Unexpected failure");
    expect(result.retry).toBe(true);
    expect(result.correlationId).toMatch(/[0-9a-f-]{36}/i);
  });
});
