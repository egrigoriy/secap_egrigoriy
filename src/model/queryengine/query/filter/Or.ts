import {Criteria} from "../../../types";
import {ICriteria} from "./ICriteria";
import {SCriteria} from "./SCriteria";
import {MCriteria} from "./MCriteria";

/**
 * Represents a logical OR operation over lhs and rhs criteria
 */
export class Or implements ICriteria {
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
     * Returns data union of applying lhs and rhs over given data
     *
     * @param data
     */
    public process(data: any[]): any[] {
        const lhsData = this.lhs.process(data);
        const rhsData = this.rhs.process(data);
        return [... new Set([...lhsData, ...rhsData])];
    }
}
