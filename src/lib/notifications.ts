const SUBSCRIPTION_KEY = 'push_subscription';

export function isNotificationSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array(Array.from(rawData, (c) => c.charCodeAt(0)));
}

export async function requestAndSubscribe(): Promise<'granted' | 'denied' | 'unsupported'> {
  if (!isNotificationSupported()) return 'unsupported';

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return 'denied';

    const registration = await navigator.serviceWorker.ready;
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) return 'unsupported';

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });

    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
    return 'granted';
  } catch {
    return 'denied';
  }
}

export async function sendPush(title: string, body: string, url: string = '/'): Promise<void> {
  if (!isNotificationSupported()) return;

  const stored = localStorage.getItem(SUBSCRIPTION_KEY);
  if (!stored) return;

  let subscription: PushSubscriptionJSON;
  try {
    subscription = JSON.parse(stored);
  } catch {
    return;
  }

  try {
    const res = await fetch('/api/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription, title, body, url }),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      if (data.expired) {
        localStorage.removeItem(SUBSCRIPTION_KEY);
      }
    }
  } catch {
    // fire-and-forget — silent failure
  }
}

export async function unsubscribe(): Promise<void> {
  if (!isNotificationSupported()) return;
  try {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.getSubscription();
    if (sub) await sub.unsubscribe();
    localStorage.removeItem(SUBSCRIPTION_KEY);
  } catch {
    // silent
  }
}

export function getStoredSubscription(): PushSubscriptionJSON | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(SUBSCRIPTION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}
