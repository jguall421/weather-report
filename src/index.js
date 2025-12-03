'use strict';

const state = {
  counter: 0,
  resetTempButton: null,
  increaseTempControlClicked: null,
  decreaseTempControlClicked: null

};

const addCounter = () => {
  state.counter += 1;
  //const countContainer = document.querySelector('#increaseTempControl');
  const countContainer = document.querySelector('#tempValue');
  countContainer.textContent = `${state.counter}`;
};

const subtractCounter = () => {
  state.counter -= 1;
  //const countContainer = document.querySelector('#decreaseTempControl');
  const countContainer = document.querySelector('#tempValue');
  countContainer.textContent = `${state.counter}`;
};
const handleTempValueClicked = (event) => {
  state.counter = 0;
  const countContainer = document.querySelector('#tempValue');
  countContainer.textContent = `${state.counter}`;

};

const registerEventHandlers = () => {
  const incTempCount = document.querySelector('#increaseTempControl');
  incTempCount.addEventListener('click', addCounter);

  const decTempCount = document.querySelector('#decreaseTempControl');
  decTempCount.addEventListener('click', subtractCounter);

  const resetButton = document.querySelector('#currentTempButton');
  resetButton.addEventListener('click', handleTempValueClicked);
};


document.addEventListener('DOMContentLoaded', registerEventHandlers);
