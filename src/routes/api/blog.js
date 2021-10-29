let fetchedPosts = []

export const get = async () => {

    if (fetchedPosts.length === 0) {
        try {
            const res = await fetch('https://kava-world-api.herokuapp.com/blogposts');
            const data = await res.json();
            fetchedPosts = data;
            console.log('🀄', data.length)

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
            fetchedPosts
        }
    };
};