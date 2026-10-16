import {MCriteria} from "../src/model/queryengine/query/filter/MCriteria";
import {expect} from "chai";

describe("MCriteria test", function () {
    describe("#isValid", function () {
        it("should be invalid if 1 MKey but different", function () {
            const validKeys = ["Average", "Pass"];
            const criteria = new MCriteria("Fail", "is greater than ", 10);
            return expect(criteria.isValid(validKeys)).to.be.false;
        });
        it("should be invalid if 1 SKey among valid ones", function () {
            const validKeys = ["Average", "Pass"];
            const criteria = new MCriteria("Pass", "is greater than ", 10);
            return expect(criteria.isValid(validKeys)).to.be.true;
        });
    });
    describe("#process", function () {
        const data = [
            {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
            {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
            {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
            {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
            {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
            {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
            {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
            {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
        ];
        it("should filter by 'is equal to '", function () {
            const criteria = new MCriteria("Average", "is equal to ", 85);
            const actualResult = criteria.process(data);
            const expectedResult = [
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ];
            return expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should filter by 'is not equal to '", function () {
            const criteria = new MCriteria("Average", "is not equal to ", 85);
            const actualResult = criteria.process(data);
            const expectedResult = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
            ];
            return expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should filter by 'is greater than '", function () {
            const criteria = new MCriteria("Average", "is greater than ", 85);
            const actualResult = criteria.process(data);
            const expectedResult = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
            ];
            return expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should filter by 'is not greater than '", function () {
            const criteria = new MCriteria("Average", "is not greater than ", 85);
            const actualResult = criteria.process(data);
            const expectedResult = [
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ];
            return expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should filter by 'is less than '", function () {
            const criteria = new MCriteria("Average", "is less than ", 85);
            const actualResult = criteria.process(data);
            const expectedResult = [
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
            ];
            return expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should filter by 'is not less than '", function () {
            const criteria = new MCriteria("Average", "is not less than ", 85);
            const actualResult = criteria.process(data);
            const expectedResult = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ];
            return expect(actualResult).to.deep.equal(expectedResult);
        });
    });
});
