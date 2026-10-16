import {ZipProcessor} from "./ZipProcessor";
import {Repository} from "../../repository/Repository";
import {InsightDataset, InsightDatasetKind} from "../../controller/IInsightFacade";
import {DatasetParserFactory} from "./datasetparser/DatasetParserFactory";
import {isKind, isReserved} from "../types";

export interface IDataset {
    kind: InsightDatasetKind;
    rows: any[];
    numRows: number;
}

export class DatasetProcessor {
    private repository: Repository = Repository.getInstance();

    public async addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<string> {
        if (!this.isValidId(id)) {
            throw new Error("Invalid id: " + id);
        }

        if (this.repository.exists(id)) {
            throw new Error("Already has dataset with id: " + id);
        }

        if (!isKind(kind)) {
            throw new Error("Invalid kind: " + kind);
        }

        let dataset: IDataset;
        try {
            dataset = await this.extractDataset(kind, content);
        } catch (err) {
            throw new Error("Invalid content");
        }

        this.repository.insert(id, dataset);

        return id;
    }

    public async removeDataset(id: string): Promise<string> {
        if (!this.isValidId(id)) {
            throw new Error("Invalid id: " + id);
        }

        if (!this.repository.exists(id)) {
            throw new Error("No dataset with id: " + id);
        }

        this.repository.remove(id);

        return id;
    }

    public async listDatasets(): Promise<InsightDataset[]> {
        const data = this.repository.getAll();
        const result = [];
        for (const [k, v] of data.entries()) {
            result.push({
                id: k,
                kind: v.kind,
                numRows: v.numRows,
            });
        }
        return result;
    }

    public getDatasetRecords(id: string): any[] {
        const data = this.repository.getAll();
        return data.get(id).rows.map((row) => ({...row}));
    }

    public hasSuchDataset(id: string, kind: string) {
        const data = this.repository.getAll();
        return data.has(id) && (data.get(id).kind.toString() === kind);
    }

    public hasNoDatasets(): boolean {
        return this.repository.getAll().size === 0;
    }

    private async extractDataset(kind: InsightDatasetKind, content: string) {
        const parser = DatasetParserFactory.create(kind);
        return await ZipProcessor.process(parser, content);
    }

    private isValidId(id: string): boolean {
        if ((id === null) || (id === undefined) || (id === "")) {
            return false;
        }
        if (id.includes(" ") || id.includes("_") || id.trim().length === 0) {
            return false;
        }

        if (isReserved(id)) {
            return false;
        }
        return true;
    }
}
