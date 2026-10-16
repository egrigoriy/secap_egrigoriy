import {IDataset} from "../DatasetProcessor";
import {InsightDatasetKind} from "../../../controller/IInsightFacade";
import {parse} from "parse5";
import {IGeoService} from "./geoservice/IGeoService";
import {AbstractDatasetParser} from "./AbstractDatasetParser";

export class RoomsParser extends AbstractDatasetParser {
    private geoService: IGeoService;

    constructor(geoService: IGeoService) {
        super();
        this.geoService = geoService;
    }

    /**
     * Returns an array of only XML files referenced by "index.xml"
     * @param files
     * @private
     */
    protected getOnlyEligibleFiles(files: Map<string, string>): string[] {
        const indexFile: string = files.get("index.xml");
        const parsedIndexFile: any = parse(indexFile);
        const validPaths = this.getAttributesByName(parsedIndexFile, "path");
        const eligibleFiles: string[] = [];
        for (const [fileName, fileContent] of files.entries()) {
            if (validPaths.includes("./" + fileName) && fileContent.includes("xml")) {
                eligibleFiles.push(fileContent);
            }
        }
        return eligibleFiles;
    }

    /**
     * Returns the dataset represented by given files
     * @param files
     * @private
     */
    protected async getDataset(files: string[]): Promise<IDataset> {
        const dataset: IDataset = {
            kind: InsightDatasetKind.Rooms,
            rows: [],
            numRows: 0,
        };
        dataset.rows = await this.extractRooms(files);
        dataset.numRows = dataset.rows.length;
        return dataset;
    }

    /**
     * Returns an array of rooms for given building files
     *
     * @param eligibleFiles
     * @private
     */
    private async extractRooms(eligibleFiles: string[]): Promise<any[]> {
        let rooms = [];
        for (const file of eligibleFiles) {
            rooms.push(...this.parseBuildingFile(file));
        }
        rooms = await this.setGeo(rooms);
        return rooms;
    }

    /**
     * Returns an array of rooms from a given building file
     *
     * @param file
     * @private
     */
    private parseBuildingFile(file: any): any[] {
        const doc = parse(file);
        const shortname = this.getSingleAttributeByName(doc, "id");
        const address = this.getSingleAttributeByName(doc, "address");
        const fullname = this.getSingleAttributeByName(doc, "name");
        const roomsNumbers = this.getAttributesByName(doc, "number");
        const roomsSeats = this.getAttributesByName(doc, "seats");
        const roomsTypes = this.getAttributesByName(doc, "type");
        const roomsFurnitures = this.getAttributesByName(doc, "furniture");
        const roomsLinks = this.getAttributesByName(doc, "link");

        const rooms = [];
        for (let i = 0; i < roomsNumbers.length; i++) {
            rooms.push({
                shortname,
                address,
                fullname,
                number: roomsNumbers[i],
                name: `${shortname}_${roomsNumbers[i]}`,
                seats: Number.parseInt(roomsSeats[i], 10),
                type: roomsTypes[i],
                furniture: roomsFurnitures[i],
                href: roomsLinks[i],
            });
        }
        return rooms;
    }

    /**
     * Set lat and lon properties of given rooms using this GeoService.
     * In case of error, the properties are set to 0.
     *
     * @param rooms
     * @private
     */
    private async setGeo(rooms: any[]): Promise<any[]> {
        const geoPromises = [];
        for (const room of rooms) {
            geoPromises.push(this.geoService.getLatLon(room.address));
        }

        Promise.all(geoPromises)
            .then((geodata) => {
                for (let i = 0; i < rooms.length; i++) {
                    rooms[i].lat = geodata[i].lat;
                    rooms[i].lon = geodata[i].lon;
                }
            })
            .catch((err) => {
                for (const room of rooms) {
                    room.lat = 0;
                    room.lon = 0;
                }
            });

        return rooms;
    }

    /**
     * Returns the attribute value of the first attribute corresponding to given attribute name in a given document
     * @param node
     * @param attrName
     * @private
     */
    private getSingleAttributeByName(node: any, attrName: string): any {
        return this.getAttributesByName(node, attrName)[0];
    }

    /**
     * Returns an array of attribute values corresponding to given attribute name in a document
     *
     * @param node
     * @param attrName
     * @private
     */
    private getAttributesByName(node: any, attrName: string): any[] {
        if (!node.childNodes) {
            return [];
        }

        const result = [];
        if (node.attrs) {
            const matchedAttr = node.attrs.find((attr: { name: string; value: string | number }) =>
                attr.name === attrName,
            );
            if (matchedAttr) {
                result.push(matchedAttr.value);
            }
        }

        for (const child of node.childNodes) {
            result.push(...this.getAttributesByName(child, attrName));
        }
        return result;
    }
}
