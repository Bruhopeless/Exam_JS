class WeatherService {
    constructor () {
        this.apikey = '94c4bfb018462346a32ab27a85023a88';
    }

    async currentWeather (lat, lon){
        let data = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apikey}`);
        data = await data.json();
        return data;
    }

    async forecastFiveDay (lat, lon) {
        let data = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${this.apikey}`);
        data = await data.json();
        return data;
    }

    async geolocation (findCity) {
        let data = await fetch (`http://api.openweathermap.org/geo/1.0/direct?q=${findCity}&limit=1&appid=${this.apikey}`);
        data = await data.json();
        return data;
    }

    async nearbyLocations (lat, lon) {
        let data = await fetch (`http://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=5&appid=${this.apikey}&units=metric`);
        data = await data.json();
        return data;
    }
}

class DayWeather {
    constructor (date, hourlyList) {
        let dateObj = new Date(date);
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        this.dayOfWeek = days[dateObj.getDay()];

        this.date = date;
        this.dateShort = date.split("2023-")[1];
        this.hourlyList = hourlyList;
    }

    getTemp() {
        return this.hourlyList[0].temp;
    }

    getForecast() {
        return this.hourlyList[0].forecast;
    }

    getIconWeather() {
        return this.hourlyList[0].iconWeather;
    }
}

class HourlyWeather {
    constructor (time, iconWeather, forecast, temp, realFeel, windSpeed, windWay) {
        this.time = time.split(":00")[0];
        this.iconWeather = iconWeather;
        this.forecast = forecast;
        this.temp = temp;
        this.realFeel = realFeel;
        this.windSpeed = windSpeed;
        this.windWay = windWay;
    }
}

class SameCommonWeather {
    constructor () {
        this.search = document.querySelector ('input');
        this.hideCont = document.querySelector ('.hide-cont');
        this.error = document.querySelector ('.error');
    }

    createInfo(list) {
        // возвращает массив дней
        let daysWeather = [];
        for (let i = 0; i < list.length; i++) {

            let date = list[i].dt_txt.split(' ')[0];
            let time = list[i].dt_txt.split(' ')[1];
            let iconWeather = list[i].weather[0].icon;
            let forecast = list[i].weather[0].description;
            let temp = list[i].main.temp;
            let realFeel = list[i].main.feels_like;
            let windSpeed = list[i].wind.speed;
            let windWay = list[i].wind.gust;

            let findDay = daysWeather.find(day => day.date === date);
            if (findDay === undefined) {
                let day = new DayWeather(date, []);
                daysWeather.push(day);
                findDay = day;
            }

            let hourly = new HourlyWeather(time, iconWeather, forecast, temp, realFeel, windSpeed, windWay);
            findDay.hourlyList.push(hourly);
        }
        return daysWeather.slice(0, 5);
    }

    errorMessage (data) {
        if(data.length == 0) {
            this.hideCont.style.display = 'none';
            this.error.style.display = 'block';

            this.error.innerHTML = `
                <div class="error-content">
                    <img src="img/error404.png" alt="error404">
                    <div>${this.search.value} could not be found.</div>
                    <div>Please enter a different location.</div>
                </div>
                `;
        }
        else if (data.length != 0){
            this.hideCont.style.display = 'block';
            this.error.style.display = 'none';
        }
    }

    createInfoHourlyWeather (date, resultWeekInfo) {
        let hourlyCont = document.querySelector ('.hourly-cont');
            let resultDay = resultWeekInfo.find(day => day.date === date);
            let resultHourly = resultDay.hourlyList.slice(0, 6);
            console.log(resultHourly)

            hourlyCont.innerHTML = `
            <div class="hourly-cont_mini">
                <div>${resultDay.dateShort}</div>
                <div></div>
                <div>Forecast</div>
                <div>Temp (°C)</div>
                <div>RealFeel</div>
                <div>Wind (m/s, way)</div>
            </div>`

        for (let i = 0; i < resultHourly.length; i++) {
                hourlyCont.innerHTML += `
                    <div class="hourly-cont_mini">
                        <div>${resultHourly[i].time}</div>
                        <div><img src="https://openweathermap.org/img/wn/${resultHourly[i].iconWeather}@2x.png" alt=""></div>
                        <div>${resultHourly[i].forecast}</div>
                        <div>${parseInt(resultHourly[i].temp)}°</div>
                        <div>${parseInt(resultHourly[i].realFeel)}°</div>
                        <div>${parseInt(resultHourly[i].windSpeed)} m/s, ${parseInt(resultHourly[i].windWay)}</div>
                    </div>
                `;
        }
    }
}