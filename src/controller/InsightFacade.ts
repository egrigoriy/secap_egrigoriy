import {
    IInsightFacade,
    InsightResponse,
    InsightDatasetKind,
} from "./IInsightFacade";
import {InsightModel} from "../model/InsightModel";
import Log from "../Util";

/**
 * This is the main programmatic entry point for the project.
 */
export default class InsightFacade implements IInsightFacade {
    private insightModel = new InsightModel();

    constructor() {
        Log.trace("InsightFacade::constructor");
    }

    public addDataset(id: string, content: string, kind: InsightDatasetKind): Promise<InsightResponse> {
        return new Promise((resolve, reject) => {
            this.insightModel.addDataset(id, content, kind)
                .then((result) => {
                    return resolve({code: 204, body: {result}});
                })
                .catch((err) => {
                    return reject({code: 400, body: {error: err.message}});
                });
        });
    }

    public removeDataset(id: string): Promise<InsightResponse> {
        return new Promise((resolve, reject) => {
            this.insightModel.removeDataset(id)
                .then((result) => {
                    return resolve({code: 204, body: {result}});
                })
                .catch((err) => {
                    return reject({code: 404, body: {error: err.message}});
                });
        });
    }

    public performQuery(query: string): Promise<InsightResponse> {
        return new Promise((resolve, reject) => {
            this.insightModel.performQuery(query)
                .then((result) => {
                    return resolve({code: 200, body: {result}});
                })
                .catch((err) => {
                    return reject({code: 400, body: {error: err.message}});
                });
        });
    }

    public listDatasets(): Promise<InsightResponse> {
        return new Promise((resolve, reject) => {
            this.insightModel.listDatasets()
                .then((result) => {
                    return resolve({code: 200, body: {result}});
                })
                .catch((err) => {
                    return reject({code: 404, body: {error: err.message}});
                });
        });
    }
}
