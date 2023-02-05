export default ({ app }, inject) => {
  inject("capFirstLetter", capFirstLetter);
};

const capFirstLetter = (text: string) => {
  return text.slice(0, 1).toUpperCase() + text.slice(1);
};
