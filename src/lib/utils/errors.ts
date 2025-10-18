import { randomUUID } from "node:crypto";

export type CosplansErrorSeverity = "info" | "warning" | "error" | "critical";

export interface CosplansError {
  code: string;
  severity: CosplansErrorSeverity;
  userMessage: string;
  operatorContext?: Record<string, unknown>;
  correlationId?: string;
  retryable?: boolean;
  cause?: unknown;
}

export interface TranslatedErrorMessage {
  title: string;
  description: string;
  severity: CosplansErrorSeverity;
  retry?: boolean;
  supportRecommendation?: string;
  correlationId?: string;
}

const ERROR_LIBRARY: Record<string, Partial<TranslatedErrorMessage> & { retry?: boolean }> = {
  AUTH_INVALID_SERVICE_KEY: {
    title: "Invalid service credentials",
    description: "The provided service key was rejected. Double-check the value and try again.",
    supportRecommendation: "Rotate the service role key in Supabase and update Cosplans settings.",
    severity: "warning",
  },
  NETWORK_TIMEOUT: {
    title: "Service timed out",
    description: "We could not reach the service before the timeout window expired.",
    supportRecommendation: "Verify the service status page and network allow lists.",
    severity: "error",
    retry: true,
  },
  STORAGE_UPLOAD_FAILED: {
    title: "Evidence upload failed",
    description: "Diagnostics evidence could not be stored. The run will retry automatically.",
    supportRecommendation: "Check Supabase storage permissions and retry the diagnostics run.",
    severity: "warning",
    retry: true,
  },
};

const DEFAULT_ERROR: TranslatedErrorMessage = {
  title: "Something went wrong",
  description: "We ran into an unexpected issue. Please retry in a moment or contact support.",
  severity: "error",
  retry: true,
  supportRecommendation: "If the issue continues, share the correlation ID with support.",
};

export type ErrorInput = CosplansError | Error | string | null | undefined;

export function toCosplansError(input: ErrorInput): CosplansError {
  if (!input) {
    return {
      code: "UNKNOWN_ERROR",
      severity: "error",
      userMessage: DEFAULT_ERROR.description,
      correlationId: randomUUID(),
    };
  }

  if (typeof input === "string") {
    return {
      code: "UNEXPECTED_STRING_ERROR",
      severity: "error",
      userMessage: input,
      correlationId: randomUUID(),
    };
  }

  if (isCosplansError(input)) {
    return {
      ...input,
      correlationId: input.correlationId ?? randomUUID(),
    };
  }

  const generic = input as Error;

  return {
    code: "UNHANDLED_EXCEPTION",
    severity: "error",
    userMessage: generic.message || DEFAULT_ERROR.description,
    correlationId: randomUUID(),
    cause: generic,
  };
}

function isCosplansError(value: unknown): value is CosplansError {
  return (
    !!value &&
    typeof value === "object" &&
    "code" in value &&
    typeof (value as CosplansError).code === "string" &&
    "userMessage" in value &&
    typeof (value as CosplansError).userMessage === "string" &&
    "severity" in value &&
    typeof (value as CosplansError).severity === "string"
  );
}

export function translateError(input: ErrorInput): TranslatedErrorMessage {
  const normalized = toCosplansError(input);
  const libraryEntry = ERROR_LIBRARY[normalized.code];
  const operatorRecommendation =
    normalized.operatorContext &&
    typeof (normalized.operatorContext as Record<string, unknown>).supportRecommendation ===
      "string"
      ? ((normalized.operatorContext as Record<string, unknown>).supportRecommendation as string)
      : undefined;

  return {
    ...DEFAULT_ERROR,
    ...libraryEntry,
    severity: libraryEntry?.severity ?? normalized.severity,
    description: libraryEntry?.description ?? normalized.userMessage ?? DEFAULT_ERROR.description,
    title: libraryEntry?.title ?? DEFAULT_ERROR.title,
    retry: libraryEntry?.retry ?? normalized.retryable ?? DEFAULT_ERROR.retry,
    supportRecommendation:
      libraryEntry?.supportRecommendation ??
      operatorRecommendation ??
      DEFAULT_ERROR.supportRecommendation,
    correlationId: normalized.correlationId,
  };
}

export interface LogErrorOptions {
  context?: Record<string, unknown>;
  logger?: Pick<typeof console, "error">;
}

export function logCosplansError(input: ErrorInput, options: LogErrorOptions = {}): CosplansError {
  const normalized = toCosplansError(input);
  const logger = options.logger ?? console;
  const payload = {
    level: mapSeverityToLevel(normalized.severity),
    code: normalized.code,
    userMessage: normalized.userMessage,
    correlationId: normalized.correlationId,
    operatorContext: {
      ...normalized.operatorContext,
      ...options.context,
    },
    retryable: normalized.retryable ?? false,
  };

  logger.error({
    ...payload,
    cause: normalized.cause,
    timestamp: new Date().toISOString(),
  });

  return normalized;
}

function mapSeverityToLevel(severity: CosplansErrorSeverity): "warn" | "error" | "fatal" {
  switch (severity) {
    case "info":
      return "warn";
    case "warning":
      return "warn";
    case "error":
      return "error";
    case "critical":
      return "fatal";
    default:
      return "error";
  }
}
