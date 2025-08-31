// src/app/api/stripe/webhook/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserRole } from '@/types';

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

export async function POST(request: NextRequest) {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature')!;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
        console.error(`❌ Error message: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (relevantEvents.has(event.type)) {
        try {
            switch (event.type) {
                case 'checkout.session.completed': {
                    const session = event.data.object as Stripe.Checkout.Session;
                    const firebaseUID = session.metadata?.firebaseUID;
                    const plan = session.metadata?.plan as UserRole;
                    
                    if (!firebaseUID || !plan) {
                        throw new Error('Missing metadata from checkout session.');
                    }

                    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
                    
                    const userDocRef = doc(db, 'users', firebaseUID);
                    await setDoc(userDocRef, { role: plan }, { merge: true });

                    const subscriptionDocRef = doc(db, 'users', firebaseUID, 'subscriptions', subscription.id);
                    await setDoc(subscriptionDocRef, {
                        id: subscription.id,
                        planId: subscription.items.data[0].price.id,
                        status: subscription.status,
                        current_period_end: Timestamp.fromMillis(subscription.current_period_end * 1000),
                    });
                    break;
                }
                case 'customer.subscription.updated': {
                    const subscription = event.data.object as Stripe.Subscription;
                    const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
                    const firebaseUID = customer.metadata.firebaseUID;
                    
                    const subscriptionDocRef = doc(db, 'users', firebaseUID, 'subscriptions', subscription.id);
                    await setDoc(subscriptionDocRef, {
                        status: subscription.status,
                        current_period_end: Timestamp.fromMillis(subscription.current_period_end * 1000),
                    }, { merge: true });
                    break;
                }
                 case 'customer.subscription.deleted': {
                    const subscription = event.data.object as Stripe.Subscription;
                    const customer = await stripe.customers.retrieve(subscription.customer as string) as Stripe.Customer;
                    const firebaseUID = customer.metadata.firebaseUID;

                    // Revert user to the 'user' (free) role
                    const userDocRef = doc(db, 'users', firebaseUID);
                    await setDoc(userDocRef, { role: 'user' }, { merge: true });
                    
                    const subscriptionDocRef = doc(db, 'users', firebaseUID, 'subscriptions', subscription.id);
                    await setDoc(subscriptionDocRef, { status: subscription.status }, { merge: true });
                    break;
                }
                default:
                    throw new Error('Unhandled relevant event!');
            }
        } catch (error) {
            console.error(error);
            return NextResponse.json({ error: 'Webhook handler failed. View logs.' }, { status: 400 });
        }
    }

    return NextResponse.json({ received: true });
}
