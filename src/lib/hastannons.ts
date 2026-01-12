'use server';

interface ExternalAd {
    title: string;
    price: number;
    category: string;
    subcategory?: string;
    breed?: string;
    gender?: string;
    birth_year?: number;
    height?: number;
    county?: string;
    municipality?: string;
    description?: string;
    images?: string[];
    external_link?: string;
    horse_name?: string;
}

interface ApiResponse {
    success: boolean;
    message?: string;
    error?: string;
    ad?: {
        id: string;
        url: string;
    };
}

export async function postToHastannons(adData: ExternalAd): Promise<ApiResponse> {
    let apiKey = process.env.HASTANNONS_API_KEY;

    if (!apiKey) {
        console.error('HASTANNONS_API_KEY is missing');
        return { success: false, error: 'Server configuration error: Missing API Key' };
    }

    // Sanitize key: remove whitespace and 'Bearer ' prefix if user included it
    apiKey = apiKey.trim();
    if (apiKey.toLowerCase().startsWith('bearer ')) {
        apiKey = apiKey.substring(7).trim();
    }

    console.log('Posting to Hastannons...');
    console.log('API Key exists:', !!apiKey);
    console.log('API Key start:', apiKey ? apiKey.substring(0, 5) + '...' : 'NONE');

    try {
        const response = await fetch('https://hastannons.se/api/external/ads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(adData),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error('Hastannons API error:', result);
            return {
                success: false,
                error: result.error || `API Error: ${response.status} ${response.statusText}`
            };
        }

        return result;
    } catch (error) {
        console.error('Failed to post to Hastannons:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown network error'
        };
    }
}
