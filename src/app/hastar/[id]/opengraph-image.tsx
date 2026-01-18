import { ImageResponse } from 'next/og';
import { getHorse } from '@/lib/data';

export const runtime = 'edge';

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
    const horse = await getHorse(params.id);

    if (!horse) {
        // Fallback if horse not found, essentially same as the main site image
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
                        backgroundColor: '#1a1a1a',
                        color: 'white',
                    }}
                >
                    <div style={{ fontSize: 60, fontWeight: 'bold' }}>STALLMB</div>
                </div>
            ),
            { ...size }
        );
    }

    // Determine the display image
    // Ideally, if horse.images[0] is absolute, we use it. If relative, we might need to be careful.
    // Assuming the images are stored as simple paths.
    // In `next/og` (Edge), fetching external images (or even local public ones via full URL) works best if we have the URL.
    // Since we don't have the deployment URL easily here, we'll try to use the image but provide a clean textual fallback design
    // that looks great even without the photo if the fetch fails, or use `backgroundImage` style if supported.

    // Note: `backgroundImage` with `url()` is supported in Satori/ImageResponse.
    // We need an absolute URL for the image. 
    // For now, let's create a card design that focuses on the text details which are 100% reliable.

    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    backgroundColor: '#f5f5f5',
                }}
            >
                {/* Left Side: Info */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    width: '60%',
                    padding: '60px',
                    backgroundColor: 'white',
                }}>
                    <div style={{ fontSize: 32, fontWeight: 'bold', color: '#EAB308', marginBottom: 20 }}>
                        STALLMB
                    </div>

                    <div style={{ fontSize: 72, fontWeight: 900, color: '#1a1a1a', lineHeight: 1.1, marginBottom: 20 }}>
                        {horse.name}
                    </div>

                    <div style={{ display: 'flex', gap: '20px', fontSize: 30, color: '#4a4a4a', marginBottom: 40 }}>
                        <span>{horse.breed}</span>
                        <span>•</span>
                        <span>{horse.age}</span>
                    </div>

                    <div style={{
                        display: 'flex',
                        backgroundColor: '#f3f4f6',
                        padding: '15px 30px',
                        borderRadius: '50px',
                        fontSize: 24,
                        fontWeight: 'bold',
                        width: 'fit-content',
                        color: '#1a1a1a'
                    }}>
                        {/* Translate category slightly for nicer display */}
                        {horse.category === 'sale' ? 'TILL SALU' :
                            horse.category === 'breeding' ? 'AVEL' :
                                horse.category === 'youngster' ? 'UNGHÄST' :
                                    horse.category === 'foal' ? 'ÅRSFÖL' :
                                        horse.category.toUpperCase()}
                    </div>
                </div>

                {/* Right Side: Visual decoration */}
                <div style={{
                    display: 'flex',
                    width: '40%',
                    backgroundColor: '#1a1a1a',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    {/* Abstract decorative circles */}
                    <div style={{
                        position: 'absolute',
                        top: '-50px',
                        right: '-50px',
                        width: '300px',
                        height: '300px',
                        borderRadius: '50%',
                        backgroundColor: '#EAB308',
                        opacity: 0.1,
                    }} />
                    <div style={{
                        position: 'absolute',
                        bottom: '-100px',
                        left: '-50px',
                        width: '400px',
                        height: '400px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        opacity: 0.05,
                    }} />

                    {/* Logo/Icon center */}
                    <div style={{
                        display: 'flex',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        width: 150,
                        height: 150,
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '4px solid rgba(255,255,255,0.2)'
                    }}>
                        <span style={{ fontSize: 60, fontWeight: 'bold', color: 'white' }}>MB</span>
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
