import {Tokenizer} from "../src/model/queryengine/queryparser/Tokenizer";
import {expect} from "chai";

describe("Tokenizer test", function () {
    let tokenizer: Tokenizer;

    beforeEach(function () {
        tokenizer = new Tokenizer();
    });
    describe("DATASET tokens", function () {
        it("should return token 'In KIND ' for Courses", function () {
            const query = `In courses dataset courses,
            find entries whose Average is greater than 97;
            show Department and Average;
            sort in ascending order by Average.
            `;
            tokenizer.init(query);
            const expectedToken = {
                type: "In KIND ",
                value: "In courses ",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
        it("should return token 'In KIND ' for Rooms", function () {
            const query = `In rooms dataset rooms,`;
            tokenizer.init(query);
            const expectedToken = {
                type: "In KIND ",
                value: "In rooms ",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
        it("should return token 'dataset '", function () {
            const query = `dataset courses,
            find entries whose Average is greater than 97;
            show Department and Average;
            sort in ascending order by Average.
            `;
            tokenizer.init(query);
            const expectedToken = {
                type: "dataset ",
                value: "dataset ",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
        it("should return token INPUT", function () {
            const query = `courses,
            find entries whose Average is greater than 97;
            show Department and Average;
            sort in ascending order by Average.
            `;
            tokenizer.init(query);
            const expectedToken = {
                type: "INPUT",
                value: "courses",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
        it("should return token literal ' grouped by '", function () {
            const query = ` grouped by Average,
            find entries whose Average is greater than 97;
            show Department and Average;
            sort in ascending order by Average.
            `;
            tokenizer.init(query);
            const expectedToken = {
                type: " grouped by ",
                value: " grouped by ",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
    });
    describe("AGGREGATION tokens", function () {
        it("should return token literal 'where '", function () {
            const query = `where minAVG is ...
            sort in ascending order by Average.
            `;
            tokenizer.init(query);
            const expectedToken = {
                type: "where ",
                value: "where ",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
        it("should return token literal ' is the '", function () {
            const query = ` is the MIN of Average,
            sort in ascending order by Average.
            `;
            tokenizer.init(query);
            const expectedToken = {
                type: " is the ",
                value: " is the ",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
        it("should return token literal ' of '", function () {
            const query = ` of Average;
            sort in ascending order by Average.
            `;
            tokenizer.init(query);
            const expectedToken = {
                type: " of ",
                value: " of ",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
        it("should return token literal 'MIN'", function () {
            const query = `MIN of Average;
            sort in ascending order by Average.
            `;
            tokenizer.init(query);
            const expectedToken = {
                type: "AGGREGATOR",
                value: "MIN",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
        it("should return token literal 'MAX'", function () {
            const query = `MAX of Average;
            sort in ascending order by Average.
            `;
            tokenizer.init(query);
            const expectedToken = {
                type: "AGGREGATOR",
                value: "MAX",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
        it("should return token literal 'AVG'", function () {
            const query = `AVG of Average;
            sort in ascending order by Average.
            `;
            tokenizer.init(query);
            const expectedToken = {
                type: "AGGREGATOR",
                value: "AVG",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
        it("should return token literal 'COUNT'", function () {
            const query = `COUNT of Average;
            sort in ascending order by Average.
            `;
            tokenizer.init(query);
            const expectedToken = {
                type: "AGGREGATOR",
                value: "COUNT",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
    });
    describe("token literal ' and '", function () {
        it("should return token literal ' and '", function () {
            const query = ` and Average;
            sort in ascending order by Average.
            `;
            tokenizer.init(query);
            const expectedToken = {
                type: " and ",
                value: " and ",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);

        });
    });
    describe("token literal ' or '", function () {
        it("should return token literal ' or '", function () {
            const query = ` or Average;
            sort in ascending order by Average.
            `;
            tokenizer.init(query);
            const expectedToken = {
                type: " or ",
                value: " or ",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);

        });
    });
    describe("M_KEY tokens", function () {
        it("should return token of Type M_KEY", function () {
            const queries = ["Average and ", "Pass or", "Fail and", "Audit or"];
            const expectedValues = ["Average", "Pass", "Fail", "Audit"];
            for (const i in queries) {
                tokenizer.init(queries[i]);
                const actualToken = tokenizer.getNextToken();
                const expectedToken = {
                    type: "M_KEY",
                    value: expectedValues[i],
                };
                expect(actualToken).to.deep.equal(expectedToken);
            }
        });
    });
    describe("S_KEY tokens", function () {
        it("should return token of Type S_KEY", function () {
            const queries = ["Department and ", "ID or", "Instructor and", "Title or", "UUID "];
            const expectedValues = ["Department", "ID", "Instructor", "Title", "UUID"];
            for (const i in queries) {
                tokenizer.init(queries[i]);
                const actualToken = tokenizer.getNextToken();
                const expectedToken = {
                    type: "S_KEY",
                    value: expectedValues[i],
                };
                expect(actualToken).to.deep.equal(expectedToken);
            }
        });
    });
    describe("M_OP tokens", function () {
        it("should return token of Type M_OP", function () {
            const queries = [
                "is greater than 97", "is less than 97", "is equal to 97",
                "is not greater than 97", "is not less than 97", "is not equal to 79",
            ];
            const expectedValues = [
                "is greater than ", "is less than ", "is equal to ",
                "is not greater than ", "is not less than ", "is not equal to ",
            ];
            for (const i in queries) {
                tokenizer.init(queries[i]);
                const actualToken = tokenizer.getNextToken();
                const expectedToken = {
                    type: "M_OP",
                    value: expectedValues[i],
                };
                expect(actualToken).to.deep.equal(expectedToken);
            }
        });
    });
    describe("S_OP tokens", function () {
        it("should return token of Type S_OP", function () {
            const queries = [
                "is \"adhe\"", "is not \"adhe\"",
                "includes to \"adhe\"", "does not include than \"adhe\"",
                "begins with \"adhe\"", "does not begin with \"adhe\"",
                "ends with \"adhe\"", "does not end with \"adhe\"",
            ];
            const expectedValues = [
                "is ", "is not ", "includes ", "does not include ",
                "begins with ", "does not begin with ", "ends with ", "does not end with ",
            ];
            for (const i in queries) {
                tokenizer.init(queries[i]);
                const actualToken = tokenizer.getNextToken();
                const expectedToken = {
                    type: "S_OP",
                    value: expectedValues[i],
                };
                expect(actualToken).to.deep.equal(expectedToken);
            }
        });
    });
    describe("NUMBER tokens", function () {
        it("should return token NUMBER", function () {
            const query = "97.53 is a number";
            tokenizer.init(query);
            const expectedToken = {
                type: "NUMBER",
                value: "97.53",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
    });
    describe("STRING tokens", function () {
        it("should return token STRING", function () {
            const query = "\"adhe\" is a string";
            tokenizer.init(query);
            const expectedToken = {
                type: "STRING",
                value: "\"adhe\"",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
    });
    describe("FILTER tokens", function () {
        it("should return token literal 'find all entries'", function () {
            const query = "find all entries;";
            tokenizer.init(query);
            const expectedToken = {
                type: "find all entries",
                value: "find all entries",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
        it("should return token literal 'find entries whose '", function () {
            const query = "find entries whose Average is greater than 97";
            tokenizer.init(query);
            const expectedToken = {
                type: "find entries whose ",
                value: "find entries whose ",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
    });
    describe("DISPLAY tokens", function () {
        it("should return token literal 'show '", function () {
            const query = "show Department and Average";
            tokenizer.init(query);
            const expectedToken = {
                type: "show ",
                value: "show ",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
    });
    describe("ORDER tokens", function () {
        it("should return literal token 'sort in '", function () {
            const query = "sort in ascending order by KEY";
            tokenizer.init(query);
            const expectedToken = {
                type: "sort in ",
                value: "sort in ",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
        it("should return literal token 'sort in '", function () {
            const query = "sort in descending order by KEY";
            tokenizer.init(query);
            const expectedToken = {
                type: "sort in ",
                value: "sort in ",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
        it("should return literal token DIRECTION 'ascending '", function () {
            const query = "ascending order by KEY";
            tokenizer.init(query);
            const expectedToken = {
                type: "DIRECTION",
                value: "ascending ",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
        it("should return literal token DIRECTION 'descending '", function () {
            const query = "descending order by KEY";
            tokenizer.init(query);
            const expectedToken = {
                type: "DIRECTION",
                value: "descending ",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
        it("should return literal token 'order by '", function () {
            const query = "order by KEY";
            tokenizer.init(query);
            const expectedToken = {
                type: "order by ",
                value: "order by ",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
    });
    describe("SEMICOLON separator", function () {
        it("should return '; '", function () {
            const query = "; ";
            tokenizer.init(query);
            const expectedToken = {
                type: "; ",
                value: "; ",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
    });
    describe("COMMA separator", function () {
        it("should return ', '", function () {
            const query = ", and";
            tokenizer.init(query);
            const expectedToken = {
                type: ", ",
                value: ", ",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
    });
    describe("SPACE", function () {
        it("should return SPACE", function () {
            const query = " Average";
            tokenizer.init(query);
            const expectedToken = {
                type: " ",
                value: " ",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
    });
    describe("END", function () {
        it("should return end of query '.'", function () {
            const query = ".";
            tokenizer.init(query);
            const expectedToken = {
                type: ".",
                value: ".",
            };
            const actualToken = tokenizer.getNextToken();
            return expect(actualToken).to.deep.equal(expectedToken);
        });
    });
    describe("Unknown token", function () {
        it("should throw an Error", function () {
            const query = "_";
            tokenizer.init(query);
            expect(function () {
                tokenizer.getNextToken();
            }).to.throw(Error);
        });
    });
    describe("Reach the end", function () {
        it("should return null", function () {
            const query = "";
            tokenizer.init(query);
            return expect(tokenizer.getNextToken()).to.be.null;
        });
    });
});
