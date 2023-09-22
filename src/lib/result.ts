import { None, Option, Some } from '.';

/**
 * Represents an abstract container, which includes either a value or an error
 * if the value was unable to be retrieved.
 *
 * # Examples
 * ```
 * let user = database.fetchUser("John Doe")
 *     .expect("Unable to fetch user.")
 * ```
 */
interface IResult<T, E> {
    /**
     * Indicate, whether the result was successful and contains a value.
     *
     * @returns `true` if the result was successful
     */
    ok(): this is Ok<T>;

    /**
     * Indicate, whether the result was unsuccessful and contains an error.
     *
     * @returns `true` if the result was unsuccessful
     */
    err(): this is Err<E>;

    /**
     * Retrieve the contained value of this result wrapped into an option.
     * If the result is failed, `None` is returned.
     */
    get(): Option<T>;

    /**
     * Retrieve the contained error of this result wrapped into an option.
     * If the result is successful, `None` is returned.
     */
    fail(): Option<E>;

    /**
     * Retrieve the contained value of this error. If this result is failed,
     * the program panics with an error.
     *
     * @returns the value inside the result
     */
    unwrap: () => T;

    /**
     * Retrieve the contained value of this result. If this result is failed,
     * the default value is returned.
     *
     * @param def - the default value to return if this result is `Err`
     * @returns the value inside the result
     */
    unwrapOr: (value: T) => T;

    /**
     * Retrieve the contained value of this result. If this result is failed,
     * the default value is supplied.
     *
     * @param supplier - the default value to be supplied if this result is `Err`
     * @returns the value inside the result
     */
    unwrapOrGet: (supplier: () => T) => T;

    /**
     * Retrieve the contained value of this result. If this result is failed,
     * the program panics with the specified error message.
     *
     * @returns the value inside the result
     */
    expect: (msg: string) => T;
}

/**
 * `Ok` indicates, that the result was completed successfully.
 */
type Ok<T> = {
    /**
     * The type that indicates, that the result contains a value.
     */
    type: 'ok';

    /**
     * The contained value of the result.
     */
    value: T;
};

/**
 * `Err` indicates, that an error occurred whilst completing.
 */
type Err<E> = {
    /**
     * The type that indicates, that the result contains an error.
     */
    type: 'err';

    /**
     * The contained error of the result.
     */
    error: E;
};

/**
 * Represents a container, which includes either a value or an error
 * if the value was unable to be retrieved.
 *
 * # Examples
 * ```
 * let user = database.fetchUser("John Doe")
 *     .expect("Unable to fetch user.")
 * ```
 */
export type Result<T, E> = (Ok<T> | Err<E>) & IResult<T, E>;

/**
 * Represents an auto-wrapper of an asynchronous result type.
 */
export type AsyncResult<T, E> = Promise<Result<T, E>>;

/**
 * Create an option, that contains the specified value.
 * This method should be used, when no value should be returned for completion.
 * @param value - the value of the option
 * @returns a new option with the specified value
 */
export function Ok<E>(): Result<void, E>;
/**
 * Create an option, that contains the specified value.
 * @param value - the value of the option
 * @returns a new option with the specified value
 */
export function Ok<T, E>(value: T): Result<T, E>;
/**
 * Create an option, that contains the specified value.
 * @param value - the value of the option
 * @returns a new option with the specified value
 */
export function Ok<T, E>(value?: T): Result<T | void, E> {
    return { type: 'ok', value, ...createBaseResult() };
}

/**
 * Create an option, that contains no value.
 * This method should be used, when no value should be returned for failure.
 * @returns a new option without a value
 */
export function Err<T>(): Result<T, void>;
/**
 * Create an option, that contains no value.
 * @returns a new option without a value
 */
export function Err<T, E>(error: E): Result<T, E>;
/**
 * Create an option, that contains no value.
 * @returns a new option without a value
 */
export function Err<T, E>(error?: E): Result<T, E | void> {
    return { type: 'err', error, ...createBaseResult() };
}

/**
 * Indicate, whether the result was successful and contains a value.
 *
 * @returns `true` if the result was successful
 */
function ok<T, E>(this: Result<T, E>): boolean {
    return this.type == 'ok';
}

/**
 * Indicate, whether the result was unsuccessful and contains an error.
 *
 * @returns `true` if the result was unsuccessful
 */
function err<T, E>(this: Result<T, E>): boolean {
    return this.type == 'err';
}

/**
 * Retrieve the contained value of this result wrapped into an option.
 * If the result is failed, `None` is returned.
 */
function get<T, E>(this: Result<T, E>): Option<T> {
    if (this.type == 'ok') {
        return Some(this.value);
    } else {
        return None();
    }
}

/**
 * Retrieve the contained error of this result wrapped into an option.
 * If the result is successful, `None` is returned.
 */
function fail<T, E>(this: Result<T, E>): Option<E> {
    if (this.type == 'err') {
        return Some(this.error);
    } else {
        return None();
    }
}

/**
 * Retrieve the contained value of this error. If this result is failed,
 * the program panics with an error.
 *
 * @returns the value inside the result
 */
function unwrap<T, E>(this: Result<T, E>): T {
    if (this.type == 'ok') {
        return this.value;
    } else {
        throw new Error(
            'Called `unwrap()` on an `Err` `Result` value with: ' + this.error
        );
    }
}

/**
 * Retrieve the contained value of this result. If this result is failed,
 * the default value is returned.
 *
 * @param def - the default value to return if this result is `Err`
 * @returns the value inside the result
 */
function unwrapOr<T, E>(this: Result<T, E>, def: T): T {
    if (this.type == 'ok') {
        return this.value;
    } else {
        return def;
    }
}

/**
 * Retrieve the contained value of this result. If this result is failed,
 * the default value is supplied.
 *
 * @param supplier - the default value to be supplied if this result is `Err`
 * @returns the value inside the result
 */
function unwrapOrGet<T, E>(this: Result<T, E>, supplier: () => T): T {
    if (this.type == 'ok') {
        return this.value;
    } else {
        return supplier();
    }
}

/**
 * Retrieve the contained value of this result. If this result is failed,
 * the program panics with the specified error message.
 *
 * @returns the value inside the result
 */
function expect<T, E>(this: Result<T, E>, msg: string): T {
    if (this.type == 'ok') {
        return this.value;
    } else {
        throw msg;
    }
}

/**
 * Implement the shared base functions for the result.
 * @returns a new object of the shared functions
 */
export function createBaseResult<T, E>(): IResult<T, E> {
    return {
        ok,
        err,
        get,
        fail,
        unwrap,
        unwrapOr,
        unwrapOrGet,
        expect,
    };
}

/**
 * Create an actual result from the given object.
 * This ensures that results can be properly used when they are received from events.
 * @param result - raw result from an event
 * @returns a converted result that contains the method implementations
 */
export function resultFactory<T, E>(result: Result<T, E>): Result<T, E> {
    return { ...result, ...createBaseResult() };
}
