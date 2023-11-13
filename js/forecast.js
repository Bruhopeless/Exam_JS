/**
 * Сайт для прогноза погоды
 * 
 * Ключ
 * 94c4bfb018462346a32ab27a85023a88
 * 
 */

class Weather {
    constructor () {
        this.api = new WeatherService ();
        this.sameCommon = new SameCommonWeather ();

        this.search = document.querySelector ('input');

        navigator.geolocation.getCurrentPosition((position) => 
                        this.init(position.coords.latitude,position.coords.longitude), 
                        () => this.init(46.479891531954095, 30.71441455988959));

        this.search.addEventListener ('keypress', (e) => {

                if (e.key === "Enter") {
                    e.preventDefault();
                    this.api.geolocation(this.search.value)
                    .then(data => {

                        this.sameCommon.errorMessage (data);
                        if(data.length == 0) return;

                        this.api.forecastFiveDay(data[0].lat, data[0].lon)
                            .then(data => {
                                let resultWeekInfo = this.sameCommon.createInfo(data.list);
                                this.createWeekWeather(resultWeekInfo);
                                this.sameCommon.createInfoHourlyWeather(resultWeekInfo[0].date, resultWeekInfo);
                            });
                    });
            }
        });
    }

    init (positionLat, positionLon) {
        this.api.forecastFiveDay(positionLat, positionLon)
        .then(data => {
            console.log(data);
            let resultWeekInfo = this.sameCommon.createInfo(data.list);
            this.createWeekWeather(resultWeekInfo);
            this.sameCommon.createInfoHourlyWeather(resultWeekInfo[0].date, resultWeekInfo);
        });
    }

    createWeekWeather(resultWeekInfo) {
        let weekWeather = document.querySelector ('.week-weather');
        weekWeather.innerHTML = '';

            for (let i = 0; i < resultWeekInfo.length; i++) {
                weekWeather.innerHTML += `
                <div class="week-cont" data-date="${resultWeekInfo[i].date}">
                    <h3>${resultWeekInfo[i].dayOfWeek}</h3>
                    <div class="week-text">${resultWeekInfo[i].dateShort}</div>
                    <div><img src="https://openweathermap.org/img/wn/${resultWeekInfo[i].getIconWeather()}@2x.png" alt=""></div>
                    <div class="week-degrees">${parseInt(resultWeekInfo[i].getTemp())}°C</div>
                    <div class="week-text">${resultWeekInfo[i].getForecast()}</div>
                </div>
                `;
            }

            let weekCont = document.querySelectorAll ('.week-cont');
            for (let i = 0; i < weekCont.length; i++) {
                weekCont[i].addEventListener('click', () => {
                    let weekContArr = weekCont[i];
                    let weekDate = weekContArr.dataset.date; 
                    this.createInfoHourlyWeather(weekDate, resultWeekInfo);
                });
            }
    }
}

let weath = new Weather();