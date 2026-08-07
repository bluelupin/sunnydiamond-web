/** Keep background/autoplay videos silent even when CMS assets include audio tracks. */
export function enforceMutedVideoPlayback(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.volume = 0;
  video.setAttribute("muted", "");
}

export function bindMutedVideoPlayback(video: HTMLVideoElement) {
  const enforce = () => enforceMutedVideoPlayback(video);

  enforce();

  video.addEventListener("loadedmetadata", enforce);
  video.addEventListener("canplay", enforce);
  video.addEventListener("play", enforce);
  video.addEventListener("volumechange", enforce);

  return () => {
    video.removeEventListener("loadedmetadata", enforce);
    video.removeEventListener("canplay", enforce);
    video.removeEventListener("play", enforce);
    video.removeEventListener("volumechange", enforce);
  };
}
