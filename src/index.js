'use strict';

const state = {
  counter: 65 // default temperature value, fix it later
};

let tempElement = null;
let landscapeElement = null;
let headerCityElement = null;
let cityNameInputElement = null;
let cityNameResetElement = null;
let increaseTempControlElement = null;
let decreaseTempControlElement = null;
let currentTempButtonElement = null;

const getElementBySelector = (selector) => {
  const element = document.querySelector(selector);
  if (element) {
    return element;
  } else {
    return null;
  }
};

const displayCurrentTemp = () => {
  if (tempElement) tempElement.textContent = String(state.counter);
  changeCurrentTempColor(state.counter);
};

const addCounter = () => {
  state.counter += 1;
  displayCurrentTemp();
};

const subtractCounter = () => {
  state.counter -= 1;
  displayCurrentTemp();
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
  const city = getCityInputValue();

  if (!city) {
    state.counter = 65;
    displayCurrentTemp();
    return;
  }

  try {
    const temp = await fetchCurrentTemp(city);
    state.counter = temp;
    displayCurrentTemp();
  } catch (err) {
    console.error('Failed to fetch temperature:', err);
    state.counter = 65;
    displayCurrentTemp();
    alert('Failed to fetch realtime temperature. Make sure API key is set and the city name is valid.');
  }
};

const changeCurrentTempColor = (temp) => {
  if (!tempElement || !landscapeElement) return;
  if (temp >= 80) {
    tempElement.style.color = 'red';
    landscapeElement.textContent = '🌵__🐍_🦂_🌵🌵__🐍_🏜_🦂';
  } else if (temp >= 70) {
    tempElement.style.color = 'orange';
    landscapeElement.textContent = '🌸🌿🌼__🌷🌻🌿_☘️🌱_🌻🌷';
  } else if (temp >= 60) {
    tempElement.style.color = 'yellow';
    landscapeElement.textContent = '🌾🌾_🍃_🪨__🛤_🌾🌾🌾_🍃';
  } else if (temp >= 50) {
    tempElement.style.color = 'green';
    landscapeElement.textContent = '🌲🌲⛄️🌲⛄️🍂🌲🍁🌲🌲⛄️🍂🌲';
  } else {
    tempElement.style.color = 'teal';
    landscapeElement.textContent = '🌲🌲⛄️🌲⛄️🍂🌲🍁🌲🌲⛄️🍂🌲';
  }
};

const updateCityNameHeader = (cityNameInput) => {
  if (headerCityElement) headerCityElement.textContent = cityNameInput;
};

const getCityInputValue = () => {
  if (cityNameInputElement) {
    return cityNameInputElement.value.trim();
  }
  return '';
};

const registerEventHandlers = () => {
  tempElement = getElementBySelector('#tempValue');
  landscapeElement = getElementBySelector('#landscape');
  headerCityElement = getElementBySelector('#headerCityName');
  cityNameInputElement = getElementBySelector('#cityNameInput');
  cityNameResetElement = getElementBySelector('#cityNameReset');
  increaseTempControlElement = getElementBySelector('#increaseTempControl');
  decreaseTempControlElement = getElementBySelector('#decreaseTempControl');
  currentTempButtonElement = getElementBySelector('#currentTempButton');

  if (increaseTempControlElement) increaseTempControlElement.addEventListener('click', addCounter);
  if (decreaseTempControlElement) decreaseTempControlElement.addEventListener('click', subtractCounter);
  if (currentTempButtonElement) currentTempButtonElement.addEventListener('click', handleTempValueClicked);

  if (cityNameInputElement) {
    const initialCityName = getCityInputValue();
    // Set initial city name header
    updateCityNameHeader(initialCityName);
    cityNameInputElement.addEventListener('input', () => {
        const cityName = getCityInputValue();
        updateCityNameHeader(cityName);
    });
  }

  if (cityNameResetElement) {
    cityNameResetElement.addEventListener('click', () => {
      if (cityNameInputElement) {
        const defaultName = 'Seattle';
        cityNameInputElement.value = defaultName;
        updateCityNameHeader(defaultName);
      }
    });
  }

  displayCurrentTemp();
  
};

document.addEventListener('DOMContentLoaded', registerEventHandlers);
