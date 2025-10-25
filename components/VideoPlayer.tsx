'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface VideoPlayerProps {
  videoUrl: string;
  userId: string;
  contentItemId: string;
  isCompleted: boolean;
}

export default function VideoPlayer({ videoUrl, userId, contentItemId, isCompleted }: VideoPlayerProps) {
  const router = useRouter();
  const [hasWatched, setHasWatched] = useState(isCompleted);
  const [isMarking, setIsMarking] = useState(false);

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Check if it's a direct video URL (e.g., .mp4, Supabase Storage)
  const isDirectVideo = (url: string) => {
    if (!url) return false;
    return url.includes('.mp4') || url.includes('.webm') || url.includes('.ogg') || url.includes('supabase.co/storage');
  };

  const videoId = getYouTubeId(videoUrl);
  const isDirectVideoUrl = isDirectVideo(videoUrl);

  const handleMarkComplete = async () => {
    setIsMarking(true);
    try {
      const response = await fetch('/api/content/mark-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          contentItemId,
          completed: true,
        }),
      });

      if (response.ok) {
        setHasWatched(true);
        router.refresh();
      } else {
        alert('Failed to mark as complete. Please try again.');
      }
    } catch (error) {
      console.error('Error marking video as complete:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsMarking(false);
    }
  };

  if (!videoId && !isDirectVideoUrl) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-12 text-center border border-gray-100">
        <div className="text-6xl mb-4">📹</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Video Coming Soon</h2>
        <p className="text-gray-600 dark:text-gray-400">The video for this lesson will be available shortly.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Video Player - YouTube or Direct Video */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
        {videoId ? (
          // YouTube Embed
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Video content"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          // Direct Video (MP4, Supabase Storage, etc.)
          <video
            className="absolute top-0 left-0 w-full h-full"
            controls
            controlsList="nodownload"
            preload="metadata"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {/* Mark as Complete Button */}
      {!hasWatched && (
        <div className="p-6 border-t border-gray-200 dark:border-slate-700">
          <button
            onClick={handleMarkComplete}
            disabled={isMarking}
            className="w-full py-3 px-6 bg-gradient-to-r from-[#0A84FF] to-[#0077ED] text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isMarking ? 'Marking Complete...' : 'Mark as Complete ✓'}
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-3">
            Click after watching the video to track your progress
          </p>
        </div>
      )}

      {hasWatched && (
        <div className="p-6 border-t border-gray-200 dark:border-slate-700 bg-green-50">
          <div className="flex items-center justify-center gap-2 text-green-700">
            <span className="text-2xl">✓</span>
            <span className="font-semibold">You've completed this video!</span>
          </div>
        </div>
      )}
    </div>
  );
}

