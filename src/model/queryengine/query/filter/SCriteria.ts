import {SKey, SOp} from "../../../types";
import {ICriteria} from "./ICriteria";

type SComparator = (value: string, threshold: string) => boolean;

/**
 * Represents a Criteria over given SKey
 */
export class SCriteria implements ICriteria {
    private readonly key: SKey;
    private readonly op: SOp;
    private readonly aString: string;

    constructor(key: SKey, op: SOp, aString: string ) {
        this.key = key;
        this.op = op;
        this.aString = aString;
    }

    /**
     * Returns true if this SCriteria key is among given ones, otherwise false
     *
     * @param validKeys
     */
    public isValid(validKeys: string[]): boolean {
        return validKeys.includes(this.key);
    }

    /**
     * Returns a given data filtered by this SCriteria
     *
     * @param data
     */
    public process(data: any[]): any[] {
        const criteria: SComparator = this.getComparator();
        return data.filter((record) => {
            return criteria(record[this.key], this.aString);
        });
    }

    /**
     * Returns a comparator function corresponding to this Criteria op sting
     *
     * @private
     */
    private getComparator(): SComparator {
        let comparator: SComparator;
        switch (this.op) {
            case "is ":
                comparator = (key, value) => key === value;
                break;
            case "is not ":
                comparator = (key, value) => !(key === value);
                break;
            case "includes ":
                comparator = (key, value) => key.includes(value);
                break;
            case "does not include ":
                comparator = (key, value) => !(key.includes(value));
                break;
            case "begins with ":
                comparator = (key, value) => key.startsWith(value);
                break;
            case "does not begin with ":
                comparator = (key, value) => !(key.startsWith(value));
                break;
            case "ends with ":
                comparator = (key, value) => key.endsWith(value);
                break;
            case "does not end with ":
                comparator = (key, value) => !(key.endsWith(value));
                break;
            default:
                throw new Error(`Unexpected SOp string: ${name}`);
        }
        return comparator;
    }
}
