

//get current date
let currentDate = new Date();
let dayName = currentDate.toString().split(' ')[0];
let monthName = currentDate.toString().split(' ')[1];
let yearName = currentDate.toString().split(' ')[3];
let setTime = currentDate.toString().split(' ')[4].split(':')
let pageTime = `${setTime[0]}:${setTime[1]}`;
console.log();


//set time
$(document).ready(function () {
    $("#dayTime").text(`${pageTime}`);
});

//set date
$(document).ready(function () {
    $("#dayDate").text(`${dayName}, ${monthName} ${yearName}`);
});


const api = {
    key: "e10f380012c58fdda0149e29d9922312",
    base: "api.openweather.org/data/2.5"
};

let userGPS;
let latitude;
let longitude;

const findState = () => {
    const user = document.querySelector('.cityInquiry');

    const success = (position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        const apiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`

        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {

                let stArray = data.principalSubdivisionCode.split('-');
                let city = data.locality;
                let state = stArray[1];

                user.textContent = `${city}, ${state}`;

                userGPS = user.textContent;

                //runs another api call to get weather json.
                getWeather(userGPS);
            })

    }
    const error = () => {
        user.textContent = "Can't Find Location"
    }
    navigator.geolocation.getCurrentPosition(success, error);
};


function getWeather(query) {

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=imperial&appid=${api.key}`)
        .then(res => res.json())
        .then(data => {

            console.log(data);
            let currentTemp = Math.round(data.current.temp);

            $(document).ready(function () {
                $('#mainTemp').text(`${currentTemp}`);
            });

            $('.dayTemp').each(function (index, temp) {
                temp = Math.round(data.daily[index].temp.day);
                
                
            })




        });
}
document.querySelector('.cityInquiry').addEventListener('click', findState);




