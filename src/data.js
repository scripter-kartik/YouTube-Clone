export const API_KEY = "AIzaSyCaT7i2JRo9EU0tiZXoXFlW-LJ-N9k2HQU";

export const value_converter = (value) => {
  if (value >= 1000000) {
    return Math.floor(value / 1000000) + "M";
  } else if (value >= 1000) {
    return Math.floor(value / 1000) + "K";
  } else {
    return value;
  }
};
