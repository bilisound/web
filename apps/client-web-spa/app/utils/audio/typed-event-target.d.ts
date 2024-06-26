export class TypedEventTarget<T> extends EventTarget {
    addEventListener<K extends keyof T>(
        type: K,
        listener: (this: TypedEventTarget<T>, ev: TypedCustomEvent<K, T[K]>) => any,
        options?: boolean | AddEventListenerOptions,
    ): void;
    addEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | AddEventListenerOptions,
    ): void;
    removeEventListener<K extends keyof T>(
        type: K,
        listener: (this: TypedEventTarget<T>, ev: TypedCustomEvent<K, T[K]>) => any,
        options?: boolean | EventListenerOptions,
    ): void;
    removeEventListener(
        type: string,
        listener: EventListenerOrEventListenerObject,
        options?: boolean | EventListenerOptions,
    ): void;
    dispatchEvent<K extends keyof T>(event: TypedCustomEvent<K, T[K]>): void;
}

export class TypedCustomEvent<S, T> extends CustomEvent<T> {
    constructor(type: S, eventInitDict?: CustomEventInit<T> | undefined);
}
