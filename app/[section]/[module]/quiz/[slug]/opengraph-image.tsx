import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'TeslaMR Quiz';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Map quiz slugs to titles
  const quizTitles: Record<string, { title: string; icon: string }> = {
    'prefixes': { title: 'Prefixes Quiz', icon: '🔤' },
    'suffixes': { title: 'Suffixes Quiz', icon: '📝' },
    'roots': { title: 'Root Words Quiz', icon: '🌿' },
    'abbreviations': { title: 'Abbreviations Quiz', icon: '📋' },
    'positioning': { title: 'Patient Positioning Quiz', icon: '🧍' },
    'introduction-quiz': { title: 'Introduction to MRI Quiz', icon: '📝' },
  };

  const quizInfo = quizTitles[slug] || { title: 'Quiz', icon: '📝' };

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        {/* Quiz Badge */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '15px 40px',
            borderRadius: 50,
            fontSize: 28,
            color: 'white',
            marginBottom: 40,
            fontWeight: 'bold',
          }}
        >
          📝 QUIZ
        </div>

        {/* Icon */}
        <div
          style={{
            display: 'flex',
            fontSize: 140,
            marginBottom: 40,
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
          }}
        >
          {quizInfo.icon}
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 64,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 30,
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        >
          {quizInfo.title}
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: 'flex',
            fontSize: 32,
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
          }}
        >
          Test your knowledge with interactive questions
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
              color: 'white',
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

