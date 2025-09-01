import { cookies } from 'next/headers';
import type { Pattern } from '@/app/_actions/patterns';
import { getRandomPatternServer } from '@/app/_actions/patterns';
import 'server-only';

const COOKIE_NAME = 'featured-pattern-session';
const _COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

export async function getFeaturedPatternSSR(locale: string = 'en'): Promise<Pattern | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);

  // Check if we have a cached pattern for this session
  if (sessionCookie?.value) {
    try {
      const sessionData = JSON.parse(sessionCookie.value);
      if (sessionData.locale === locale && sessionData.pattern) {
        // Return the cached pattern for this session
        return sessionData.pattern;
      }
    } catch {
      // Invalid cookie data, continue to get new pattern
    }
  }

  // Get a new random pattern (no cookie setting in SSR)
  const pattern = await getRandomPatternServer(locale);
  return pattern;
}
