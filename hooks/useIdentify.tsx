import { useMemo } from "react";

export default function useIdentify() {
  const identifyUser = useMemo(
    () => ({
      identify: identify,
    }),
    []
  );
  return identifyUser;
}

export function identify(
  userId: string,
  // eslint-disable-next-line @typescript-eslint/ban-types
  traits?: Record<string, unknown>
) {
  const normalizedTraits = traits ? { ...traits, id: undefined } : undefined;
  if (window.analytics) {
    try {
      window.analytics.identify(userId, normalizedTraits);
    } catch (e) {
      console.error(e);
    }
  } else {
    console.debug("identify", userId, traits);
  }

  if (window.posthog) {
    try {
      window.posthog.identify(userId, normalizedTraits);
    } catch (e) {
      console.error(e);
    }
  }
}
