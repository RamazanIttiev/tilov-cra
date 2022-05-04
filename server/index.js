import dotenv from 'dotenv';

import cors from 'cors';
import Stripe from 'stripe';
import express from 'express';
import { PORT, YOUR_DOMAIN } from './utils.js';

const app = express();
dotenv.config({ path: './.env' });

const stripe = new Stripe(process.env.PRIVATE_STRIPE_KEY, {
	apiVersion: '2020-08-27',
});

app.use(cors());
app.use(express.static('public'));

app.post('/create-checkout-session', async (req, res) => {
	console.log(req);

	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price: 'price_1KsR75A3FxV88R1ixXh9pCBu',
				quantity: 1,
			},
		],
		mode: 'payment',
		success_url: `${YOUR_DOMAIN}?successful_payment`,
		cancel_url: `${YOUR_DOMAIN}?canceled_payment`,
	});

	return res.redirect(303, session.url);
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
