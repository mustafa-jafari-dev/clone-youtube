/** Minimal declarations for the YouTube IFrame Player API */

declare namespace YT {
  class Player {
    constructor(elementId: string, options: PlayerOptions)
    playVideo(): void
    pauseVideo(): void
    stopVideo(): void
    seekTo(seconds: number, allowSeekAhead: boolean): void
    mute(): void
    unMute(): void
    isMuted(): boolean
    setVolume(volume: number): void
    getVolume(): number
    getCurrentTime(): number
    getDuration(): number
    getPlayerState(): number
    destroy(): void
  }

  interface PlayerOptions {
    videoId?: string
    width?: number | string
    height?: number | string
    playerVars?: PlayerVars
    events?: Events
  }

  interface PlayerVars {
    autoplay?: 0 | 1
    controls?: 0 | 1
    disablekb?: 0 | 1
    enablejsapi?: 0 | 1
    fs?: 0 | 1
    modestbranding?: 0 | 1
    rel?: 0 | 1
    iv_load_policy?: 1 | 3
    showinfo?: 0 | 1
    loop?: 0 | 1
    playlist?: string
  }

  interface Events {
    onReady?: (event: PlayerEvent) => void
    onStateChange?: (event: OnStateChangeEvent) => void
    onError?: (event: OnErrorEvent) => void
  }

  interface PlayerEvent {
    target: Player
  }

  interface OnStateChangeEvent {
    data: number
    target: Player
  }

  interface OnErrorEvent {
    data: number
    target: Player
  }

  const PlayerState: {
    UNSTARTED: -1
    ENDED: 0
    PLAYING: 1
    PAUSED: 2
    BUFFERING: 3
    CUED: 5
  }
}

interface Window {
  onYouTubeIframeAPIReady?: () => void
  YT?: typeof YT
}
