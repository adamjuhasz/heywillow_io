import { useMemo } from "react";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var posthog:
    | undefined
    | {
        capture: (
          event: string,
          props?: Record<string, string | number>
        ) => void;
        identify: (
          userId: string,
          propsSet?: Record<string, unknown>,
          propsOnceSet?: Record<string, unknown>
        ) => void;
        reset: () => void;
        group: (
          groupType: string,
          groupId: string,
          props?: Record<string, unknown>
        ) => void;
      };
}

export default function useTrackEvent() {
  const track = useMemo(
    () => ({
      track: trackEvent,
    }),
    []
  );
  return track;
}

export function trackEvent(
  event: string,
  props?: Record<string, string | number>
) {
  if (window.analytics) {
    try {
      window.analytics.track(event, props);
    } catch (e) {
      console.error(e);
    }
  } else {
    console.debug(event, props);
  }

  if (window.posthog) {
    try {
      window.posthog.capture(event, props);
    } catch (e) {
      console.error(e);
    }
  }
}
