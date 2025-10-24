import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'TeslaMR - MRI Technologist Curriculum';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #dbeafe, #ffffff, #f3e8ff)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        {/* Logo/Icon */}
        <div
          style={{
            display: 'flex',
            fontSize: 120,
            marginBottom: 40,
          }}
        >
          🧲
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontWeight: 'bold',
            color: '#1a1a1a',
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          TeslaMR
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            fontSize: 40,
            color: '#6b7280',
            textAlign: 'center',
            maxWidth: 800,
          }}
        >
          MRI Technologist Curriculum
        </div>

        {/* Description */}
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            color: '#9ca3af',
            marginTop: 30,
            textAlign: 'center',
            maxWidth: 900,
          }}
        >
          Interactive lessons, quizzes, and hands-on preparation
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

