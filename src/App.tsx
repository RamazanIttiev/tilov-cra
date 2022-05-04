import React from 'react';

export const App = () => {
	return (
		<form action="/create-checkout-session" method="POST">
			<button type="submit">Checkout</button>
		</form>
	);
};
