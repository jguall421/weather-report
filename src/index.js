'use strict';

const state = {
  counter: 65 // default temperature value, fix it later
};

const getTempElement = () => document.querySelector('#tempValue');

// display current temp
const renderTemp = () => {
  const el = getTempElement();
  if (el) el.textContent = String(state.counter);
  changeCurrentTempColor(state.counter);
};

const addCounter = () => {
  state.counter += 1;
  renderTemp();
};

const subtractCounter = () => {
  state.counter -= 1;
  renderTemp();
};

const fetchCurrentTemp = async (city) => {
  // Testing code:
  const apiKey = 'YOUR_API_KEY';
  if (!city) throw new Error('City required');
  if (apiKey === 'YOUR_API_KEY') {
    console.warn('No API key set');
    // a default value for current temperature
    return 65;
  }

  // const url = find the url for the weather API, using city and apiKey
  // const resp = await axios.get(url);
  // return Math.round(resp.data.main.temp);
};

const handleTempValueClicked = async (event) => {
  const cityInput = document.querySelector('#cityNameInput');
  
  let city;
  if (cityInput) {
    city = cityInput.value.trim();
  } else {
    city = '';
  }

  if (!city) {
    state.counter = 65;
    renderTemp();
    return;
  }

  try {
    const temp = await fetchCurrentTemp(city);
    state.counter = temp;
    renderTemp();
  } catch (err) {
    console.error('Failed to fetch temperature:', err);
    state.counter = 65;
    renderTemp();
    alert('Failed to fetch realtime temperature. Make sure API key is set and the city name is valid.');
  }
};

const changeCurrentTempColor = (temp) => {
    const el = getTempElement();

    if (temp >= 80) {
       el.style.color = 'red';
    } else if (temp >= 70) {
       el.style.color = 'orange';
    } else if (temp >= 60) {
       el.style.color = 'yellow';
    } else if (temp >= 50) {
       el.style.color = 'green';
    } else {
       el.style.color = 'teal';
    }
}

const registerEventHandlers = () => {
  const incTempCount = document.querySelector('#increaseTempControl');
  if (incTempCount) incTempCount.addEventListener('click', addCounter);

  const decTempCount = document.querySelector('#decreaseTempControl');
  if (decTempCount) decTempCount.addEventListener('click', subtractCounter);

  const resetButton = document.querySelector('#currentTempButton');
  if (resetButton) resetButton.addEventListener('click', handleTempValueClicked);

  // Initialize displayed temperature
  renderTemp();
};

document.addEventListener('DOMContentLoaded', registerEventHandlers);
