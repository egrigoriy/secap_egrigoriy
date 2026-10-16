import {KeyTranslator} from "./KeyTranslator";

export class DataTranslator {
    private keyTranslator: KeyTranslator;

    constructor(keyTranslator: KeyTranslator) {
        this.keyTranslator = keyTranslator;
    }
    public toQuery(data: any[]): any[] {
        return data.map((record) => this.translateRecordToQuery(record));
    }
    public fromQuery(id: string, data: any[]): any[] {
        return data.map((record) => this.translateRecordFromQuery(id, record));
    }

    private translateRecordFromQuery(id: string, record: any): any {
        const result: any = {};
        for (const [k, v] of Object.entries(record)) {
            result[this.keyTranslator.fromQuery(id, k)] = v;
        }
        return result;
    }

    private translateRecordToQuery(record: any): any {
        const result: any = {};
        for (const [k, v] of Object.entries(record)) {
            result[this.keyTranslator.toQuery(k)] = v;
        }
        return result;
    }
}
