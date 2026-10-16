import {Key} from "../../../types";

/**
 * Represents a GROUP: Group the list of results into sets by given keys.
 *
 * When no keys, then Group is valid and is transparent for processing
 */
export class Group {
    private readonly keys: Key[];

    constructor(keys: Key[] = []) {
        this.keys = keys;
    }

    /**
     * Returns all keys contained by this Group
     */
    public getKeys() {
        return this.keys;
    }

    /**
     * Returns true if this group keys are among the given valid keys, otherwise false
     */
    public isValid(validKeys: string[]) {
        return this.allKeysValid(validKeys);
    }

    /**
     * Returns the given data grouped by this Group keys.
     * If no key, no processing is done and copy is input data is returned.
     *
     * @param filteredData
     */
    public process(filteredData: any[]): any[] | any[][] {
        const aDataCopy = filteredData.map((record) => ({...record}));

        if (this.keys.length === 0) {
            return aDataCopy;
        }
        return this.groupData(aDataCopy);
    }

    /**
     * Returns the given data grouped by this Group keys.
     *
     * @param filteredData
     * @private
     */
    private groupData(filteredData: any[]): any[][] {
        let toGroup = [filteredData];
        for (const key of this.keys) {
            const grouped = [];
            for (const data of toGroup) {
                grouped.push(...this.group(data, key));
            }
            toGroup = grouped;
        }
        return toGroup;
    }

    /**
     * Returns an array of array of records, where each subarray is grouped by given key
     * Groups a given array of records by a given key, and returns
     *
     * @param data
     * @param key
     * @private
     */
    private group(data: any[], key: Key) {
        const map = new Map<string, any[]>();
        for (const record of data) {
            const k = record[key] as string;
            if (map.has(k)) {
                map.get(k).push(record);
            } else {
                map.set(k, [record]);
            }
        }

        return map.values();
    }

    /**
     * Returns true if this group keys are among the given valid keys, otherwise false
     */
    private allKeysValid(validKeys: any[]) {
        return this.keys.every((key) => validKeys.includes(key));
    }
}
