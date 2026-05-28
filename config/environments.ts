export type Environment = 'local' | 'staging';

export interface EnvConfig {
  baseURL: string;
}

const configs: Record<Environment, EnvConfig> = {
  local: {
    baseURL: 'http://127.0.0.1:3006',
  },
  staging: {
    baseURL: 'http://staging.juice-shop.example.com',
  },
};

export function getEnvConfig(): EnvConfig {
  const env = (process.env.TEST_ENV ?? 'local') as Environment;
  if (!configs[env]) {
    const valid = Object.keys(configs).join(', ');
    throw new Error(`TEST_ENV inválido: "${env}". Valores aceitos: ${valid}`);
  }
  return configs[env];
}
