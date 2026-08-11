/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */


import { useYouTubeRadio } from './useYouTubeRadio';
import { NOSTALGIA_TRACKS } from './data/tracks';
import { cleanTrackInfo } from './utils/formatters';

import { Header } from './components/Header';
import { RadioDial } from './components/RadioDial';
import { CentralRadioDisplay } from './components/CentralRadioDisplay';
import { NowPlayingCard } from './components/NowPlayingCard';
import { PlaybackControls } from './components/PlaybackControls';
import { TracklistDrawer } from './components/TracklistDrawer';
import { MemoryCards } from './components/MemoryCards';
import { SleepTimerModal } from './components/SleepTimerModal';
import { Footer } from './components/Footer';

export default function App() {
  const containerId = 'awaara-yt-player';
  const [frequency, setFrequency] = useState(90.0);
  const [showVideo, setShowVideo] = useState(false);
  const [isTracklistOpen, setIsTracklistOpen] = useState(false);
  const [isSleepTimerOpen, setIsSleepTimerOpen] = useState(false);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('awaara_favorites');
      return saved ? JSON.parse(saved) : ['1', '3'];
    } catch (e) {
      return ['1', '3'];
    }
  });

  // Main YouTube Player hook
  const {
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
  } = useYouTubeRadio(containerId);

  // Save favorites to localStorage
  const handleToggleFavorite = useCallback((trackId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId];
      try {
        localStorage.setItem('awaara_favorites', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  // Sleep timer handler
  useEffect(() => {
    if (!sleepTimerMinutes) return;
    const timer = setTimeout(() => {
      pause();
      setSleepTimerMinutes(null);
      alert('AWAARA Radio: Sleep timer finished. Goodnight!');
    }, sleepTimerMinutes * 60 * 1000);

    return () => clearTimeout(timer);
  }, [sleepTimerMinutes, pause]);

  // Clean title & author or match with catalog
  const { cleanedTitle, cleanedArtist, matchedTrack } = useMemo(() => {
    // 1. Try index match from static catalog
    const staticTrack = NOSTALGIA_TRACKS[currentTrackIndex];

    // 2. Parse video title and author from YouTube API
    const parsed = cleanTrackInfo(videoTitle, videoAuthor);

    // 3. Check if parsed title matches any static catalog track by title
    const foundByTitle = NOSTALGIA_TRACKS.find(
      (t) =>
        videoTitle.toLowerCase().includes(t.title.toLowerCase()) ||
        t.title.toLowerCase().includes(parsed.title.toLowerCase())
    );

    const activeTrack = foundByTitle || staticTrack || null;

    return {
      cleanedTitle: parsed.title,
      cleanedArtist: parsed.artist,
      matchedTrack: activeTrack,
    };
  }, [videoTitle, videoAuthor, currentTrackIndex]);

  // Tune frequency dial
  const handleSelectFrequency = useCallback((freq: number) => {
    setFrequency(freq);
    // Frequency change effect
    const mappedIndex = Math.floor(((freq - 88.0) / (108.0 - 88.0)) * NOSTALGIA_TRACKS.length);
    const clampedIndex = Math.max(0, Math.min(NOSTALGIA_TRACKS.length - 1, mappedIndex));
    playTrackAtIndex(clampedIndex);
  }, [playTrackAtIndex]);

  return (
    <div className="min-h-screen bg-paper-texture paper-overlay text-[#2C221E] px-4 py-6 sm:px-8 flex flex-col items-center justify-between selection:bg-[#E2D5C3]">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center flex-1">
        {/* Header */}
        <Header
          frequency={frequency}
          isPlaying={isPlaying}
          onOpenTracklist={() => setIsTracklistOpen(true)}
          onOpenSleepTimer={() => setIsSleepTimerOpen(true)}
          showVideo={showVideo}
          onToggleShowVideo={() => setShowVideo((prev) => !prev)}
          favoriteCount={favorites.length}
          onOpenFavorites={() => setIsTracklistOpen(true)}
        />

        {/* Central Radio Unit */}
        <CentralRadioDisplay
          track={matchedTrack}
          isPlaying={isPlaying}
          status={status}
          frequency={frequency}
          showVideo={showVideo}
          onToggleVideo={() => setShowVideo((prev) => !prev)}
          containerId={containerId}
          tuningState={status === 'TUNING'}
        />

        {/* Radio Dial Scale */}
        <RadioDial
          currentFrequency={frequency}
          onSelectFrequency={handleSelectFrequency}
          isPlaying={isPlaying}
        />

        {/* Now Playing Card */}
        <NowPlayingCard
          title={cleanedTitle}
          artist={cleanedArtist}
          matchedTrack={matchedTrack}
          currentTime={currentTime}
          duration={duration}
          status={status}
          errorMessage={errorMessage}
          onSeek={seekTo}
        />

        {/* Playback Controls */}
        <PlaybackControls
          isPlaying={isPlaying}
          status={status}
          volume={volume}
          isMuted={isMuted}
          onTogglePlay={togglePlay}
          onNext={next}
          onPrevious={previous}
          onVolumeChange={setVolume}
          onToggleMute={toggleMute}
        />

        {/* 90s Memory Notes */}
        <MemoryCards />
      </div>

      {/* Footer */}
      <Footer />

      {/* Tracklist Drawer */}
      <TracklistDrawer
        isOpen={isTracklistOpen}
        onClose={() => setIsTracklistOpen(false)}
        currentTrackIndex={currentTrackIndex}
        isPlaying={isPlaying}
        onSelectTrack={playTrackAtIndex}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Sleep Timer Modal */}
      <SleepTimerModal
        isOpen={isSleepTimerOpen}
        onClose={() => setIsSleepTimerOpen(false)}
        activeMinutes={sleepTimerMinutes}
        onSetTimer={setSleepTimerMinutes}
      />
    </div>
  );
}
