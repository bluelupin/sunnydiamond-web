/** First-paint PWA splash — styled via {@link PWA_LAUNCH_SPLASH_CRITICAL_CSS} (no Tailwind required). */
export default function PwaLaunchSplashStatic() {
  return (
    <div id="pwa-launch-splash-static" aria-hidden="true">
      <div className="pwa-launch-shell">
        <div className="pwa-launch-mark" aria-hidden />
        <div className="pwa-launch-copy">
          <p className="pwa-launch-title">Sunny Diamonds</p>
          <p className="pwa-launch-tagline">Crafting Brilliance Since 1997</p>
        </div>
      </div>
    </div>
  );
}
