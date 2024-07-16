import ky from "ky";
import { BASE_URL } from "@/constants";

const request = ky.extend({
    prefixUrl: `${BASE_URL}/`,
    throwHttpErrors: true,
    timeout: false,
});

export default request;
