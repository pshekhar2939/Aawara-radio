import { useState, useEffect, useRef, useCallback } from 'react';
import { PlayerStatus } from '../types';
import { PLAYLIST_ID } from '../data/tracks';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

let youtubeApiPromise: Promise<any> | null = null;

function loadYouTubeAPI(): Promise<any> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      try {
        previous?.();
      } catch {}
      resolve(window.YT);
    };

    const existing = document.getElementById('yt-iframe-api');
    if (!existing) {
      const script = document.createElement('script');
      script.id = 'yt-iframe-api';
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.head.appendChild(script);
    }
  });

  return youtubeApiPromise;
}

export function useYouTubeRadio(containerId: string) {
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<number | null>(null);
  const pendingPlayRef = useRef(false);
  const mountedRef = useRef(true);

  const videoTitleRef = useRef('');
  const videoAuthorRef = useRef('');
  const currentIndexRef = useRef(0);
  const volumeRef = useRef(80);

  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState<PlayerStatus>('UNSTARTED');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoAuthor, setVideoAuthor] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const syncMetadata = useCallback((player: any) => {
    if (!player || !mountedRef.current) return;

    try {
      const data = player.getVideoData?.();
      if (data?.title && data.title !== videoTitleRef.current) {
        videoTitleRef.current = data.title;
        setVideoTitle(data.title);
      }
      if (data?.author && data.author !== videoAuthorRef.current) {
        videoAuthorRef.current = data.author;
        setVideoAuthor(data.author);
      }

      const dur = player.getDuration?.();
      if (typeof dur === 'number' && Number.isFinite(dur) && dur > 0) {
        setDuration(dur);
      }

      const idx = player.getPlaylistIndex?.();
      if (typeof idx === 'number' && idx >= 0 && idx !== currentIndexRef.current) {
        currentIndexRef.current = idx;
        setCurrentTrackIndex(idx);
      }
    } catch {}
  }, []);

  const stopTimeInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimeInterval = useCallback(() => {
    stopTimeInterval();

    intervalRef.current = window.setInterval(() => {
      const player = playerRef.current;
      if (!player || !mountedRef.current) return;

      try {
        const cur = player.getCurrentTime?.();
        const dur = player.getDuration?.();

        if (typeof cur === 'number' && Number.isFinite(cur)) setCurrentTime(cur);
        if (typeof dur === 'number' && Number.isFinite(dur) && dur > 0) {
          setDuration(dur);
        }

        syncMetadata(player);
      } catch {}
    }, 500);
  }, [stopTimeInterval, syncMetadata]);

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    const createPlayer = () => {
      if (cancelled || !mountedRef.current) return;
      if (!window.YT?.Player || playerRef.current) return;

      const target = document.getElementById(containerId);
      if (!target) {
        console.error('AWAARA Radio: YouTube container not found:', containerId);
        return;
      }

      const origin = window.location.origin;
      console.log('AWAARA Radio: production origin:', origin);

      playerRef.current = new window.YT.Player(target, {
        width: '200',
        height: '200',
        playerVars: {
          autoplay: 0,
          controls: 0,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          fs: 0,
          disablekb: 1,
          iv_load_policy: 3,
          enablejsapi: 1,
          origin,
          widget_referrer: origin,
          listType: 'playlist',
          list: PLAYLIST_ID,
        },
        events: {
          onReady: (event: any) => {
            if (cancelled || !mountedRef.current) return;

            const iframe = event.target.getIframe?.();
            if (iframe) {
              iframe.setAttribute(
                'allow',
                'autoplay; encrypted-media; picture-in-picture'
              );
              iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
              iframe.setAttribute('playsinline', '1');
            }

            try {
              event.target.setVolume(volumeRef.current);
            } catch {}

            setIsPlayerReady(true);
            setStatus('CUED');
            syncMetadata(event.target);

            if (pendingPlayRef.current) {
              pendingPlayRef.current = false;
              try {
                event.target.playVideo();
              } catch (err) {
                console.error('AWAARA Radio: queued play failed', err);
              }
            }
          },

          onAutoplayBlocked: () => {
            console.warn('AWAARA Radio: YouTube autoplay was blocked.');
            if (!mountedRef.current) return;
            setIsPlaying(false);
            setStatus('PAUSED');
          },

          onStateChange: (event: any) => {
            if (!mountedRef.current) return;

            syncMetadata(event.target);

            switch (event.data) {
              case -1:
                setStatus('UNSTARTED');
                setIsPlaying(false);
                stopTimeInterval();
                break;

              case 0:
                setStatus('ENDED');
                setIsPlaying(false);
                stopTimeInterval();
                try {
                  event.target.nextVideo();
                } catch {}
                break;

              case 1:
                setStatus('PLAYING');
                setIsPlaying(true);
                setErrorMessage(null);
                startTimeInterval();
                break;

              case 2:
                setStatus('PAUSED');
                setIsPlaying(false);
                stopTimeInterval();
                break;

              case 3:
                setStatus('BUFFERING');
                setIsPlaying(true);
                break;

              case 5:
                setStatus('CUED');
                setIsPlaying(false);
                stopTimeInterval();
                break;
            }
          },

          onError: (event: any) => {
            const code = event.data;
            console.error('AWAARA Radio: YouTube error code:', code);

            let message = `Track error (${code}). Skipping...`;
            if (code === 153) {
              message =
                'YouTube blocked this embedded player (Error 153). Trying next track...';
            } else if (code === 150 || code === 101) {
              message =
                'This video does not allow embedding. Trying next track...';
            } else if (code === 100) {
              message = 'This video is unavailable. Trying next track...';
            } else if (code === 2 || code === 5) {
              message = `Invalid YouTube video (${code}). Trying next track...`;
            }

            if (!mountedRef.current) return;
            setErrorMessage(message);
            setStatus('ERROR');
            setIsPlaying(false);
            stopTimeInterval();

            window.setTimeout(() => {
              if (!mountedRef.current) return;
              try {
                playerRef.current?.nextVideo?.();
                setErrorMessage(null);
              } catch {}
            }, 1200);
          },
        },
      });
    };

    loadYouTubeAPI()
      .then(() => {
        if (cancelled || !mountedRef.current) return;
        setIsApiLoaded(true);
        createPlayer();
      })
      .catch((err) => {
        console.error('AWAARA Radio: failed to load YouTube API', err);
        if (mountedRef.current) {
          setStatus('ERROR');
          setErrorMessage('Unable to load the radio player.');
        }
      });

    return () => {
      cancelled = true;
      mountedRef.current = false;
      pendingPlayRef.current = false;
      stopTimeInterval();

      try {
        playerRef.current?.destroy?.();
      } catch {}

      playerRef.current = null;
    };
  }, [containerId, syncMetadata, startTimeInterval, stopTimeInterval]);

  const play = useCallback(() => {
    pendingPlayRef.current = true;
    const player = playerRef.current;

    if (!player?.playVideo) return;

    try {
      player.playVideo();
      pendingPlayRef.current = false;
    } catch (err) {
      console.error('AWAARA Radio: playVideo failed', err);
    }
  }, []);

  const pause = useCallback(() => {
    pendingPlayRef.current = false;
    try {
      playerRef.current?.pauseVideo?.();
    } catch {}
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const next = useCallback(() => {
    try {
      setStatus('TUNING');
      playerRef.current?.nextVideo?.();
    } catch {}
  }, []);

  const previous = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    try {
      const cur = player.getCurrentTime?.() ?? currentTime;
      if (cur > 5) player.seekTo?.(0, true);
      else player.previousVideo?.();
    } catch {}
  }, [currentTime]);

  const seekTo = useCallback((seconds: number) => {
    try {
      playerRef.current?.seekTo?.(seconds, true);
      setCurrentTime(seconds);
    } catch {}
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    const clamped = Math.max(0, Math.min(100, newVolume));
    volumeRef.current = clamped;
    setVolumeState(clamped);

    try {
      playerRef.current?.setVolume?.(clamped);
      if (clamped === 0) {
        playerRef.current?.mute?.();
        setIsMuted(true);
      } else {
        playerRef.current?.unMute?.();
        setIsMuted(false);
      }
    } catch {}
  }, []);

  const toggleMute = useCallback(() => {
    const player = playerRef.current;
    if (!player) return;

    try {
      if (isMuted) {
        player.unMute?.();
        player.setVolume?.(volumeRef.current || 70);
        setIsMuted(false);
      } else {
        player.mute?.();
        setIsMuted(true);
      }
    } catch {}
  }, [isMuted]);

  const playTrackAtIndex = useCallback((index: number) => {
    pendingPlayRef.current = true;

    try {
      setStatus('TUNING');
      playerRef.current?.playVideoAt?.(index);
      pendingPlayRef.current = false;
    } catch {}
  }, []);

  return {
    isApiLoaded,
    isPlayerReady,
    isPlaying,
    status,
    currentTime,
    duration,
    volume,
    isMuted,
    currentTrackIndex,
    videoTitle,
    videoAuthor,
    errorMessage,
    play,
    pause,
    togglePlay,
    next,
    previous,
    seekTo,
    setVolume,
    toggleMute,
    playTrackAtIndex,
  };
}
