'use client';

import { useEffect, useRef } from 'react';

export default function ElevenLabsWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the ElevenLabs script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);

    // Create the widget element
    if (containerRef.current) {
      const widget = document.createElement('elevenlabs-convai');
      widget.setAttribute('agent-id', 'agent_4001k86e3t32ef9bm924j3ccg9kk');
      containerRef.current.appendChild(widget);
    }

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return <div ref={containerRef} />;
}

