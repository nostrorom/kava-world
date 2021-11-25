export const get = async () => {

    let posts = []

        try {
            const res = await fetch('https://nosdev-api.herokuapp.com/kavaworld/blogposts');
            posts = await res.json();

        } catch (err) {
            return {
                body: {
                    error: "Error fetching data"
                }
            };
        };

    return {
        body: {
            posts
        }
    };
};