import React, { FC, FormEvent } from 'react';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { PaymentStatus } from './PaymentStatus';

interface PaymentFormProps {
	message: string;
	isLoading: boolean;
	handleMessage: (text: string) => void;
	handleLoading: (loading: boolean) => void;
}

export const PaymentForm: FC<PaymentFormProps> = ({ message, isLoading, handleLoading, handleMessage }) => {
	const stripe = useStripe();
	const elements = useElements();

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		handleLoading(true);

		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: 'http://ramazz1g.beget.tech/',
			},
		});

		if (error.type === 'card_error' || error.type === 'validation_error') {
			error.message && handleMessage(error.message);
		} else {
			handleMessage('An unexpected error occurred.');
		}

		handleLoading(false);
	};

	return (
		<form id="payment-form" onSubmit={e => handleSubmit(e)}>
			<PaymentElement id="payment-element" />
			<button disabled={isLoading || !stripe || !elements} id="submit">
				<span id="button-text">{isLoading ? <div className="spinner" id="spinner"></div> : 'Pay now'}</span>
			</button>
			<PaymentStatus stripe={stripe} message={message} handleMessage={handleMessage} />
		</form>
	);
};
