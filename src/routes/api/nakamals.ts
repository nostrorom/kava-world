export const GET = async () => {
	let nakamals = [];

	try {
		const res = await fetch('https://nosdev-api.herokuapp.com/kavaworld/nakamals');
		nakamals = await res.json();
	} catch (err) {
		return {
			body: {
				error: 'Error fetching data'
			}
		};
	}

	return {
		body: {
			nakamals
		}
	};
};
