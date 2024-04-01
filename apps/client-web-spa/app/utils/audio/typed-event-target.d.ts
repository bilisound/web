export default class TypedEventTarget<T> extends EventTarget {
    addEventListener<K extends keyof T>(
        type: K,
        listener: (this: TypedEventTarget, ev: T[K]) => any,
        options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof T>(
        type: K,
        listener: (this: TypedEventTarget, ev: T[K]) => any,
        options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions,
    ): void;
    dispatchEvent<K extends keyof T>(event: T[K]): void;
}
