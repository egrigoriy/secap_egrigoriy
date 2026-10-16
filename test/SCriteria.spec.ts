import {expect} from "chai";
import {SCriteria} from "../src/model/queryengine/query/filter/SCriteria";

describe("SCriteria test", function () {
    describe("#isValid", function () {
        it("should be invalid if 1 SKey but different", function () {
            const validKeys = ["Instructor", "Department"];
            const criteria = new SCriteria("Title", "begins with ", "cp");
            return expect(criteria.isValid(validKeys)).to.be.false;
        });
        it("should be valid if 1 SKey among valid ones", function () {
            const validKeys = ["Instructor", "Department"];
            const criteria = new SCriteria("Department", "begins with ", "cp");
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
        it("should filter by 'is '", function () {
            const criteria = new SCriteria("Title", "is ", "310");
            const actualResult = criteria.process(data);
            const expectedResult = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
            ];
            return expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should filter by 'is not '", function () {
            const criteria = new SCriteria("Instructor", "is not ", "Kelly");
            const actualResult = criteria.process(data);
            const expectedResult = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ];
            return expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should filter by 'includes '", function () {
            const criteria = new SCriteria("Instructor", "includes ", "l");
            const actualResult = criteria.process(data);
            const expectedResult = [
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ];
            return expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should filter by 'does not include '", function () {
            const criteria = new SCriteria("Instructor", "does not include ", "ll");
            const actualResult = criteria.process(data);
            const expectedResult = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ];
            return expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should filter by 'begins with '", function () {
            const criteria = new SCriteria("Instructor", "begins with ", "J");
            const actualResult = criteria.process(data);
            const expectedResult = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
            ];
            return expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should filter by 'does not begin with '", function () {
            const criteria = new SCriteria("Instructor", "does not begin with ", "K");
            const actualResult = criteria.process(data);
            const expectedResult = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ];
            return expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should filter by 'ends with '", function () {
            const criteria = new SCriteria("Instructor", "ends with ", "ey");
            const actualResult = criteria.process(data);
            const expectedResult = [
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
            ];
            return expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should filter by 'does not end with ", function () {
            const criteria = new SCriteria("Instructor", "does not end with ", "y");
            const actualResult = criteria.process(data);
            const expectedResult = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ];
            return expect(actualResult).to.deep.equal(expectedResult);
        });
    });
});
