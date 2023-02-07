var key = '3515eb9c90ae5a3e5fc4c071e8510f74';
var city = "Stuart"

//Grabs the current time and date
var date = moment().format('dddd, MMMM Do YYYY');
var dateTime = moment().format('YYYY-MM-DD HH:MM:SS')

var cityHist = [];


//Grab the main 'Today' card body.
var TodaysCards = $('.cardBodyToday')
//Applies the weather data to the today card and then launches the five day forecast
function getWeatherToday() {
	var getUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;

	$(TodaysCards).empty();

	$.ajax({
		url: getUrlCurrent,
		method: 'GET',
	}).then(function (response) {
		$('.cardTodayCityName').text(response.name);
		$('.cardTodayDate').text(date);
		//Icons
		$('.icons').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
		// Temperature
		var active = $('<p>').text(`Temperature: ${response.main.temp} °F`);
		TodaysCards.append(active);
		//Wind Speed
		var activeWind = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
		TodaysCards.append(activeWind);
		//Humidity
		var activeHumid = $('<p>').text(`Humidity: ${response.main.humidity} %`);
		TodaysCards.append(activeHumid);
		//Feels Like
		var activeTemp = $('<p>').text(`Feels Like: ${response.main.feels_like} °F`);
		TodaysCards.append(activeTemp);
		//Set the lat and long from the searched city
		var cityLon = response.coord.lon;
		// console.log(cityLon);
		var cityLat = response.coord.lat;
		// console.log(cityLat);

		var getUrlUVindex = `https://api.openweathermap.org/data/2.5/onecall?lat=${cityLat}&lon=${cityLon}&exclude=hourly,daily,minutely&appid=${key}`;

		$.ajax({
			url: getUrlUVindex,
			method: 'GET',
		}).then(function (response) {
			var activeUVindex = $('<p>').text(`UV Index: `);
			var UVindexSpan = $('<span>').text(response.current.UVindex);
			var UVindex = response.current.UVindex;
			activeUVindex.append(UVindexSpan);
			TodaysCards.append(activeUVindex);
			//set the UV index to match an exposure chart severity based on color 
			if (UVindex >= 0 && UVindex <= 2) {
				UVindexSpan.attr('class', 'green');
			} else if (UVindex > 2 && UVindex <= 5) {
				UVindexSpan.attr("class", "yellow")
			} else if (UVindex > 5 && UVindex <= 7) {
				UVindexSpan.attr("class", "orange")
			} else if (UVindex > 7 && UVindex <= 10) {
				UVindexSpan.attr("class", "red")
			} else {
				UVindexSpan.attr("class", "purple")
			}
		});
	});
	getFiveDayForecast();
};

var fiveForecasttel = $('.fiveForecast');

function getFiveDayForecast() {
	var getUrlFiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;

	$.ajax({
		url: getUrlFiveDay,
		method: 'GET',
	}).then(function (response) {
		var fiveDayArray = response.list;
		var myWeather = [];
		//Made a object that would allow for easier data read
		$.each(fiveDayArray, function (index, value) {
			testObj = {
				date: value.dt_txt.split(' ')[0],
				time: value.dt_txt.split(' ')[1],
				temp: value.main.temp,
				feels_like: value.main.feels_like,
				icon: value.weather[0].icon,
				humidity: value.main.humidity
			}

			if (value.dt_txt.split(' ')[1] === "12:00:00") {
				myWeather.push(testObj);
			}
		})
		//Inject the cards to the screen 
		for (let i = 0; i < myWeather.length; i++) {

			var divElCard = $('<div>');
			divElCard.attr('class', 'card text-white bg-primary mb-3 cardOne');
			divElCard.attr('style', 'max-width: 200px;');
			fiveForecasttel.append(divElCard);

			var divElHeader = $('<div>');
			divElHeader.attr('class', 'card-header')
			var m = moment(`${myWeather[i].date}`).format('MM-DD-YYYY');
			divElHeader.text(m);
			divElCard.append(divElHeader)

			var divElBody = $('<div>');
			divElBody.attr('class', 'card-body');
			divElCard.append(divElBody);

			var divElIcon = $('<img>');
			divElIcon.attr('class', 'icons');
			divElIcon.attr('src', `https://openweathermap.org/img/wn/${myWeather[i].icon}@2x.png`);
			divElBody.append(divElIcon);

			//Humidity
			var activeHumid = $('<p>').text(`Humidity: ${myWeather[i].humidity} %`);
			divElBody.append(activeHumid);
			
			//Feels Like
			var activeFeel = $('<p>').text(`Feels Like: ${myWeather[i].feels_like} °F`);
			divElBody.append(activeFeel);
		
			//Temp
			var activeTemp = $('<p>').text(`Temperature: ${myWeather[i].temp} °F`);
			divElBody.append(activeTemp);
		}
	});
};

//Will save the text value of the search and save it to an array and storage
$('.search').on("click", function (event) {
	event.preventDefault();
	city = $(this).parent('.btnPar').siblings('.textVal').val().trim();
	if (city === "") {
		return;
	};
	cityHist.push(city);

	localStorage.setItem('city', JSON.stringify(cityHist));
	fiveForecasttel.empty();
	getHistory();
	getWeatherToday();
});

//Will create buttons based on search history 
var conthistorytel = $('.cityHist');
function getHistory() {
	conthistorytel.empty();

	for (let i = 0; i < cityHist.length; i++) {

		var rowtel = $('<row>');
		var btntel = $('<button>').text(`${cityHist[i]}`)

		rowtel.addClass('row histBtnRow');
		btntel.addClass('btn btn-outline-secondary histBtn');
		btntel.attr('type', 'button');

		conthistorytel.prepend(rowtel);
		rowtel.append(btntel);
	} if (!city) {
		return;
	}
	//Allows the buttons to start a search as well
	$('.histBtn').on("click", function (event) {
		event.preventDefault();
		city = $(this).text();
		fiveForecasttel.empty();
		getWeatherToday();
	});
};

//Allows for the example data to load for Denver
function initLoad() {

	var cityHistStore = JSON.parse(localStorage.getItem('city'));

	if (cityHistStore !== null) {
		cityHist = cityHistStore
	}
	getHistory();
	getWeatherToday();
};

initLoad();