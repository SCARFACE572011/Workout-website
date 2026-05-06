import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';

const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
const vapidEmail = process.env.VAPID_EMAIL || 'mailto:admin@example.com';

if (vapidPublic && vapidPrivate) {
  webpush.setVapidDetails(vapidEmail, vapidPublic, vapidPrivate);
}

export async function POST(req: NextRequest) {
  if (!vapidPublic || !vapidPrivate) {
    return NextResponse.json({ error: 'VAPID keys not configured' }, { status: 503 });
  }

  let body: { subscription: webpush.PushSubscription; title: string; body: string; url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { subscription, title, body: msgBody, url = '/' } = body;
  if (!subscription?.endpoint) {
    return NextResponse.json({ error: 'Missing subscription' }, { status: 400 });
  }

  const payload = JSON.stringify({ title, body: msgBody, url });

  try {
    await webpush.sendNotification(subscription, payload);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const statusCode = (err as { statusCode?: number }).statusCode;
    if (statusCode === 410) {
      return NextResponse.json({ expired: true }, { status: 200 });
    }
    return NextResponse.json({ error: 'Push failed' }, { status: 500 });
  }
}
