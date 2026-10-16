import {expect} from "chai";

import {InsightDatasetKind, InsightResponse, InsightResponseSuccessBody} from "../src/controller/IInsightFacade";
import Log from "../src/Util";
import TestUtil from "./TestUtil";
import {InsightModel} from "../src/model/InsightModel";
import {ITestQuery} from "./InsightFacade.spec";
import {QueryEngine} from "../src/model/queryengine/QueryEngine";

describe("QueryEngine tests", function () {
    describe("#isValid(query: string)", () => {
        const datasetsToQuery: { [id: string]: string } = {
            courses: "./test/data/courses49044.zip",
            coursesmiddle: "./test/data/valid_courses6_sections44.zip",
            coursessmall: "./test/data/valid_courses1_sections1.zip",
        };
        let queryEngine: QueryEngine;
        let testQueries: ITestQuery[] = [];

        // Create a new instance of InsightModel, read in the test queries from test/queries and
        // add the datasets specified in datasetsToQuery.
        before(async function () {
            Log.test(`Before: ${this.test.parent.title}`);

            // Load the query JSON files under test/queries.
            // Fail if there is a problem reading ANY query.
            try {
                testQueries = await TestUtil.readTestQueries();
                expect(testQueries).to.have.length.greaterThan(0);
            } catch (err) {
                expect.fail("", "", `Failed to read one or more test queries. ${JSON.stringify(err)}`);
            }

            try {
                queryEngine = new QueryEngine();
            } catch (err) {
                Log.error(err);
            } finally {
                expect(queryEngine).to.be.instanceOf(QueryEngine);
            }
        });

        beforeEach(function () {
            Log.test(`BeforeTest: ${this.currentTest.title}`);
        });

        after(async function () {
            Log.test(`After: ${this.test.parent.title}`);
        });

        afterEach(function () {
            Log.test(`AfterTest: ${this.currentTest.title}`);
        });

        // Dynamically create and run a test for each query in testQueries
        it("Should run test queries", () => {
            describe("Dynamic InsightModel PerformQuery tests", () => {
                for (const test of testQueries) {
                    it(`[${test.filename}] ${test.title}`, async () => {
                        const actualResult = queryEngine.isValid(test.query);
                        const expectedResult = (test.response.body).hasOwnProperty("result");
                        expect(actualResult).to.deep.equal(expectedResult);
                    });
                }
            });
        });
    });
});
