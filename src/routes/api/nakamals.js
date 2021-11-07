let nakamals = [];

export const get = async () => {

    if (nakamals.length === 0) {
        try {
            const res = await fetch('https://nosdev-api.herokuapp.com/kavaworld/nakamals');
            const data = await res.json();
            nakamals = data;

        } catch (err) {
            return {
                body: {
                    error: "Error fetching data"
                }
            };
        };
    };

    return {
        body: {
            nakamals
        }
    };
};