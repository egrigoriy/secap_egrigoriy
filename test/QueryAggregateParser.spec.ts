import {expect} from "chai";
import {Order} from "../src/model/queryengine/query/order/Order";
import {Display} from "../src/model/queryengine/query/display/Display";
import {Filter} from "../src/model/queryengine/query/filter/Filter";
import {SCriteria} from "../src/model/queryengine/query/filter/SCriteria";
import {Or} from "../src/model/queryengine/query/filter/Or";
import {Group} from "../src/model/queryengine/query/group/Group";
import {Apply} from "../src/model/queryengine/query/apply/Apply";
import {QueryAggregate} from "../src/model/queryengine/query/QueryAggregate";
import {ApplyRule} from "../src/model/queryengine/query/apply/ApplyRule";
import {QueryAggregateParser} from "../src/model/queryengine/queryparser/QueryAggregateParser";

describe("QueryAggregate Parser Test", function () {
    describe("Filter - FIND ALL ENTRIES, NO SORT", function () {
        it("should return ast", function () {
            const query = "In courses dataset courses grouped by Department and Title, " +
                "find all entries; " +
                "show Department and count, where count is the COUNT of Department.";
            const queryParser = new QueryAggregateParser();
            const actualAST = queryParser.parse(query);
            const expectedAST = new QueryAggregate({
                kind: "courses",
                id: "courses",
                group: new Group(["Department", "Title"]),
                filter: new Filter(),
                display: new Display([
                    "Department",
                    "count",
                ]),
                apply: new Apply([new ApplyRule("count", "COUNT", "Department")]),
                order: new Order(),
            });

            expect(actualAST).to.deep.equal(expectedAST);
        });
    });
    describe("Filter - FIND ALL ENTRIES, SORT BY M_KEY", function () {
        it("should return ast", function () {
            const query = "In courses dataset courses grouped by Department and Title, " +
                "find all entries; " +
                "show Department, Average and count, where count is the COUNT of Department; " +
                "sort in ascending order by Average and Department.";
            const queryParser = new QueryAggregateParser();
            const actualAST = queryParser.parse(query);
            const expectedAST = new QueryAggregate({
                kind: "courses",
                id: "courses",
                group: new Group(["Department", "Title"]),
                filter: new Filter(),
                display: new Display([
                    "Department",
                    "Average",
                    "count",
                ]),
                apply: new Apply([new ApplyRule("count", "COUNT", "Department")]),
                order: new Order("UP", ["Average", "Department"]),
            });

            expect(actualAST).to.deep.equal(expectedAST);
        });
    });
    describe("EDGE CASE APPLYKEY IS RESERVED WORD", function () {
        it("should return ast", function () {
            const query = "In courses dataset courses grouped by Department, " +
                "find entries whose Department is \"cpsc\"; " +
                "show Department and MIN, " +
                "where MIN is the MIN of Average.";
            const queryParser = new QueryAggregateParser();
            const actualAST = queryParser.parse(query);
            const expectedAST = new QueryAggregate({
                kind: "courses",
                id: "courses",
                group: new Group(["Department"]),
                filter: new Filter(new SCriteria("Department", "is ", "cpsc")),
                display: new Display([
                    "Department",
                    "MIN",
                ]),
                apply: new Apply([new ApplyRule("MIN", "MIN", "Average")]),
                order: new Order(),
            });

            expect(actualAST).to.deep.equal(expectedAST);
        });
    });
    describe("Filter - 2 RULES", function () {
        it("should return ast", function () {
            const query = "In courses dataset courses grouped by Department, " +
                "find entries whose Department is \"cpsc\"; " +
                "show Department, countTitle and avgGrade, " +
                "where avgGrade is the AVG of Average and countTitle is the COUNT of Title.";
            const queryParser = new QueryAggregateParser();
            const actualAST = queryParser.parse(query);
            const expectedAST = new QueryAggregate({
                kind: "courses",
                id: "courses",
                group: new Group(["Department"]),
                filter: new Filter(new SCriteria("Department", "is ", "cpsc")),
                display: new Display([
                    "Department",
                    "countTitle",
                    "avgGrade",
                ]),
                apply: new Apply([
                    new ApplyRule("avgGrade", "AVG", "Average"),
                    new ApplyRule("countTitle", "COUNT", "Title"),
                ]),
                order: new Order(),
            });

            expect(actualAST).to.deep.equal(expectedAST);
        });
    });
    describe("Filter - NO RULE", function () {
        it("should return ast", function () {
            const query = "In courses dataset courses grouped by Department and Title, " +
                "find entries whose Department is \"cpsc\"; " +
                "show Department and Title; " +
                "sort in descending order by Title.";
            const queryParser = new QueryAggregateParser();
            const actualAST = queryParser.parse(query);
            const expectedAST = new QueryAggregate({
                kind: "courses",
                id: "courses",
                group: new Group(["Department", "Title"]),
                filter: new Filter(new SCriteria("Department", "is ", "cpsc")),
                display: new Display([
                    "Department",
                    "Title",
                ]),
                apply: new Apply(),
                order: new Order("DOWN", ["Title"]),
            });

            expect(actualAST).to.deep.equal(expectedAST);
        });
    });
    describe("COMPLEX QUERY GROUP 3 KEYS", function () {
        it("should return ast", function () {
            const query = "In courses dataset courses " +
                "grouped by Department, Year and Instructor, " +
                "find entries whose Department is \"iar\" or Department is \"cnto\"; " +
                "show Department, Instructor, Year, avgGrade, maxGrade, minGrade and sumAudit, " +
                "where avgGrade is the AVG of Average, " +
                "maxGrade is the MAX of Average, " +
                "minGrade is the MIN of Average " +
                "and sumAudit is the SUM of Audit; " +
                "sort in ascending order by Department, Year and avgGrade.";
            const queryParser = new QueryAggregateParser();
            const actualAST = queryParser.parse(query);
            const expectedAST = new QueryAggregate({
                kind: "courses",
                id: "courses",
                group: new Group(["Department", "Year", "Instructor"]),
                filter: new Filter(new Or(
                    new SCriteria("Department", "is ", "iar"),
                    new SCriteria("Department", "is ", "cnto")),
                ),
                display: new Display([
                    "Department",
                    "Instructor",
                    "Year",
                    "avgGrade",
                    "maxGrade",
                    "minGrade",
                    "sumAudit",
                ]),
                apply: new Apply([
                    new ApplyRule("avgGrade", "AVG", "Average"),
                    new ApplyRule("maxGrade", "MAX", "Average"),
                    new ApplyRule("minGrade", "MIN", "Average"),
                    new ApplyRule("sumAudit", "SUM", "Audit"),
                ]),
                order: new Order("UP", ["Department", "Year", "avgGrade"]),
            });

            expect(actualAST).to.deep.equal(expectedAST);
        });
    });
    describe("COMPLEX QUERY GROUP 4 KEYS", function () {
        it("should return ast", function () {
            const query = "In courses dataset courses " +
                "grouped by Department, Year, Title and Instructor, " +
                "find entries whose Department is \"iar\" or Department is \"cnto\"; " +
                "show Department, Instructor, Year, avgGrade, maxGrade, minGrade and sumAudit, " +
                "where avgGrade is the AVG of Average, " +
                "maxGrade is the MAX of Average, " +
                "minGrade is the MIN of Average " +
                "and sumAudit is the SUM of Audit; " +
                "sort in ascending order by Department, Year and avgGrade.";
            const queryParser = new QueryAggregateParser();
            const actualAST = queryParser.parse(query);
            const expectedAST = new QueryAggregate({
                kind: "courses",
                id: "courses",
                group: new Group(["Department", "Year", "Title", "Instructor"]),
                filter: new Filter(new Or(
                    new SCriteria("Department", "is ", "iar"),
                    new SCriteria("Department", "is ", "cnto")),
                ),
                display: new Display([
                    "Department",
                    "Instructor",
                    "Year",
                    "avgGrade",
                    "maxGrade",
                    "minGrade",
                    "sumAudit",
                ]),
                apply: new Apply([
                    new ApplyRule("avgGrade", "AVG", "Average"),
                    new ApplyRule("maxGrade", "MAX", "Average"),
                    new ApplyRule("minGrade", "MIN", "Average"),
                    new ApplyRule("sumAudit", "SUM", "Audit"),
                ]),
                order: new Order("UP", ["Department", "Year", "avgGrade"]),
            });

            expect(actualAST).to.deep.equal(expectedAST);
        });
    });
    describe("try to catch NaN Mkeys", function () {
        it("should return ast", function () {
            const query = "In courses dataset courses grouped by Year, " +
                "find all entries; " +
                "show Year, minGrade, minPass, minFail and minAudit, " +
                "where minGrade is the MIN of Average, minPass is the MIN of Pass, " +
                "minFail is the MIN of Fail and minAudit is the MIN of Audit.";

            const queryParser = new QueryAggregateParser();
            const actualAST = queryParser.parse(query);
            const expectedAST = new QueryAggregate({
                kind: "courses",
                id: "courses",
                group: new Group(["Year"]),
                filter: new Filter(),
                display: new Display([
                    "Year",
                    "minGrade",
                    "minPass",
                    "minFail",
                    "minAudit",
                ]),
                apply: new Apply([
                    new ApplyRule("minGrade", "MIN", "Average"),
                    new ApplyRule("minPass", "MIN", "Pass"),
                    new ApplyRule("minFail", "MIN", "Fail"),
                    new ApplyRule("minAudit", "MIN", "Audit"),
                ]),
                order: new Order(),
            });

            expect(actualAST).to.deep.equal(expectedAST);
        });
    });
});
