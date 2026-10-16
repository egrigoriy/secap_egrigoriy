import {ApplyRule} from "./ApplyRule";
import {Key_C} from "../../../types";

/**
 * Represents a set of rules to be applied to given grouped data
 *
 * When no keys, then Apply is valid and is transparent for processing
 */
export class Apply {
    private readonly rules: ApplyRule[];

    constructor(rules: ApplyRule[] = []) {
        this.rules = rules;
    }

    /**
     * Returns true if all apply rules are valid (incl no rules) and no duplicate apply keys, otherwise false
     */
    public isValid(validKeys: string[]): boolean {
        return this.areRulesValid(validKeys) && this.noDuplicateApplyKeys();
    }

    /**
     * Returns an array of records with one more property per rule.
     *
     * @param groupedData an array of grouped records (i.e. array of array of data records)
     */
    public process(groupedData: any[][]): any[] {
        const aDataCopy = this.getDataCopy(groupedData);
        const allRulesApplied = this.applyAllRules(aDataCopy);
        return this.regroupDataTakingFirst(allRulesApplied);
    }

    /**
     * Returns all apply keys contained by this Rule
     */
    public getApplyKeys(): Key_C[] {
        return this.rules.map((rule) => rule.getApplyKey());
    }

    /**
     * Returns true, if no duplicate apply keys among rules found, otherwise false
     *
     * @private
     */
    private noDuplicateApplyKeys() {
        return new Set(this.getApplyKeys()).size === this.rules.length;
    }

    /**
     * Returns true if all rules are valid, otherwise false
     *
     * @private
     */
    private areRulesValid(validKeys: string[]) {
        return this.rules.every((rule) => rule.isValid(validKeys));
    }

    /**
     * Returns an array of regrouped records by taking only the first record of each group
     *
     * @param groupedData
     * @private
     */
    private regroupDataTakingFirst(groupedData: any[]) {
        const result: any[] = [];
        for (const group of groupedData) {
            result.push(group[0]);
        }
        return result;
    }

    /**
     * Returns a deep copy of array of grouped records
     *
     * @param groupedData is an array of groups of records
     * @private
     */
    private getDataCopy(groupedData: any[][]): any[][] {
        const aDataCopy = [];
        for (const group of groupedData) {
            aDataCopy.push(group.map((record: any) => ({...record})));
        }
        return aDataCopy;
    }

    /**
     * Returns result of applying all rules to given grouped data.
     * If no rules then returns the input data.
     *
     * @param groupedData is an array of groups of records
     * @private
     */
    private applyAllRules(groupedData: any[][]) {
        let toApplyRule = groupedData;
        for (const rule of this.rules) {
            toApplyRule = toApplyRule.map((group) => rule.process(group));
        }
        return toApplyRule;
    }
}
