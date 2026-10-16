const Spec = [
    // DATASET tokens
    // [/^In /, "In "],
    // [/^courses /, "KIND"],
    // [/^rooms /, "KIND"],
    [/^In courses |In rooms /, "In KIND "],
    [/^dataset /, "dataset "],
    [/^ grouped by /, " grouped by "],
    // FILTER tokens
    [/^find all entries/, "find all entries"],
    [/^find entries whose /, "find entries whose "],
    // DISPLAY tokens
    [/^show /, "show "],
    // AGGREGATION tokens
    [/^where /, "where "],
    [/^ is the /, " is the "],
    [/^ of /, " of "],
    // M_KEY
    [/^\b(Average|Pass|Fail|Audit|Year)\b/, "M_KEY"],
    [/^\b(Latitude|Longitude|Seats)\b/, "M_KEY"],
    // S_KEY
    [/^\b(Department|ID|Instructor|Title|UUID)\b/, "S_KEY"],
    [/^\b(Full Name|Short Name|Number|Name|Address|Type|Furniture|Link)\b/, "S_KEY"],
    // Aggregators
    [/^\b(MIN|MAX|AVG|COUNT|SUM)\b/, "AGGREGATOR"],
    // Operators
    [/^ and /, " and "],
    [/^ or /, " or "],
    // M_OP
    [/^is greater than /, "M_OP"],
    [/^is not greater than /, "M_OP"],
    [/^is less than /, "M_OP"],
    [/^is not less than /, "M_OP"],
    [/^is equal to /, "M_OP"],
    [/^is not equal to /, "M_OP"],
    // S_OP
    [/^is not /, "S_OP"],
    [/^is /, "S_OP"],
    [/^includes /, "S_OP"],
    [/^does not include /, "S_OP"],
    [/^begins with /, "S_OP"],
    [/^does not begin with /, "S_OP"],
    [/^ends with /, "S_OP"],
    [/^does not end with /, "S_OP"],
    // NUMBER
    [/^[-]?\d+([.]?\d+)?/, "NUMBER"],
    // STRING
    [/^"[^*"]*"/, "STRING"],
    // ORDER tokens
    [/^sort in /, "sort in "],
    [/^ascending /, "DIRECTION"],
    [/^descending /, "DIRECTION"],
    [/^order by /, "order by "],
    // Separator
    [/^; /, "; "],
    [/^, /, ", "],
    [/^\s/, " "],
    // END
    [/^[.]/, "."],
    // MUST BE LAST AS IS BROAD
    [/^[^\s_;,.]+/, "INPUT"],
];

export class Tokenizer {
    private cursor: number;
    private query: string;

    public init(query: string) {
        this.query = query;
        this.cursor = 0;
    }

    public getNextToken(): any {
        if (this.hasNoMoreTokens()) {
            return null;
        }
        const query = this.query.slice(this.cursor);

        for (const [regexp, tokenType] of Spec) {
            const matched = (regexp as RegExp).exec(query);
            if (matched !== null) {
                this.cursor += matched[0].length;
                return {
                    type: tokenType,
                    value: matched[0],
                };
            }
        }
        throw new Error(`Unknown token!!! The rest was: ${query}`);
    }

    private hasNoMoreTokens(): boolean {
        return this.cursor === this.query.length;
    }
}
