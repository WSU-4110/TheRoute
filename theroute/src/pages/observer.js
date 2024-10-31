// src/utils/observer.js
const observers = [];

export const addObserver = (observer) => {
  observers.push(observer);
};

export const removeObserver = (observer) => {
  const index = observers.indexOf(observer);
  if (index > -1) {
    observers.splice(index, 1);
  }
};

export const notifyObservers = () => {
  observers.forEach((observer) => observer());
};
