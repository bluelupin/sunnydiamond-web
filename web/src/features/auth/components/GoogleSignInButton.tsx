"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import GoogleIcon from "@/assets/Icons/GoogleIcon";
import { renderGoogleSignInButton } from "../services/socialSignIn";

type GoogleSignInButtonProps = {
  /** Styling for the visible surface — shared with the other social buttons. */
  className?: string;
  onCredential: (credential: string) => void;
};

/**
 * Google hands out ID tokens only through its own rendered button, and that
 * button cannot be restyled to match the storefront. So it is rendered at its
 * fixed size, made transparent, and stretched over the button the customer
 * actually sees, which is presentation only.
 *
 * Google's button sits inside a cross-origin iframe, so nothing can forward a
 * click into it — the real control has to be the one under the pointer.
 */
const GoogleSignInButton = ({ className, onCredential }: GoogleSignInButtonProps) => {
  const [status, setStatus] = useState<"pending" | "ready" | "unavailable">("pending");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  // Held in a ref so a re-render never re-runs the mount effect: re-rendering
  // Google's button would replace the click target mid-interaction.
  const onCredentialRef = useRef(onCredential);
  useEffect(() => {
    onCredentialRef.current = onCredential;
  }, [onCredential]);

  const fitToWrapper = useCallback(() => {
    const wrapper = wrapperRef.current;
    const host = hostRef.current;
    const rendered = host?.firstElementChild;
    if (!wrapper || !host || !(rendered instanceof HTMLElement)) return;

    const { offsetWidth: renderedWidth, offsetHeight: renderedHeight } = rendered;
    if (!renderedWidth || !renderedHeight) return;

    // A transform doesn't feed back into layout size, so this cannot retrigger
    // the ResizeObserver that called it.
    host.style.transform = `scale(${wrapper.offsetWidth / renderedWidth}, ${
      wrapper.offsetHeight / renderedHeight
    })`;
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const host = hostRef.current;
    if (!wrapper || !host) return;

    let cancelled = false;
    const observer = new ResizeObserver(fitToWrapper);

    void renderGoogleSignInButton(host, (credential) => {
      onCredentialRef.current(credential);
    }).then((rendered) => {
      if (cancelled) return;
      if (!rendered) {
        setStatus("unavailable");
        return;
      }

      setStatus("ready");
      fitToWrapper();
      observer.observe(wrapper);
      // Google's button settles a frame or two later, once its iframe loads —
      // watch its size rather than measuring once.
      observer.observe(host);
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [fitToWrapper]);

  // A button that cannot produce a token is worse than no button at all: this is
  // where an extension blocking accounts.google.com lands.
  if (status === "unavailable") return null;

  return (
    <div ref={wrapperRef} className={className}>
      <GoogleIcon className="block size-6 shrink-0" />
      <span className="relative z-10 leading-none" aria-hidden>
        CONTINUE WITH GOOGLE
      </span>
      <div
        ref={hostRef}
        style={{
          // Inline: .btn-border-slide > * sets position: relative on every direct
          // child at the same specificity as a utility class.
          position: "absolute",
          top: 0,
          left: 0,
          // Clear of the label, which carries its own z-index to sit above the
          // hover fill — the overlay has to stay the topmost thing in the button
          // or the label would take the click and nothing would happen.
          zIndex: 20,
          transformOrigin: "top left",
          opacity: 0,
          pointerEvents: status === "ready" ? "auto" : "none",
        }}
      />
    </div>
  );
};

export default GoogleSignInButton;
