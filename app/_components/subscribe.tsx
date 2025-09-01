'use client';

import { usePlausible } from 'next-plausible';
import { useId, useState } from 'react';

interface SubscribeFormProps {
  variant?: 'default' | 'inline';
}

export const SubscribeForm = ({ variant = 'default' }: SubscribeFormProps) => {
  const plausible = usePlausible();
  const subscribeTitleId = useId();
  const subscribeMessageId = useId();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    // Client-side validation
    if (!trimmedEmail) {
      setStatus('error');
      setMessage('Please enter a valid email');
      return;
    }

    // Basic email pattern validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      setStatus('error');
      setMessage('Please enter a valid email');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
        plausible(`newsletter-subscribe-success${variant === 'inline' ? '-inline' : ''}`);
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to subscribe');
        plausible(`newsletter-subscribe-error${variant === 'inline' ? '-inline' : ''}`);
      }
    } catch (_error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
      plausible(`newsletter-subscribe-error${variant === 'inline' ? '-inline' : ''}`);
    }
  };

  const isInline = variant === 'inline';

  return (
    <section
      className={
        isInline
          ? 'mt-12 mb-8 py-6 px-6 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-center'
          : 'flex flex-col mt-10 items-center justify-center py-10 px-4 text-center border border-neutral-400 dark:border-neutral-600 rounded-xl'
      }
      aria-labelledby={subscribeTitleId}
    >
      {isInline ? (
        <>
          <h3 id={subscribeTitleId} className="text-lg font-semibold mb-2 text-foreground">
            Stay updated with new patterns
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Get notified when new UX patterns are added to the collection.
          </p>
        </>
      ) : (
        <>
          <h2 id={subscribeTitleId} className="text-2xl font-bold mb-5 text-foreground">
            Get notified when new patterns are added!
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-5">
            Subscribe to the UX Patterns for Devs newsletter for the latest updates and new pattern
            releases.
          </p>
        </>
      )}

      <form
        onSubmit={handleSubmit}
        aria-busy={status === 'loading'}
        className={isInline ? 'w-full max-w-md mx-auto' : 'w-full max-w-md mx-auto'}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            name="email"
            autoComplete="email"
            inputMode="email"
            required
            disabled={status === 'loading'}
            className={`plausible-event-name=Newsletter+${isInline ? 'Inline+' : ''}Input+Focus flex-1 ${isInline ? 'px-3 py-1.5' : 'px-4 py-2'} text-sm border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50`}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`plausible-event-name=Newsletter+${isInline ? 'Inline+' : ''}Subscribe+Click ${isInline ? 'px-4 py-1.5' : 'px-6 py-2'} text-sm font-medium text-black bg-white hover:bg-gray-100 disabled:bg-neutral-400 disabled:cursor-not-allowed rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border border-neutral-300`}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>

        {message && (
          <output
            id={subscribeMessageId}
            aria-live="polite"
            className={`${isInline ? 'mt-2' : 'mt-3'} text-sm block ${status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
          >
            {message}
          </output>
        )}
      </form>
    </section>
  );
};
