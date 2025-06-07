# Webhooks

Stripe webhooks let your application receive real-time notifications when events occur in your account. Each webhook event contains the API version at which it was generated; this repository uses `2023-10-16` as the default Stripe API version. The events delivered to your endpoint follow the format defined by that version. 

The most common events include `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.succeeded`, and `charge.refunded`. Depending on the products you use, you might also handle subscription lifecycle events like `customer.subscription.created`, `invoice.paid`, or `invoice.payment_failed`. Connect platforms see additional events such as `account.updated` or `transfer.paid`. A full list is available in the [Stripe documentation](https://docs.stripe.com/events/types), but it is important to filter and handle only the events your integration relies on. 

When setting up your webhook endpoint, specify the latest version in the Stripe Dashboard to ensure your code interprets the payload consistently. Webhook objects include an `api_version` field that tells you what version generated the event. If you upgrade your API version, test your webhooks thoroughly to catch any payload changes. 

Handle events using code similar to:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SK!, { apiVersion: '2023-10-16' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sig = req.headers['stripe-signature'] as string;
  const event = stripe.webhooks.constructEvent(req.body, sig, process.env.WEBHOOK_SECRET!);
  console.log('Received event', event.type);
  logEvent(event); // custom log helper

  switch (event.type) {
    case 'payment_intent.succeeded':
      // fulfill order
      break;
    case 'invoice.payment_failed':
      // notify customer
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  res.json({ received: true });
}
```

Logging webhooks is essential for debugging and auditing. This repository directs logs to the `logs/stripe.log` file using a helper that appends JSON entries with timestamps. Ensure your webhook handler captures the entire event object so you can replay or inspect it later. Also monitor the response status your endpoint returns; Stripe interprets any non-2xx status as a failure and will retry delivery based on its backoff strategy. 

To test locally, use the Stripe CLI to forward events to your development environment. Run `stripe listen --forward-to localhost:3000/api/webhooks` and trigger events with `stripe trigger payment_intent.succeeded`. These tools allow you to verify that your code handles events correctly and that your logging works before deploying to production.

