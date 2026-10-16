import {QueryAggregate} from "../src/model/queryengine/query/QueryAggregate";
import {Group} from "../src/model/queryengine/query/group/Group";
import {Filter} from "../src/model/queryengine/query/filter/Filter";
import {Display} from "../src/model/queryengine/query/display/Display";
import {Apply} from "../src/model/queryengine/query/apply/Apply";
import {ApplyRule} from "../src/model/queryengine/query/apply/ApplyRule";
import {Order} from "../src/model/queryengine/query/order/Order";
import {expect} from "chai";
import {SCriteria} from "../src/model/queryengine/query/filter/SCriteria";

describe("QueryAggregate tests", function () {
    describe("#isValid", function () {
        it("is valid Query", function () {
            const query = new QueryAggregate({
                kind: "courses",
                id: "courses",
                group: new Group(["Department"]),
                filter: new Filter(new SCriteria("Department", "is ", "cpsc")),
                display: new Display([
                    "Department",
                    "minGrade",
                ]),
                apply: new Apply([new ApplyRule("minGrade", "MIN", "Average")]),
                order: new Order(),
            });
            return expect(query.isValid()).to.be.true;
        });
        it("is invalid valid Query - applyKey not Display", function () {
            const query = new QueryAggregate({
                kind: "courses",
                id: "courses",
                group: new Group(["Department"]),
                filter: new Filter(new SCriteria("Department", "is ", "cpsc")),
                display: new Display([
                    "Department",
                    "Title",
                ]),
                apply: new Apply([new ApplyRule("minGrade", "MIN", "Average")]),
                order: new Order(),
            });
            const actualResult = query.isValid();
            return expect(actualResult).to.be.false;
        });
        it("is invalid Query - display not in group", function () {
            const query = new QueryAggregate({
                kind: "courses",
                id: "courses",
                group: new Group(["Department"]),
                filter: new Filter(new SCriteria("Department", "is ", "cpsc")),
                display: new Display([
                    "Title",
                    "minGrade",
                ]),
                apply: new Apply([new ApplyRule("minGrade", "MIN", "Average")]),
                order: new Order(),
            });
            return expect(query.isValid()).to.be.false;
        });
        it("is invalid Query - no APPLY, but Display has key out of Group", function () {
            const query = new QueryAggregate({
                kind: "courses",
                id: "courses",
                group: new Group(["Title", "Average"]),
                filter: new Filter(),
                display: new Display([
                    "UUID",
                    "Average",
                    "Title",
                ]),
                apply: new Apply(),
                order: new Order("DOWN", ["Average"]),
            });
            return expect(query.isValid()).to.be.false;
        });
        it("is valid Query - no APPLY", function () {
            const query = new QueryAggregate({
                kind: "courses",
                id: "courses",
                group: new Group(["Title", "Average"]),
                filter: new Filter(),
                display: new Display([
                    "Average",
                    "Title",
                ]),
                apply: new Apply(),
                order: new Order("DOWN", ["Average"]),
            });
            return expect(query.isValid()).to.be.true;
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
        it("should return [] if input []", function () {
            const query = new QueryAggregate({
                kind: "courses",
                id: "courses",
                group: new Group(["Title"]),
                filter: new Filter(),
                display: new Display([
                    "Title",
                    "minOverall",
                ]),
                apply: new Apply([new ApplyRule("minOverall", "MIN", "Average")]),
                order: new Order(),
            });
            const actualResult = query.process([]);
            expect(actualResult).to.deep.equal([]);
        });
        it("should COUNT", function () {
            const query = new QueryAggregate({
                kind: "courses",
                id: "courses",
                group: new Group(["Title"]),
                filter: new Filter(),
                display: new Display([
                    "Title",
                    "count",
                ]),
                apply: new Apply([new ApplyRule("count", "COUNT", "Instructor")]),
                order: new Order(),
            });
            const expectedResult = [
                {count: 2, Title: "310"},
                {count: 2, Title: "210"},
            ];
            const actualResult = query.process(data);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should MIN", function () {
            const query = new QueryAggregate({
                kind: "courses",
                id: "courses",
                group: new Group(["Title"]),
                filter: new Filter(),
                display: new Display([
                    "Title",
                    "minOverall",
                ]),
                apply: new Apply([new ApplyRule("minOverall", "MIN", "Average")]),
                order: new Order(),
            });
            const expectedResult = [
                {minOverall: 80, Title: "310"},
                {minOverall: 72, Title: "210"},
            ];
            const actualResult = query.process(data);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should MIN with empty Instructor", function () {
            const inData = [
                {UUID: "1", Instructor: "Jean", Average: 90, Title: "310"},
                {UUID: "2", Instructor: "Jean", Average: 80, Title: "310"},
                {UUID: "3", Instructor: "", Average: 95, Title: "310"},
                {UUID: "4", Instructor: "", Average: 85, Title: "310"},
                {UUID: "5", Instructor: "", Average: 74, Title: "210"},
                {UUID: "6", Instructor: "Kelly", Average: 78, Title: "210"},
                {UUID: "7", Instructor: "Kelly", Average: 72, Title: "210"},
                {UUID: "8", Instructor: "Eli", Average: 85, Title: "210"},
            ];
            const query = new QueryAggregate({
                kind: "courses",
                id: "courses",
                group: new Group(["Instructor"]),
                filter: new Filter(),
                display: new Display([
                    "Instructor",
                    "minOverall",
                ]),
                apply: new Apply([new ApplyRule("minOverall", "MIN", "Average")]),
                order: new Order(),
            });
            const expectedResult = [
                {Instructor: "Jean", minOverall: 80},
                {Instructor: "", minOverall: 74},
                {Instructor: "Kelly", minOverall: 72},
                {Instructor: "Eli", minOverall: 85},
            ];
            const actualResult = query.process(inData);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should MAM", function () {
            const query = new QueryAggregate({
                kind: "courses",
                id: "courses",
                group: new Group(["Title"]),
                filter: new Filter(),
                display: new Display([
                    "Title",
                    "maxOverall",
                ]),
                apply: new Apply([new ApplyRule("maxOverall", "MAX", "Average")]),
                order: new Order(),
            });
            const expectedResult = [
                {maxOverall: 95, Title: "310"},
                {maxOverall: 85, Title: "210"},
            ];
            const actualResult = query.process(data);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should AVG", function () {
            const query = new QueryAggregate({
                kind: "courses",
                id: "courses",
                group: new Group(["Title"]),
                filter: new Filter(),
                display: new Display([
                    "Title",
                    "avgOverall",
                ]),
                apply: new Apply([new ApplyRule("avgOverall", "AVG", "Average")]),
                order: new Order(),
            });
            const expectedResult = [
                {avgOverall: 87.5, Title: "310"},
                {avgOverall: 77.25, Title: "210"},
            ];
            const actualResult = query.process(data);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should SUM", function () {
            const query = new QueryAggregate({
                kind: "courses",
                id: "courses",
                group: new Group(["Title"]),
                filter: new Filter(),
                display: new Display([
                    "Title",
                    "sumOverall",
                ]),
                apply: new Apply([new ApplyRule("sumOverall", "SUM", "Average")]),
                order: new Order(),
            });
            const expectedResult = [
                {sumOverall: 350, Title: "310"},
                {sumOverall: 309, Title: "210"},
            ];
            const actualResult = query.process(data);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should handle GROUP 1 KEYS NO APPLY", function () {
            const query = new QueryAggregate({
                kind: "courses",
                id: "courses",
                group: new Group(["Average"]),
                filter: new Filter(),
                display: new Display([
                    "Average",
                ]),
                apply: new Apply(),
                order: new Order(),
            });
            const expectedResult = [
                {Average: 90},
                {Average: 80},
                {Average: 95},
                {Average: 85},
                {Average: 74},
                {Average: 78},
                {Average: 72},
            ];
            const actualResult = query.process(data);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should handle GROUP 3 KEYS NO APPLY", function () {
            const query = new QueryAggregate({
                kind: "courses",
                id: "courses",
                group: new Group(["Title", "Average", "UUID"]),
                filter: new Filter(),
                display: new Display([
                    "UUID",
                    "Average",
                    "Title",
                ]),
                apply: new Apply(),
                order: new Order("DOWN", ["Average"]),
            });
            const expectedResult = [
                {UUID: "3", Average: 95, Title: "310"},
                {UUID: "1", Average: 90, Title: "310"},
                {UUID: "4", Average: 85, Title: "310"},
                {UUID: "8", Average: 85, Title: "210"},
                {UUID: "2", Average: 80, Title: "310"},
                {UUID: "6", Average: 78, Title: "210"},
                {UUID: "5", Average: 74, Title: "210"},
                {UUID: "7", Average: 72, Title: "210"},
            ];
            const actualResult = query.process(data);
            expect(actualResult).to.deep.equal(expectedResult);
        });

    });
});
