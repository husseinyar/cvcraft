// src/app/api/stripe/create-checkout-session/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getAuth } from 'firebase-admin/auth';
import { initializeAdminApp } from '@/lib/firebase-admin-config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

initializeAdminApp();

const priceIds = {
    standard: process.env.STRIPE_PRICE_ID_STANDARD!,
    pro: process.env.STRIPE_PRICE_ID_PRO!,
};

export async function POST(request: NextRequest) {
    try {
        const { plan, userId } = await request.json();
        
        if (!userId) {
            return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
        }
        
        if (!plan || !priceIds[plan as keyof typeof priceIds]) {
            return NextResponse.json({ error: 'Invalid plan specified' }, { status: 400 });
        }

        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        let stripeCustomerId = userDoc.data()?.stripeCustomerId;

        // Create a Stripe customer if one doesn't exist
        if (!stripeCustomerId) {
            const firebaseUser = await getAuth().getUser(userId);
            const customer = await stripe.customers.create({
                email: firebaseUser.email,
                name: firebaseUser.displayName,
                metadata: { firebaseUID: userId },
            });
            stripeCustomerId = customer.id;
            await setDoc(userDocRef, { stripeCustomerId }, { merge: true });
        }
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            customer: stripeCustomerId,
            line_items: [{
                price: priceIds[plan as keyof typeof priceIds],
                quantity: 1,
            }],
            success_url: `${request.headers.get('origin')}/editor?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.headers.get('origin')}/pricing`,
             metadata: {
                firebaseUID: userId,
                plan,
            }
        });

        return NextResponse.json({ sessionId: session.id });

    } catch (error: any) {
        console.error('Stripe checkout session error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
