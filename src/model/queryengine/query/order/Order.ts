import {DIRECTION, Key_C} from "../../../types";

/**
 * Represents an Order able to sort given results on one or more columns in given direction.
 *
 * "dir": "UP": Sort results ascending.
 * "dir": "DOWN": Sort results descending.
 *
 * The "keys" field allows for sorting by multiple keys (i.e., columns),
 * where each additional key resolves ties for the previous key.
 * "keys": ["courses_avg"]: sorts by a single key
 * "keys": ["courses_year", "courses_avg"]: sorts by multiple keys
 * In this example the course average should be used to resolve ties for courses in the same year.
 *
 * When no keys, then Order is valid and is transparent for processing
 */
export class Order {
    private readonly keys: Key_C[];
    private readonly dir: number;

    constructor(dir: DIRECTION = "UP", keys: Key_C[] = []) {
        this.dir = (dir === "UP") ? 1 : -1;
        this.keys = keys;
    }

    /**
     * Returns true if this order keys are among given valid keys, otherwise false
     *
     * @param validKeys
     */
    public isValid(validKeys: any[]) {
        return this.allKeysValid(validKeys);
    }

    /**
     * Returns a copy of given array of records sorted by this order keys.
     * If no keys, then just copy of input data is returned.
     *
     * @param data an array of records
     */
    public process(data: any[]): any[] {
        const aDataCopy = data.map((record) => ({...record}));

        if (this.orderDoesNotMatter()) {
            return aDataCopy;
        }
        return aDataCopy.sort((a: any, b: any) => {
            if (this.isLessThan(a, b)) {
                return -1 * this.dir;
            }
            if (this.isGreaterThan(a, b)) {
                return 1 * this.dir;
            }
            return 0;
        });

    }

    /**
     * Returns true if the order does not matter (i.e. no keys), otherwise false
     *
     * @private
     */
    private orderDoesNotMatter(): boolean {
        return this.keys.length === 0;
    }

    /**
     * Returns true if all keys of this order are among valid ones, otherwise false
     *
     * @param validKeys
     * @private
     */
    private allKeysValid(validKeys: any[]) {
        return this.keys.every((key) => validKeys.includes(key));
    }

    /**
     * Returns true if a is less than b on all keys of this order, otherwise false
     * Each additional key resolves ties for the previous key
     */
    private isLessThan(a: any, b: any): boolean {
        for (const key of this.keys) {
            if (a[key] < b[key]) {
                return true;
            }
            if (a[key] === b[key]) {
                continue;
            }
            if (a[key] > b[key]) {
                return false;
            }
        }
        return false;
    }

    /**
     * Returns true if a is greater than b on all keys of this order, otherwise false
     * Each additional key resolves ties for the previous key
     */
    private isGreaterThan(a: any, b: any): boolean {
        for (const key of this.keys) {
            if (a[key] < b[key]) {
                return false;
            }
            if (a[key] === b[key]) {
                continue;
            }
            if (a[key] > b[key]) {
                return true;
            }
        }
        return false;
    }
}
