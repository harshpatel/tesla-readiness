'use client';

import { useEffect, useRef } from 'react';

interface ElevenLabsWidgetProps {
  firstName?: string;
}

// Track if script has already been loaded globally
let scriptLoaded = false;

export default function ElevenLabsWidget({ firstName }: ElevenLabsWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Only load the script once globally
    if (!scriptLoaded) {
      const existingScript = document.querySelector('script[src*="elevenlabs"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
        script.async = true;
        script.type = 'text/javascript';
        document.body.appendChild(script);
        scriptLoaded = true;
      }
    }

    // Create the widget element with dynamic variables
    if (containerRef.current && !widgetRef.current) {
      const widget = document.createElement('elevenlabs-convai');
      widget.setAttribute('agent-id', 'agent_4001k86e3t32ef9bm924j3ccg9kk');
      
      // Add dynamic variables as JSON string
      if (firstName) {
        const dynamicVars = JSON.stringify({ user_name: firstName });
        widget.setAttribute('dynamic-variables', dynamicVars);
      }
      
      containerRef.current.appendChild(widget);
      widgetRef.current = widget;
    }

    return () => {
      // Cleanup widget on unmount
      if (widgetRef.current && containerRef.current && containerRef.current.contains(widgetRef.current)) {
        containerRef.current.removeChild(widgetRef.current);
        widgetRef.current = null;
      }
    };
  }, [firstName]);

  return <div ref={containerRef} />;
}

