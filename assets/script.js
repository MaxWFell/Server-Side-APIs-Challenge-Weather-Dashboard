// Store the API key in a variable
const apiKey = '90a3b1c089d56935bb3d43cf179e1637';
// Store the city name in a variable
const city = 'Stuart';
// Get the current date and format it as a string
const date = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });


// Define a function that retrieves weather data for today's forecast for a given city
function getWeatherToday(city) {
	// Get a reference to the HTML element that will display today's forecast
	const todaysCard = document.getElementById('cardBodyToday');
	// Make an AJAX request to the OpenWeatherMap API to retrieve current weather data for the specified city
	$.ajax({
		url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`,
		method: 'GET',
	}).then(function (response) {
		// Update the HTML element that displays the city name with the name of the city from the API response
		document.getElementById('cardTodayCityName').innerHTML = response.name;
		// Update the HTML element that displays the weather icon with the icon URL from the API response
		document.getElementById("currIcon").src = "https://openweathermap.org/img/wn/"+response.weather[0].icon+".png";
		// Update the HTML element that displays the current date with the formatted date string
		document.getElementById('cardTodayDate').innerHTML = date;
		todaysCard.innerHTML = '<p>Temperature: '+response.main.temp+' °F</p><p>Wind Speed: '+response.wind.speed+' MPH</p><p>Humidity: '+response.main.humidity+' %</p><p>Feels Like: '+response.main.feels_like+' °F</p>';
		const longitude = response.coord.lon;
		var latitude = response.coord.lat;

		var output = '';
		// Make another AJAX request to the OpenWeatherMap API to retrieve additional weather data for the specified latitude and longitude
		$.ajax({
			url: `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,daily,minutely&appid=${apiKey}`,
			method: 'GET',
		}).then(function (response) {
			var uvi = response.current.uvi;
			if (uvi >= 0 && uvi <= 2) {
				output += '<p>UV Index: <span class="green">'+uvi.toString()+'</span></p>';
			} else if (uvi > 2 && uvi <= 5) {
				output += '<p>UV Index: <span class="yellow">'+uvi.toString()+'</span></p>';
			} else if (uvi > 5 && uvi <= 7) {
				output += '<p>UV Index: <span class="orange">'+uvi.toString()+'</span></p>';
			} else if (uvi > 7 && uvi <= 10) {
				output += '<p>UV Index: <span class="red">'+uvi.toString()+'</span></p>';
			} else {
				output += '<p>UV Index: <span class="purple">'+uvi.toString()+'</span></p>';
			}
			todaysCard.innerHTML += output;
		});
		
	});
	// calling getFiveDayForecast function
	getFiveDayForecast(city);
}
// Function to get five-day forecast for a city
function getFiveDayForecast(city) {
	// AJAX request to OpenWeatherMap API to get five-day forecast
	$.ajax({
		url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`,
		method: 'GET',
	}).then(function (response) {
		// An array to hold the data for each day's forecast
		var dataArray = [];
		// Loop through each item in the response to extract the data
		response.list.forEach(function(value) {
			// Create an object with the desired properties for each item
		  resObject = {
		    date: value.dt_txt.split(' ')[0],
		    time: value.dt_txt.split(' ')[1],
		    temp: value.main.temp,
		    feels_like: value.main.feels_like,
		    icon: value.weather[0].icon,
		    humidity: value.main.humidity
		  };
		   // If the time is 12:00:00, add the object to the dataArray
		  if (value.dt_txt.split(' ')[1] === "12:00:00") {
		    dataArray.push(resObject);
		  }
		});
		// Get the DOM element for the five-day forecas
		var fiveForecast = document.getElementById('fiveForecast');
		var output = '';
		// Loop through the dataArray to generate the HTML for each day's forecast
		for (let i = 0; i < dataArray.length; i++) {
			// Add the HTML for a card for the day's forecast
			output += '<div class="card text-white bg-primary mb-3 cardOne" style="max-width: 200px;">';
			output += '<div class="card-header">'+dataArray[i].date.toString()+'</div>';
			output += '<div class="card-body">';
			output += '<img class="icons" id="currIcon" src="https://openweathermap.org/img/wn/'+dataArray[i].icon+'@2x.png" />';
			output += '<p>Humidity: '+dataArray[i].humidity.toString()+' %</p>';
			output += '<p>Feels Like: '+dataArray[i].feels_like.toString()+' °F</p>';
			output += '<p>Temperature: '+dataArray[i].temp.toString()+' °F</p></div></div>';
			
		}
		// Set the innerHTML of the fiveForecast element to the generated HTML
		fiveForecast.innerHTML = output;
		
	});

}
// Define a function to handle city search
function searchCity(){
	// Get user input from search box
	const userInput = document.getElementById('searchInput').value;
	// Initialize an empty array for storing city history
	var searchedArray = [];
	// Get the search history from local storage and parse it as an array
	var localstr = JSON.parse(localStorage.getItem('city'));
	if (localstr !== null) {
		searchedArray = JSON.parse(localStorage.getItem('city'));
	}
	
	searchedArray.push(userInput);
	// Store the updated search history in local storage
	localStorage.setItem('city', JSON.stringify(searchedArray));
	// Call a function to display search history buttons
	loadData(userInput, searchedArray);
}
// Define a function to display search history buttons
function displayHistory(cityHistArray){
	// Get the div element to display search history
	var histDiv = document.getElementById('cityHist');
	var output = '';
	// Reverse the order of the search history array so that the most recent search appears first
	cityHistArray = cityHistArray.reverse();
	// Loop through the search history array and create a button for each city
	for (let i = 0; i < cityHistArray.length; i++) {

		output += '<button class="btn btn-outline-secondary" onclick="histBtn(\''+cityHistArray[i]+'\');" style="margin-bottom: 10px;">'+cityHistArray[i]+'</button><br>';
	}
	// Insert the search history buttons into the div element
	histDiv.innerHTML = output;
	

}
// Define a function to handle search history button clicks
function histBtn(city){
	// Call the function to display current weather for the selected city
	getWeatherToday(city);

}
// Define a function to load search history and call functions to display it and current weather for the last searched city
function loadData(city, searchedArray){
	// If the search history exists, call the function to display it
	if (searchedArray !== null) {
		displayHistory(searchedArray);
	}
	// Call the function to display current weather for the last searched city
	getWeatherToday(city);
}

// Get the search history from local storage and parse it as an array
var searchedArray = JSON.parse(localStorage.getItem('city'));
// Call a function to load search history and call functions to display it and current weather for the last searched city
loadData(city, searchedArray);