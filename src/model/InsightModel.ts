import {QueryEngine} from "./queryengine/QueryEngine";
import {InsightDataset, InsightDatasetKind} from "../controller/IInsightFacade";
import {DatasetProcessor} from "./datasetprocessor/DatasetProcessor";

export class InsightModel {
    private datasetProcessor = new DatasetProcessor();
    private queryEngine = new QueryEngine();

    public async addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<string> {
        return await this.datasetProcessor.addDataset(id, content, kind);
    }

    public async removeDataset(id: string): Promise<string> {
        return await this.datasetProcessor.removeDataset(id);
    }

    public async listDatasets(): Promise<InsightDataset[]> {
        return await this.datasetProcessor.listDatasets();
    }

    public async performQuery(queryString: string): Promise<any[]> {
        if (this.datasetProcessor.hasNoDatasets()) {
            throw new Error("Shall load a dataset before to query!");
        }

        if (!this.queryEngine.isValid(queryString)) {
            throw new Error(`Invalid query: ${queryString}`);
        }

        try {
            return this.queryEngine.process(this.datasetProcessor);
        } catch (err) {
            throw new Error(`Cannot process your query: ${queryString}, cause of error: ` + err.message);
        }
    }
}
