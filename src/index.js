'use strict';

const BASE_URL = 'https://ada-weather-report-proxy-server.onrender.com';
const DEFAULT_TEMPERATURE = 72;
const DEFAULT_CITY_NAME = 'Seattle';

const state = {
  counter: DEFAULT_TEMPERATURE
};

let tempElement = null;
let landscapeElement = null;
let skyElement = null;
let headerCityElement = null;
let cityNameInputElement = null;
let cityNameResetElement = null;
let increaseTempControlElement = null;
let decreaseTempControlElement = null;
let currentTempButtonElement = null;
let skySelectElement = null;
let gardenContent = null;

const getElementBySelector = (selector) => {
  const element = document.querySelector(selector);
  if (element) {
    return element;
  } else {
    return null;
  }
};

const kelvinToFahrenheit = (tempK) => {
  return (tempK - 273.15) * (9 / 5) + 32;
};

const setTemperatureAndDisplay = (temp) => {
  state.counter = temp;
  displayCurrentTemp();
};

const displayCurrentTemp = () => {
  if (tempElement) {
    tempElement.textContent = String(state.counter);
  }
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

const getColorForTemp = (temp) => {
  if (temp >= 80) {
    return 'red';
  }
  if (temp >= 70) {
    return 'orange';
  }
  if (temp >= 60) {
    return 'yellow';
  }
  if (temp >= 50) {
    return 'green';
  }

  return 'teal';
};

const getLandscapeForTemp = (temp) => {
  if (temp >= 80) {
    return '🌵__🐍_🦂_🌵🌵__🐍_🏜_🦂';
  }
  if (temp >= 70) {
    return '🌸🌿🌼__🌷🌻🌿_☘️🌱_🌻🌷';
  }
  if (temp >= 60) {
    return '🌾🌾_🍃_🪨__🛤_🌾🌾🌾_🍃';
  }
  if (temp >= 50) {
    return '🌲🌲⛄️🌲⛄️🍂🌲🍁🌲🌲⛄️🍂🌲';
  }
  return '🌲🌲⛄️🌲⛄️🍂🌲🍁🌲🌲⛄️🍂🌲';
};

const changeCurrentTempColor = (temp) => {
  if (!tempElement || !landscapeElement) {
    return;
  }
  tempElement.style.color = getColorForTemp(temp);
  landscapeElement.textContent = getLandscapeForTemp(temp);
};

const getLocation = (locationName) => {
  return axios
    .get(`${BASE_URL}/location?q=${locationName}`)
    .then((response) => {
      const { lat, lon } = response.data[0];
      return { lat, lon };
    })
    .catch((error) => {
      console.error(`Error fetching coordinates for ${locationName}:`, error);
    });
};

const getWeather = (lat, lon) => {
  return axios
    .get(`${BASE_URL}/weather?lat=${lat}&lon=${lon}`)
    .then((response) => {
      const tempK = response.data.main.temp;
      const tempF = kelvinToFahrenheit(tempK);
      setTemperatureAndDisplay(tempF);
      return tempF;
    })
    .catch((error) => {
      console.error(`Error fetching weather for ${lat},${lon}:`, error);
    });
};

const fetchCurrentTemp = async (city) => {
  if (!city) {
    throw new Error('City name is required to fetch temperature.');
  }
  const { lat, lon } = await getLocation(city);
  const tempF = await getWeather(lat, lon);
  return Math.round(tempF);
};

const handleTempValueClicked = async () => {
  const city = getCityInputValue();

  if (!city) {
    setTemperatureAndDisplay(DEFAULT_TEMPERATURE);
    return;
  }

  try {
    const temp = await fetchCurrentTemp(city);
    setTemperatureAndDisplay(temp);
  } catch (err) {
    console.error('Failed to fetch temperature:', err);
    setTemperatureAndDisplay(DEFAULT_TEMPERATURE);
    alert('Failed to fetch realtime temperature. Make sure API key is set and the city name is valid.');
  }
};

const skySelectDropDown = () => {
  if (!skyElement || !gardenContent) return;
  let option = skySelectElement.value;

  if (option == 'Sunny') {
    skyElement.textContent = '☁️ ☁️ ☁️ ☀️ ☁️ ☁️';
    gardenContent.style.backgroundColor = 'rgb(221, 255, 255)';
  } else if (option == 'Cloudy') {
    skyElement.textContent = '☁️☁️ ☁️ ☁️☁️ ☁️ 🌤 ☁️ ☁️☁️';
    gardenContent.style.backgroundColor = 'lightgrey';
  } else if (option == 'Rainy') {
    skyElement.textContent = '🌧🌈⛈🌧🌧💧⛈🌧🌦🌧💧🌧🌧';
    gardenContent.style.backgroundColor = 'lightblue';
  } else if (option == 'Snowy') {
    skyElement.textContent = '🌨❄️🌨🌨❄️❄️🌨❄️🌨❄️❄️🌨🌨';
    gardenContent.style.backgroundColor = 'lightsteelblue';
  }
};

const updateCityNameHeader = (cityNameInput) => {
  if (headerCityElement) {
    headerCityElement.textContent = cityNameInput;
  }
};

const getCityInputValue = () => {
  if (cityNameInputElement) {
    return cityNameInputElement.value.trim();
  }

  return '';
};

const resetCityName = () => {
  if (!cityNameInputElement) {
    return;
  }

  cityNameInputElement.value = DEFAULT_CITY_NAME;
  updateCityNameHeader(DEFAULT_CITY_NAME);
};

const initializeElements = () => {
  tempElement = getElementBySelector('#tempValue');
  landscapeElement = getElementBySelector('#landscape');
  headerCityElement = getElementBySelector('#headerCityName');
  cityNameInputElement = getElementBySelector('#cityNameInput');
  cityNameResetElement = getElementBySelector('#cityNameReset');
  increaseTempControlElement = getElementBySelector('#increaseTempControl');
  decreaseTempControlElement = getElementBySelector('#decreaseTempControl');
  currentTempButtonElement = getElementBySelector('#currentTempButton');
  skySelectElement = getElementBySelector('#skySelect');
  skyElement = getElementBySelector('#sky');
  gardenContent = getElementBySelector('#gardenContent');
};

const registerEventHandlers = () => {
  initializeElements();

  if (increaseTempControlElement) {
    increaseTempControlElement.addEventListener('click', addCounter);
  }
  if (decreaseTempControlElement) {
    decreaseTempControlElement.addEventListener('click', subtractCounter);
  }
  if (currentTempButtonElement) {
    currentTempButtonElement.addEventListener('click', handleTempValueClicked);
  }

  if (skySelectElement) {
    skySelectElement.addEventListener('change', skySelectDropDown);
  }

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
    cityNameResetElement.addEventListener('click', resetCityName);
  }

  displayCurrentTemp();
};

document.addEventListener('DOMContentLoaded', registerEventHandlers);
