import { useMemo } from "react";

export default function useGroup() {
  const identifyUser = useMemo(
    () => ({
      group: group,
    }),
    []
  );
  return identifyUser;
}

export function group(
  groupId: number,
  // eslint-disable-next-line @typescript-eslint/ban-types
  traits?: Record<string, unknown>
) {
  const normalizedTraits = traits ? { ...traits, id: undefined } : undefined;
  if (window.analytics) {
    try {
      window.analytics.group(`${groupId}`, normalizedTraits);
    } catch (e) {
      console.error(e);
    }
  } else {
    console.debug("group", groupId, traits);
  }

  if (window.posthog) {
    try {
      window.posthog.group("team", `id:${groupId}`, traits);
    } catch (e) {
      console.error(e);
    }
  }
}
