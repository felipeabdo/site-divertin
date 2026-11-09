/**
 * Ajustes da experiência offline.
 * Para alterar a duração da tela de reconexão, mude o valor abaixo (em ms).
 */
export const OFFLINE_CONFIG = {
  reconnectionScreenDurationMs: 2_800,
  connectivityCheckIntervalMs: 15_000,
  connectivityTimeoutMs: 5_000,
} as const;
