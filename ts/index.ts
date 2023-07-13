const AXIOS = require('axios').default;
const INSTANCE = AXIOS.create({
    baseURL: 'https://icanhazdadjoke.com/api',
    timeout: 1000,
    headers: {'Accept': 'application/json'},
    responseType: 'json'
});
const GETJOKE = async () => {
    try {
        const response = await INSTANCE.get();
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}

GETJOKE();



