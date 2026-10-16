import {IDataset} from "../DatasetProcessor";
import {IDatasetParser} from "./IDatasetParser";

export abstract class AbstractDatasetParser implements IDatasetParser {
    /**
     * Returns a dataset
     * @param files
     * @throws an Error when the dataset is not valid
     */
    public async parse(files: Map<string, string>): Promise<IDataset> {
        const eligibleFiles: string[] = this.getOnlyEligibleFiles(files);
        const dataset = await this.getDataset(eligibleFiles);
        if (!this.isValidDataset(dataset)) {
            throw new Error("Invalid dataset");
        }
        return dataset;
    }

    /**
     * Returns true if a dataset is valid dataset, otherwise false
     * @param dataset
     * @protected
     */
    protected isValidDataset(dataset: IDataset): boolean {
        return dataset.numRows > 0;
    }

    protected abstract getOnlyEligibleFiles(files: Map<string, string>): string[];

    protected abstract getDataset(files: string[]): Promise<IDataset>;
}
