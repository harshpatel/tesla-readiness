import { ImageResponse } from 'next/og';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const runtime = 'edge';

export const alt = 'TeslaMR Module';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ section: string; module: string }> }) {
  const { section, module } = await params;
  
  // Fetch module data
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
    .select('id, title')
    .eq('slug', section)
    .single();

  const { data: moduleData } = await supabase
    .from('modules')
    .select('title, description, icon')
    .eq('slug', module)
    .eq('section_id', sectionData?.id)
    .single();

  const title = moduleData?.title || 'Module';
  const description = moduleData?.description || 'MRI Training Module';
  const icon = moduleData?.icon || '📚';
  const sectionTitle = sectionData?.title || '';

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
        {/* Breadcrumb */}
        <div
          style={{
            display: 'flex',
            fontSize: 24,
            color: '#9ca3af',
            marginBottom: 20,
          }}
        >
          {sectionTitle}
        </div>

        {/* Icon */}
        <div
          style={{
            display: 'flex',
            fontSize: 120,
            marginBottom: 30,
          }}
        >
          {icon}
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            fontSize: 56,
            fontWeight: 'bold',
            color: '#1a1a1a',
            marginBottom: 20,
            textAlign: 'center',
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            display: 'flex',
            fontSize: 28,
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

