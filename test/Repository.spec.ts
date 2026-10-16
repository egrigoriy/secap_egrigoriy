import {Repository} from "../src/repository/Repository";
import {expect} from "chai";
import {IDataset} from "../src/model/datasetprocessor/DatasetProcessor";
import {InsightDatasetKind} from "../src/controller/IInsightFacade";

describe.skip("Repository test", function () {
    let repo: Repository;
    beforeEach(async function () {
        repo = Repository.getInstance();
        repo.clean();
    });

    describe("preconditions", function () {
        it("should be singleton", async function () {
            const repo2: Repository = Repository.getInstance();
            return expect(repo2 === repo).true;
        });
        it("empty db", function () {
            const expectedResult = new Map<string, IDataset>();
            const actualResult = repo.getAll();
            expect(Object.keys(actualResult).length).to.deep.equal(Object.keys(expectedResult).length);
        });
    });

    describe("#insert", function () {
        it("should not insert if repo dir removed", async function () {
            repo.removeMemoryDir();
            expect(() => repo.insert("courses", null)).to.throw(Error);
        });
        it("should insert 1 id", async function () {
            const id = "courses";
            const dataset: IDataset = null;
            const expectedResult = new Map<string, IDataset>().set(id, dataset);
            repo.insert(id, dataset);
            const actualResult = repo.getAll();
            expect(Object.keys(actualResult).length).to.deep.equal(Object.keys(expectedResult).length);
        });
        it("should insert 2 ids", async function () {
            const id1 = "courses1";
            const id2 = "courses2";
            const dataset: IDataset = null;
            const expectedResult = new Map<string, IDataset>();
            expectedResult.set(id1, dataset);
            expectedResult.set(id2, dataset);
            repo.insert(id1, dataset);
            repo.insert(id2, dataset);
            const actualResult = repo.getAll();
            expect(Object.keys(actualResult).length).to.deep.equal(Object.keys(expectedResult).length);
        });
    });

    describe("#delete", function () {
        it("should not delete if repo dir removed", async function () {
            repo.removeMemoryDir();
            expect(() => repo.remove("courses")).to.throw(Error);
        });
        it("should delete 1 id", async function () {
            const id = "courses3";
            const dataset: IDataset = null;
            const expectedResult = new Map<string, IDataset>();
            repo.insert(id, dataset);
            repo.remove(id);
            const actualResult = repo.getAll();
            expect(Object.keys(actualResult).length).to.deep.equal(Object.keys(expectedResult).length);
        });
        it("should delete 2 ids", async function () {
            const id1 = "courses4";
            const id2 = "courses5";
            const dataset: IDataset = null;
            const expectedResult = new Map<string, IDataset>();
            repo.insert(id1, dataset);
            repo.insert(id2, dataset);
            repo.remove(id2);
            repo.remove(id1);
            const actualResult = repo.getAll();
            expect(Object.keys(actualResult).length).to.deep.equal(Object.keys(expectedResult).length);
        });
    });

    describe("#get", function () {
        it("should throw error when no such id", async function () {
            const id = "courses";
            const dataset: IDataset = {
                kind: InsightDatasetKind.Courses,
                rows: [],
                numRows: 123,
            };
            repo.insert(id, dataset);
            expect(() => repo.get("foo")).to.throw(Error);
        });
        it("should get with success", async function () {
            const id = "courses";
            const dataset: IDataset = {
                kind: InsightDatasetKind.Courses,
                rows: [],
                numRows: 123,
            };
            repo.insert(id, dataset);

            const actualResult = repo.get(id);
            expect(Object.keys(actualResult).length).to.deep.equal(Object.keys(dataset).length);
            expect(actualResult.kind).to.deep.equal(dataset.kind);
            expect(actualResult.rows).to.deep.equal(dataset.rows);
            expect(actualResult.numRows).to.deep.equal(dataset.numRows);
        });
    });

    describe("#getAll", function () {
        it("should throw error if repo dir removed", async function () {
            const id1 = "courses6";
            const id2 = "courses7";
            const dataset: IDataset = null;
            const expectedResult = new Map<string, IDataset>();
            expectedResult.set(id1, dataset);
            expectedResult.set(id2, dataset);
            repo.insert(id1, dataset);
            repo.insert(id2, dataset);

            repo.removeMemoryDir();
            expect(() => repo.getAll()).to.throw(Error);
        });

        it("should recover after crash 2 earlier added ids", async function () {
            const id1 = "courses6";
            const id2 = "courses7";
            const dataset: IDataset = null;
            const expectedResult = new Map<string, IDataset>();
            expectedResult.set(id1, dataset);
            expectedResult.set(id2, dataset);
            repo.insert(id1, dataset);
            repo.insert(id2, dataset);
            // crash
            repo = Repository.getInstance();
            const actualResult = repo.getAll();
            expect(Object.keys(actualResult).length).to.deep.equal(Object.keys(expectedResult).length);
        });
    });

    describe("#exists", function () {
        it("should find 1 id added", async function () {
            const id = "courses";
            const dataset: IDataset = null;
            repo.insert(id, dataset);

            const actualResult = repo.exists(id);
            return expect(actualResult).to.be.true;
        });
        it("should not find not added id", async function () {
            const id = "courses";
            const dataset: IDataset = null;
            repo.insert(id, dataset);

            const actualResult = repo.exists("foo");
            return expect(actualResult).to.be.false;
        });
    });

    describe("#clean", function () {
        it("should clean", async function () {
            repo.clean();
            const expectedResult = new Map<string, IDataset>();
            const actualResult = repo.getAll();
            expect(Object.keys(actualResult).length).to.deep.equal(Object.keys(expectedResult).length);
        });
    });
});
