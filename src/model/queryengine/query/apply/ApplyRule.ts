import {Aggregator, isMKey, isNumAggregator, isOtherAggregator, Key} from "../../../types";
import Decimal from "decimal.js";

/**
 * Represents a rule to be applied to data:
 * aggregation to be applied over given key and provide the result as property applyKey
 *
 * MAX: Find the maximum value of a field. For numeric fields only.
 * MIN: Find the minimum value of a field. For numeric fields only.
 * AVG: Find the average value of a field. For numeric fields only.
 * SUM: Find the sum of a field. For numeric fields only.
 * COUNT: Count the number of unique occurrences of a field. For both numeric and string fields.
 */
export class ApplyRule {
    private readonly applyKey: string;
    private readonly aggregator: Aggregator;
    private readonly key: Key;

    constructor(applyKey: string, aggregator: Aggregator, key: Key) {
        this.applyKey = applyKey;
        this.aggregator = aggregator;
        this.key = key;
    }

    /**
     * Returns the apply key
     */
    public getApplyKey(): string {
        return this.applyKey;
    }

    /**
     * Returns true if apply rule is valid, otherwise false
     * Validity:
     *      MAX/MIN/AVG should only be requested for numeric keys.
     *      COUNT for both numeric and string fields.
     */
    public isValid(validKeys: string[]): boolean {
        return validKeys.includes(this.key) && this.isValidAggregatorKeyPair();

    }

    /**
     * Returns a copy of data with added to each record a property "applyKey: aggregatedValue"
     *
     * @param data
     */
    public process(data: any[]): any[] {
        const aDataCopy = data.map((record) => ({...record}));

        const aggValue = this.getAggValue(aDataCopy);
        this.addAggValueToEachRecord(aDataCopy, aggValue);

        return aDataCopy;
    }

    /**
     * Return the value obtained by applying this rule to the given data
     *
     * @param data
     * @private
     */
    private getAggValue(data: any[]) {
        const aggColumnData = data.map((record) => record[this.key]);
        return this.getAggregateValue(aggColumnData);
    }

    /**
     * Return the aggregated value by applying the AGGREGATOR function to given array of data
     *
     * @param data
     * @private
     */
    private getAggregateValue(data: string[] | number[]): number {
        if (isNumAggregator(this.aggregator)) {
            data = data as number[];
            switch (this.aggregator) {
                case "MIN":
                    return this.calculateMIN(data);
                case "MAX":
                    return this.calculateMAX(data);
                case "AVG":
                    return this.calculateAVG(data);
                case "SUM":
                    return this.calculateSUM(data);
            }
        } else if (isOtherAggregator(this.aggregator)) {
            data = data as string[];
            switch (this.aggregator) {
                case "COUNT":
                    return new Set(data).size;
            }
        }
    }

    /**
     * Calculates the MIN in given array of numbers.
     *
     * @param numbers
     * @private
     */
    private calculateMIN(numbers: number[]) {
        let min = Number.MAX_VALUE;
        for (const n of numbers) {
            min = Math.min(min, n);
        }
        return min;
    }

    /**
     * Calculates the MIN in given array of numbers.
     *
     * @param numbers
     * @private
     */
    private calculateMAX(numbers: number[]) {
        let max = numbers[0];
        for (const n of numbers) {
            if (n > max) {
                max = n;
            }
        }
        return max;
    }

    /**
     * Calculates the AVERAGE as number rounded to two decimal places for given array of numbers.
     *
     * @param numbers
     * @private
     */
    private calculateAVG(numbers: number[]): number {
        // Convert you values to decimals (e.g., new Decimal(number)).
        const dataAsDecimals = numbers.map((value) => new Decimal(value));
        // Add the numbers being averaged using Decimal's add() method (and building up a variable called total)
        let total: Decimal = new Decimal(0);
        for (const value of dataAsDecimals) {
            total = Decimal.add(total, value);
        }
        // Calculate the average. numRows should not be converted to a Decimal e.g.,
        // let avg = total.toNumber() / numRows)
        const avg = total.toNumber() / numbers.length;
        // Round the average to the second decimal digit with toFixed(2) and cast the result back to a number type.
        // When casting to a number, you may appear to "lose" decimal places,
        // for instance Number("2.00") will display as 2.
        // This is okay. e.g., let res = Number(avg.toFixed(2))
        return Number(avg.toFixed(2));
    }

    /**
     * Calculates the SUM as number rounded to two decimal places for given array of numbers.
     *
     * @param numbers
     * @private
     */
    private calculateSUM(numbers: number[]): number {
        // SUM: Use toFixed(2) to round to two decimal places;
        let total: Decimal = new Decimal(0);
        for (const value of numbers) {
            total = Decimal.add(total, value);
        }
        return Number(total.toFixed(2));
    }

    /**
     * Adds aggregated value to each record as property: "applyKey: aggregatedValue"
     *
     * @param data
     * @param aggValue
     * @private
     */
    private addAggValueToEachRecord(data: any[], aggValue: number) {
        for (const record of data) {
            record[this.applyKey] = aggValue;
        }
    }

    private isValidAggregatorKeyPair() {
        return (isNumAggregator(this.aggregator) && isMKey(this.key)) || isOtherAggregator(this.aggregator);
    }

}
