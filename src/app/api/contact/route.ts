import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with API key
// Ideally this should be in process.env.RESEND_API_KEY
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        // Basic validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Namn, e-post och meddelande krävs.' },
                { status: 400 }
            );
        }

        const data = await resend.emails.send({
            from: 'StallMB Kontakt <onboarding@resend.dev>', // Update this if you have a verified domain
            to: ['marinabengtsson@outlook.com'], // The owner's email
            replyTo: email,
            subject: `Nytt meddelande från ${name} via hemsidan`,
            text: `
Namn: ${name}
E-post: ${email}

Meddelande:
${message}
            `,
        });

        if (data.error) {
            return NextResponse.json({ error: data.error }, { status: 400 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json(
            { error: 'Ett internt fel inträffade.' },
            { status: 500 }
        );
    }
}
