// @ts-ignore
import axios from "../../node_modules/axios/dist/esm/axios.js"

const INSTANCE = axios.create({
    baseURL: 'https://icanhazdadjoke.com',
    timeout: 1000,
    headers: {'Accept': 'application/json'},
    responseType: 'json'
});
const BTN = document.getElementById("id-next");
const JOKE_DIV = document.getElementById("id-joke")
const getJoke = async () => await INSTANCE.get("");
const nextJoke = () =>
    getJoke().then(res => JOKE_DIV!.innerText = res.data.joke);

BTN!.addEventListener("click", nextJoke)

