import {Criteria} from "../../../types";

/**
 * Represents a Filter containing matching criteria
 */
export class Filter {
    private readonly criteria: Criteria;

    constructor(criteria: Criteria = null) {
        this.criteria = criteria;
    }

    /**
     * Return a copy of given data filtered by this Filter Criteria
     *
     * @param data
     */
    public process(data: any[]): any[] {
        const aDataCopy = data.map((record) => ({...record}));
        const noCriteriaPredicate = () => true;
        if (this.criteria === null) {
            return aDataCopy.filter(noCriteriaPredicate);
        }
        return this.criteria.process(data);
    }

    /**
     * Returns true if this Filter Criteria keys are among given ones, otherwise return false.
     * No criteria is a true case.
     *
     * @param validKeys
     */
    public isValid(validKeys: string[]) {
        if (this.criteria !== null) {
            return this.criteria.isValid(validKeys);
        }
        return true;
    }
}
