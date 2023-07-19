// @ts-ignore
import axios from "./../../node_modules/axios/dist/esm/axios.js"
   
const INSTANCE = axios.create({
    baseURL: 'https://icanhazdadjoke.com',
    timeout: 1000,
    headers: {'Accept': 'application/json'},
    responseType: 'json'
});
const BTN_NEXT = document.getElementById("id-btn-next");
const P_JOKE = document.getElementById("id-p-joke")
const getJoke = async () => await INSTANCE.get("");
const nextJoke = () =>
    getJoke().then(res => P_JOKE!.innerText = `" ${res.data.joke} "`);

BTN_NEXT!.addEventListener("click", nextJoke)

