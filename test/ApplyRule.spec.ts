import {ApplyRule} from "../src/model/queryengine/query/apply/ApplyRule";
import {expect} from "chai";

describe("ApplyRule tests", function () {
    describe("#getApplyKey", function () {
        it("should get applyKey", function () {
            const applyKey = "someKey";
            const applyRule = new ApplyRule(applyKey, "MIN", "Department");
            return expect(applyRule.getApplyKey()).to.deep.equal(applyKey);
        });
    });
    describe("#isValid", function () {
        it("should not be valid key", function () {
            const validKeys = ["UUID", "Title", "Average"];
            const applyRule = new ApplyRule("someKey", "MIN", "Department");
            return expect(applyRule.isValid(validKeys)).to.be.false;
        });
        it("should not be valid MIN", function () {
            const validKeys = ["Department"];
            const applyRule = new ApplyRule("someKey", "MIN", "Department");
            return expect(applyRule.isValid(validKeys)).to.be.false;
        });
        it("should not be valid MAX", function () {
            const validKeys = ["Full Name"];
            const applyRule = new ApplyRule("someKey", "MAX", "Full Name");
            return expect(applyRule.isValid(validKeys)).to.be.false;
        });
        it("should not be valid SUM", function () {
            const validKeys = ["Type"];
            const applyRule = new ApplyRule("someKey", "SUM", "Type");
            return expect(applyRule.isValid(validKeys)).to.be.false;
        });
        it("should be valid MIN", function () {
            const validKeys = ["Latitude"];
            const applyRule = new ApplyRule("someKey", "MIN", "Latitude");
            return expect(applyRule.isValid(validKeys)).to.be.true;
        });
        it("should be valid MAX", function () {
            const validKeys = ["Longitude"];
            const applyRule = new ApplyRule("someKey", "MAX", "Longitude");
            return expect(applyRule.isValid(validKeys)).to.be.true;
        });
        it("should be valid SUM", function () {
            const validKeys = ["Seats"];
            const applyRule = new ApplyRule("someKey", "SUM", "Seats");
            return expect(applyRule.isValid(validKeys)).to.be.true;
        });
        it("should be valid COUNT", function () {
            const validKeys = ["Title"];
            const applyRule = new ApplyRule("someKey", "COUNT", "Title");
            return expect(applyRule.isValid(validKeys)).to.be.true;
        });
        it("should be valid COUNT", function () {
            const validKeys = ["Seats"];
            const applyRule = new ApplyRule("someKey", "COUNT", "Seats");
            return expect(applyRule.isValid(validKeys)).to.be.true;
        });
    });
    describe("#process", function () {
        it("should return [] when given []", function () {
            const applyRule = new ApplyRule("minAverage", "MIN", "Average");
            const actualResult = applyRule.process([]);
            expect(actualResult).to.deep.equal([]);
        });
        it("should apply 1 rule MIN skipping NaN", function () {
            const data = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: NaN, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
            ];
            const applyRule = new ApplyRule("minAverage", "MIN", "Average");
            const expectedResult = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310", minAverage: 85.0},
                {UUID: "2", Instructor: "Jean", Average: NaN, Title: "310", minAverage: 85.0},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310", minAverage: 85.0},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310", minAverage: 85.0},
            ];
            const actualResult = applyRule.process(data);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should apply 1 rule MAX", function () {
            const data = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
            ];
            const applyRule = new ApplyRule("maxAverage", "MAX", "Average");
            const expectedResult = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310", maxAverage: 95},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310", maxAverage: 95},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310", maxAverage: 95},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310", maxAverage: 95},
            ];
            const actualResult = applyRule.process(data);
            expect(actualResult).to.deep.equal(expectedResult);
            expect(data).to.deep.equal([
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
            ]);
        });
        it("should apply 1 rule AVG", function () {
            const data = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
            ];
            const applyRule = new ApplyRule("avgAverage", "AVG", "Average");
            const expectedResult = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310", avgAverage: 87.5},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310", avgAverage: 87.5},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310", avgAverage: 87.5},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310", avgAverage: 87.5},
            ];
            const actualResult = applyRule.process(data);
            expect(actualResult).to.deep.equal(expectedResult);
            expect(data).to.deep.equal([
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
            ]);
        });
        it("should apply 1 rule SUM", function () {
            const data = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85.25, Title: "310"},
            ];
            const applyRule = new ApplyRule("sumAverage", "SUM", "Average");
            const expectedResult = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310", sumAverage: 350.25},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310", sumAverage: 350.25},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310", sumAverage: 350.25},
                {UUID: "4", Instructor: "Casey", Average: 85.25, Title: "310", sumAverage: 350.25},
            ];
            const actualResult = applyRule.process(data);
            expect(actualResult).to.deep.equal(expectedResult);
            expect(data).to.deep.equal([
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85.25, Title: "310"},
            ]);
        });
        it("should apply 1 rule COUNT unique", function () {
            const data = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
            ];
            const applyRule = new ApplyRule("countInstructor", "COUNT", "Instructor");
            const expectedResult = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310", countInstructor: 2},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310", countInstructor: 2},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310", countInstructor: 2},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310", countInstructor: 2},
            ];
            const actualResult = applyRule.process(data);
            expect(actualResult).to.deep.equal(expectedResult);
            expect(data).to.deep.equal([
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
            ]);
        });
    });
});
