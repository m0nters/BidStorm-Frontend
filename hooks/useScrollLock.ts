import { useEffect } from "react";

export function useScrollLock(enabled: boolean = true) {
  useEffect(() => {
    // the reason for `enabled` is to prevent hook automatically running inside
    // the component, this is for fixing "change in the order of Hooks" error

    // the second check is for when 2 dialogs are opened, we don't want to apply
    // scroll lock again if it's already applied
    if (!enabled || document.body.style.position === "fixed") return;

    // Get the current scroll position
    const scrollY = window.scrollY;

    // Apply styles to body
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflowY = "scroll"; // Prevent layout shift

    // Cleanup function
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflowY = "";

      // Restore scroll position
      window.scrollTo(0, scrollY);
    };
  }, [enabled]);
}
