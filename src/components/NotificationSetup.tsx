'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Smartphone } from 'lucide-react';
import {
  isNotificationSupported,
  requestAndSubscribe,
  getStoredSubscription,
  unsubscribe,
} from '@/lib/notifications';

type Status = 'idle' | 'granted' | 'denied' | 'unsupported' | 'loading';

function isIosNonStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  const isIos = /iphone|ipad|ipod/i.test(ua);
  const isStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return isIos && !isStandalone;
}

export default function NotificationSetup() {
  const [status, setStatus] = useState<Status>('idle');
  const [iosPrompt, setIosPrompt] = useState(false);

  useEffect(() => {
    if (!isNotificationSupported()) {
      setStatus('unsupported');
      return;
    }
    if (isIosNonStandalone()) {
      setIosPrompt(true);
      return;
    }
    if (Notification.permission === 'granted' && getStoredSubscription()) {
      setStatus('granted');
    } else if (Notification.permission === 'denied') {
      setStatus('denied');
    }
  }, []);

  const handleEnable = async () => {
    setStatus('loading');
    const result = await requestAndSubscribe();
    setStatus(result === 'unsupported' ? 'unsupported' : result);
  };

  const handleDisable = async () => {
    await unsubscribe();
    setStatus('idle');
  };

  if (iosPrompt) {
    return (
      <div className="card-dark p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-[#3b82f6]" />
          <h3 className="font-display text-base tracking-widest text-white">NOTIFICATIONS</h3>
        </div>
        <div className="text-xs text-[#71717a] leading-relaxed space-y-1">
          <p className="text-[#a1a1aa] font-medium">To get rest + workout alerts on iPhone:</p>
          <p>1. Tap the <span className="text-white">Share</span> button in Safari</p>
          <p>2. Tap <span className="text-white">&quot;Add to Home Screen&quot;</span></p>
          <p>3. Open from your home screen icon</p>
          <p>4. Return here and tap <span className="text-white">Enable Notifications</span></p>
        </div>
      </div>
    );
  }

  if (status === 'unsupported') {
    return null;
  }

  return (
    <div className="card-dark p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Bell className="w-4 h-4 text-[#3b82f6]" />
        <h3 className="font-display text-base tracking-widest text-white">NOTIFICATIONS</h3>
      </div>

      {status === 'granted' ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#22c55e]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] inline-block" />
            Enabled — rest &amp; workout alerts active
          </div>
          <button
            onClick={handleDisable}
            className="flex items-center justify-center gap-1.5 py-2 rounded-lg border border-white/[0.08] text-[#52525b] hover:text-[#a1a1aa] text-xs transition-colors"
          >
            <BellOff className="w-3 h-3" />
            Disable Notifications
          </button>
        </div>
      ) : status === 'denied' ? (
        <div className="text-xs text-[#ef4444]">
          Notifications blocked. Enable them in your browser settings.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-[#52525b]">
            Get notified when rest ends and workouts are logged.
          </p>
          <button
            onClick={handleEnable}
            disabled={status === 'loading'}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#3b82f6] text-white text-sm font-semibold hover:bg-[#2563eb] transition-colors disabled:opacity-60"
          >
            <Bell className="w-3.5 h-3.5" />
            {status === 'loading' ? 'Enabling…' : 'Enable Notifications'}
          </button>
        </div>
      )}
    </div>
  );
}
