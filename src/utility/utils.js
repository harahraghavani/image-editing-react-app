import CryptoJS from "crypto-js";
import { ENCRYPTION_KEY } from "../constant/constant";

export const encryptData = (data) => {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    ENCRYPTION_KEY
  ).toString();
  return encryptedData;
};

export const decryptData = (encryptedData) => {
  if (!encryptedData) return null;

  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData);
};

export const setDataToLocalStorage = (key, data) => {
  localStorage.setItem(key, encryptData(data));
};

export const getDataFromLocalStorage = (key) => {
  const encryptedData = localStorage?.getItem(key);
  return decryptData(encryptedData);
};

export const removeDataFromLocalStorage = (key) => {
  localStorage.removeItem(key);
};

export const getFilterString = (filters) => {
  let filterString = "";

  for (const filterName in filters) {
    const { filterName: name, value, unit } = filters[filterName];
    if (value !== 0) {
      filterString += `${name}(${value}${unit}) `;
    }
  }

  return filterString.trim();
};

export const getDefaultValue = () => {
  return {
    brightness: {
      filterName: "brightness",
      displayName: "Brightness",
      value: 100,
      unit: "%",
      min: 0,
      max: 200,
    },
    contrast: {
      filterName: "contrast",
      displayName: "Contrast",
      value: 100,
      unit: "%",
      min: 0,
      max: 200,
    },
    grayscale: {
      filterName: "grayscale",
      displayName: "Black & White",
      value: 0,
      unit: "%",
      min: 0,
      max: 100,
    },
    hue: {
      filterName: "hue-rotate",
      displayName: "Hue",
      value: 0,
      unit: "deg",
      min: 0,
      max: 360,
    },
    saturation: {
      filterName: "saturate",
      displayName: "Saturation",
      value: 100,
      unit: "%",
      min: 0,
      max: 200,
    },
    sepia: {
      filterName: "sepia",
      displayName: "Warm",
      value: 0,
      unit: "%",
      min: 0,
      max: 100,
    },
  };
};
