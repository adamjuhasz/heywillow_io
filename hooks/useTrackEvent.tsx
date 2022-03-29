import { useMemo } from "react";

export default function useTrackEvent() {
  const track = useMemo(
    () => ({
      track: (event: string, props?: Record<string, string>) => {
        if (window.analytics) {
          window.analytics.track(event, props);
        } else {
          console.debug(event, props);
        }
      },
    }),
    []
  );
  return track;
}
