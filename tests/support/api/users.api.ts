import type { APIRequestContext } from '@playwright/test';

export async function createUserViaApi(
  request: APIRequestContext,
  email: string,
  password: string,
): Promise<void> {
  const res = await request.post('/api/Users/', {
    data: {
      email,
      password,
      passwordRepeat: password,
      securityQuestion: { id: 1 },
      securityAnswer: 'Fluffy',
    },
  });
  if (res.status() !== 201) {
    throw new Error(`Falha ao criar usuário via API: HTTP ${res.status()}`);
  }
}
