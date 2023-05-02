function forecast()
{
    const api = 'https://api.open-meteo.com/v1/meteofrance?latitude=55&longitude=25.8&timezone=EET&daily=apparent_temperature_min,apparent_temperature_max'; 
    
    fetch(api)
        .then(response => response.json())
        .then(data => {
            const result = document.querySelector('#result');
            let s = '';
            const daily = data.daily;
            const time = daily.time;
            const min = daily.apparent_temperature_min;
            const max = daily.apparent_temperature_max;
            
            for (let i = 0; i < time.length; i++)
            {
                s += `<tr><td>${time[i]}</td><td>${min[i]}</td><td>${max[i]}</td><tr>`
            }
            
            result.innerHTML += s;
        })
        .catch(error => {
            result.innerHTML = error;
        });
}

document.addEventListener('DOMContentLoaded', function() {
    forecast();
});