import { Err, None, Ok, Option, Result, Some, optionFactory } from '.';

describe('testing optionals', () => {
    it('should handle options', () => {
        /** */
        const getVerificationCode = (): Option<string> => {
            return Some('ABC');
        };

        const option: Option<string> = getVerificationCode();
        expect(option.some()).toEqual(true);
        expect(option.none()).toEqual(false);
        expect(option.unwrapOr('CBA')).toEqual('ABC');

        expect(option.filter(val => val.length > 5).some()).toEqual(false);
        expect(option.map(val => val.length).unwrap()).toEqual(3);

        expect(() => option.unwrap()).not.toThrow();
        expect(() => None().unwrap()).toThrow();

        const first = None<number>();
        const second = Some(3);
        expect(
            first.or(second).match({
                some: value => value + 2,
                none: () => 0,
            })
        ).toEqual(3 + 2);
    });

    describe('unwrap', () => {
        it('should return the value of a `Some` option', () => {
            const option: Option<string> = Some('hello');
            const value = option.unwrap();

            expect(value).toBe('hello');
        });

        it('should throw an error for a `None` option', () => {
            const option: Option<string> = None();

            expect(() => option.unwrap()).toThrowError(
                'Called `unwrap()` on a `None` `Option` value'
            );
        });
    });

    describe('unwrapOr', () => {
        it('should return def for a `None` option', () => {
            const option: Option<string> = None();

            expect(option.unwrapOr('default')).toBe('default');
        });
    });

    describe('unwrapOrGet', () => {
        it('should call the unwarpOrGet and return `default`', () => {
            const unwartpOrGet = jest.fn(() => 'default');
            const option: Option<string> = None();
            expect(option.unwrapOrGet(unwartpOrGet)).toBe('default');
        });

        it('should return this value the unwarpOrGet function', () => {
            const unwartpOrGet = jest.fn(() => 'default');
            const option: Option<string> = Some('hello');
            expect(option.unwrapOrGet(unwartpOrGet)).toBe('hello');
        });
    });

    describe('expect', () => {
        it('should throw an msg for a expect function call', () => {
            const option: Option<string> = None();
            expect(() => option.expect('Testing expect')).toThrowError(
                'Testing expect'
            );
        });

        it('should return the value of a `Some` option', () => {
            const option: Option<string> = Some('hello');
            const value = option.expect('Expected a value');

            expect(value).toBe('hello');
        });
    });

    describe('match', () => {
        it('should call the `some` function for a `Some` option', () => {
            const option: Option<string> = Some('hello');
            const result = option.match({
                some: value => value.toUpperCase(),
                none: () => 'NONE',
            });

            expect(result).toBe('HELLO');
        });

        it('should call the `none` function for a `None` option', () => {
            const option: Option<string> = None();
            const result = option.match({
                some: value => value.toUpperCase(),
                none: () => 'NONE',
            });

            expect(result).toBe('NONE');
        });
    });

    describe('map', () => {
        it('should return a `None` option for a `None` option', () => {
            const option: Option<number> = None();
            const mappedOption = option.map(value => value * 2);

            expect(mappedOption.none()).toBe(true);
        });
    });

    describe('mapOr', () => {
        it('should return a `Some` option with the mapped value for a `Some` option', () => {
            const option: Option<number> = Some(5);
            const mappedOption = option.mapOr(value => value * 2, 0);

            expect(mappedOption.unwrap()).toBe(10);
        });

        it('should return a `Some` option with the default value for a `None` option', () => {
            const option: Option<number> = None();
            const mappedOption = option.mapOr(value => value * 2, 0);

            expect(mappedOption.unwrap()).toBe(0);
        });
    });

    describe('flatMap', () => {
        it('should return the mapped `Some` option for a `Some` option', () => {
            const option: Option<number> = Some(5);
            const mappedOption = option.flatMap(value => Some(value * 2));

            expect(mappedOption.unwrap()).toBe(10);
        });

        it('should return a `None` option for a `None` option', () => {
            const option: Option<number> = None();
            const mappedOption = option.flatMap(value => Some(value * 2));

            expect(mappedOption.none()).toBe(true);
        });
    });

    describe('mapOrElse', () => {
        it('should apply the mapper function if Option is Some', () => {
            const inputOption = Some(5); // Create a Some instance with a value
            const mapper = (value: number): number => value * 2;
            const supplier = (): number => 10;

            const result = inputOption.mapOrElse(mapper, supplier);

            expect(result).toEqual(Some(10)); // The value 5 should be doubled to 10
        });

        it('should apply the supplier function if Option is None', () => {
            const inputOption = None(); // Create a None instance
            const mapper = (value: unknown): number => (value as number) * 2; // Use a type assertion to tell TypeScript that the argument is of type number
            const supplier = (): number => 10;

            const result = inputOption.mapOrElse(mapper, supplier);

            expect(result).toEqual(Some(10)); // Since the Option is None, the supplier value 10 should be returned
        });
    });

    describe('inspect', () => {
        it('should call the callback function for a Some option', () => {
            const option: Option<number> = Some(5);
            const callback = jest.fn();
            const result = option.inspect(callback);
            expect(callback).toHaveBeenCalledWith(5);
            expect(result).toEqual(option);
        });

        it('should not call the callback function for a None option', () => {
            const option: Option<number> = None();
            const callback = jest.fn();
            const result = option.inspect(callback);
            expect(callback).not.toHaveBeenCalled();
            expect(result).toEqual(option);
        });
    });

    describe('ok', () => {
        it('should return an Ok result with the value of a Some option', () => {
            const option: Option<number> = Some(5);
            const result: Result<number, void> = option.ok();
            expect(result).toEqual(Ok(5));
        });

        it('should return an Err result with a default value for a None option', () => {
            const option: Option<number> = None();
            const result: Result<number, void> = option.ok();
            expect(result).toEqual(Err(undefined));
        });
    });

    describe('okOr', () => {
        it('should return an Ok result with the value of a Some option', () => {
            const option: Option<number> = Some(5);
            const result: Result<number, string> = option.okOr('error');
            expect(result).toEqual(Ok(5));
        });

        it('should return an Err result with the provided error for a None option', () => {
            const option: Option<number> = None();
            const result: Result<number, string> = option.okOr('error');
            expect(result).toEqual(Err('error'));
        });
    });

    describe('okOrElse', () => {
        it('should return an Ok result with the value of a Some option', () => {
            const option: Option<number> = Some(5);
            const result: Result<number, string> = option.okOrElse(
                () => 'error'
            );
            expect(result).toEqual(Ok(5));
        });

        it('should return an Err result with the result of the error function for a None option', () => {
            const option: Option<number> = None();
            const result: Result<number, string> = option.okOrElse(
                () => 'error'
            );
            expect(result).toEqual(Err('error'));
        });
    });

    describe('and', () => {
        it('should return the other option for a Some option', () => {
            const option1: Option<number> = Some(5);
            const option2: Option<string> = Some('hello');
            const result = option1.and(option2);
            expect(result).toEqual(option2);
        });

        it('should return None for a None option', () => {
            const option1: Option<number> = None();
            const option2: Option<string> = Some('hello');
            const result = option1.and(option2);
            expect(result).toEqual(None());
        });
    });

    describe('or', () => {
        it('should return the original option for a Some option', () => {
            const option1: Option<number> = Some(5);
            const option2: Option<number> = Some(10);
            const result = option1.or(option2);
            expect(result).toEqual(option1);
        });

        it('should return the other option for a None option', () => {
            const option1: Option<number> = None();
            const option2: Option<number> = Some(10);
            const result = option1.or(option2);
            expect(result).toEqual(option2);
        });
    });

    describe('orElse', () => {
        it('should return the original option for a Some option', () => {
            const option1: Option<number> = Some(5);
            const option2: Option<number> = Some(10);
            const result = option1.orElse(() => option2);
            expect(result).toEqual(option1);
        });

        it('should return the other option for a None option', () => {
            const option1: Option<number> = None();
            const option2: Option<number> = Some(10);
            const result = option1.orElse(() => option2);
            expect(result).toEqual(option2);
        });
    });

    describe('xor', () => {
        it('should return the original option for a Some option and a None option', () => {
            const option1: Option<number> = Some(5);
            const option2: Option<number> = None();
            const result = option1.xor(option2);
            expect(result).toEqual(option1);
        });

        it('should return the other option for a None option and a Some option', () => {
            const option1: Option<number> = None();
            const option2: Option<number> = Some(10);
            const result = option1.xor(option2);
            expect(result).toEqual(option2);
        });

        it('should return None for two Some options', () => {
            const option1: Option<number> = Some(5);
            const option2: Option<number> = Some(10);
            const result = option1.xor(option2);
            expect(result).toEqual(None());
        });

        it('should return None for two None options', () => {
            const option1: Option<number> = None();
            const option2: Option<number> = None();
            const result = option1.xor(option2);
            expect(result).toEqual(None());
        });
    });

    describe('filter', () => {
        it('should return the original option for a Some option that passes the predicate', () => {
            const option: Option<number> = Some(5);
            const result = option.filter(val => val > 0);
            expect(result).toEqual(option);
        });

        it('should return None for a Some option that fails the predicate', () => {
            const option: Option<number> = Some(5);
            const result = option.filter(val => val < 0);
            expect(result).toEqual(None());
        });

        it('should return None for a None option', () => {
            const option: Option<number> = None();
            const result = option.filter(val => val > 0);
            expect(result).toEqual(None());
        });
    });

    describe('zip', () => {
        it('should return a Some option with a tuple for two Some options', () => {
            const option1: Option<number> = Some(5);
            const option2: Option<string> = Some('hello');
            const result = option1.zip(option2);
            expect(result).toEqual(Some([5, 'hello']));
        });

        it('should return None for a None option and a Some option', () => {
            const option1: Option<number> = None();
            const option2: Option<string> = Some('hello');
            const result = option1.zip(option2);
            expect(result).toEqual(None());
        });

        it('should return None for a Some option and a None option', () => {
            const option1: Option<number> = Some(5);
            const option2: Option<string> = None();
            const result = option1.zip(option2);
            expect(result).toEqual(None());
        });

        it('should return None for two None options', () => {
            const option1: Option<number> = None();
            const option2: Option<string> = None();
            const result = option1.zip(option2);
            expect(result).toEqual(None());
        });
    });

    describe('unzip', () => {
        it('should return a tuple of Some options for a Some option with a tuple', () => {
            const option: Option<[number, string]> = Some([5, 'hello']);
            const [result1, result2] = option.unzip();
            expect(result1).toEqual(Some(5));
            expect(result2).toEqual(Some('hello'));
        });

        it('should return a tuple of None options for a None option', () => {
            const option: Option<[number, string]> = None();
            const [result1, result2] = option.unzip();
            expect(result1).toEqual(None());
            expect(result2).toEqual(None());
        });
    });

    describe('optionFactory', () => {
        it('should return an object with the same properties as the input option', () => {
            const option: Option<number> = Some(5);
            const result = optionFactory(option);
            expect(result).toEqual(option);
        });

        it('should return an object with additional properties', () => {
            const option: Option<number> = None();
            const result = optionFactory(option);
            expect(result).toEqual({
                ...option,
            });
        });
    });
});
