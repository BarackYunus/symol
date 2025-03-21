import WebApp from '@twa-dev/sdk';

export const initTelegramApp = () => {
  // Initialize Telegram WebApp
  WebApp.ready();
  WebApp.expand();
};

export const getUserData = () => {
  return WebApp.initDataUnsafe?.user || null;
};

export const showAlert = (message) => {
  WebApp.showAlert(message);
};

export const showConfirm = (message) => {
  WebApp.showConfirm(message);
};

export const closeApp = () => {
  WebApp.close();
}; 