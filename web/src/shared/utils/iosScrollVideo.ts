import { isIosWebKit } from "@/shared/utils/isIosWebKit";

/** Helps iOS Safari fetch/decode the first frame when using scroll-scrubbed `<video>`. */
export function appendIosMediaFragment(url: string): string {
  if (!isIosWebKit()) {
    return url;
  }
  const [base, hash] = url.split("#");
  if (hash?.startsWith("t=")) {
    return url;
  }
  return `${base}#t=0.001`;
}

export function iosSeekScrollVideo(video: HTMLVideoElement, targetTime: number) {
  if (!isIosWebKit()) {
    return;
  }

  video.muted = true;
  video.playsInline = true;

  if (Math.abs(video.currentTime - targetTime) > 0.01) {
    video.currentTime = targetTime;
  }

  const paintAfterFrame = () => {
    void video
      .play()
      .then(() => {
        const rvfc = video.requestVideoFrameCallback;
        if (typeof rvfc === "function") {
          rvfc.call(video, () => {
            video.pause();
          });
          return;
        }
        requestAnimationFrame(() => {
          video.pause();
        });
      })
      .catch(() => {});
  };

  paintAfterFrame();
}

export function primeIosScrollVideo(video: HTMLVideoElement) {
  iosSeekScrollVideo(video, video.currentTime || 0);
}
