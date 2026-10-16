import {IDataset} from "../DatasetProcessor";
import {InsightDatasetKind} from "../../../controller/IInsightFacade";
import {AbstractDatasetParser} from "./AbstractDatasetParser";

export class CoursesParser extends AbstractDatasetParser {

    /**
     * Returns an array of only CSV files located in Course folder
     * @param files
     * @protected
     */
    protected getOnlyEligibleFiles(files: Map<string, string>): string[] {
        const eligibleFiles: string[] = [];
        for (const fileName of files.keys()) {
            if (fileName.startsWith("courses/") && fileName.toLowerCase().endsWith(".csv")) {
                eligibleFiles.push(files.get(fileName));
            }
        }
        return eligibleFiles;
    }

    /**
     * Returns the dataset represented by given files
     * @param files
     * @protected
     */
    protected getDataset(files: string[]): Promise<IDataset> {
        const dataset: IDataset = {
            kind: InsightDatasetKind.Courses,
            rows: [],
            numRows: 0,
        };
        dataset.rows = this.extractSections(files);
        dataset.numRows = dataset.rows.length;
        return Promise.resolve(dataset);
    }

    /**
     * Extracts sections from given files
     * @param files
     * @private
     */
    private extractSections(files: string[]): any[] {
        const sections: any[] = [];
        for (const fileContent of files) {
            // spit to rows
            const rows = fileContent.split(/\r\n/);
            // for each row but header push to sections
            const header = rows[0];
            const eligibleSections = rows.slice(1, -1);
            sections.push(...eligibleSections.map((sectionString) => this.getSection(header, sectionString)));
        }
        return sections;
    }

    /**
     * Returns a section record from given header and sectionString
     * @param header
     * @param sectionString
     * @private
     */
    private getSection(header: string, sectionString: string) {
        const headers = header.split("|");
        const fields = sectionString.split("|");
        const section: any = {};
        headers.forEach((heading, i) => section[heading] = fields[i]);

        return this.correctSectionValueTypes(section);
    }

    /**
     * Correct types of some section record to be numbers
     * @param section
     * @private
     */
    private correctSectionValueTypes(section: any): any {
        // section["Year"] = Number.parseInt(section["Year"], 10);
        // section["Avg"] = Number.parseFloat(section["Avg"]);
        // section["Pass"] = Number.parseInt(section["Pass"], 10);
        // section["Fail"] = parseInt(section["Fail"], 10);
        // section["Audit"] = parseInt(section["Audit"], 10);
        //
        // if ((section["Section"] !== undefined) && (section["Section"] === "overall")) {
        //     section["Year"] = 1900;
        // }
        section["Year"] = Number(section["Year"]);
        section["Avg"] = Number(section["Avg"]);
        section["Pass"] = Number(section["Pass"]);
        section["Fail"] = Number(section["Fail"]);
        section["Audit"] = Number(section["Audit"]);

        if ((section["Section"] !== undefined) && (section["Section"] === "overall")) {
            section["Year"] = 1900;
        }
        return section;
    }
}
