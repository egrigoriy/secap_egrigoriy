import {MKey, MOp} from "../../../types";
import {ICriteria} from "./ICriteria";

type MComparator = (value: number, threshold: number) => boolean;

/**
 * Represents a Criteria over given MKey
 */
export class MCriteria implements ICriteria {
    private readonly key: MKey;
    private readonly op: MOp;
    private readonly aNumber: number;

    constructor(key: MKey, op: MOp, aNumber: number) {
        this.key = key;
        this.op = op;
        this.aNumber = aNumber;
    }

    /**
     * Returns true if this MCriteria key is among given ones, otherwise false
     *
     * @param validKeys
     */
    public isValid(validKeys: string[]) {
        return validKeys.includes(this.key);
    }

    /**
     * Returns a given data filtered by this MCriteria
     *
     * @param data
     */
    public process(data: any[]): any[] {
        const criteria: MComparator = this.getComparator();
        return data.filter((record) => {
            return criteria(record[this.key], this.aNumber);
        });
    }

    /**
     * Returns a comparator function corresponding to this Criteria op sting
     *
     * @private
     */
    private getComparator(): MComparator {
        let comparator: MComparator;
        switch (this.op) {
            case "is greater than ":
                comparator = (key, value) => key > value;
                break;
            case "is not greater than ":
                comparator = (key, value) => !(key > value);
                break;
            case "is less than ":
                comparator = (key, value) => key < value;
                break;
            case "is not less than ":
                comparator = (key, value) => !(key < value);
                break;
            case "is equal to ":
                comparator = (key, value) => key === value;
                break;
            case "is not equal to ":
                comparator = (key: any, value: any) => !(key === value);
                break;
            default:
                throw new Error(`Unexpected MOp string: ${name}`);
        }
        return comparator;
    }
}
