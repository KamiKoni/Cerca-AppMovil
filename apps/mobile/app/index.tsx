import { SessionGuard } from '../src/presentation/SessionGuard';

/**
 * The launch route, which shows nothing of its own.
 *
 * Its only job is to hold the user on the bootstrap screen until the keystore
 * has been read, then send them to the area their session earns. Rendering
 * sign-in here instead — as this file used to — meant deciding before the
 * answer was known, and showing the form to someone already signed in.
 */
export default function Page() {
  return <SessionGuard group="entry" />;
}
