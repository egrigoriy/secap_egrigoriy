import {Key_C} from "../../../types";

/**
 * Represents a Display, a column filter by given keys
 */
export class Display {
    public keys: Key_C[];

    constructor(keys: Key_C[]) {
        this.keys = keys;
    }

    /**
     * Returns the keys of this display
     */
    public getKeys() {
        return this.keys;
    }

    /**
     * Returns true if this Display keys are among the given valid ones, otherwise false
     *
     * @param validKeys
     */
    public isValid(validKeys: string[]) {
        return this.keys.every((key) => validKeys.includes(key));
    }

    /**
     * Returns a copy of given array of records having properties matching this Display keys.
     *
     * @param data an array of records
     */
    public process(data: any[]): any[] {
        const aDataCopy = data.map((record) => ({...record}));
        return aDataCopy.map((record) => this.processRecord(record));
    }

    /**
     * Removes from given record properties not matching this Display keys.
     *
     * @param record
     */
    private processRecord(record: any): any {
        for (const key of Object.keys(record)) {
            if (!this.keys.includes(key as Key_C)) {
                delete record[key];
            }
        }
        return record;
    }
}
