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
        
                            this.api.currentWeather(data[0].lat, data[0].lon)
                                .then(data => {
                                    this.createCurrentWeather(data);
                                });
                            
                            this.api.forecastFiveDay(data[0].lat, data[0].lon)
                                .then(data => {
                                    let resultWeekInfo = this.sameCommon.createInfo(data.list);
                                    this.sameCommon.createInfoHourlyWeather(resultWeekInfo[0].date, resultWeekInfo);
                                });
        
                            this.api.nearbyLocations(data[0].lat, data[0].lon)
                                .then(data => {
                                    this.createNearbyPlaces(data, this.search.value);
                                    console.log(data);
                                });
                        });
                    }
            });
    }

    async init (positionLat, positionLon) {
        let currentWeatherData = await this.api.currentWeather(positionLat, positionLon)
        this.createCurrentWeather(currentWeatherData);
        
        let forecastFiveDayData = await this.api.forecastFiveDay(positionLat, positionLon)
        let resultWeekInfo = this.sameCommon.createInfo(forecastFiveDayData.list);
        this.sameCommon.createInfoHourlyWeather(resultWeekInfo[0].date, resultWeekInfo);
        
        let currentCityName = currentWeatherData.name;
        let nearbyLocationsData = await this.api.nearbyLocations(positionLat, positionLon)
        this.createNearbyPlaces(nearbyLocationsData, currentCityName);
    }

    unixTime (unixTime) {
        let date = new Date(unixTime * 1000);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        if (minutes <= 9) {
            return hours + ':0' + minutes;
        }
        return hours + ':' + minutes;
    }

    unixTimeUTC (unixTime) {
        let date = new Date(unixTime * 1000);
        let hours = date.getUTCHours();
        let minutes = date.getUTCMinutes();
        if (minutes <= 9) {
            return hours + ':0' + minutes;
        }
        return hours + ':' + minutes;
    }

    createCurrentWeather (data) {
        let currentMainCont = document.querySelector ('.current-main_cont'); 

        let durationTime = data.sys.sunset - data.sys.sunrise;
        let resultSunrise = this.unixTime(data.sys.sunrise);
        let resultSunset = this.unixTime(data.sys.sunset);
        let resultDurationTime = this.unixTimeUTC(durationTime);
        
        let date = new Date();
        let yearDate = date.getFullYear();
        let monthDate = date.getMonth() + 1;
        let dateDate = date.getDate();

        currentMainCont.innerHTML = `
            <div class="title-current">
            <div class="title-text_current">CURRENT WEATHER</div>
            <span class="title-data_current">${dateDate}.${monthDate}.${yearDate}</span>
        </div>
        <div class="content-current">
            <div class="content-weather_current">
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="sun">
                <div>${data.weather[0].description}</div>
            </div>
            <div class="content-temp_current">
                <div class="temp-title">${parseInt(data.main.temp)}°C</div>
                <div class="temp-content">Real feel ${parseInt(data.main.feels_like)}°</div>
            </div>
            <div class="content-list_current">
                <ul>
                    <li>Sunrise: ${resultSunrise}</li>
                    <li>Sunset: ${resultSunset}</li>
                    <li>Duration: ${resultDurationTime} hr</li>
                </ul>
            </div>
        </div>
        `;
    }

    createNearbyPlaces (data, city) {
        let nearbyCont = document.querySelector('.nearby-cont');
        nearbyCont.innerHTML = '';
        
        for (let i = 0; i < data.list.length; i++) {
            if (city.toLowerCase() == data.list[i].name.toLowerCase()) {
                continue;
            }
            nearbyCont.innerHTML += `
            <div class="neardy-content">${data.list[i].name}
                <img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png" alt="sun"> 
                <span>${parseInt(data.list[i].main.temp)}°C</span>
            </div>
            `
        }
    }
}

let weath = new Weather();