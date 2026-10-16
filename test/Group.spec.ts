import {Group} from "../src/model/queryengine/query/group/Group";
import {expect} from "chai";

describe("Group test", function () {
    describe("getKeys", function () {
        const group = new Group(["Title", "Instructor", "Average"]);
        expect(group.getKeys()).to.deep.equal(["Title", "Instructor", "Average"]);
    });
    describe("#isValid", function () {
        it("should empty Group be valid", function () {
            const validKeys = ["Instructor", "Department"];
            const group = new Group();
            return expect(group.isValid(validKeys)).to.be.true;
        });
        it("should Group with 1 key but different be invalid", function () {
            const validKeys = ["Instructor", "Department"];
            const group = new Group(["Average"]);
            return expect(group.isValid(validKeys)).to.be.false;
        });
        it("should Group with 2 keys but 1 different be invalid", function () {
            const validKeys = ["Instructor", "Department"];
            const group = new Group(["Instructor", "Average"]);
            return expect(group.isValid(validKeys)).to.be.false;
        });
        it("should Group with 2 valid keys  be valid", function () {
            const validKeys = ["Instructor", "Department"];
            const group = new Group( ["Instructor", "Department"]);
            return expect(group.isValid(validKeys)).to.be.true;
        });
    });
    describe("#process", function () {
        const data = [
            {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
            {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
            {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
            {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
            {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
            {UUID: "6", Instructor: "Kelly", Average: 72, Title: "210"},
            {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
            {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
        ];
        it("should no group empty input even no keys", function () {
            const group = new Group();
            const expectedResult: any[] = [];
            const actualResult = group.process([]);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should no group empty input even if keys", function () {
            const group = new Group(["Title", "Instructor"]);
            const expectedResult: any[] = [];
            const actualResult = group.process([]);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should no group if no key", function () {
            const group = new Group();
            const expectedResult = data;
            const actualResult = group.process(data);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should group with 1 key", function () {
            const group = new Group(["Title"]);
            const expectedResult = [
                [
                    {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                    {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                    {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                    {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                ],
                [
                    {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                    {UUID: "6", Instructor: "Kelly", Average: 72, Title: "210"},
                    {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
                    {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
                ],
            ];
            const actualResult = group.process(data);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should group with 2 keys", function () {
            const group = new Group(["Title", "Instructor"]);
            const expectedResult = [
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
                    {UUID: "6", Instructor: "Kelly", Average: 72, Title: "210"},
                    {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
                ],
                [
                    {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
                ],
            ];
            const actualResult = group.process(data);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should group with 3 keys", function () {
            const group = new Group(["Title", "Instructor", "Average"]);
            const expectedResult = [
                [
                    {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                ],
                [
                    {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                ],
                [
                    {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                ],
                [
                    {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                ],
                [
                    {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                ],
                [
                    {UUID: "6", Instructor: "Kelly", Average: 72, Title: "210"},
                    {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
                ],
                [
                    {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
                ],
            ];
            const actualResult = group.process(data);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should not mutate input data", function () {
            const group = new Group(["Title", "Instructor"]);
            group.process(data);
            expect(data).to.deep.equal([
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "6", Instructor: "Kelly", Average: 72, Title: "210"},
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ]);
        });
    });
});
