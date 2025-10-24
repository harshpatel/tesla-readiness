import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'TeslaMR Dashboard';
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
        {/* Icon */}
        <div
          style={{
            display: 'flex',
            fontSize: 140,
            marginBottom: 40,
          }}
        >
          📊
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
          Your Dashboard
        </div>

        {/* Description */}
        <div
          style={{
            display: 'flex',
            fontSize: 36,
            color: '#6b7280',
            textAlign: 'center',
            maxWidth: 900,
          }}
        >
          Track your progress through the curriculum
        </div>

        {/* Stats Preview */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 50,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'white',
              padding: '20px 40px',
              borderRadius: 16,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ fontSize: 48 }}>✓</div>
            <div style={{ fontSize: 20, color: '#6b7280', marginTop: 10 }}>Content</div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'white',
              padding: '20px 40px',
              borderRadius: 16,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ fontSize: 48 }}>🔥</div>
            <div style={{ fontSize: 20, color: '#6b7280', marginTop: 10 }}>Streak</div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'white',
              padding: '20px 40px',
              borderRadius: 16,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ fontSize: 48 }}>📚</div>
            <div style={{ fontSize: 20, color: '#6b7280', marginTop: 10 }}>Sections</div>
          </div>
        </div>

        {/* Branding */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            display: 'flex',
            alignItems: 'center',
            gap: 15,
          }}
        >
          <div style={{ fontSize: 32 }}>🧲</div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 'bold',
              color: '#0A84FF',
            }}
          >
            TeslaMR
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

