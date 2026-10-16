import {MCriteria} from "./queryengine/query/filter/MCriteria";
import {SCriteria} from "./queryengine/query/filter/SCriteria";
import {And} from "./queryengine/query/filter/And";
import {Or} from "./queryengine/query/filter/Or";

const mkeys = ["Average", "Pass", "Fail", "Audit", "Latitude", "Longitude", "Seats", "Year"] as const;

export type MKey = typeof mkeys[number];

export function isMKey(x: string): x is MKey {
    return (mkeys as readonly string[]).includes(x);
}

const skeys = ["Department", "ID", "Instructor", "Title", "UUID", "Full Name", "Short Name",
"Number", "Name", "Address", "Type", "Furniture", "Link"] as const;

export type SKey = typeof skeys[number];

export function isSKey(x: string): x is SKey {
    return (skeys as readonly string[]).includes(x);
}

export type Key = MKey | SKey;

export type INPUT = string;

export type Key_C = Key | INPUT;

const mops = ["is greater than ", "is not greater than ",
    "is less than ", "is not less than ",
    "is equal to ", "is not equal to "] as const;

export type MOp = typeof mops[number];

export function isMop(x: string): x is MOp {
    return (mops as readonly string[]).includes(x);
}

const sops = ["is ", "is not ", "includes ", "does not include ", "begins with ", "does not begin with ",
    "ends with ", "does not end with "] as const;

export type SOp = typeof sops[number];

export function isSop(x: string): x is SOp {
    return (sops as readonly string[]).includes(x);
}

export type Criteria = MCriteria | SCriteria | And | Or;

const numAggregators = ["MIN", "MAX", "SUM", "AVG"] as const;
export type NumAggregator = typeof numAggregators[number];

export function isNumAggregator(x: string): x is NumAggregator {
    return (numAggregators as readonly string[]).includes(x);
}

const otherAggregators = ["COUNT"] as const;
export type OtherAggregator = typeof otherAggregators[number];

export function isOtherAggregator(x: string): x is OtherAggregator {
    return (otherAggregators as readonly string[]).includes(x);
}

const aggregators = [...numAggregators, ...otherAggregators] as const;

export type Aggregator = typeof aggregators[number];

export function isAggregator(x: string): x is Aggregator {
    return (aggregators as readonly string[]).includes(x);
}

const kinds = ["courses", "rooms"] as const;

export type Kind = typeof kinds[number];

export function isKind(x: string): x is Kind {
    return (kinds as readonly string[]).includes(x);
}

export type DIRECTION = "UP" | "DOWN";

const keywords = ["In", "dataset", "find", "all", "show", "and", "or", "sort", "by", "entries",
    "grouped", "where", "is", "the", "of", "whose"] as const;

export type Keyword = typeof keywords[number];

export function isKeyword(x: string): x is Keyword {
    return (keywords as readonly string[]).includes(x);
}

export function isReserved(x: string): boolean {
    return isKeyword(x) || isMop(x) || isSop(x) || isAggregator(x);
}
