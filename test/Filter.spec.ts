import {expect} from "chai";
import {Filter} from "../src/model/queryengine/query/filter/Filter";
import {SCriteria} from "../src/model/queryengine/query/filter/SCriteria";
import {MCriteria} from "../src/model/queryengine/query/filter/MCriteria";
import {Or} from "../src/model/queryengine/query/filter/Or";
import {And} from "../src/model/queryengine/query/filter/And";

describe("Filter test", function () {
    describe("#isValid", function () {
        it("should empty Filter valid", function () {
            const filter = new Filter();
            const validKeys = ["Instructor", "Pass", "Year", "Department"];
            return expect(filter.isValid(validKeys)).to.be.true;
        });
        it("should be invalid if 1 SKey but different", function () {
            const validKeys = ["Instructor", "Department"];
            const filter = new Filter(
                new SCriteria("Title", "begins with ", "cp"),
            );
            return expect(filter.isValid(validKeys)).to.be.false;
        });
        it("should be invalid if 1 MKey but different", function () {
            const validKeys = ["Instructor", "Department", "Audit"];
            const filter = new Filter(
                new MCriteria("Pass", "is equal to ", 44),
            );
            return expect(filter.isValid(validKeys)).to.be.false;
        });
        it("should be invalid if OR but different keys", function () {
            const validKeys = ["Instructor", "Department"];
            const filter = new Filter(
                new Or(
                    new SCriteria("Department", "begins with ", "cp"),
                    new MCriteria("Pass", "is equal to ", 44),
                ),
            );
            return expect(filter.isValid(validKeys)).to.be.false;
        });
        it("should be invalid if AND but different keys", function () {
            const validKeys = ["Instructor", "Department", "Title"];
            const filter = new Filter(
                new And(
                    new MCriteria("Pass", "is equal to ", 44),
                    new SCriteria("Title", "begins with ", "cp"),
                ),
            );
            return expect(filter.isValid(validKeys)).to.be.false;
        });
        it("should be invalid if complex CRITERIA but different keys", function () {
            const validKeys = ["Instructor", "Department", "Title", "Pass"];
            const filter = new Filter(
                new Or(
                    new And(
                        new MCriteria("Pass", "is equal to ", 44),
                        new SCriteria("Title", "begins with ", "cp"),
                    ),
                    new MCriteria("Audit", "is equal to ", 44),
                ),
            );
            return expect(filter.isValid(validKeys)).to.be.false;
        });
        it("should be valid if complex CRITERIA all keys", function () {
            const validKeys = ["Instructor", "Department", "Title", "Pass", "Audit"];
            const filter = new Filter(
                new Or(
                    new And(
                        new MCriteria("Pass", "is equal to ", 44),
                        new SCriteria("Title", "begins with ", "cp"),
                    ),
                    new SCriteria("Department", "begins with ", "cp"),
                ),
            );
            return expect(filter.isValid(validKeys)).to.be.true;
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
        it("should not mutate input data", function () {
            const filter = new Filter();
            filter.process(data);
            return expect(data).to.deep.equal([
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ]);
        });
        it("should not change input data if no criteria", function () {
            const filter = new Filter();
            const actualResult = filter.process(data);
            return expect(actualResult).to.deep.equal(data);
        });
        it("should return empty array if no matching criteria", function () {
            const filter = new Filter(
                new SCriteria("Instructor", "is ", "Fred Flintstones"),
            );
            const actualResult = filter.process(data);
            return expect(actualResult).to.deep.equal([]);
        });
        it("should filter by MCriteria", function () {
            const filter = new Filter(
                new MCriteria("Average", "is equal to ", 85),
            );
            const expectedResult = [
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ];
            const actualResult = filter.process(data);
            return expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should filter by SCriteria", function () {
            const filter = new Filter(
                new SCriteria("Instructor", "is ", "Kelly"),
            );
            const expectedResult = [
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
            ];
            const actualResult = filter.process(data);
            return expect(actualResult).to.deep.equal(expectedResult);
        });

        it("should be filter by OR", function () {
            const filter = new Filter(
                new Or(
                    new SCriteria("Title", "is ", "310"),
                    new MCriteria("Average", "is greater than ", 80),
                ),
            );
            const expectedResult = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ];
            const actualResult = filter.process(data);
            return expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should be filter by AND", function () {
            const validKeys = ["Instructor", "Department", "Title"];
            const filter = new Filter(
                new And(
                    new MCriteria("Average", "is greater than ", 80),
                    new SCriteria("Title", "is not ", "310"),
                ),
            );
            const expectedResult = [
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ];
            const actualResult = filter.process(data);
            return expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should filter by complex CRITERIA", function () {
            const filter = new Filter(
                new Or(
                    new And(
                        new MCriteria("Average", "is less than ", 80),
                        new SCriteria("Title", "is not ", "310"),
                    ),
                    new MCriteria("Average", "is greater than ", 85),
                ),
            );
            const expectedResult = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
            ];
            const actualResult = filter.process(data);
            return expect(actualResult).to.have.deep.members(expectedResult);
            expect(actualResult).to.have.length(expectedResult.length);
        });
    });
});
