import { Err, Ok, Result } from '.';

/**
 * Represents an abstract container, which may or may not contain a value.
 * This allows you to safely retrieve values from methods.
 *
 * # Examples
 * ```
 * let element = list.get(0)
 *     .expect("No such index")
 * ```
 */
interface IOption<T> {
    /**
     * Indicate, whether a value is present in the option.
     *
     * @returns `true` if this option is a `Some` value.
     */
    some: () => this is Some<T>;

    /**
     * Indicate, whether the option is empty, and does not contain a value.
     *
     * @returns `true` if this option is a `None` value.
     */
    none: () => this is None;

    /**
     * Retrieve the contained value of this option. If no value is associated for the option,
     * the program panics with an error.
     *
     * @returns the value inside the option
     */
    unwrap: () => T;

    /**
     * Retrieve the contained value of this option. If no value is associated for the option,
     * the default value is returned.
     *
     * @param def - the default value to return if this option is `None`
     * @returns the value inside the option
     */
    unwrapOr: (def: T) => T;

    /**
     * Retrieve the contained value of this option. If no value is associated for the option,
     * the default value is supplied.
     *
     * @param supplier - the default value to be supplied if this option is `None`
     * @returns the value inside the option
     */
    unwrapOrGet: (supplier: () => T) => T;

    /**
     * Retrieve the contained value of this option. If no value is associated for the option,
     * the program panics with the specified error message.
     *
     * @returns the value inside the option
     */
    expect: (msg: string) => T;

    /**
     * Retrieve and map the value contained of this option. This method handles both cases,
     * if the option has a value or if it does not.
     * @param matcher - option pattern matcher
     * @returns the mapped value of the option
     */
    match: <R>(matcher: { some: (value: T) => R; none: () => R }) => R;

    /**
     * Map the contained value of this option to the type of `U` using the specified mapper.
     * If the option is empty, a `None` is returned.
     *
     * @returns an option of type `U`
     */
    map: <U>(mapper: (value: T) => U) => Option<U>;

    /**
     * Map the contained value of this option to the type of `U` using the specified mapper.
     * If the option is empty, a the default value is returned.
     *
     * @returns the mapped value or the default value
     */
    mapOr: <U>(mapper: (value: T) => U, value: U) => Option<U>;

    /**
     * Return `None` if this option is `None`. Call the `mapper` with the held value and return the result.
     *
     * @param mapper - option mapper function
     * @returns the map result or `None`
     */
    flatMap: <U>(mapper: (value: T) => Option<U>) => Option<U>;

    /**
     * Map the contained value of this option to the type of `U` using the specified mapper.
     * If the option is empty, a the default value is supplied.
     *
     * @returns the mapped value or the default value
     */
    mapOrElse: <U>(mapper: (value: T) => U, supplier: () => U) => Option<U>;

    /**
     * Call the specified callback if the option contains a value.
     *
     * @param callback - the function to call if the option contains a value
     */
    inspect: (callback: (value: T) => void) => Option<T>;

    /**
     * Transform the option to a result, that is `Ok`, if this option has a value, `Err` otherwise.
     *
     * @param error - the error to be given in case of `Err`
     * @returns this option as a `Result`
     */
    ok: () => Result<T, void>;

    /**
     * Transform the option to a result, that is `Ok`, if this option has a value, `Err` otherwise.
     *
     * @param error - the error to be given in case of `Err`
     * @returns this option as a `Result`
     */
    okOr: <E>(error: E) => Result<T, E>;

    /**
     * Transform the option to a result, that is `Ok`, if this option has a value, `Err` otherwise.
     *
     * @param error - the error to be supplied in case of `Err`
     * @returns this option as a `Result`
     */
    okOrElse: <E>(error: () => E) => Result<T, E>;

    /**
     * Return `None` if this option is `None`, return `other` otherwise.
     *
     * @param other - the option to return if this option has a value
     * @returns the other option or `None`
     */
    and: <U>(other: Option<U>) => Option<U>;

    /**
     * Return the option, if it contains a value, return `other` otherwise.
     *
     * @param other - the other option to return if this option is empty
     * @returns this option or the other option, if this is `None`
     */
    or: (other: Option<T>) => Option<T>;

    /**
     * Return the option, if it contains a value, return `other` otherwise.
     *
     * @param other - the suppleir for other option to return if this option is empty
     * @returns this option or the other option, if this is `None`
     */
    orElse: (other: () => Option<T>) => Option<T>;

    /**
     * Return `Some`, if exactly this or the specified option is `Some`, `None` otherwise.
     *
     * @param other - the other operand of the check
     * @returns either this or the specified option if they match the filter, otherwise `None`
     */
    xor: (other: Option<T>) => Option<T>;

    /**
     * Return `None` if this option is `None`. If this is `Some`, call the `predicate` and return
     * the contained value of the option, if the `predicate` passes. Return `None` otherwise.
     *
     * @param predicate - the function to test the contained value with
     * @returns `None` if the contained value exists and did not pass the predicate, `this` option otherwise
     */
    filter: (predicate: (value: T) => boolean) => Option<T>;

    /**
     * Zip this option with the specified option.
     *
     * @param other - the other option to zip with
     * @returns a new option containing this and the other option or `None` if this option is empty
     */
    zip: <U>(other: Option<U>) => Option<[T, U]>;

    /**
     * Unzip this option of two tuple elements.
     *
     * @returns tuple of two options, if this option has two `Some` values, `None` otherwise.
     */
    unzip: <U>() => [Option<T>, Option<U>];
}

/**
 * `Some` indicates, that the option has a value of type `T`.
 */
type Some<T> = {
    /**
     * The type that indicates, that the optional contains a value.
     */
    type: 'some';

    /**
     * The contained value of the option.
     */
    value: T;
};

/**
 * `None` indicates, that the option is empty, thus does not contain a value.
 */
type None = {
    /**
     * The type that indicates, that the optional does not contain a value.
     */
    type: 'none';
};

/**
 * Represents a container, which may or may not contain a value.
 * This allows you to safely retrieve values from methods.
 *
 * # Examples
 * ```
 * let element = list.get(0)
 *     .expect("No such index")
 * ```
 */
export type Option<T> = (Some<T> | None) & IOption<T>;

/**
 * Represents an auto-wrapper of an asynchronous option type.
 */
export type AsyncOption<T> = Promise<Option<T>>;

/**
 * Create an option, that contains the specified value.
 * @param value - the value of the option
 * @returns a new option with the specified value
 */
export function Some<T>(value: T): Option<T> {
    if (value === undefined || value === null)
        console.warn('Creating an option with an undefined value', value);
    return { type: 'some', value, ...createBaseOption() };
}

/**
 * Create an option, that contains no value.
 * @returns a new option without a value
 */
export function None<T>(): Option<T> {
    return { type: 'none', ...createBaseOption() };
}

/**
 * Create an option, that contains the specified value if the `value` is not null, otherwise `None`.
 * @param value - the value of the option
 * @returns a new option with the specified value
 */
export function Maybe<T>(value: T | undefined | null): Option<T> {
    if (value === undefined || value === null) {
        return None();
    } else {
        return Some(value) as unknown as Option<T>;
    }
}

/**
 * Indicate, whether a value is present in the option.
 *
 * @returns `true` if this option is a `Some` value.
 */
function some<T>(this: Option<T>): boolean {
    return this.type == 'some';
}

/**
 * Indicate, whether the option is empty, and does not contain a value.
 *
 * @returns `true` if this option is a `None` value.
 */
function none<T>(this: Option<T>): boolean {
    return this.type == 'none';
}

/**
 * Retrieve the contained value of this option. If no value is associated for the option,
 * the program panics with an error.
 *
 * @returns the value inside the option
 */
function unwrap<T>(this: Option<T>): T {
    if (this.type === 'some') {
        return this.value;
    } else {
        throw new Error('Called `unwrap()` on a `None` `Option` value');
    }
}

/**
 * Retrieve the contained value of this option. If no value is associated for the option,
 * the default value is returned.
 *
 * @param def - the default value to return if this option is `None`
 * @returns the value inside the option
 */
function unwrapOr<T>(this: Option<T>, def: T): T {
    if (this.type == 'some') {
        return this.value;
    } else {
        return def;
    }
}

/**
 * Retrieve the contained value of this option. If no value is associated for the option,
 * the default value is supplied.
 *
 * @param supplier - the default value to be supplied if this option is `None`
 * @returns the value inside the option
 */
function unwrapOrGet<T>(this: Option<T>, supplier: () => T): T {
    if (this.type == 'some') {
        return this.value;
    } else {
        return supplier();
    }
}

/**
 * Retrieve the contained value of this option. If no value is associated for the option,
 * the program panics with the specified error message.
 *
 * @returns the value inside the option
 */
function expect<T>(this: Option<T>, msg: string): T {
    if (this.type == 'some') {
        return this.value;
    }
    throw msg;
}

/**
 * Retrieve and map the value contained of this option. This method handles both cases,
 * if the option has a value or if it does not.
 * @param matcher - option pattern matcher
 * @returns the mapped value of the option
 */
function match<T, R>(
    this: Option<T>,
    matcher: { some: (value: T) => R; none: () => R }
): R {
    return this.type === 'some' ? matcher.some(this.value) : matcher.none();
}

/**
 * Map the contained value of this option to the type of `U` using the specified mapper.
 * If the option is empty, a `None` is returned.
 *
 * @returns an option of type `U`
 */
function map<T, U>(this: Option<T>, mapper: (value: T) => U): Option<U> {
    if (this.type == 'some') {
        return Some(mapper(this.value));
    } else {
        return None();
    }
}

/**
 * Map the contained value of this option to the type of `U` using the specified mapper.
 * If the option is empty, a the default value is returned.
 *
 * @returns the mapped value or the default value
 */
function mapOr<T, U>(
    this: Option<T>,
    mapper: (value: T) => U,
    value: U
): Option<U> {
    if (this.type == 'some') {
        return Some(mapper(this.value));
    } else {
        return Some(value);
    }
}

/**
 * Return `None` if this option is `None`. Call the `mapper` with the held value and return the result.
 *
 * @param mapper - option mapper function
 * @returns the map result or `None`
 */
function flatMap<T, U>(
    this: Option<T>,
    mapper: (value: T) => Option<U>
): Option<U> {
    if (this.type == 'some') {
        return mapper(this.value);
    } else {
        return None();
    }
}

/**
 * Map the contained value of this option to the type of `U` using the specified mapper.
 * If the option is empty, a the default value is supplied.
 *
 * @returns the mapped value or the default value
 */
function mapOrElse<T, U>(
    this: Option<T>,
    mapper: (value: T) => U,
    supplier: () => U
): Option<U> {
    if (this.type == 'some') {
        return Some(mapper(this.value));
    } else {
        return Some(supplier());
    }
}

/**
 * Call the specified callback if the option contains a value.
 *
 * @param callback - the function to call if the option contains a value
 */
function inspect<T>(this: Option<T>, callback: (value: T) => void): Option<T> {
    if (this.type == 'some') {
        callback(this.value);
    }
    return this;
}

/**
 * Transform the option to a result, that is `Ok`, if this option has a value, `Err` otherwise.
 *
 * @param error - the error to be given in case of `Err`
 * @returns this option as a `Result`
 */
function ok<T>(this: Option<T>): Result<T, void> {
    if (this.type == 'some') {
        return Ok(this.value);
    } else {
        return Err(undefined as void);
    }
}

/**
 * Transform the option to a result, that is `Ok`, if this option has a value, `Err` otherwise.
 *
 * @param error - the error to be given in case of `Err`
 * @returns this option as a `Result`
 */
function okOr<T, E>(this: Option<T>, error: E): Result<T, E> {
    if (this.type == 'some') {
        return Ok(this.value);
    } else {
        return Err(error);
    }
}

/**
 * Transform the option to a result, that is `Ok`, if this option has a value, `Err` otherwise.
 *
 * @param error - the error to be supplied in case of `Err`
 * @returns this option as a `Result`
 */
function okOrElse<T, E>(this: Option<T>, error: () => E): Result<T, E> {
    if (this.type == 'some') {
        return Ok(this.value);
    } else {
        return Err(error());
    }
}

/**
 * Return `None` if this option is `None`, return `other` otherwise.
 *
 * @param other - the option to return if this option has a value
 * @returns the other option or `None`
 */
function and<T, U>(this: Option<T>, other: Option<U>): Option<U> {
    if (this.type == 'some') {
        return other;
    } else {
        return None();
    }
}

/**
 * Return the option, if it contains a value, return `other` otherwise.
 *
 * @param other - the other option to return if this option is empty
 * @returns this option or the other option, if this is `None`
 */
function or<T>(this: Option<T>, other: Option<T>): Option<T> {
    if (this.type == 'some') {
        return this;
    } else {
        return other;
    }
}

/**
 * Return the option, if it contains a value, return `other` otherwise.
 *
 * @param other - the suppleir for other option to return if this option is empty
 * @returns this option or the other option, if this is `None`
 */
function orElse<T>(this: Option<T>, other: () => Option<T>): Option<T> {
    if (this.type == 'some') {
        return this;
    } else {
        return other();
    }
}

/**
 * Return `Some`, if exactly this or the specified option is `Some`, `None` otherwise.
 *
 * @param other - the other operand of the check
 * @returns either this or the specified option if they match the filter, otherwise `None`
 */
function xor<T>(this: Option<T>, other: Option<T>): Option<T> {
    if (this.type == 'some' && other.type == 'none') {
        return this;
    } else if (this.type == 'none' && other.type == 'some') {
        return other;
    } else {
        return None();
    }
}

/**
 * Return `None` if this option is `None`. If this is `Some`, call the `predicate` and return
 * the contained value of the option, if the `predicate` passes. Return `None` otherwise.
 *
 * @param predicate - the function to test the contained value with
 * @returns `None` if the contained value exists and did not pass the predicate, `this` option otherwise
 */
function filter<T>(
    this: Option<T>,
    predicate: (value: T) => boolean
): Option<T> {
    if (this.type == 'some' && predicate(this.value)) {
        return this;
    } else {
        return None();
    }
}

/**
 * Zip this option with the specified option.
 *
 * @param other - the other option to zip with
 * @returns a new option containing this and the other option or `None` if this option is empty
 */
function zip<T, U>(this: Option<T>, other: Option<U>): Option<[T, U]> {
    if (this.type == 'some' && other.type == 'some') {
        return Some([this.value, other.value]);
    } else {
        return None();
    }
}

/**
 * Unzip this option of two tuple elements.
 *
 * @returns tuple of two options, if this option has two `Some` values, `None` otherwise.
 */
function unzip<T, U>(this: Option<[T, U]>): [Option<T>, Option<U>] {
    if (this.type === 'some') {
        const [valueT, valueU] = this.value;
        return [Some(valueT), Some(valueU)];
    } else {
        return [None(), None()] as never;
    }
}

/**
 * Implement the shared base functions for the option.
 * @returns a new object of the shared functions
 */
export function createBaseOption<T>(): IOption<T> {
    return {
        some,
        none,
        unwrap,
        unwrapOr,
        unwrapOrGet,
        expect,
        match,
        map,
        mapOr,
        flatMap,
        mapOrElse,
        inspect,
        ok,
        okOr,
        okOrElse,
        and,
        or,
        orElse,
        xor,
        filter,
        zip,
        unzip,
    };
}

/**
 * Create an actual result from the given object.
 * This ensures that results can be properly used when they are received from events.
 * @param result - raw result from an event
 * @returns a converted result that contains the method implementations
 */
export function optionFactory<T>(option: Option<T>): Option<T> {
    return { ...option, ...createBaseOption() };
}
