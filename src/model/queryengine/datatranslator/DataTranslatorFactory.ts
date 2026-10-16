import {InsightDatasetKind} from "../../../controller/IInsightFacade";
import {DataTranslator} from "./DataTranslator";
import {KeyTranslatorFactory} from "./KeyTranslatorFactory";

export class DataTranslatorFactory {
   public static create(kind: InsightDatasetKind) {
       const keyTranslator = KeyTranslatorFactory.create(kind);

       return new DataTranslator(keyTranslator);
   }
}
