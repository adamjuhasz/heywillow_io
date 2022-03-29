import { useMemo } from "react";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var posthog:
    | undefined
    | {
        capture: (event: string, props?: Record<string, string>) => void;
        identify: (
          userId: string,
          propsSet?: Record<string, unknown>,
          propsOnceSet?: Record<string, unknown>
        ) => void;
      };
}

export default function useTrackEvent() {
  const track = useMemo(
    () => ({
      track: (event: string, props?: Record<string, string>) => {
        if (window.analytics) {
          window.analytics.track(event, props);
        } else {
          console.debug(event, props);
        }

        if (window.posthog) {
          window.posthog.capture(event, props);
        }
      },
    }),
    []
  );
  return track;
}
