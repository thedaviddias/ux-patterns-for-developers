import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title');

    // Get the language from the Accept-Language header or default to 'en'
    const acceptLanguage = req.headers.get('accept-language') || '';
    const lang = acceptLanguage.includes('fr') ? 'fr' : 'en';

    // Get the base URL from the request
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const host = req.headers.get('host') || 'localhost:3060';

    // Use language-specific path to the image
    const imageUrl = `${protocol}://${host}/${lang}/og/opengraph-image.png`;

    // Fetch the image
    const imageResponse = await fetch(imageUrl, {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const dataUrl = `data:${imageResponse.headers.get('content-type') || 'image/png'};base64,${base64Image}`;

    return new ImageResponse(
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#000',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {/* biome-ignore lint/performance/noImgElement: OG image generation requires img element */}
        <img
          src={dataUrl}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {title && (
          <div
            style={{
              position: 'relative',
              fontSize: 45,
              fontWeight: 'normal',
              color: 'white',
              textAlign: 'center',
              maxWidth: '80%',
              marginBottom: 150,
            }}
          >
            {title}
          </div>
        )}
      </div>,
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      }
    );
  } catch (e) {
    console.error('Error generating image:', e);
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    });
  }
}
