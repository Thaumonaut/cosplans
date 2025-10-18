import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env as dynamicEnv } from "$env/dynamic/private";
import { COSPLANS_ENVIRONMENT, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from "$env/static/private";

import type { Database } from "$lib/supabase";

export interface AdminClientOptions {
  supabaseUrl?: string;
  serviceRoleKey?: string;
  environment?: string;
  fetch?: typeof fetch;
}

export interface ResolvedCredentials {
  url: string;
  serviceRoleKey: string;
  environment: string;
}

const clientCache = new Map<string, SupabaseClient<Database>>();

export function getAdminClient(options: AdminClientOptions = {}): SupabaseClient<Database> {
  const credentials = resolveCredentials(options);
  const cacheKey = `${credentials.environment}:${credentials.url}`;

  if (!clientCache.has(cacheKey)) {
    clientCache.set(
      cacheKey,
      createClient<Database>(credentials.url, credentials.serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
        global: {
          fetch: options.fetch ?? fetch,
        },
      })
    );
  }

  const client = clientCache.get(cacheKey);
  if (!client) {
    throw new Error("Unable to initialize Supabase admin client");
  }

  return client;
}

export function resolveCredentials(options: AdminClientOptions = {}): ResolvedCredentials {
  const environment = normalizeEnvironment(
    options.environment ?? dynamicEnv.COSPLANS_ENVIRONMENT ?? COSPLANS_ENVIRONMENT ?? "development"
  );
  const envSuffix = environment.toUpperCase();

  const url =
    options.supabaseUrl ??
    dynamicEnv[`SUPABASE_URL_${envSuffix}`] ??
    SUPABASE_URL ??
    dynamicEnv.SUPABASE_URL;

  const serviceRoleKey =
    options.serviceRoleKey ??
    dynamicEnv[`SUPABASE_SERVICE_ROLE_KEY_${envSuffix}`] ??
    SUPABASE_SERVICE_ROLE_KEY ??
    dynamicEnv.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      `Missing Supabase admin credentials for ${environment}. Expected SUPABASE_URL or SUPABASE_URL_${envSuffix} and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_ROLE_KEY_${envSuffix}.`
    );
  }

  return { url, serviceRoleKey, environment };
}

function normalizeEnvironment(value: string | undefined): string {
  if (!value) {
    return "development";
  }

  return value.toLowerCase();
}
