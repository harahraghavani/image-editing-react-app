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
