import React, { useEffect, useState } from 'react';
import { PUBLIC_KEY } from '../../../utils/utils';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentForm } from '../components/PaymentForm';
import { Appearance, loadStripe } from '@stripe/stripe-js';

import '../theme/payment.css';

const stripePromise = loadStripe(PUBLIC_KEY);

export const PaymentContainer = () => {
	const [message, setMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [clientSecret, setClientSecret] = useState('');

	const handleMessage = (text: string) => {
		setMessage(text);
	};

	const handleLoading = (loading: boolean) => {
		setIsLoading(loading);
	};

	useEffect(() => {
		fetch('/create-payment-intent', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ items: [{ id: '2121' }] }),
		})
			.then(res => res.json())
			.then(data => setClientSecret(data.clientSecret));
	}, []);

	const appearance: Appearance = {
		theme: 'flat',
	};

	const options = {
		clientSecret,
		appearance,
	};

	return (
		<div>
			{clientSecret && (
				<Elements options={options} stripe={stripePromise}>
					<PaymentForm
						message={message}
						isLoading={isLoading}
						handleMessage={handleMessage}
						handleLoading={handleLoading}
					/>
				</Elements>
			)}
		</div>
	);
};
