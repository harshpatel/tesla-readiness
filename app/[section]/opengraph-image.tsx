import { ImageResponse } from 'next/og';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const runtime = 'edge';

export const alt = 'TeslaMR Section';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  
  // Fetch section data
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );

  const { data: sectionData } = await supabase
    .from('sections')
    .select('title, description, icon')
    .eq('slug', section)
    .single();

  const title = sectionData?.title || 'Section';
  const description = sectionData?.description || 'MRI Training';
  const icon = sectionData?.icon || '📖';

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
          {icon}
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 64,
            fontWeight: 'bold',
            color: '#1a1a1a',
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            display: 'flex',
            fontSize: 32,
            color: '#6b7280',
            textAlign: 'center',
            maxWidth: 900,
          }}
        >
          {description}
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

