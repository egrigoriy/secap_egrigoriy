import {DatasetProcessor} from "../datasetprocessor/DatasetProcessor";
import {InsightDatasetKind} from "../../controller/IInsightFacade";
import {DataTranslatorFactory} from "./datatranslator/DataTranslatorFactory";
import {QueryParserFactory} from "./queryparser/QueryParserFactory";
import {AbstractQuery} from "./query/AbstractQuery";

export class QueryEngine {
    private query: AbstractQuery;

    public isValid(queryString: string) {
        try {
            const queryParser = QueryParserFactory.create(queryString);
            this.query = queryParser.parse(queryString);
            return this.query.isValid();
        } catch (e) {
            return false;
        }
    }

    public process(datasetProcessor: DatasetProcessor): any[] {
        const id = this.query.getId();
        const kind = this.query.getKind() as InsightDatasetKind;
        if (!datasetProcessor.hasSuchDataset(id, kind)) {
            throw new Error("No such dataset loaded!");
        }
        const data: any[] = datasetProcessor.getDatasetRecords(id);
        const dataTranslator = DataTranslatorFactory.create(kind);
        const translatedInData = dataTranslator.toQuery(data);
        const processedData = this.query.process(translatedInData);
        const translatedOutData = dataTranslator.fromQuery(id, processedData);
        return translatedOutData;
    }
}
