export const GET = async () => {
	let reviews = [];

	try {
		const res = await fetch('https://nosdev-api.herokuapp.com/kavaworld/reviews');
		reviews = await res.json();
	} catch (err) {
		return {
			body: {
				error: 'Error fetching data'
			}
		};
	}

	return {
		body: {
			reviews
		}
	};
};
