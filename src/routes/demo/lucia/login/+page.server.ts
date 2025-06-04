import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { createDB } from '$lib/server/db';
import { z } from 'zod/v4';
import { createSession, generateSessionToken, setSessionTokenCookie } from '$lib/server/auth';
import { hashPassword, verifyPassword } from '$lib/crypto/password';

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    return redirect(302, '/demo/lucia');
  }
  return {};
};

export const actions: Actions = {
  login: async (event) => {
    const formData = await event.request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    const { success, data, error } = User.safeParse({ email, password });

    if (!success) {
      return fail(400, { error: z.prettifyError(error) });
    }

    const results = await createDB(event.platform!.env.DB)
      .select()
      .from(table.user)
      .where(eq(table.user.email, data.email));

    const existingUser = results.at(0);
    if (!existingUser) {
      return fail(400, { error: 'Incorrect email or password' });
    }

    const validPassword = await verifyPassword({
      hash: existingUser.password!,
      password: data.password
    });

    if (!validPassword) {
      return fail(400, { error: 'Incorrect email or password' });
    }

    const sessionToken = generateSessionToken();
    const session = await createSession(event.platform!.env.DB, sessionToken, existingUser.id);
    setSessionTokenCookie(event, sessionToken, session.expiresAt);

    return redirect(302, '/demo/lucia');
  },
  register: async (event) => {
    const formData = await event.request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    const { success, data, error } = User.safeParse({ email, password });

    if (!success) {
      return fail(400, { error: z.prettifyError(error) });
    }

    const userId = generateUserId();
    const passwordHash = await hashPassword(data.password);

    try {
      await createDB(event.platform!.env.DB).insert(table.user).values({
        email: data.email,
        id: userId,
        name: 'constantine',
        password: passwordHash,
        provider: 'credentials'
      });

      const sessionToken = generateSessionToken();
      const session = await createSession(event.platform!.env.DB, sessionToken, userId);
      setSessionTokenCookie(event, sessionToken, session.expiresAt);
    } catch (e) {
      if (e instanceof Error && e.message.includes('UNIQUE constraint failed')) {
        return fail(400, { error: 'Email already exists' });
      }

      return fail(500, { error: 'Internal Server Errror' });
    }
    return redirect(302, '/demo/lucia');
  }
};

function generateUserId() {
  // ID with 120 bits of entropy, or about the same as UUID v4.
  const bytes = crypto.getRandomValues(new Uint8Array(15));
  const id = encodeBase32LowerCase(bytes);
  return id;
}

const User = z.object({
  email: z.email().min(8),
  password: z.string().min(8).max(100)
});
