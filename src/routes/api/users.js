export const get = async () => {

    let users = []

        try {
            const res = await fetch('https://nosdev-api.herokuapp.com/kavaworld/users');
            users = await res.json();

        } catch (err) {
            return {
                body: {
                    error: "Error fetching data"
                }
            };
        };

    return {
        body: {
            users
        }
    };
};