import type { Handle } from '@sveltejs/kit';
import {
  sessionCookieName,
  validateSessionToken,
  setSessionTokenCookie,
  deleteSessionTokenCookie
} from '$lib/server/auth.js';

const handleAuth: Handle = async ({ event, resolve }) => {
  const sessionToken = event.cookies.get(sessionCookieName);

  if (event.url.pathname.startsWith('/.well-known/appspecific/com.chrome.devtools')) {
    return new Response(null, { status: 204 }); // Return empty response with 204 No Content
  }

  if (!sessionToken) {
    event.locals.user = null;
    event.locals.session = null;
    return resolve(event);
  }

  const { session, user } = await validateSessionToken(event.platform!.env.DB, sessionToken);

  if (session) {
    setSessionTokenCookie(event, sessionToken, session.expiresAt);
  } else {
    deleteSessionTokenCookie(event);
  }

  event.locals.user = user;
  event.locals.session = session;
  return resolve(event);
};

export const handle: Handle = handleAuth;
