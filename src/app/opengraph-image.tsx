import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'StallMB - Connemara Uppfödning & Utbildning';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    // We can fetch fonts if needed, but for now we rely on system fonts for speed/simplicity
    // or web safety. Using a simple clean design.

    // Fetch the hero image to use as background
    // Ideally this should be an absolute URL, but for local/relative in Edge it can be tricky.
    // We will try to fetch it from the deployed URL or use a gradient if that fails or for local dev.
    // Because we can't easily get the absolute localhost URL in build time for local assets in `next/og` sometimes,
    // we'll design a nice graphical card that looks like the landing page.

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#000', // Dark background like the overlay
                    position: 'relative',
                }}
            >
                {/* Background Image Layer - using a gradient since fetching local static file in Edge can be complex without full URL */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(to bottom right, #3f3f2d, #1a1a1a)',
                        opacity: 0.8,
                    }}
                />

                {/* Content */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
                    {/* Logo imitation */}
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 40 }}>
                        <div style={{
                            display: 'flex',
                            borderRadius: '50%',
                            backgroundColor: 'white',
                            width: 80,
                            height: 80,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 20
                        }}>
                            {/* Simple Icon representation */}
                            <span style={{ fontSize: 40, fontWeight: 'bold', color: '#000' }}>MB</span>
                        </div>
                        <div style={{ display: 'flex', fontSize: 60, fontWeight: 'bold', color: 'white' }}>
                            STALL<span style={{ color: '#EAB308' }}>MB</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ fontSize: 70, fontWeight: 900, color: 'white', lineHeight: 1, marginBottom: 10 }}>
                            Kvalitet.
                        </div>
                        <div style={{ fontSize: 70, fontWeight: 900, color: '#EAB308', lineHeight: 1, marginBottom: 10 }}>
                            Passion.
                        </div>
                        <div style={{ fontSize: 70, fontWeight: 900, color: 'white', lineHeight: 1 }}>
                            Connemara.
                        </div>
                    </div>

                    <div style={{ marginTop: 40, fontSize: 24, color: '#e5e5e5' }}>
                        stallmb.com
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
