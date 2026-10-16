import {Criteria} from "../../../types";
import {ICriteria} from "./ICriteria";
import {SCriteria} from "./SCriteria";
import {MCriteria} from "./MCriteria";

/**
 * Represents a logical AND operation over lhs and rhs criteria
 */
export class And implements ICriteria {
    private lhs: Criteria;
    private rhs: SCriteria | MCriteria;

    constructor(lhs: Criteria, rhs: SCriteria | MCriteria) {
        this.lhs = lhs;
        this.rhs = rhs;
    }

    /**
     * Returns true if keys of lhs and rhs criteria are valid
     *
     * @param validKeys
     */
    public isValid(validKeys: string[]): boolean {
        return this.lhs.isValid(validKeys) && this.rhs.isValid(validKeys);
    }

    /**
     * Returns given data filtered by lhs and then by rhs criteria
     *
     * @param data
     */

    public process(data: any[]): any[] {
        const lhsFilteredData = this.lhs.process(data);
        return this.rhs.process(lhsFilteredData);
    }
}
