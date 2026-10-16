import * as path from "path";
import Log from "../Util";
import {IDataset} from "../model/datasetprocessor/DatasetProcessor";
import * as fs from "fs";
import {PathLike} from "fs";

export class Repository {
    public static getInstance() {
        if (!fs.existsSync(this.memoryDir)) {
            fs.mkdirSync(this.memoryDir);
        }
        if (!Repository.instance) {
            Repository.instance = new Repository();
        }
        return Repository.instance;
    }

    private static instance: Repository = null;
    private static memoryDir = path.join(path.dirname(__filename), "..", "..", "/data");
    private dbFileExtension = ".json";

    private constructor() {
        this.makeMemoryDir();
    }
    /**
     * Reads all datasets from repository
     * @return a Map with record id/dataset as key/value pair
     */
    public getAll(): Map<string, IDataset> {
        let filesPaths: string[];
        try {
            filesPaths = this.getAllRepositoryFilesPaths();
        } catch (e) {
            const message = `Cannot read all datasets from repository`;
            Log.error(message);
            throw new Error(message);
        }
        const result = new Map<string, IDataset>();
        for (const filePath of filesPaths) {
            const {id, dataset} = this.getSingleDataset(filePath);
            result.set(id, dataset);
        }
        return result;
    }

    /**
     * Returns the dataset stored in repository with given id
     *
     * @param id
     * @return a dataset
     * @throws an Error if the dataset cannot be get
     */
    public get(id: string): IDataset {
        const filePathTo = this.getFilePathTo(id);
        try {
            const content = this.getContent(filePathTo);
            return JSON.parse(content.toString());
        } catch (err) {
            const message = `Cannot get dataset for id: ${id}`;
            Log.error(message);
            throw new Error(message);
        }
    }

    /**
     * Writes to repository the given dataset under given id
     * @param id
     * @param dataset
     * @throws an Error if the record cannot be inserted
     */
    public insert(id: string, dataset: IDataset) {
        try {
            this.writeToFile(id, dataset);
        } catch (e) {
            const message = `Cannot insert id: ${id} for dataset ${dataset}`;
            Log.error(message);
            throw new Error(message);
        }
    }

    /**
     * Deletes a record with given id from repository
     * @param id
     * @throws an Error if
     */
    public remove(id: string): void {
        const file = this.getFilePathTo(id);
        try {
            fs.unlinkSync(file);
        } catch (e) {
            const message = `Cannot delete file: ${file}`;
            Log.error(message);
            throw new Error(message);
        }
    }

    /**
     * Cleans the repository, i.e. removes all records inserted before
     * @throws an Error if operation is unsuccessful
     */
    public clean() {
        if (fs.existsSync(Repository.memoryDir)) {
            try {
                this.removeAllFiles();
            } catch (e) {
                const message = `Cannot clean the repository`;
                Log.error(message);
                throw new Error(message);
            }
        }
    }

    /**
     * Return true if dataset with given id is in repository, otherwise false
     * @param id
     */
    public exists(id: string) {
        return fs.existsSync(this.getFilePathTo(id));
    }

    /**
     * Removes memory dir.
     * TO BE USED ONLY FOR TESTING REPOSITORY CLASS
     */
    public removeMemoryDir() {
        fs.rmdirSync(Repository.memoryDir, {recursive: true});
    }

    /**
     * Create a directory defined by the class field
     */
   public  makeMemoryDir() {
        if (!fs.existsSync(Repository.memoryDir)) {
            fs.mkdirSync(Repository.memoryDir);
        }
    }

    /**
     * Returns the id and the file content as string for given file path
     * @param filePath
     * @private
     */
    private getSingleDataset(filePath: string) {
        const content = this.getContent(filePath);
        const id = this.getIdFromFileName(filePath);
        const dataset: IDataset = JSON.parse(content.toString());
        return {id, dataset};
    }

    /**
     * Deletes all files with given extension from given directory
     * @private
     * @throws an Error if a file cannot be deleted
     */
    private removeAllFiles() {
        const files = this.getAllRepositoryFilesPaths();
        for (const file of files) {
            try {
                fs.unlinkSync(file);
            } catch (e) {
                const message = `Cannot delete file: ${file}`;
                Log.error(message);
                throw new Error(message);
            }
        }
    }

    /**
     * Writes a given record with given id to the disk
     * @param id
     * @param dataset
     * @private
     * @throws an Error if the file cannot be written
     */
    private writeToFile(id: string, dataset: IDataset) {
        const file = this.getFilePathTo(id);
        try {
            fs.writeFileSync(file, JSON.stringify(dataset), {flag: "wx"});
        } catch (e) {
            const message = `Cannot write file: ${file}`;
            Log.error(message);
            throw new Error(message);
        }
    }

    /**
     * Reads the content of a given file
     * @param file
     * @private
     * @throws an Error if the file cannot be red
     */
    private getContent(file: PathLike): Buffer {
        try {
            return fs.readFileSync(file);
        } catch (e) {
            const message = `Cannot read file: ${file}`;
            Log.error(message);
            throw new Error(message);
        }
    }

    /**
     * Returns the file path from given id
     * @param id
     * @private
     */
    private getFilePathTo(id: string): PathLike {
        return path.join(Repository.memoryDir, id + this.dbFileExtension);
    }

    /**
     * Returns the id corresponding to the given fileName
     * @param fileName
     * @private
     */
    private getIdFromFileName(fileName: string): string {
        return path.parse(fileName).name;
    }

    /**
     * Returns an array of absolute paths to all files with defined extension in defined directory
     * @private
     */
    private getAllRepositoryFilesPaths(): string[] {
        const allFiles = this.readDirectory();
        const validFiles: string[] = allFiles.filter((fileName) =>
            path.extname(fileName).toLowerCase() === this.dbFileExtension,
        );
        const absPathsToValidFiles: string[] = validFiles.map((fileName) =>
            path.join(Repository.memoryDir, fileName));
        return absPathsToValidFiles;
    }

    /**
     * Returns an array of all file names from defined directory
     * @private
     * @throws an Error when cannot read the defined directory
     */
    private readDirectory(): string[] {
        let allFiles: string[];
        try {
            allFiles = fs.readdirSync(Repository.memoryDir);
        } catch (err) {
            const message = `Cannot read files from directory: ${Repository.memoryDir}`;
            Log.error(message);
            throw new Error(message);
        }
        return allFiles;
    }
}
