import {InsightDatasetKind} from "../../../controller/IInsightFacade";
import {CoursesParser} from "./CoursesParser";
import {RoomsParser} from "./RoomsParser";
import {StubGeoService} from "./geoservice/StubGeoService";
import {UBCGeoService} from "./geoservice/UBCGeoService";

export class DatasetParserFactory {
    public static create(kind: InsightDatasetKind) {
        switch (kind) {
            case InsightDatasetKind.Courses:
                return new CoursesParser();
            case InsightDatasetKind.Rooms:
                return new RoomsParser(new StubGeoService());
                // return new RoomsParser(new UBCGeoService());
            default:
                throw new Error("Invalid kind: " + kind);
        }
    }
}
