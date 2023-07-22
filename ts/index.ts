// @ts-ignore
import axios, { AxiosError, AxiosResponse } from "./../../node_modules/axios/dist/esm/axios.js"
 
type JokeScore = {
    joke: string,
    score: number,
    date: string
}
const reportJokes: Array<JokeScore> = [];
const axiosJokesInstance = axios.create({
    baseURL: 'https://icanhazdadjoke.com',
    timeout: 1000,
    headers: {'Accept': 'application/json'},
    responseType: 'json'
});
const axiosChuckInstance = axios.create({
    baseURL: 'https://api.chucknorris.io/jokes/random',
    timeout: 1000,
    headers: {'Accept': 'application/json'},
    responseType: 'json'
});
const btnNext = document.getElementById("id-btn-next");
const pJoke = document.getElementById("id-p-joke");
const btngroupStars = document.getElementById("id-btngroup-stars");
/**
 *  Sets the background star of the score buttons
 * @param idx Index of the button (0 - 2)
 * @param gold True if it s a golden star
 */
const setBg = (idx: number, gold: boolean) => {
    const btn = btngroupStars!.children[idx] as HTMLButtonElement;

    let url = "src/img/empty-star.svg";
    btn.classList.remove("gold")
    
    if (gold) {
        url = "src/img/gold-star.svg"
        btn.classList.add("gold")
    }

    btn.style.backgroundImage = `url("${url}")`
}
const reportStatus = () => {
    const last = reportJokes.slice(-1)[0]; // Last pushed score
    console.log(reportJokes, last.joke, last.score, last.date)
}
/**
 *  Sets the score of the last pushed JokeScore
 * @param score Clicked score (1 - 3)
 * @returns none
 */
const setScore = (score: number) => {
    const idx = reportJokes.length - 1;
    const oldScore = reportJokes[idx].score;
    
    if (score == oldScore) // Clicking over the last selected score, it is reset to zero
        score = 0;
 
    reportJokes[idx].score = score;
 
    if (score < oldScore) { // Sets empty stars from right to left
        for (let i = oldScore - 1; i > score - 1; i--)
            setBg(i, false);
        reportStatus();
        return
    }

    for (let i = oldScore; i < score; i++) // Sets golden stars from left to right
        setBg(i, true);

    reportStatus()
}
const resetStars = () => {
    for (let i = 0; i < 3; i++) // Sets all three empty stars
        setBg(i, false);
    reportStatus()
}
const getJoke = async () => {
    const rnd = Math.random() < 0.5;

    if (rnd)
        return await axiosJokesInstance.get("").then((res: AxiosResponse) => res.data.joke);

    return await axiosChuckInstance.get("").then((res: AxiosResponse) => res.data.value)
}
const nextJoke = () => {
    getJoke().then(joke => {
        const score: JokeScore = {
            joke: joke, 
            score: 0,
            date: (new Date()).toISOString()
        }

        reportJokes.push(score);
        pJoke!.innerText = `" ${joke} "`;
        btngroupStars?.classList.remove("d-none");
        resetStars();        
    });    
}

document.querySelectorAll('#id-btngroup-stars>button').forEach(item => {
    item.addEventListener('click', event => {
        const ev = <PointerEvent>event;
        const button = ev.target as HTMLButtonElement
        const score = parseInt(button.innerText); // The selected score is inside the button inner text

        setScore(score)
    })
})

btnNext!.addEventListener("click", nextJoke)

// Animation

const newPos = (svg: HTMLElement) => {
    const pos = Math.random() * 85; // 100% - 15%
    const side = Math.floor(Math.random() * 4)
    let top, left: number;

    switch (side) {
        case 0: top = 0; left = pos; break;
        case 1: top = pos; left = 85; break;
        case 2: top = 85; left = pos; break;
        default: top = pos; left = 0
    }

    svg.style.setProperty("--top", `${top}%`);
    svg.style.setProperty("--left", `${left}%`)
}

document.querySelectorAll(".cls-svg-little").forEach((v, k) => {
    const seg = 4 + k * .25;
    (v as HTMLElement).style.setProperty("transition", `all ${seg}s linear`);
    v.addEventListener('transitionend', (event) =>
        newPos(event.target as HTMLElement)
    , false )
    newPos(v as HTMLElement);
})
