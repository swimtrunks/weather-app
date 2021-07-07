

//get current date
let currentDate = new Date();
let dayName = currentDate.toString().split(' ')[0];
let monthName = currentDate.toString().split(' ')[1];
let yearName = currentDate.toString().split(' ')[3];
let setTime = currentDate.toString().split(' ')[4].split(':')
let pageTime = `${setTime[0]}:${setTime[1]}`;

//set date & time
$(document).ready(function () {
    $("#dayDate").text(`${dayName}, ${monthName} ${yearName}`);
    $("#dayTime").text(`${pageTime}`);
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
            let highest = Math.round(data.daily[0].temp.max);
            let lowest = Math.round(data.daily[0].temp.min);
            let statement = data.current.weather[0].description;
            let descArr = [...statement]



            $(document).ready(function () {
                $('#mainTemp').text(`${currentTemp}`);
                $('#hiTemp').text(`${highest} `);
                $('#lowTemp').text(`${lowest}`);
                $('#description').text(`${statement}`);


                //background image conditional
                if (descArr.includes('rain')) {
                    $("#blue").fadeOut(function () {
                        $(this).attr("src", "/images/rain.png").fadeIn();
                    });
                } else if (currentTemp >= 85 && currentTemp < 110) {
                    $("#blue").fadeOut(function () {
                        $(this).attr("src", "/images/hot.png").fadeIn();
                    });
                } else if (currentTemp > 65 && currentTemp < 85) {
                    $("#blue").fadeOut(function () {
                        $(this).attr("src", "/images/pngegg.png").fadeIn();
                    });
                }

                $('.dayTemp').each(function (i, obj) {

                    let dailyTemp = Math.round(data.daily[i].temp.day);

                    $(this).html(`
                    <div><span class='dayTemp'>${dailyTemp}</span> &#8457</div> <img
                    id = "wIcon" src="images/weather-icons-master/svg/wi-day-sunny.svg">
                    <div class="dayWeek">Mon</div>
                    `)
                })


            });




        });
}
document.querySelector('.cityInquiry').addEventListener('click', findState);




