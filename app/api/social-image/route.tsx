import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';
import QRCode from 'qrcode';

const PLATFORM_SIZES = {
  instagram: { width: 1080, height: 1080 },
  twitter: { width: 1200, height: 675 },
  linkedin: { width: 1200, height: 627 },
};

// Load Google Font with specific weight
async function loadGoogleFont(fontFamily: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${fontFamily}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url, { next: { revalidate: 86400 } })).text();

  // Extract the font URL from the CSS - more flexible pattern
  const resource = css.match(/src:\s*url\(([^)]+)\)\s*format\(['"](woff2?|opentype|truetype)['"]\)/);

  if (resource?.[1]) {
    const fontUrl = resource[1].replace(/['"]/g, ''); // Remove any quotes from the URL
    const response = await fetch(fontUrl, { next: { revalidate: 86400 } });
    if (response.status === 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error(`Failed to load font: ${fontFamily} ${weight}`);
}

export async function POST(request: NextRequest) {
  try {
    const { text, platform = 'instagram', patternName = '', pageUrl = '' } = await request.json();

    if (!text || text.length > 500) {
      return new Response('Invalid text', { status: 400 });
    }

    const size =
      PLATFORM_SIZES[platform as keyof typeof PLATFORM_SIZES] || PLATFORM_SIZES.instagram;

    // Clean pattern name for display
    const cleanPatternName = patternName
      .replace(' | UX Patterns for Devs', '')
      .replace(' - UX Patterns for Developers', '');

    // Use the actual page URL or construct a fallback
    const qrUrl = pageUrl || `https://uxpatterns.dev`;

    // Generate QR code as SVG string
    let qrCodeDataUrl = '';
    try {
      const svgString = await QRCode.toString(qrUrl, {
        type: 'svg',
        width: 100, // Made smaller per user request
        margin: 1,
        color: {
          dark: '#0a0a0a',
          light: '#ffffff',
        },
      });
      // Convert SVG string to data URL
      qrCodeDataUrl = `data:image/svg+xml;base64,${Buffer.from(svgString).toString('base64')}`;
    } catch (err) {
      console.error('QR generation failed:', err);
    }

    // Prepare all text for font loading
    const allText = `${cleanPatternName}${text}UX Patterns for Developersuxpatterns.devScan for full pattern`;

    // Load Poppins fonts with different weights
    const [poppins300, poppins400, poppins500, poppins700, poppins800] = await Promise.all([
      loadGoogleFont('Poppins', 300, allText),
      loadGoogleFont('Poppins', 400, allText),
      loadGoogleFont('Poppins', 500, allText),
      loadGoogleFont('Poppins', 700, allText),
      loadGoogleFont('Poppins', 800, allText),
    ]);

    return new ImageResponse(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          padding: platform === 'instagram' ? '80px' : '60px',
          fontFamily: 'Poppins',
        }}
      >
        {/* Pattern Name at Top */}
        {cleanPatternName && (
          <div
            style={{
              fontSize: platform === 'instagram' ? '48px' : '42px',
              fontWeight: 300,
              color: '#667eea',
              textAlign: 'center',
              letterSpacing: '0.02em',
              fontFamily: 'Poppins',
              textTransform: 'capitalize',
            }}
          >
            {cleanPatternName}
          </div>
        )}

        {/* Quote Section */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '85%',
            flex: 1,
          }}
        >
          {/* Text Content */}
          <div
            style={{
              fontSize: platform === 'instagram' ? '64px' : '52px',
              color: '#0a0a0a',
              textAlign: 'center',
              lineHeight: 1.1,
              fontFamily: 'Poppins',
              letterSpacing: '-0.02em',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {(() => {
              // Parse text with ** markers for bold
              const parts = text.split(/(\*\*.*?\*\*)/g);
              return parts.map((part, index) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  // Bold text
                  return (
                    <span
                      key={index}
                      style={{
                        fontWeight: 800,
                        fontFamily: 'Poppins',
                        color: '#0a0a0a',
                      }}
                    >
                      {part.slice(2, -2)}
                    </span>
                  );
                } else {
                  // Regular text
                  return (
                    <span
                      key={index}
                      style={{
                        fontWeight: 500,
                        fontFamily: 'Poppins',
                        color: '#0a0a0a',
                      }}
                    >
                      {part}
                    </span>
                  );
                }
              });
            })()}
          </div>

        </div>

        {/* Website, Domain and QR Code at Bottom */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            width: '100%',
            gap: '40px',
          }}
        >
          {/* Text section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '4px',
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: '24px',
                color: '#8b8b8b',
                fontWeight: 400,
                fontFamily: 'Poppins',
                letterSpacing: '0',
              }}
            >
              UX Patterns for Developers
            </div>
            <div
              style={{
                fontSize: '48px',
                color: '#0a0a0a',
                fontWeight: 800,
                fontFamily: 'Poppins',
                letterSpacing: '-0.03em',
                lineHeight: 1,
              }}
            >
              uxpatterns.dev
            </div>
          </div>

          {/* QR Code */}
          {qrCodeDataUrl && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <img
                src={qrCodeDataUrl}
                width="100"
                height="100"
                style={{
                  backgroundColor: 'white',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '2px solid #e5e5e5',
                }}
              />
              <div
                style={{
                  fontSize: '12px',
                  color: '#a0a0a0',
                  fontWeight: 500,
                  fontFamily: 'Poppins, system-ui, -apple-system, sans-serif',
                  textAlign: 'center',
                }}
              >
                Scan for full pattern
              </div>
            </div>
          )}
        </div>
      </div>,
      {
        ...size,
        fonts: [
          {
            name: 'Poppins',
            data: poppins300,
            weight: 300,
            style: 'normal',
          },
          {
            name: 'Poppins',
            data: poppins400,
            weight: 400,
            style: 'normal',
          },
          {
            name: 'Poppins',
            data: poppins500,
            weight: 500,
            style: 'normal',
          },
          {
            name: 'Poppins',
            data: poppins700,
            weight: 700,
            style: 'normal',
          },
          {
            name: 'Poppins',
            data: poppins800,
            weight: 800,
            style: 'normal',
          },
        ],
      }
    );
  } catch (error) {
    console.error('Error generating social image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
