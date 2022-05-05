import React, { FC, useEffect } from 'react';
import { Stripe } from '@stripe/stripe-js';

interface PaymentStatusProps {
	message: string;
	stripe: Stripe | null;
	handleMessage: (text: string) => void;
}

export const PaymentStatus: FC<PaymentStatusProps> = ({ stripe, message, handleMessage }) => {
	useEffect(() => {
		if (!stripe) {
			return;
		}

		const clientSecret = new URLSearchParams(window.location.search).get('payment_intent_client_secret');

		if (clientSecret) {
			stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
				switch (paymentIntent?.status) {
					case 'succeeded':
						handleMessage('Success! Payment received.');
						break;

					case 'processing':
						handleMessage("Payment processing. We'll update you when payment is received.");
						break;

					case 'requires_payment_method':
						// Redirect your user back to your payment page to attempt collecting
						// payment again
						handleMessage('Payment failed. Please try another payment method.');
						break;

					default:
						handleMessage('Something went wrong.');
						break;
				}
			});
		}
	}, [handleMessage, stripe]);

	return <div id="payment-message">{message}</div>;
};
