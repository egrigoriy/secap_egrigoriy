import * as JSZip from "jszip";
import {IDataset} from "./DatasetProcessor";
import {IDatasetParser} from "./datasetparser/IDatasetParser";

export class ZipProcessor {
    /**
     * Returns a dataset as result of processing a given content with given parser
     * @param parser
     * @param content
     */
    public static async process(parser: IDatasetParser, content: string): Promise<IDataset> {
        const zipContent = await ZipProcessor.getZipContent(content);
        const files = await ZipProcessor.readFilesFromZip(zipContent);
        return await parser.parse(files);
    }

    /**
     * Reads the zip archive content
     * @param content
     * @private
     * @throws an Error the given content is not a valid zip file
     */
    private static async getZipContent(content: string) {
        const zip = JSZip();
        try {
            await zip.loadAsync(content, {base64: true});
        } catch (e) {
            throw new Error("Invalid zip file: " + zip.name);
        }
        return zip;
    }

    /**
     * Returns a Map with file name/content as key/value pair
     * @param zip
     * @private
     */
    private static async readFilesFromZip(zip: JSZip): Promise<Map<string, string>> {
        const files = Object.values(zip.files);
        const result = new Map<string, string>();
        for (const file of files) {
            let fileContent: string;
            try {
                fileContent = await file.async("text");
            } catch (e) {
               throw new Error("Unable to read from zip the file: " + file);
            }
            result.set(file.name, fileContent);
        }
        return result;
    }
}
