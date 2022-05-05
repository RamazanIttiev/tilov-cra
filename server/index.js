import Stripe from 'stripe';
import dotenv from 'dotenv';
import express, { json } from 'express';

dotenv.config({ path: './.env' });

const stripe = new Stripe(process.env.PRIVATE_STRIPE_KEY, {
	apiVersion: '2020-08-27',
});

const app = express();

app.use(json());
app.use(express.static('public'));

const calculateOrderAmount = items => {
	return 10000 || items;
};

app.post('/create-payment-intent', async (req, res) => {
	const { items } = req.body;

	const paymentIntent = await stripe.paymentIntents.create({
		amount: calculateOrderAmount(items),
		currency: 'rub',
	});

	res.send({
		clientSecret: paymentIntent.client_secret,
	});
});

app.listen(4242, () => console.log('Node server listening on port 4242!'));
