export interface ICriteria {
    isValid(validKeys: string[]): boolean;

    process(data: any[]): any[];
}
