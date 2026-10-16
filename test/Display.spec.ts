import {Display} from "../src/model/queryengine/query/display/Display";
import {expect} from "chai";

describe("Display test", function () {
    describe("#isValid", function () {
        it("should be invalid if 1 key but different", function () {
            const validKeys = ["Instructor", "Department"];
            const display = new Display(["Pass"]);
            return expect(display.isValid(validKeys)).to.be.false;
        });
        it("should be invalid if 2 keys but 1 different", function () {
            const validKeys = ["Instructor", "Department"];
            const display = new Display([, "Instructor", "Pass"]);
            return expect(display.isValid(validKeys)).to.be.false;
        });
        it("should be valid if keys same as valid ones", function () {
            const validKeys = ["Instructor", "Department"];
            const display = new Display([, "Instructor", "Department"]);
            return expect(display.isValid(validKeys)).to.be.true;
        });
        it("should be valid if keys are included by valid ones", function () {
            const validKeys = ["Instructor", "Pass", "Year", "Department"];
            const display = new Display([, "Instructor", "Department"]);
            return expect(display.isValid(validKeys)).to.be.true;
        });
    });

    describe("#process", function () {
        const data = [
            { Department: "adhe", ID: "329", Fail: 10, Average: 90.02 },
            { Department: "adhe", ID: "412", Fail: 10, Average: 90.16 },
            { Department: "adhe", ID: "330", Fail: 10, Average: 90.17 },
            { Department: "adhe", ID: "412", Fail: 10, Average: 90.18 },
        ];
        it("should display 2 keys", function () {
            const expectedResult = [
                { Department: "adhe", Average: 90.02 },
                { Department: "adhe", Average: 90.16 },
                { Department: "adhe", Average: 90.17 },
                { Department: "adhe", Average: 90.18 },
            ];
            const display = new Display([
                "Department",
                "Average",
            ]);
            const actualResult = display.process(data);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should display 3 keys", function () {
            const expectedResult = [
                { Department: "adhe", ID: "329", Fail: 10 },
                { Department: "adhe", ID: "412", Fail: 10 },
                { Department: "adhe", ID: "330", Fail: 10 },
                { Department: "adhe", ID: "412", Fail: 10 },
            ];
            const display = new Display([
                "Department",
                "ID",
                "Fail",
            ]);
            const actualResult = display.process(data);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should not mutate input data", function () {
            const expectedResult = [
                { Department: "adhe", ID: "329", Fail: 10 },
                { Department: "adhe", ID: "412", Fail: 10 },
                { Department: "adhe", ID: "330", Fail: 10 },
                { Department: "adhe", ID: "412", Fail: 10 },
            ];
            const display = new Display([
                "Department",
                "Average",
            ]);
            display.process(data);
            expect(data).to.deep.equal([
                { Department: "adhe", ID: "329", Fail: 10, Average: 90.02 },
                { Department: "adhe", ID: "412", Fail: 10, Average: 90.16 },
                { Department: "adhe", ID: "330", Fail: 10, Average: 90.17 },
                { Department: "adhe", ID: "412", Fail: 10, Average: 90.18 },
            ]);
        });
    });
});
