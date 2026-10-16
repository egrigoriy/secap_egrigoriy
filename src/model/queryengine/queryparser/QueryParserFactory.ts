import {QueryAggregateParser} from "./QueryAggregateParser";
import {QueryNormalParser} from "./QueryNormalParser";

export class QueryParserFactory {
    public static create(queryString: string) {
        if (queryString.includes("grouped by")) {
            return new QueryAggregateParser();
        }
        return new QueryNormalParser();
    }
}
