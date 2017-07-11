const PROTOCOL = window.location.protocol;
const HOSTNAME = window.location.hostname;
const BASE_URL = PROTOCOL + "//" + HOSTNAME;

$(document).ready(() => {
  console.log(BASE_URL);
  const socket = io(BASE_URL);
  console.log(socket);
});
