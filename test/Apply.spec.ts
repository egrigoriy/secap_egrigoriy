import {expect} from "chai";
import {Apply} from "../src/model/queryengine/query/apply/Apply";
import {ApplyRule} from "../src/model/queryengine/query/apply/ApplyRule";

describe("Apply test", function () {
    describe("#getApplyKeys", function () {
        it("should get all applyKeys", function () {
            const apply = new Apply([
                new ApplyRule("applyKey1", "MAX", "Pass"),
                new ApplyRule("applyKey2", "AVG", "Fail"),
                new ApplyRule("applyKey3", "MIN", "Average"),
            ]);
            return expect(apply.getApplyKeys()).to.deep.equal(["applyKey1", "applyKey2", "applyKey3"]);
        });
    });
    describe("#isValid", function () {
        it("should be valid if no rules", function () {
            const validKeys = ["Department"];
            return expect(new Apply().isValid(validKeys)).to.be.true;
        });
        it("should not be valid when one rules is invalid cause key", function () {
            const validKeys = ["Instructor", "Average"];
            const apply = new Apply([
                new ApplyRule("applyKey", "MAX", "Department"),
            ]);
            return expect(apply.isValid(validKeys)).to.be.false;
        });
        it("should not be valid when one rules is invalid cause AGGREGATOR", function () {
            const validKeys = ["Department"];
            const apply = new Apply([
                new ApplyRule("applyKey", "MAX", "Department"),
            ]);
            return expect(apply.isValid(validKeys)).to.be.false;
        });
        it("should be valid when one rules is valid", function () {
            const validKeys = ["Pass"];
            const apply = new Apply([
                new ApplyRule("applyKey", "MAX", "Pass"),
            ]);
            return expect(apply.isValid(validKeys)).to.be.true;
        });
        it("should not be valid when one of many rules is invalid cause key", function () {
            const validKeys = ["Pass", "Fail"];
            const apply = new Apply([
                new ApplyRule("applyKey1", "MAX", "Pass"),
                new ApplyRule("applyKey2", "AVG", "Fail"),
                new ApplyRule("applyKey3", "MIN", "Average"),
            ]);
            return expect(apply.isValid(validKeys)).to.be.false;
        });
        it("should not be valid when one of many rules is invalid cause AGGREGATOR", function () {
            const validKeys = ["Pass", "Fail", "Department"];
            const apply = new Apply([
                new ApplyRule("applyKey1", "MAX", "Pass"),
                new ApplyRule("applyKey2", "AVG", "Fail"),
                new ApplyRule("applyKey3", "MIN", "Department"),
            ]);
            return expect(apply.isValid(validKeys)).to.be.false;
        });
        it("should be valid when all rules are valid", function () {
            const validKeys = ["Pass", "Fail", "Average"];
            const apply = new Apply([
                new ApplyRule("applyKey1", "MAX", "Pass"),
                new ApplyRule("applyKey2", "AVG", "Fail"),
                new ApplyRule("applyKey3", "MIN", "Average"),
            ]);
            return expect(apply.isValid(validKeys)).to.be.true;
        });
        it("should not be valid when duplicated applyKeys", function () {
            const validKeys = ["Pass", "Fail", "Average"];
            const apply = new Apply([
                new ApplyRule("applyKey", "MAX", "Pass"),
                new ApplyRule("applyKey2", "AVG", "Fail"),
                new ApplyRule("applyKey", "MIN", "Average"),
            ]);
            return expect(apply.isValid(validKeys)).to.be.false;
        });
    });
    describe("#process", function () {
        const dataGrouped1Key = [
            [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
            ],
            [
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ],
        ];

        const dataGroupedBy2Keys = [
            [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
            ],
            [
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
            ],
            [
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
            ],
            [
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ],
        ];
        it("should no apply if empty input", function () {
            const apply = new Apply();
            const actualResult = apply.process([]);
            expect(actualResult).to.deep.equal([]);
        });
        it("should no apply when empty - in data grouped by 2 key", function () {
            const apply = new Apply();
            const expectedResult = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ];
            const actualResult = apply.process(dataGroupedBy2Keys);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should no apply - in data grouped by 2 keys", function () {
            const apply = new Apply();
            const expectedResult = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ];
            const actualResult = apply.process(dataGroupedBy2Keys);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should apply 1 rule", function () {
            const apply = new Apply([
                new ApplyRule("overallAvg", "AVG", "Average"),
            ]);
            const expectedResult = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310", overallAvg: 87.5},
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210", overallAvg: 77.25},
            ];
            const actualResult = apply.process(dataGrouped1Key);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should apply 1 rule COUNT unique", function () {
            const apply = new Apply([
                new ApplyRule("countInstructor", "COUNT", "Instructor"),
            ]);
            const expectedResult = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310", countInstructor: 2},
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210", countInstructor: 2},
            ];
            const actualResult = apply.process(dataGrouped1Key);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should apply 2 rules", function () {
            const apply = new Apply([
                    new ApplyRule("overallAvg", "AVG", "Average"),
                    new ApplyRule("cntInstructor", "COUNT", "Instructor"),
                ],
            );
            const expectedResult = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310", overallAvg: 87.5, cntInstructor: 2},
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210", overallAvg: 77.25, cntInstructor: 2},
            ];
            const actualResult = apply.process(dataGrouped1Key);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should apply 3 rules", function () {
            const inData = [
                [
                    {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                    {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                    {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                    {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                ],
                [
                    {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                    {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
                    {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
                    {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
                ],
            ];
            const apply = new Apply([
                    new ApplyRule("overallAvg", "AVG", "Average"),
                    new ApplyRule("cntInstructor", "COUNT", "Instructor"),
                    new ApplyRule("minAvg", "MIN", "Average"),
                ],
            );
            const expectedResult = [
                {
                    UUID: "1",
                    Instructor: "Jean",
                    Average: 90,
                    Title: "310",
                    overallAvg: 87.5,
                    cntInstructor: 2,
                    minAvg: 80,
                },
                {
                    UUID: "5",
                    Instructor: "Kelly",
                    Average: 74,
                    Title: "210",
                    overallAvg: 77.25,
                    cntInstructor: 2,
                    minAvg: 72,
                },
            ];
            const actualResult = apply.process(dataGrouped1Key);
            expect(actualResult).to.deep.equal(expectedResult);
        });
    });
});
