import {IDataset} from "../DatasetProcessor";

export interface IDatasetParser {
    parse(files: Map<string, string>): Promise<IDataset>;
}
