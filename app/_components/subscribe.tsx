'use client';

import { usePlausible } from 'next-plausible';
import { useId, useState } from 'react';

export const SubscribeForm = () => {
  const plausible = usePlausible();
  const subscribeTitleId = useId();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
        plausible('newsletter-subscribe-success');
      } else {
        setStatus('error');
        setMessage(data.message || 'Failed to subscribe');
        plausible('newsletter-subscribe-error');
      }
    } catch (_error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
      plausible('newsletter-subscribe-error');
    }
  };

  return (
    <section
      className="flex flex-col mt-10 items-center justify-center py-10 px-4 text-center border border-neutral-400 dark:border-neutral-600 rounded-xl"
      aria-labelledby={subscribeTitleId}
    >
      <h2 id={subscribeTitleId} className="text-2xl font-bold mb-5 text-foreground">
        Get notified when new patterns are added!
      </h2>
      <p className="text-muted-foreground max-w-xl mx-auto mb-5">
        Subscribe to the UX Patterns for Devs newsletter for the latest updates and new pattern
        releases.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={status === 'loading'}
            className="plausible-event-name=Newsletter+Input+Focus flex-1 px-4 py-2 text-sm border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading' || !email}
            className="plausible-event-name=Newsletter+Subscribe+Click px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-400 disabled:cursor-not-allowed rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>

        {message && (
          <p
            className={`mt-3 text-sm ${status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
          >
            {message}
          </p>
        )}
      </form>
    </section>
  );
};
