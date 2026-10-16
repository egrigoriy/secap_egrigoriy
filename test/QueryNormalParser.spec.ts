import {expect} from "chai";
import {Order} from "../src/model/queryengine/query/order/Order";
import {Display} from "../src/model/queryengine/query/display/Display";
import {Filter} from "../src/model/queryengine/query/filter/Filter";
import {MCriteria} from "../src/model/queryengine/query/filter/MCriteria";
import {SCriteria} from "../src/model/queryengine/query/filter/SCriteria";
import {And} from "../src/model/queryengine/query/filter/And";
import {Or} from "../src/model/queryengine/query/filter/Or";
import {QueryNormal} from "../src/model/queryengine/query/QueryNormal";
import {QueryNormalParser} from "../src/model/queryengine/queryparser/QueryNormalParser";

describe("QueryNormal Parser Test", function () {
    describe("Filter - FIND ALL ENTRIES, NO SORT", function () {
        it("should return ast", function () {
            const query = "In courses dataset courses, " +
                "find all entries; " +
                "show Department and Average.";
            const queryParser = new QueryNormalParser();
            const actualAST = queryParser.parse(query);
            const expectedAST = new QueryNormal({
                kind: "courses",
                id: "courses",
                filter: new Filter(),
                display: new Display([
                    "Department",
                    "Average",
                ]),
                order: new Order( ),
            });

            expect(actualAST).to.deep.equal(expectedAST);
        });
    });
    describe("Filter - FIND ALL ENTRIES, SORT BY M_KEY", function () {
        it("should return ast", function () {
            const query = "In courses dataset courses, " +
                "find all entries; " +
                "show Department and Average; " +
                "sort in ascending order by Average.";
            const queryParser = new QueryNormalParser();
            const actualAST = queryParser.parse(query);
            const expectedAST = new QueryNormal({
                kind: "courses",
                id: "courses",
                filter: new Filter(),
                display: new Display([
                    "Department",
                    "Average",
                ]),
                order: new Order("UP", ["Average"]),
            });

            expect(actualAST).to.deep.equal(expectedAST);
        });
    });
    describe("Filter - FIND ALL ENTRIES, SORT BY S_KEY", function () {
        it("should return ast", function () {
            const query = "In courses dataset courses, " +
                "find all entries; " +
                "show Department and Average; " +
                "sort in ascending order by Department.";
            const queryParser = new QueryNormalParser();
            const actualAST = queryParser.parse(query);
            const expectedAST = new QueryNormal({
                kind: "courses",
                id: "courses",
                filter: new Filter(),
                display: new Display([
                    "Department",
                    "Average",
                ]),
                order: new Order("UP", ["Department"]),
            });

            expect(actualAST).to.deep.equal(expectedAST);
        });
    });
    describe("Filter - FIND ALL ENTRIES, DISPLAY MORE KEYS SORT BY S_KEY", function () {
        it("should return ast", function () {
            const query = "In courses dataset courses, " +
                "find all entries; " +
                "show Department, Pass, Instructor and Average; " +
                "sort in ascending order by Department.";
            const queryParser = new QueryNormalParser();
            const actualAST = queryParser.parse(query);
            const expectedAST = new QueryNormal({
                kind: "courses",
                id: "courses",
                filter: new Filter(),
                display: new Display([
                    "Department",
                    "Pass",
                    "Instructor",
                    "Average",
                ]),
                order: new Order("UP", ["Department"]),
            });

            expect(actualAST).to.deep.equal(expectedAST);
        });
    });
    describe("Filter - FIND ENTRIES WHOSE 1 M_CRITERIA, DISPLAY MORE KEYS SORT BY S_KEY", function () {
        it("should return ast", function () {
            const query = "In courses dataset courses, " +
                "find entries whose Average is greater than 97; " +
                "show Department, Pass, Instructor and Average; " +
                "sort in ascending order by Department.";
            const queryParser = new QueryNormalParser();
            const actualAST = queryParser.parse(query);
            const expectedAST = new QueryNormal({
                kind: "courses",
                id: "courses",
                filter: new Filter(
                    new MCriteria("Average", "is greater than " , 97),
                ),
                display: new Display([
                    "Department",
                    "Pass",
                    "Instructor",
                    "Average",
                ]),
                order: new Order("UP", ["Department"]),
            });

            expect(actualAST).to.deep.equal(expectedAST);
        });
    });
    describe("Filter - FIND ENTRIES WHOSE 1 S_CRITERIA, DISPLAY MORE KEYS SORT BY S_KEY", function () {
        it("should return ast", function () {
            const query = "In courses dataset courses, " +
                "find entries whose Department is \"adhe\"; " +
                "show Department, Pass, Instructor and Average; " +
                "sort in ascending order by Department.";
            const queryParser = new QueryNormalParser();
            const actualAST = queryParser.parse(query);
            const expectedAST = new QueryNormal({
                kind: "courses",
                id: "courses",
                filter: new Filter(
                    new SCriteria("Department", "is ", "adhe"),
                ),
                display: new Display([
                    "Department",
                    "Pass",
                    "Instructor",
                    "Average",
                ]),
                order: new Order("UP", ["Department"]),
            });

            expect(actualAST).to.deep.equal(expectedAST);
        });
    });
    describe("Filter - 2 CRITERIA - M_CRITERIA AND S_CRITERIA, DISPLAY MORE KEYS SORT BY S_KEY", function () {
        it("should return ast", function () {
            const query = "In courses dataset courses, " +
                "find entries whose Average is greater than 97.56 and Department is \"adhe\"; " +
                "show Department, Pass, Instructor and Average; " +
                "sort in ascending order by Department.";
            const queryParser = new QueryNormalParser();
            const actualAST = queryParser.parse(query);
            const expectedAST = new QueryNormal({
                kind: "courses",
                id: "courses",
                filter: new Filter(
                    new And(new MCriteria("Average", "is greater than ", 97.56),
                        new SCriteria("Department", "is ", "adhe")),
                ),
                display: new Display([
                    "Department",
                    "Pass",
                    "Instructor",
                    "Average",
                ]),
                order: new Order("UP", ["Department"]),
            });

            expect(actualAST).to.deep.equal(expectedAST);
        });
    });
    describe("Filter - 2 CRITERIA - M_CRITERIA OR S_CRITERIA, DISPLAY MORE KEYS SORT BY S_KEY", function () {
        it("should return ast", function () {
            const query = "In courses dataset courses, " +
                "find entries whose Average is greater than 97.56 or Department is \"adhe\"; " +
                "show Department, Pass, Instructor and Average; " +
                "sort in ascending order by Department.";
            const queryParser = new QueryNormalParser();
            const actualAST = queryParser.parse(query);
            const expectedAST = new QueryNormal({
                kind: "courses",
                id: "courses",
                filter: new Filter(
                    new Or(new MCriteria("Average", "is greater than ", 97.56),
                        new SCriteria("Department", "is ", "adhe")),
                ),
                display: new Display([
                    "Department",
                    "Pass",
                    "Instructor",
                    "Average",
                ]),
                order: new Order("UP", ["Department"]),
            });

            expect(actualAST).to.deep.equal(expectedAST);
        });
    });
    describe("Filter - 2 CRITERIA - S_CRITERIA OR M_CRITERIA, DISPLAY MORE KEYS SORT BY S_KEY", function () {
        it("should return ast", function () {
            const query = "In courses dataset courses, " +
                "find entries whose Department is \"adhe\" or Average is greater than 97.56; " +
                "show Department, Pass, Instructor and Average; " +
                "sort in ascending order by Department.";
            const queryParser = new QueryNormalParser();
            const actualAST = queryParser.parse(query);
            const expectedAST = new QueryNormal({
                kind: "courses",
                id: "courses",
                filter: new Filter(
                    new Or(new SCriteria("Department", "is ", "adhe"),
                        new MCriteria("Average", "is greater than ", 97.56)),
                ),
                display: new Display([
                    "Department",
                    "Pass",
                    "Instructor",
                    "Average",
                ]),
                order: new Order("UP", ["Department"]),
            });

            expect(actualAST).to.deep.equal(expectedAST);
        });
    });
    describe("Filter - 3 CRITERIA - S_CRITERIA OR M_CRITERIA AND M_CRITERIA", function () {
        it("should return ast", function () {
            const query = "In courses dataset courses, " +
                "find entries whose " +
                "Department is \"adhe\" or Average is greater than 97.56 and Pass is less than 20.05; " +
                "show Department, Pass, Instructor and Average; " +
                "sort in ascending order by Department.";
            const queryParser = new QueryNormalParser();
            const actualAST = queryParser.parse(query);
            const expectedAST = new QueryNormal({
                kind: "courses",
                id: "courses",
                filter: new Filter(
                    new And (new Or(
                            new SCriteria("Department", "is ", "adhe"),
                            new MCriteria("Average", "is greater than ", 97.56)),
                        new MCriteria("Pass", "is less than " , 20.05)),
                ),
                display: new Display([
                    "Department",
                    "Pass",
                    "Instructor",
                    "Average",
                ]),
                order: new Order("UP", ["Department"]),
            });

            expect(actualAST).to.deep.equal(expectedAST);
        });
    });

    describe("Parse Rooms", function () {
        it("should return ast", function () {
            const query = "In rooms dataset rooms, " +
                "find entries whose Short Name is \"ESB\" and Seats is greater than 100; " +
                "show Short Name, Number and Seats; " +
                "sort in ascending order by Seats.";
            const queryParser = new QueryNormalParser();
            const actualAST = queryParser.parse(query);
            const expectedAST = new QueryNormal({
                kind: "rooms",
                id: "rooms",
                filter: new Filter(
                    new And (new SCriteria("Short Name", "is ", "ESB"),
                            new MCriteria("Seats", "is greater than ", 100)),
                ),
                display: new Display([
                    "Short Name",
                    "Number",
                    "Seats",
                ]),
                order: new Order("UP", ["Seats"]),
            });

            expect(actualAST).to.deep.equal(expectedAST);
        });
        it("should return ast", function () {
            const query = "In rooms dataset rooms, " +
                "find entries whose Type is \"\"; " +
                "show Full Name and Furniture.";
            const queryParser = new QueryNormalParser();
            const actualAST = queryParser.parse(query);
            const expectedAST = new QueryNormal({
                kind: "rooms",
                id: "rooms",
                filter: new Filter(
                    new SCriteria("Type", "is ", ""),
                ),
                display: new Display([
                    "Full Name",
                    "Furniture",
                ]),
                order: new Order(),
            });

            expect(actualAST).to.deep.equal(expectedAST);
        });
    });
    describe("should throw error", function () {
        it("when unknown token for INPUT production (reserved word)", function () {
            const query = "In courses dataset show, " +
                "find all entries; " +
                "show Department and Average.";
            const queryParser = new QueryNormalParser();
            expect(function () {
                queryParser.parse(query);
            }).to.throw(Error);
        });
        it("when unknown token for FILTER production", function () {
            const query = "In courses dataset courses, " +
                "find all; " +
                "show Department and Average.";
            const queryParser = new QueryNormalParser();
            expect(function () {
                queryParser.parse(query);
            }).to.throw(Error);
        });
        it("when unknown token for CRITERIA production", function () {
            const query = "In courses dataset courses, " +
                "find entries whose DEPARTM is \"adhe\"; " +
                "show Department, Pass, Instructor and Average; " +
                "sort in ascending order by Department.";
            const queryParser = new QueryNormalParser();
            expect(function () {
                queryParser.parse(query);
            }).to.throw(Error);
        });
        it("when unknown token for CRITERIA LOGIC production", function () {
            const query = "In courses dataset courses, " +
                "find entries whose Department is \"adhe\" OOOR Average is greater than 97.56; " +
                "show Department, Pass, Instructor and Average; " +
                "sort in ascending order by Department.";
            const queryParser = new QueryNormalParser();
            expect(function () {
                queryParser.parse(query);
            }).to.throw(Error);
        });
        it("when unknown token for KEY production", function () {
            const query = "In courses dataset courses, " +
                "find entries whose Average is greater than 97; " +
                "show DEPRT, Pass, Instructor and Average; " +
                "sort in ascending order by Department.";
            const queryParser = new QueryNormalParser();
            expect(function () {
                queryParser.parse(query);
            }).to.throw(Error);
        });
        it("when unknown token", function () {
            const query = "In courses _ courses, " +
                "find all entries; " +
                "show Department, Pass, Instructor and Average." ;
            const queryParser = new QueryNormalParser();
            expect(function () {
                queryParser.parse(query);
            }).to.throw(Error);
        });
        it("when unexpected token", function () {
            const query = "In courses UNEXPECTED courses, " +
                "find all entries; " +
                "show Department, Pass, Instructor and Average." ;
            const queryParser = new QueryNormalParser();
            expect(function () {
                queryParser.parse(query);
            }).to.throw(Error);
        });
        it("when unexpected end of query", function () {
            const query = "In courses dataset courses, " +
            "find all entries; ";
            const queryParser = new QueryNormalParser();
            expect(function () {
                queryParser.parse(query);
            }).to.throw(Error);
        });
    });
});
