// @ts-ignore
import axios from "./../../node_modules/axios/dist/esm/axios.js"

const axiosLocationInstance = axios.create({
    baseURL: 'https://www.mapquestapi.com/geocoding/v1/reverse?key=9LdL4XzbV7CKqyj7YvT6NsXHjoz8xj2a&outFormat=json&thumbMaps=false',
    timeout: 1000,
    headers: {'Accept': 'application/json'},
    responseType: 'json'
});
const axiosWeatherInstance = axios.create({
    baseURL: 'https://www.el-tiempo.net/api/json/v2/provincias',
    timeout: 1000,
    headers: {'Accept': 'application/json'},
    responseType: 'json'
});
const getLocation = async (lat: number, lng: number) => await axiosLocationInstance.get(`&location=${lat}%2C${lng}`);
const getProvinces = async () => await axiosWeatherInstance.get();
const getCities = async () => await axiosWeatherInstance.get(`/${provinceCode}/municipios`);
const getWeather = async () => await axiosWeatherInstance.get(`/${provinceCode}/municipios/${cityCode}`);
const h6Location = document.getElementById("id-h6-location");
const h6Weather = document.getElementById("id-h6-weather");
let province = "";
let provinceCode = "00";
let city = "";
let cityCode = "00000";
let location = "";
let stateSky = "";
let temp = "";
let wetness = "";
let wind = "";
let rain = "";

navigator.geolocation.getCurrentPosition(
    pos => getLocation(pos.coords.latitude, pos.coords.longitude)
    //pos => getLocation(500.833333333333, -2.75)
    .then(res => {
        province = res.data.results[0].locations[0]?.adminArea4.toUpperCase() ?? "";
        city = res.data.results[0].locations[0]?.adminArea5.toUpperCase() ?? "";
        return getProvinces()
        
    })
    .then(res => {
        const provincesData: Array<{CODPROV: string, NOMBRE_PROVINCIA: string}> = res.data.provincias;
        const provinces = provincesData.map(v => ({cod: v.CODPROV, name: v.NOMBRE_PROVINCIA.toUpperCase()}));
        const provinceObject = provinces.find(v => v.name.match(new RegExp(`.*${province}.*`)) );
        provinceCode = province == "" ? "00" : (provinceObject?.cod ?? "00");
        return getCities()
    })
    .then(res => {
        console.log("RES", province, provinceCode, city, cityCode, res.data.municipios);
        const citiesData: Array<{CODIGOINE: string, NOMBRE: string}> = 
            Object.values(res.data.municipios);
        const cities = citiesData.map(v => ({cod: v.CODIGOINE.slice(0, 5), name: v.NOMBRE.toUpperCase()}));
        const htmlCity = city.replaceAll("'", "&#39;")
        const cityObject = cities.find(v => v.name.match(new RegExp(`.*${htmlCity}.*`)) );
        cityCode = city == "" ? "00000" : (cityObject?.cod ?? "00000");
        return getWeather()
    })
    .then(res => {
        location = res.data.metadescripcion;
        stateSky = res.data.stateSky.description;
        temp = `${res.data.temperatura_actual}º (max: ${res.data.temperaturas.max}, min: ${res.data.temperaturas.min})`
        wetness = res.data.humedad + "%";
        wind = res.data.viento + "km/h";
        rain = res.data.lluvia + "%";

        h6Location!.innerHTML = location;
        h6Weather!.innerText = `${stateSky}. ${temp}. Humedad: ${wetness}. Viento: ${wind}. Posibilidad de lluvia: ${rain}`
    }), 
    err => console.log("ERR", err), 
    {maximumAge: 60000, timeout: 10000, enableHighAccuracy: true});
