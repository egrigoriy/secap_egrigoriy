import {Order} from "../src/model/queryengine/query/order/Order";
import {expect} from "chai";

describe("Order test", function () {
    describe("#isValid", function () {
        it("should empty Order be valid", function () {
            const validKeys = ["Instructor", "Department"];
            const order = new Order();
            return expect(order.isValid(validKeys)).to.be.true;
        });
        it("should Order with 1 key but different be invalid", function () {
            const validKeys = ["Instructor", "Department"];
            const order = new Order("UP", ["Average"]);
            return expect(order.isValid(validKeys)).to.be.false;
        });
        it("should Order with 2 keys but 1 different be invalid", function () {
            const validKeys = ["Instructor", "Department"];
            const order = new Order("UP", ["Instructor", "Average"]);
            return expect(order.isValid(validKeys)).to.be.false;
        });
        it("should Order with 2 valid keys  be valid", function () {
            const validKeys = ["Instructor", "Department"];
            const order = new Order("DOWN", ["Instructor", "Department"]);
            return expect(order.isValid(validKeys)).to.be.true;
        });
    });

    describe("#process", function () {
        it("should not order if no key", function () {
            const dataToBeSorted = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ];
            const expectedResult = dataToBeSorted;
            const order = new Order();
            const actualResult = order.process(dataToBeSorted);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should order by 1 MKey UP", function () {
            const dataToBeSorted = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ];
            const expectedResult = [
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
            ];
            const order = new Order("UP", ["Average"]);
            const actualResult = order.process(dataToBeSorted);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should order by 1 MKey DOWN ", function () {
            const dataToBeSorted = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ];
            const expectedResult = [
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
            ];
            const order = new Order("DOWN", ["Average"]);
            const actualResult = order.process(dataToBeSorted);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should order by 1 SKey UP", function () {
            const dataToBeSorted = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ];
            const expectedResult = [
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
            ];
            const order = new Order("UP", ["Instructor"]);
            const actualResult = order.process(dataToBeSorted);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should order by 1 SKey DOWN", function () {
            const dataToBeSorted = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ];
            const expectedResult = [
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
            ];
            const order = new Order("DOWN", ["Instructor"]);
            const actualResult = order.process(dataToBeSorted);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should order by 2 Keys UP", function () {
            const dataToBeSorted = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ];
            const expectedResult = [
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
            ];
            const order = new Order("UP", ["Instructor", "Average"]);
            const actualResult = order.process(dataToBeSorted);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should order by 2 Keys DOWN", function () {
            const dataToBeSorted = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ];
            const expectedResult = [
                {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
            ];
            const order = new Order("DOWN", ["Instructor", "Average"]);
            const actualResult = order.process(dataToBeSorted);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should order by 1 MKey UP TIE", function () {
            const dataToBeSorted = [
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ];
            const expectedResult = [
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},

            ];
            const order = new Order("UP", ["Average"]);
            const actualResult = order.process(dataToBeSorted);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should order by 2 keys UP , TIE of first key", function () {
            const dataToBeSorted = [
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "8", Instructor: "Alice", Average: 85, Title: "210"},
            ];
            const expectedResult = [
                {UUID: "8", Instructor: "Alice", Average: 85, Title: "210"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
            ];
            const order = new Order("UP", ["Average", "Instructor"]);
            const actualResult = order.process(dataToBeSorted);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should order by 3 keys UP , TIE of 2 first keys", function () {
            const dataToBeSorted = [
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "8", Instructor: "Casey", Average: 85, Title: "210"},
            ];
            const expectedResult = [
                {UUID: "8", Instructor: "Casey", Average: 85, Title: "210"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
            ];
            const order = new Order("UP", ["Average", "Instructor", "Title"]);
            const actualResult = order.process(dataToBeSorted);
            expect(actualResult).to.deep.equal(expectedResult);
        });

        it("should not mutate the input data", function () {
            const dataToBeSorted = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "Casey", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "Casey", Average: 85, Title: "310"},
                {UUID: "5", Instructor: "Kelly", Average: 74, Title: "210"},
                {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ];
            const order = new Order("UP", ["Instructor", "Average"]);
            expect(dataToBeSorted).to.deep.equal([
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
    });
});
