export function stringifyError(mayBeError: unknown): string {
    return mayBeError instanceof Error ? mayBeError.message : `${mayBeError}`;
}

export function assertNever<T = unknown>(value: never, stringify: (value: T) => string): never {
    throw new Error(stringify(value));
}

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}
