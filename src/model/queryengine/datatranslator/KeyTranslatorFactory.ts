import {InsightDatasetKind} from "../../../controller/IInsightFacade";
import {CoursesKeyDictionary} from "./CoursesKeyDictionary";
import {RoomsKeyDictionary} from "./RoomsKeyDictionary";
import {KeyTranslator} from "./KeyTranslator";

export class KeyTranslatorFactory {
    public static create(kind: InsightDatasetKind) {
        switch (kind) {
            case InsightDatasetKind.Courses:
                return new KeyTranslator(CoursesKeyDictionary);
            case InsightDatasetKind.Rooms:
                return new KeyTranslator(RoomsKeyDictionary);
            default:
                throw new Error("Invalid kind");
        }
    }
}
