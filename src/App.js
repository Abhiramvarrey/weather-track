import React from 'react';
import './styles.css';
import { useState} from 'react';
function App() {
  const [cityname, setCity] = useState('');
  const [weatherData, setWeatherData] = useState({});

  const search = ()=>{
    console.log(cityname);
  // Fetching data from API
    fetch('https://api.openweathermap.org/data/2.5/weather?q='+cityname+'&units=metric&appid=ca68d07cd7575eef2a74c9673615d745')
       .then((response) => response.json())
       .then((data) => {
          console.log(data);
          setWeatherData(data);
       })
       .catch((err) => {
          console.log(err.message);
       });
    console.log(weatherData);
  }
   return (
   <div className='weatherbox'>
       <div className='search'>
          <input type='text' placeholder='Enter City Name'value={cityname} onChange={(e) => setCity(e.target.value)}/>
          <button type='submit'onClick={() => search()}>Search</button>
       </div>
       <div className='output'>
            <h1>City: {weatherData.name}</h1>
            <h1>Temparature: {weatherData.main?.temp}</h1>
            <p>Feels like: {weatherData.main?.feels_like}</p>
            <h1>Sky condition: {weatherData.weather?.[0].main}</h1>
            <p>Sky description: {weatherData.weather?.[0].description}</p>
            <h1>Wind speed: {weatherData.wind?.speed} kmph
            <br></br> Wind direction: {weatherData.wind?.deg} degrees</h1>
       </div>
    </div>);
};

export default App;