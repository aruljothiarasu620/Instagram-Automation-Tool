import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';

// Helper to verify the Instagram Webhook Signature
function verifySignature(payload: string, signature: string, secret: string) {
    const expectedSignature = `sha1=${crypto.createHmac('sha1', secret).update(payload).digest('hex')}`;
    return signature === expectedSignature;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);

    const mode = searchParams.get('hub.mode');
    const token = searchParams.get('hub.verify_token');
    const challenge = searchParams.get('hub.challenge');

    // Check if a token and mode is in the query string of the request
    if (mode && token) {
        // Check the mode and token sent is correct
        if (mode === 'subscribe' && token === process.env.INSTAGRAM_WEBHOOK_SECRET) {
            // Respond with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            return new NextResponse(challenge, { status: 200 });
        } else {
            // Respond with '403 Forbidden' if verify tokens do not match
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
    }

    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
}

export async function POST(request: Request) {
    try {
        const signature = request.headers.get('x-hub-signature');
        const body = await request.text();

        // Validate signature (Optional but recommended)
        if (process.env.FACEBOOK_CLIENT_SECRET && signature) {
            const isValid = verifySignature(body, signature, process.env.FACEBOOK_CLIENT_SECRET);
            if (!isValid) {
                console.warn('Invalid signature received');
                // In production, you might want to uncomment the following line to block invalid requests:
                // return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
            }
        }

        const payload = JSON.parse(body);

        // Instagram/Facebook events
        if (payload.object === 'instagram') {
            // Iterate over each entry. There may be multiple if batched
            for (const entry of payload.entry) {
                // Iterate over each change
                for (const change of entry.changes) {
                    console.log(`Received webhook for field: ${change.field}`);
                    console.dir(change.value, { depth: null });

                    // Here we would process 'comments' or 'messages' or 'story_insights'
                    // E.g.
                    // if (change.field === 'comments') {
                    //   await handleNewComment(entry.id, change.value);
                    // }
                }
            }
            return NextResponse.json({ status: 'ok' }, { status: 200 });
        }

        return NextResponse.json({ status: 'not an instagram event' }, { status: 404 });
    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
