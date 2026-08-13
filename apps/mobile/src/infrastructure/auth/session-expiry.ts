type Listener = () => void;

const listeners = new Set<Listener>();

/**
 * A one-way notice from the HTTP client to whoever is displaying the session.
 *
 * The client is a module-level singleton created before React mounts, so it
 * cannot call a hook or read a context. Without a channel like this one, a
 * server-rejected refresh would clear the keystore and leave the UI showing an
 * authenticated shell backed by nothing — until the next launch corrected it.
 *
 * Deliberately not an event emitter with a payload: there is exactly one event,
 * it carries no data, and the only reasonable response is to end the session.
 */
export const sessionExpiry = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },

  notify(): void {
    // Copied before iterating: a listener that unsubscribes itself while being
    // called would otherwise mutate the set mid-iteration.
    for (const listener of [...listeners]) listener();
  },
};
