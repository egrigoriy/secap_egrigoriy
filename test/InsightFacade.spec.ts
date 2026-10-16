import {expect} from "chai";

import {
    InsightDataset,
    InsightDatasetKind,
    InsightResponse,
    InsightResponseSuccessBody,
} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
import Log from "../src/Util";
import TestUtil from "./TestUtil";
import {Repository} from "../src/repository/Repository";

// This should match the JSON schema described in test/query.schema.json
// except 'filename' which is injected when the file is read.
export interface ITestQuery {
    title: string;
    query: any;  // make any to allow testing structurally invalid queries
    response: InsightResponse;
    filename: string;  // This is injected when reading the file
}

describe("InsightFacade Add/Remove Dataset test", function () {
    // Reference any datasets you've added to test/data here and they will
    // automatically be loaded in the Before All hook.
    const datasetsToLoad: { [id: string]: string } = {
        courses: "./test/data/courses.zip",
        invalid_notZipFile: "./test/data/invalid_notZipFile.txt",
        invalid_emptyZipFile: "./test/data/invalid_emptyZipFile.zip",
        invalid_noCoursesFolder: "./test/data/invalid_noCoursesFolder.zip",
        invalid_emptyCoursesFolder: "./test/data/invalid_emptyCoursesFolder.zip",
        invalid_coursesFolderWithNoCSVFile: "./test/data/invalid_coursesFolderWithNoCSVFile.zip",
        invalid_manyCSVnoSections: "./test/data/invalid_manyCSVnoSections.zip",
        invalid_courses1_sections0: "./test/data/invalid_courses1_sections0.zip",
        invalid_courses1_sections1_noAuditColumn: "./test/data/invalid_courses1_sections1_noAuditColumn.zip",
        invalid_courses1_sections1_noAvgColumn: "./test/data/invalid_courses1_sections1_noAvgColumn.zip",
        invalid_courses1_sections1_noCourseColumn: "./test/data/invalid_courses1_sections1_noCourseColumn.zip",
        invalid_courses1_sections1_noFailColumn: "./test/data/invalid_courses1_sections1_noFailColumn.zip",
        invalid_courses1_sections1_noIdColumn: "./test/data/invalid_courses1_sections1_noIdColumn.zip",
        invalid_courses1_sections1_noPassColumn: "./test/data/invalid_courses1_sections1_noPassColumn.zip",
        invalid_courses1_sections1_noProfessorColumn: "./test/data/invalid_courses1_sections1_noProfessorColumn.zip",
        invalid_courses1_sections1_noSubjectColumn: "./test/data/invalid_courses1_sections1_noSubjectColumn.zip",
        invalid_courses1_sections1_noTitleColumn: "./test/data/invalid_courses1_sections1_noTitleColumn.zip",
        invalid_courses1_sections1_nbrFieldsGreaterThanHeaders:
            "./test/data/invalid_courses1_sections1_nbrFieldsGreaterThanHeaders.zip",
        invalid_courses1_sections1_nbrFieldsLessThanHeaders:
            "./test/data/invalid_courses1_sections1_nbrFieldsLessThanHeaders.zip",
        rooms: "./test/data/rooms.zip",
    };

    let insightFacade: InsightFacade;
    let datasets: { [id: string]: string };
    const tryListDatasets = async function () {
        let response: InsightResponse;
        try {
            response = await insightFacade.listDatasets();
        } catch (err) {
            response = err;
        }
        return response;
    };

    const tryAddDataset = async function (id: string, content: string, kind: InsightDatasetKind) {
        let response: InsightResponse;
        try {
            response = await insightFacade.addDataset(id, content, kind);
        } catch (err) {
            response = err;
        }
        return response;
    };
    const addCoursesWithIds = async function (ids: string[]) {
        for (const id of ids) {
            try {
                await insightFacade.addDataset(id, datasets["courses"], InsightDatasetKind.Courses);
            } catch (err) {
                Log.error(`Error initial adding dataset with id " ${id}.  ${JSON.stringify(err)}`);
            }
        }
    };
    const addRoomsWithIds = async function (ids: string[]) {
        for (const id of ids) {
            try {
                await insightFacade.addDataset(id, datasets["rooms"], InsightDatasetKind.Rooms);
            } catch (err) {
                Log.error(`Error initial adding dataset with id " ${id}.  ${JSON.stringify(err)}`);
            }
        }
    };
    const tryRemoveDataset = async function (id: string) {
        let response: InsightResponse;
        try {
            response = await insightFacade.removeDataset(id);
        } catch (err) {
            response = err;
        }
        return response;
    };
    const removeDatasetsWithIds = async function (ids: string[]) {
        for (const id of ids) {
            try {
                await insightFacade.removeDataset(id);
            } catch (err) {
                Log.error(`Error removing/cleaning dataset with id " ${id}.  ${JSON.stringify(err)}`);
            }
        }
    };

    const expectAddError = function (response: InsightResponse) {
        expect(response.code).to.equal(400);
        expect(response.body).to.have.property("error");
    };
    const expectAddSuccess = function (response: InsightResponse) {
        expect(response.code).to.equal(204);
        expect(response.body).to.have.property("result");
    };
    const expectRemoveError = function (response: InsightResponse) {
        expect(response.code).to.equal(404);
        expect(response.body).to.have.property("error");
    };
    const expectRemoveSuccess = function (response: InsightResponse) {
        expect(response.code).to.equal(204);
        expect(response.body).to.have.property("result");
    };
    const expectListDatasetsSuccess = function (response: InsightResponse) {
        expect(response.code).to.equal(200);
        expect(response.body).to.have.property("result");
    };
    const crash = function () {
        insightFacade = new InsightFacade();
    };
    before(async function () {
        Log.test(`Before: ${this.test.parent.title}`);
        Repository.getInstance().clean();
        try {
            datasets = await TestUtil.loadDatasets(datasetsToLoad);
            expect(Object.keys(datasets)).to.have.length.greaterThan(0);
        } catch (err) {
            expect.fail("", "", `Failed to read one or more datasets. ${JSON.stringify(err)}`);
        }
    });

    beforeEach(async function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
        insightFacade = new InsightFacade();
    });

    after(function () {
        Log.test(`After: ${this.test.parent.title}`);
    });

    afterEach(function () {
        Log.test(`AfterTest: ${this.currentTest.title}`);
    });

    describe("#addDataset", function () {
        describe("pass INVALID id, valid content and valid kind", function () {
            const expectErrorWhenAddingInvalidId = async function (invalidId: string) {
                const response = await tryAddDataset(invalidId, datasets["courses"], InsightDatasetKind.Courses);
                // assert
                expectAddError(response);
            };
            it("should reject when id is null", async function () {
                const invalidId: string = null;
                await expectErrorWhenAddingInvalidId(invalidId);
            });
            it("should reject when id is undefined", async function () {
                const invalidId: string = undefined;
                await expectErrorWhenAddingInvalidId(invalidId);
            });
            it("should reject when id is empty string", async function () {
                const invalidId: string = "";
                await expectErrorWhenAddingInvalidId(invalidId);
            });
            it("should reject when id is only empty spaces", async function () {
                const invalidId: string = "   ";
                await expectErrorWhenAddingInvalidId(invalidId);
            });
            it("should reject when id contains spaces", async function () {
                const invalidId: string = "cour ses";
                await expectErrorWhenAddingInvalidId(invalidId);
            });
            it("should reject when id contains underscore", async function () {
                const invalidId: string = "cour_ses";
                await expectErrorWhenAddingInvalidId(invalidId);
            });
            it("should ERROR when id is a reserved word", async function () {
                const reservedKeywords: string[] = [
                    "In",
                    "dataset",
                    "find",
                    "all",
                    "show",
                    "and",
                    "or",
                    "sort",
                    "by",
                    "entries",
                    "is",
                    "the",
                    "of",
                    "whose",
                ];

                for (const keyword of reservedKeywords) {
                    await expectErrorWhenAddingInvalidId(keyword);
                }
            });
        });
        describe("(valid id, INVALID content, valid kind)", function () {
            const expectErrorWhenAddingInvalidContent = async function (invalidContent: string) {
                const validId: string = "courses";
                const response = await tryAddDataset(validId, invalidContent, InsightDatasetKind.Courses);
                expectAddError(response);
            };
            it("should ERROR not zip file", async function () {
                const invalidContent = datasets["invalid_notZipFile"];
                await expectErrorWhenAddingInvalidContent(invalidContent);
            });
            it("should ERROR empty zip file", async function () {
                const invalidContent = datasets["emptyZipFile"];
                await expectErrorWhenAddingInvalidContent(invalidContent);
            });
            it("should ERROR zip file with missing courses folder", async function () {
                const invalidContent = datasets["invalid_noCoursesFolder"];
                await expectErrorWhenAddingInvalidContent(invalidContent);
            });
            it("should ERROR zip file with empty courses folder", async function () {
                const invalidContent = datasets["invalid_emptyCoursesFolder"];
                await expectErrorWhenAddingInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder but non csv files", async function () {
                const invalidContent = datasets["coursesFolderWithNoCSVFile"];
                await expectErrorWhenAddingInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder csv files but no AUDIT column", async function () {
                const invalidContent = datasets["invalid_courses1_sections1_noAuditColumn"];
                await expectErrorWhenAddingInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder csv files but no AVG column", async function () {
                const invalidContent = datasets["invalid_courses1_sections1_noAvgColumn"];
                await expectErrorWhenAddingInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder csv files but no COURSE column", async function () {
                const invalidContent = datasets["invalid_courses1_sections1_noCourseColumn"];
                await expectErrorWhenAddingInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder csv files but no FAIL column", async function () {
                const invalidContent = datasets["invalid_courses1_sections1_noFailColumn"];
                await expectErrorWhenAddingInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder csv files but no ID column", async function () {
                const invalidContent = datasets["invalid_courses1_sections1_noIdColumn"];
                await expectErrorWhenAddingInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder csv files but no PASS column", async function () {
                const invalidContent = datasets["invalid_courses1_sections1_noPassColumn"];
                await expectErrorWhenAddingInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder csv files but no PROFESSOR column", async function () {
                const invalidContent = datasets["invalid_courses1_sections1_noProfessorColumn"];
                await expectErrorWhenAddingInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder csv files but no SUBJECT column", async function () {
                const invalidContent = datasets["invalid_courses1_sections1_noSubjectColumn"];
                await expectErrorWhenAddingInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder csv files but no TITLE column", async function () {
                const invalidContent = datasets["invalid_courses1_sections1_noTitleColumn"];
                await expectErrorWhenAddingInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder INVALID CSV fields > headers", async function () {
                const invalidContent = datasets["invalid_courses1_sections1_nbrFieldsGreaterThanHeaders"];
                await expectErrorWhenAddingInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder INVALID CSV fields < headers", async function () {
                const invalidContent = datasets["invalid_courses1_sections1_nbrFieldsLessThanHeaders"];
                await expectErrorWhenAddingInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder 1 valid csv file but 0 sections", async function () {
                const invalidContent = datasets["invalid_courses1_sections0"];
                await expectErrorWhenAddingInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder many valid csv files but 0 sections", async function () {
                const invalidContent = datasets["invalid_manyCSVnoSections"];
                await expectErrorWhenAddingInvalidContent(invalidContent);
            });
            it("should ERROR when content string is not base64 encoded", async function () {
                const invalidContent: string = "ȜĳŷéŲ😉😴ų¡ǅł😭😏🙇😩😞😋😏Ê♛ǊƗ☸ų";
                await expectErrorWhenAddingInvalidContent(invalidContent);
            });
        });

        describe("pass valid id, valid content and INVALID kind", async function () {
            const expectErrorWhenAddingMisMatch = async function (content: string, invalidKind: InsightDatasetKind) {
                const response = await tryAddDataset("allCourses", content, invalidKind);
                // assert
                expectAddError(response);
            };
            it("should reject when passed kind is null for Courses", async function () {
                await expectErrorWhenAddingMisMatch(datasets["courses"], null);
            });
            it("should reject when passed kind is null for Rooms", async function () {
                await expectErrorWhenAddingMisMatch(datasets["rooms"], null);
            });
            it("should reject when passed kind is undefined for Courses", async function () {
                await expectErrorWhenAddingMisMatch(datasets["courses"], undefined);
            });
            it("should reject when passed kind is undefined for Rooms", async function () {
                await expectErrorWhenAddingMisMatch(datasets["rooms"], undefined);
            });
            it("should reject when passed kind is Rooms but content is Courses", async function () {
                await expectErrorWhenAddingMisMatch(datasets["courses"], InsightDatasetKind.Rooms);
            });
            it("should reject when passed kind is Courses but content is Rooms", async function () {
                await expectErrorWhenAddingMisMatch(datasets["rooms"], InsightDatasetKind.Courses);
            });
        });
        describe("(valid id, valid content, valid kind)", async function () {
            describe("when previously added 0 datasets", function () {
                it("should SUCCESS to add SINGLE valid dataset Courses", async function () {
                    this.timeout(10000);
                    const validId = "courses";

                    const response = await tryAddDataset(validId, datasets["courses"], InsightDatasetKind.Courses);
                    expectAddSuccess(response);
                    await removeDatasetsWithIds([validId]);
                });
                it("should SUCCESS to add SINGLE valid dataset Rooms", async function () {
                    this.timeout(10000);
                    const validId = "rooms";

                    const response = await tryAddDataset(validId, datasets["rooms"], InsightDatasetKind.Rooms);
                    expectAddSuccess(response);
                    await removeDatasetsWithIds([validId]);
                });
            });
            describe("when previously added 1 dataset", function () {
                it("should ERROR to add with SAME id if NO CRASH", async function () {
                    const validId = "courses";
                    const sameValidId = validId;
                    await addCoursesWithIds([validId]);

                    const response = await tryAddDataset(sameValidId, datasets["courses"], InsightDatasetKind.Courses);
                    expectAddError(response);
                    await removeDatasetsWithIds([validId]);
                });
                it("should ERROR to add with SAME id if CRASH", async function () {
                    const validId = "courses";
                    const sameValidId = validId;
                    await addCoursesWithIds([validId]);

                    // CRASH
                    crash();
                    const response = await tryAddDataset(sameValidId, datasets["courses"], InsightDatasetKind.Courses);
                    expectAddError(response);
                    await removeDatasetsWithIds([validId]);
                });

                it("should SUCCESS to add with DIFFERENT id if NO CRASH", async function () {
                    this.timeout(10000);
                    const validId = "courses";
                    const otherValidId: string = "courses-2";

                    await addCoursesWithIds([validId]);

                    const response = await tryAddDataset(otherValidId, datasets["courses"], InsightDatasetKind.Courses);
                    expectAddSuccess(response);
                    await removeDatasetsWithIds([validId, otherValidId]);
                });
                it("should SUCCESS to add with DIFFERENT id if CRASH", async function () {
                    this.timeout(10000);
                    const validId = "courses";
                    const otherValidId: string = "courses-2";

                    await addCoursesWithIds([validId]);

                    // CRASH
                    crash();
                    const response = await tryAddDataset(otherValidId, datasets["courses"], InsightDatasetKind.Courses);
                    expectAddSuccess(response);
                    await removeDatasetsWithIds([validId, otherValidId]);
                });
            });
            describe("when previously added 2 datasets", function () {
                it("should ERROR to add with SAME id as LAST if NO CRASH", async function () {
                    this.timeout(10000);
                    const beforeLastId: string = "courses";
                    const lastId: string = "courses-2";

                    const sameAsLastId: string = lastId;

                    await addCoursesWithIds([beforeLastId, lastId]);

                    const response = await tryAddDataset(sameAsLastId, datasets["courses"], InsightDatasetKind.Courses);
                    expectAddError(response);

                    await removeDatasetsWithIds([beforeLastId, lastId]);
                });
                it("should ERROR to add with SAME id as BEFORE LAST if NO CRASH", async function () {
                    this.timeout(10000);
                    const beforeLastId: string = "courses";
                    const lastId: string = "courses-2";
                    const sameAsBeforeLastId: string = beforeLastId;

                    await addCoursesWithIds([beforeLastId, lastId]);

                    const response = await tryAddDataset(
                        sameAsBeforeLastId,
                        datasets["courses"],
                        InsightDatasetKind.Courses);
                    expectAddError(response);

                    await removeDatasetsWithIds([beforeLastId, lastId]);
                });
                it("should SUCCESS to add with DIFFERENT id if NO CRASH", async function () {
                    this.timeout(10000);
                    const beforeLastId: string = "courses";
                    const lastId: string = "courses-2";
                    const otherThanPreviousIds: string = "otherThanPreviousIds1";

                    await addCoursesWithIds([beforeLastId, lastId]);

                    const response = await tryAddDataset(
                        otherThanPreviousIds,
                        datasets["courses"],
                        InsightDatasetKind.Courses);
                    expectAddSuccess(response);

                    await removeDatasetsWithIds([beforeLastId, lastId, otherThanPreviousIds]);
                });
            });
        });
    });
    describe("#removeDataset", function () {
        describe("pass INVALID id", function () {
            it("should ERROR when id is null", async function () {
                const invalidId: string = null;
                const response = await tryRemoveDataset(invalidId);
                expectRemoveError(response);
            });
            it("should ERROR when id is undefined", async function () {
                const invalidId: string = undefined;
                const response = await tryRemoveDataset(invalidId);
                expectRemoveError(response);
            });
            it("should ERROR when id is empty string", async function () {
                const invalidId: string = "";
                const response = await tryRemoveDataset(invalidId);
                expectRemoveError(response);
            });
            it("should ERROR when id is only whitespaces", async function () {
                const invalidId: string = "  ";
                const response = await tryRemoveDataset(invalidId);
                expectRemoveError(response);
            });
            it("should ERROR when id contains whitespaces", async function () {
                const invalidId: string = "co urses";
                const response = await tryRemoveDataset(invalidId);
                expectRemoveError(response);
            });
            it("should ERROR when id contains underscore", async function () {
                const invalidId: string = "cou_rses";
                const response = await tryRemoveDataset(invalidId);
                expectRemoveError(response);
            });
            it("should ERROR when id is a reserved word", async function () {
                const reservedKeywords: string[] = [
                    "In",
                    "dataset",
                    "find",
                    "all",
                    "show",
                    "and",
                    "or",
                    "sort",
                    "by",
                    "entries",
                    "is",
                    "the",
                    "of",
                    "whose",
                    "begins",
                    "ends",
                ];

                for (const keyword of reservedKeywords) {
                    const response = await tryRemoveDataset(keyword);
                    expectRemoveError(response);
                }
            });
        });
        describe("pass VALID id", function () {
            describe("when previously added 0 datasets", function () {
                it("should ERROR removing", async function () {
                    const validId = "courses";
                    const response = await tryRemoveDataset(validId);
                    expectRemoveError(response);
                });
            });
            describe("when previously added 1 dataset", function () {
                it("should ERROR to remove DIFFERENT id if NO CRASH", async function () {
                    this.timeout(10000);
                    const validId = "courses";
                    const otherValidId: string = "courses-322";

                    await addCoursesWithIds([validId]);
                    const response = await tryRemoveDataset(otherValidId);
                    expectRemoveError(response);
                    await removeDatasetsWithIds([validId]);
                });
                it("should SUCCESS to remove SAME id if NO CRASH", async function () {
                    this.timeout(10000);
                    const validId = "courses";
                    const sameValidId: string = validId;

                    await addCoursesWithIds([validId]);

                    const response = await tryRemoveDataset(sameValidId);
                    expectRemoveSuccess(response);
                });
            });
            describe("when previously added 2 datasets", function () {
                it("should SUCCESS to remove SAME id as LAST if NO CRASH", async function () {
                    this.timeout(10000);
                    const beforeLastId: string = "courses";
                    const lastId: string = "courses-2";
                    const sameAsLastId: string = lastId;

                    await addCoursesWithIds([beforeLastId, lastId]);

                    const response = await tryRemoveDataset(sameAsLastId);
                    expectRemoveSuccess(response);
                    await removeDatasetsWithIds([beforeLastId]);
                });
                it("should SUCCESS to remove SAME id as BEFORE LAST if NO CRASH", async function () {
                    this.timeout(10000);
                    const beforeLastId: string = "courses";
                    const lastId: string = "courses-2";
                    const sameAsBeforeLastId: string = beforeLastId;

                    await addCoursesWithIds([beforeLastId, lastId]);

                    const response = await tryRemoveDataset(sameAsBeforeLastId);
                    expectRemoveSuccess(response);
                    await removeDatasetsWithIds([lastId]);
                });
                it("should ERROR to remove DIFFERENT id if NO CRASH", async function () {
                    this.timeout(10000);
                    const beforeLastId: string = "courses";
                    const lastId: string = "courses-2";
                    const otherThanPreviousIds: string = "otherThanPreviousIds3";
                    await addCoursesWithIds([beforeLastId, lastId]);

                    const response = await tryRemoveDataset(otherThanPreviousIds);
                    expectRemoveError(response);
                    await removeDatasetsWithIds([beforeLastId, lastId]);
                });
                it("should SUCCESS to remove MULTIPLE datasets in ORDER if NO CRASH", async function () {
                    this.timeout(10000);
                    const beforeLastId: string = "courses";
                    const lastId: string = "courses-2";

                    await addCoursesWithIds([beforeLastId, lastId]);
                    await tryRemoveDataset(beforeLastId);
                    const response = await tryRemoveDataset(lastId);
                    expectRemoveSuccess(response);
                });
                it("should SUCCESS to remove MULTIPLE datasets in INVERSE ORDER if NO CRASH", async function () {
                    this.timeout(10000);
                    const beforeLastId: string = "courses";
                    const lastId: string = "courses-2";
                    await addCoursesWithIds([beforeLastId, lastId]);

                    await tryRemoveDataset(lastId);
                    const response = await tryRemoveDataset(beforeLastId);
                    expectRemoveSuccess(response);
                });
            });
        });
    });

    describe("#listDatasets", function () {
        it("should list no dataset when nothing added before", async function () {
            // act
            const response = await tryListDatasets();
            // assert
            const expectedResponse: InsightResponse = {code: 200, body: {result: []}};
            expect(response).to.deep.equal(expectedResponse);
        });
        it("should list one Courses dataset when one valid dataset added before", async function () {
            this.timeout(10000);
            const id: string = "courses";
            // arrange
            await addCoursesWithIds([id]);
            // act
            const response = await tryListDatasets();
            // assert
            const expectedResult: InsightDataset[] = [{
                id,
                kind: InsightDatasetKind.Courses,
                numRows: 64612,
            }];
            expectListDatasetsSuccess(response);
            const actualResult = (response.body as InsightResponseSuccessBody).result;
            expect(actualResult).to.be.instanceOf(Array);
            expect(actualResult).to.have.length(expectedResult.length);
            expect(actualResult).to.deep.equal(expectedResult);
            // clean after test
            await removeDatasetsWithIds([id]);
        });
        it("should list one Rooms dataset when one valid dataset added before", async function () {
            this.timeout(10000);
            const id: string = "rooms";
            // arrange
            await addRoomsWithIds([id]);
            // act
            const response = await tryListDatasets();
            // assert
            const expectedResult: InsightDataset[] = [{
                id,
                kind: InsightDatasetKind.Rooms,
                numRows: 284,
            }];
            expectListDatasetsSuccess(response);
            const actualResult = (response.body as InsightResponseSuccessBody).result;
            expect(actualResult).to.be.instanceOf(Array);
            expect(actualResult).to.have.length(expectedResult.length);
            expect(actualResult).to.deep.equal(expectedResult);
            // clean after test
            await removeDatasetsWithIds([id]);
        });
        it("should list multiple Courses datasets when multiple valid datasets added before", async function () {
            this.timeout(10000);
            const id = "courses";
            const validId2 = "courses-2";
            // arrange
            await addCoursesWithIds([id, validId2]);

            // act
            const response = await tryListDatasets();
            // assert
            const expectedResult: InsightDataset[] = [{
                id,
                kind: InsightDatasetKind.Courses,
                numRows: 64612,
            }, {
                id: validId2,
                kind: InsightDatasetKind.Courses,
                numRows: 64612,
            }];
            expectListDatasetsSuccess(response);
            const actualResult = (response.body as InsightResponseSuccessBody).result;
            expect(actualResult).to.be.instanceOf(Array);
            expect(actualResult).to.have.length(expectedResult.length);
            expect(actualResult).to.have.deep.members(expectedResult);
            // clean after test
            await removeDatasetsWithIds([id, validId2]);
        });
        it("should list multiple Rooms datasets when multiple valid datasets added before", async function () {
            this.timeout(10000);
            const id = "rooms";
            const validId2 = "rooms-2";
            // arrange
            await addRoomsWithIds([id, validId2]);

            // act
            const response = await tryListDatasets();
            // assert
            const expectedResult: InsightDataset[] = [{
                id,
                kind: InsightDatasetKind.Rooms,
                numRows: 284,
            }, {
                id: validId2,
                kind: InsightDatasetKind.Rooms,
                numRows: 284,
            }];
            expectListDatasetsSuccess(response);
            const actualResult = (response.body as InsightResponseSuccessBody).result;
            expect(actualResult).to.be.instanceOf(Array);
            expect(actualResult).to.have.length(expectedResult.length);
            expect(actualResult).to.have.deep.members(expectedResult);
            // clean after test
            await removeDatasetsWithIds([id, validId2]);
        });
        it("should list mix of Courses and Rooms datasets when multiple valid datasets added before",
            async function () {
                this.timeout(10000);
                const coursesId = "courses";
                const roomsId = "rooms";
                // arrange
                await addRoomsWithIds([roomsId]);
                await addCoursesWithIds([coursesId]);

                // act
                const response = await tryListDatasets();
                // assert
                const expectedResult: InsightDataset[] = [{
                    id: coursesId,
                    kind: InsightDatasetKind.Courses,
                    numRows: 64612,
                }, {
                    id: roomsId,
                    kind: InsightDatasetKind.Rooms,
                    numRows: 284,
                }];
                expectListDatasetsSuccess(response);
                const actualResult = (response.body as InsightResponseSuccessBody).result;
                expect(actualResult).to.be.instanceOf(Array);
                expect(actualResult).to.have.length(expectedResult.length);
                expect(actualResult).to.have.deep.members(expectedResult);
                // clean after test
                await removeDatasetsWithIds([roomsId, coursesId]);
            });
    });
})
;

// This test suite dynamically generates tests from the JSON files in test/queries.
// You should not need to modify it; instead, add additional files to the queries directory.
describe("InsightFacade PerformQuery test", () => {
    const datasetsToQuery: { [id: string]: string } = {
        courses: "./test/data/courses49044.zip",
        coursesmiddle: "./test/data/valid_courses6_sections44.zip",
        coursessmall: "./test/data/valid_courses1_sections1.zip",
        rooms: "./test/data/rooms.zip",
    };
    let insightFacade: InsightFacade;
    let testQueries: ITestQuery[] = [];

    // Create a new instance of InsightFacade, read in the test queries from test/queries and
    // add the datasets specified in datasetsToQuery.
    before(async function () {
        Log.test(`Before: ${this.test.parent.title}`);

        // Load the query JSON files under test/queries.
        // Fail if there is a problem reading ANY query.
        try {
            testQueries = await TestUtil.readTestQueries();
            expect(testQueries).to.have.length.greaterThan(0);
        } catch (err) {
            expect.fail("", "", `Failed to read one or more test queries. ${JSON.stringify(err)}`);
        }

        Repository.getInstance().clean();
        insightFacade = new InsightFacade();

        // Load the datasets specified in datasetsToQuery and add them to InsightFacade.
        // Fail if there is a problem reading ANY dataset.
        try {
            const datasets: { [id: string]: string } = await TestUtil.loadDatasets(datasetsToQuery);
            const responsePromises: Array<Promise<InsightResponse>> = [];
            for (const [id, content] of Object.entries(datasets)) {
                if (id === "rooms") {
                    responsePromises.push(insightFacade.addDataset(id, content, InsightDatasetKind.Rooms));
                } else {
                    responsePromises.push(insightFacade.addDataset(id, content, InsightDatasetKind.Courses));
                }
            }
            const responses: InsightResponse[] = await Promise.all(responsePromises);
            responses.forEach((response) => expect(response.code).to.equal(204));
        } catch (err) {
            expect.fail("", "", `Failed to read one or more datasets. ${JSON.stringify(err)}`);
        }
    });

    beforeEach(function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);
    });

    after(async function () {
        Log.test(`After: ${this.test.parent.title}`);
    });

    afterEach(function () {
        Log.test(`AfterTest: ${this.currentTest.title}`);
    });

    // Dynamically create and run a test for each query in testQueries
    it("Should run test queries", () => {
        describe("Dynamic InsightFacade PerformQuery tests", () => {
            after(async function () {
                Log.test(`After: ${this.test.parent.title}`);
            });
            for (const test of testQueries) {
                it(`[${test.filename}] ${test.title}`, async () => {
                    let response: InsightResponse;

                    try {
                        response = await insightFacade.performQuery(test.query);
                    } catch (err) {
                        response = err;
                    } finally {
                        expect(response.code).to.equal(test.response.code);

                        if (test.response.code >= 400) {
                            expect(response.body).to.have.property("error");
                        } else {
                            expect(response.body).to.have.property("result");
                            const expectedResult = (test.response.body as InsightResponseSuccessBody).result;
                            const actualResult = (response.body as InsightResponseSuccessBody).result;
                            expect(actualResult).to.have.length(expectedResult.length);
                            expect(actualResult).to.have.deep.members(expectedResult as any[]);
                        }
                    }
                });
            }
        });
    });
});
