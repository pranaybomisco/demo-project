/**
 * Global Search Debounce Configuration for Tech Talk Demonstrations.
 *
 * - enabled: true  => Debounced auto-search (waits delayMs) + manual Apply button.
 * - enabled: false => Zero debounce (fires API request on EVERY keystroke to demo input jank and rapid server traffic).
 */
export const DEBOUNCE_CONFIG = {
  enabled: true,
  delayMs: 2000,
};

export default DEBOUNCE_CONFIG;
