/**
 * Format seconds into MM:SS format
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Parses raw YouTube video titles into clean Song Title and Artist/Movie info
 */
export function cleanTrackInfo(rawTitle: string, rawAuthor: string) {
  if (!rawTitle) {
    return {
      title: 'AWAARA Radio Stream',
      artist: rawAuthor || '90s Bollywood Classics',
    };
  }

  // Remove common YouTube noise like "(Full Song)", "[HD]", "| 4K Video", "Lyrical Video"
  let cleaned = rawTitle
    .replace(/\s*[\(\[](4K|HD|Full Song|Official Video|Audio|Lyrical|Video Song|High Quality|HQ|Remastered)[\)\]]/gi, '')
    .replace(/\s*\|.*$/, '')
    .trim();

  // Split by '-' or '–' if available
  const parts = cleaned.split(/[-–—]/);
  if (parts.length >= 2) {
    const titlePart = parts[0].trim();
    const artistPart = parts.slice(1).join(' - ').trim();
    return {
      title: titlePart,
      artist: artistPart || rawAuthor || '90s Nostalgia',
    };
  }

  return {
    title: cleaned,
    artist: rawAuthor || '90s Bollywood Classics',
  };
}
