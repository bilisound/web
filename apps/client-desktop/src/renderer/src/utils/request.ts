import ky from "ky";

const request = ky.extend({
    prefixUrl: "https://api.tuu.run/",
    throwHttpErrors: true,
    timeout: false,
});

export default request;
