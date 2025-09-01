import { NextResponse } from 'next/server';
import { z } from 'zod';

const subscribeSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  groups: z.array(z.string()).optional(),
});

const API_BASE = 'https://connect.mailerlite.com/api';

interface MailerliteSubscriber {
  email: string;
  fields?: Record<string, unknown>;
  groups?: string[];
}

interface MailerliteErrorResponse {
  errors?: {
    email?: string[];
    [key: string]: string[] | undefined;
  };
  message?: string;
}

interface MailerliteSuccessResponse {
  data?: {
    id: string;
    email: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationResult = subscribeSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }

    const { email, groups } = validationResult.data;

    if (!process.env.MAILERLITE_API_KEY) {
      console.error('MAILERLITE_API_KEY is not configured');
      return NextResponse.json(
        { success: false, message: 'Newsletter service not configured. Please try again later.' },
        { status: 503 }
      );
    }

    const requestBody: MailerliteSubscriber = {
      email,
      fields: {},
    };

    // Use default group IDs from environment or provided groups
    const groupIds =
      groups ||
      process.env.MAILERLITE_GROUP_IDS?.split(',')
        .map((id) => id.trim())
        .filter(Boolean);
    if (groupIds && groupIds.length > 0) {
      requestBody.groups = groupIds;
    }

    const response = await fetch(`${API_BASE}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    // Check if it's a successful response (200 or 201)
    if (response.ok) {
      const result = (await response.json()) as MailerliteSuccessResponse;

      return NextResponse.json({
        success: true,
        message: 'Successfully subscribed to the newsletter! Check your email for confirmation.',
        subscriber: {
          id: result.data?.id || '',
          email: result.data?.email || email,
          status: result.data?.status || 'active',
          createdAt: result.data?.created_at || new Date().toISOString(),
          updatedAt: result.data?.updated_at || new Date().toISOString(),
        },
      });
    }

    // Handle error responses
    const errorText = await response.text();
    let errorMessage = 'Failed to subscribe to newsletter. Please try again.';

    if (response.status === 422) {
      try {
        const errorData = JSON.parse(errorText) as MailerliteErrorResponse;

        // Check for specific error messages
        const emailErrors = errorData.errors?.email;
        if (emailErrors && emailErrors.length > 0 && emailErrors[0]) {
          const firstError = emailErrors[0];
          const errorString = firstError.toLowerCase();

          if (errorString.includes('unsubscribed')) {
            errorMessage =
              'This email was previously unsubscribed. Please contact support to reactivate.';
          } else if (
            errorString.includes('already exists') ||
            errorString.includes('already subscribed')
          ) {
            errorMessage = "You're already subscribed! Check your inbox for our newsletters.";
          } else if (errorString.includes('invalid')) {
            errorMessage = 'Please enter a valid email address.';
          } else {
            errorMessage = firstError; // Use the actual error message from API
          }
        }
      } catch (parseError) {
        console.error('Failed to parse Mailerlite error:', parseError);
      }
    } else if (response.status === 401) {
      console.error('Invalid Mailerlite API key');
      errorMessage = 'Newsletter service configuration error. Please contact support.';
    } else if (response.status === 429) {
      errorMessage = 'Too many requests. Please try again in a few minutes.';
    }

    console.error(`Mailerlite API error (${response.status}):`, errorText);

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: response.status === 422 ? 400 : response.status }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);

    // Check if it's a network error
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { success: false, message: 'Network error. Please check your connection and try again.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
