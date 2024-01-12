declare module "konami-code" {
    export default class KonamiCode {
        _delay: number;

        constructor();
        listen(callback: () => void): KonamiCode;
    }
}
