import {expect} from "chai";

import {
    InsightDataset,
    InsightDatasetKind,
} from "../src/controller/IInsightFacade";
import Log from "../src/Util";
import TestUtil from "./TestUtil";
import {DatasetProcessor} from "../src/model/datasetprocessor/DatasetProcessor";
import {Repository} from "../src/repository/Repository";

describe("DatasetProcessor Add/Remove/List Dataset test", function () {
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

    let datasetProcessor: DatasetProcessor;
    let datasets: { [id: string]: string };

    const addCoursesWithIds = async function (ids: string[]) {
        for (const id of ids) {
            try {
                await datasetProcessor.addDataset(id, datasets["courses"], InsightDatasetKind.Courses);
            } catch (err) {
                Log.error(`Error initial adding dataset with id " ${id}.  ${JSON.stringify(err)}`);
            }
        }
    };

    const addRoomsWithIds = async function (ids: string[]) {
        for (const id of ids) {
            try {
                await datasetProcessor.addDataset(id, datasets["rooms"], InsightDatasetKind.Rooms);
            } catch (err) {
                Log.error(`Error initial adding dataset with id " ${id}.  ${JSON.stringify(err)}`);
            }
        }
    };

    const crash = async function () {
        datasetProcessor = new DatasetProcessor();
    };

    before(async function () {
        Log.test(`Before: ${this.test.parent.title}`);

        try {
            datasets = await TestUtil.loadDatasets(datasetsToLoad);
            expect(Object.keys(datasets)).to.have.length.greaterThan(0);
        } catch (err) {
            expect.fail("", "", `Failed to read one or more datasets. ${JSON.stringify(err)}`);
        }
    });

    beforeEach(async function () {
        Log.test(`BeforeTest: ${this.currentTest.title}`);

        Repository.getInstance().clean();
        datasetProcessor = new DatasetProcessor();
    });

    after(function () {
        Log.test(`After: ${this.test.parent.title}`);
    });

    afterEach(function () {
        Log.test(`AfterTest: ${this.currentTest.title}`);
    });

    describe("#addDataset", function () {
        describe("pass INVALID id, valid content and valid kind",
            function () {
                const expectErrorWhenAddingInvalidId = async function (invalidId: string) {
                    const dataset = datasets["courses"];
                    const kind = InsightDatasetKind.Courses;
                    try {
                        await datasetProcessor.addDataset(invalidId, dataset, kind);
                        expect.fail("Should not reach this line");
                    } catch (err) {
                        expect(err).to.be.an.instanceOf(Error);
                    }
                };
                it("should reject when id is null", async function () {
                    const invalidId: string = null;
                    const dataset = datasets["courses"];
                    const validKind = InsightDatasetKind.Courses;
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
            },
        );
        describe("(valid id, INVALID content, valid kind)", function () {
            const expectErrorWhenAddingInvalidContent = async function (invalidContent: string) {
                const id: string = "courses";
                const kind = InsightDatasetKind.Courses;
                try {
                    await datasetProcessor.addDataset(id, invalidContent, kind);
                    expect.fail("Should not reach this line");
                } catch (err) {
                    expect(err).to.be.an.instanceOf(Error);
                }
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
                const invalidContent: string = "??yeU????u??l??????????????E??I?u";
                await expectErrorWhenAddingInvalidContent(invalidContent);
            });
        });

        describe("pass valid id, valid content and INVALID kind", async function () {
            const expectErrorWhenAddingInvalidKind = async function (invalidKind: InsightDatasetKind) {
                const validId = "allCourses";
                const dataset = datasets["courses"];
                try {
                    await datasetProcessor.addDataset(validId, dataset, invalidKind);
                    expect.fail("Should not reach this line");
                } catch (err) {
                    expect(err).to.be.an.instanceOf(Error);
                }
            };
            it("should reject when passed kind is null", async function () {
                const invalidKind: InsightDatasetKind = null;
                await expectErrorWhenAddingInvalidKind(invalidKind);
            });
            it("should reject when passed kind is undefined", async function () {
                const invalidKind: InsightDatasetKind = undefined;
                await expectErrorWhenAddingInvalidKind(invalidKind);
            });
            it("should reject when passed kind is Rooms", async function () {
                this.timeout(10000);
                const invalidKind = InsightDatasetKind.Rooms;
                await expectErrorWhenAddingInvalidKind(invalidKind);
            });
        });
        describe("(valid id, valid content, valid kind)", async function () {
            const expectErrorWhenAddingInvalidId = async function (invalidId: string) {
                const dataset = datasets["courses"];
                const validKind = InsightDatasetKind.Courses;
                try {
                    await datasetProcessor.addDataset(invalidId, dataset, validKind);
                    expect.fail("Should not reach this line");
                } catch (err) {
                    expect(err).to.be.an.instanceOf(Error);
                }
            };
            const expectSuccessWhenAddingValidId = async function (validId: string) {
                const validContent = datasets["courses"];
                const validKind = InsightDatasetKind.Courses;
                try {
                    await datasetProcessor.addDataset(validId, validContent, validKind);
                } catch (e) {
                    expect.fail("Should not reach this line");
                }
            };
            describe("when previously added 0 datasets", function () {
                it("should SUCCESS to add SINGLE valid dataset", async function () {
                    this.timeout(10000);
                    const validId = "courses";
                    await expectSuccessWhenAddingValidId(validId);
                });
            });
            describe("when previously added 1 dataset", function () {
                it("should ERROR to add with SAME id if NO CRASH", async function () {
                    this.timeout(10000);
                    const validId = "courses";
                    const sameValidId = validId;
                    await addCoursesWithIds([validId]);
                    await expectErrorWhenAddingInvalidId(sameValidId);
                });
                it("should ERROR to add with SAME id if CRASH", async function () {
                    this.timeout(10000);
                    const validId = "courses";
                    const sameValidId = validId;
                    await addCoursesWithIds([validId]);

                    // CRASH
                    await crash();
                    await expectErrorWhenAddingInvalidId(sameValidId);
                });

                it("should SUCCESS to add with DIFFERENT id if NO CRASH", async function () {
                    this.timeout(10000);
                    const validId = "courses";
                    const otherValidId: string = "courses-2";

                    await addCoursesWithIds([validId]);

                    await expectSuccessWhenAddingValidId(otherValidId);
                });
                it("should SUCCESS to add with DIFFERENT id if CRASH", async function () {
                    this.timeout(10000);
                    const validId = "courses";
                    const otherValidId: string = "courses-2";

                    await addCoursesWithIds([validId]);

                    // CRASH
                    await crash();
                    await expectSuccessWhenAddingValidId(otherValidId);
                });
            });
            describe("when previously added 2 datasets", function () {
                it("should ERROR to add with SAME id as LAST if NO CRASH", async function () {
                    this.timeout(10000);
                    const beforeLastId: string = "courses";
                    const lastId: string = "courses-2";

                    const sameAsLastId: string = lastId;

                    await addCoursesWithIds([beforeLastId, lastId]);

                    await expectErrorWhenAddingInvalidId(sameAsLastId);
                });
                it("should ERROR to add with SAME id as LAST if CRASH", async function () {
                    this.timeout(10000);
                    const beforeLastId: string = "courses";
                    const lastId: string = "courses-2";

                    const sameAsLastId: string = lastId;

                    await addCoursesWithIds([beforeLastId, lastId]);

                    // CRASH
                    await crash();
                    await expectErrorWhenAddingInvalidId(sameAsLastId);
                });
                it("should ERROR to add with SAME id as BEFORE LAST if NO CRASH", async function () {
                    this.timeout(10000);
                    const beforeLastId: string = "courses";
                    const lastId: string = "courses-2";
                    const sameAsBeforeLastId: string = beforeLastId;

                    await addCoursesWithIds([beforeLastId, lastId]);

                    await expectErrorWhenAddingInvalidId(sameAsBeforeLastId);
                });
                it("should ERROR to add with SAME id as BEFORE LAST if CRASH", async function () {
                    this.timeout(10000);
                    const beforeLastId: string = "courses";
                    const lastId: string = "courses-2";
                    const sameAsBeforeLastId: string = beforeLastId;

                    await addCoursesWithIds([beforeLastId, lastId]);

                    // CRASH
                    await crash();
                    await expectErrorWhenAddingInvalidId(sameAsBeforeLastId);
                });
                it("should SUCCESS to add with DIFFERENT id if NO CRASH", async function () {
                    this.timeout(10000);
                    const beforeLastId: string = "courses";
                    const lastId: string = "courses-2";
                    const otherThanPreviousIds: string = "otherThanPreviousIds1";

                    await addCoursesWithIds([beforeLastId, lastId]);

                    await expectSuccessWhenAddingValidId(otherThanPreviousIds);
                });
                it("should SUCCESS to add with DIFFERENT id if CRASH", async function () {
                    this.timeout(10000);
                    const beforeLastId: string = "courses";
                    const lastId: string = "courses-2";
                    const otherThanPreviousIds: string = "otherThanPreviousIds1";

                    await addCoursesWithIds([beforeLastId, lastId]);

                    // CRASH
                    await crash();
                    await expectSuccessWhenAddingValidId(otherThanPreviousIds);
                });
            });
        });
    });
    describe("#removeDataset", function () {
        const expectErrorWhenRemovingInvalidId = async function (invalidId: string) {
            try {
                await datasetProcessor.removeDataset(invalidId);
                expect.fail("Should not reach this line");
            } catch (err) {
                expect(err).to.be.an.instanceOf(Error);
            }
        };
        const expectSuccessWhenRemovingValidId = async function (validId: string) {
            try {
                await datasetProcessor.removeDataset(validId);
            } catch (err) {
                expect.fail("Should not reach this line");
            }
        };
        describe("pass INVALID id", function () {
            it("should ERROR when id is null", async function () {
                const invalidId: string = null;
                await expectErrorWhenRemovingInvalidId(invalidId);
            });
            it("should ERROR when id is undefined", async function () {
                const invalidId: string = undefined;
                await expectErrorWhenRemovingInvalidId(invalidId);
            });
            it("should ERROR when id is empty string", async function () {
                const invalidId: string = "";
                await expectErrorWhenRemovingInvalidId(invalidId);
            });
            it("should ERROR when id is only whitespaces", async function () {
                const invalidId: string = "  ";
                await expectErrorWhenRemovingInvalidId(invalidId);
            });
            it("should ERROR when id contains whitespaces", async function () {
                const invalidId: string = "co urses";
                await expectErrorWhenRemovingInvalidId(invalidId);
            });
            it("should ERROR when id contains underscore", async function () {
                const invalidId: string = "cou_rses";
                await expectErrorWhenRemovingInvalidId(invalidId);
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
                    await expectErrorWhenRemovingInvalidId(keyword);
                }
            });
        });
        describe("pass VALID id", function () {
            describe("when previously added 0 datasets", function () {
                it("should ERROR removing", async function () {
                    const validId = "courses";
                    expectErrorWhenRemovingInvalidId(validId);
                });
            });
            describe("when previously added 1 dataset", function () {
                it("should ERROR to remove DIFFERENT id if NO CRASH", async function () {
                    const validId = "courses";
                    const otherValidId: string = "courses-322";

                    await addCoursesWithIds([validId]);
                    await expectErrorWhenRemovingInvalidId(otherValidId);
                });
                it("should ERROR to remove DIFFERENT id if CRASH", async function () {
                    const validId = "courses";
                    const otherValidId: string = "courses-322";

                    await addCoursesWithIds([validId]);
                    // CRASH
                    await crash();
                    await expectErrorWhenRemovingInvalidId(otherValidId);
                });
                it("should SUCCESS to remove SAME id if NO CRASH", async function () {
                    const validId = "courses";
                    const sameValidId: string = validId;

                    await addCoursesWithIds([validId]);

                    await expectSuccessWhenRemovingValidId(sameValidId);
                });
                it("should SUCCESS to remove SAME id if CRASH", async function () {
                    this.timeout(10000);
                    const validId = "courses";
                    const sameValidId: string = validId;

                    await addCoursesWithIds([validId]);
                    // CRASH
                    await crash();
                    await expectSuccessWhenRemovingValidId(sameValidId);
                });
            });
            describe("when previously added 2 datasets", function () {
                it("should SUCCESS to remove SAME id as LAST if NO CRASH", async function () {
                    this.timeout(10000);
                    const beforeLastId: string = "courses";
                    const lastId: string = "courses-2";
                    const sameAsLastId: string = lastId;

                    await addCoursesWithIds([beforeLastId, lastId]);

                    await expectSuccessWhenRemovingValidId(sameAsLastId);
                });
                it("should SUCCESS to remove SAME id as LAST if CRASH", async function () {
                    this.timeout(10000);
                    const beforeLastId: string = "courses";
                    const lastId: string = "courses-2";
                    const sameAsLastId: string = lastId;

                    await addCoursesWithIds([beforeLastId, lastId]);

                    // CRASH
                    await crash();
                    await expectSuccessWhenRemovingValidId(sameAsLastId);
                });
                it("should SUCCESS to remove SAME id as BEFORE LAST if NO CRASH", async function () {
                    this.timeout(10000);
                    const beforeLastId: string = "courses";
                    const lastId: string = "courses-2";
                    const sameAsBeforeLastId: string = beforeLastId;

                    await addCoursesWithIds([beforeLastId, lastId]);

                    await expectSuccessWhenRemovingValidId(sameAsBeforeLastId);
                });
                it("should SUCCESS to remove SAME id as BEFORE LAST if CRASH", async function () {
                    this.timeout(10000);
                    const beforeLastId: string = "courses";
                    const lastId: string = "courses-2";
                    const sameAsBeforeLastId: string = beforeLastId;

                    await addCoursesWithIds([beforeLastId, lastId]);

                    // CRASH
                    await crash();
                    await expectSuccessWhenRemovingValidId(sameAsBeforeLastId);
                });
                it("should ERROR to remove DIFFERENT id if NO CRASH", async function () {
                    this.timeout(10000);
                    const beforeLastId: string = "courses";
                    const lastId: string = "courses-2";
                    const otherThanPreviousIds: string = "otherThanPreviousIds3";
                    await addCoursesWithIds([beforeLastId, lastId]);

                    await expectErrorWhenRemovingInvalidId(otherThanPreviousIds);
                });
                it("should ERROR to remove DIFFERENT id if CRASH", async function () {
                    this.timeout(10000);
                    const beforeLastId: string = "courses";
                    const lastId: string = "courses-2";
                    const otherThanPreviousIds: string = "otherThanPreviousIds3";
                    await addCoursesWithIds([beforeLastId, lastId]);

                    // CRASH
                    await crash();
                    await expectErrorWhenRemovingInvalidId(otherThanPreviousIds);
                });
                it("should SUCCESS to remove MULTIPLE datasets in ORDER if NO CRASH", async function () {
                    const beforeLastId: string = "courses";
                    const lastId: string = "courses-2";

                    await addCoursesWithIds([beforeLastId, lastId]);

                    await datasetProcessor.removeDataset(beforeLastId);

                    await expectSuccessWhenRemovingValidId(lastId);
                });
                it("should SUCCESS to remove MULTIPLE datasets in ORDER if NO CRASH", async function () {
                    this.timeout(10000);
                    const beforeLastId: string = "courses";
                    const lastId: string = "courses-2";

                    await addCoursesWithIds([beforeLastId, lastId]);

                    await datasetProcessor.removeDataset(beforeLastId);

                    await expectSuccessWhenRemovingValidId(lastId);
                });
                it("should SUCCESS to remove MULTIPLE datasets in INVERSE ORDER if CRASH", async function () {
                    this.timeout(10000);
                    const beforeLastId: string = "courses";
                    const lastId: string = "courses-2";
                    await addCoursesWithIds([beforeLastId, lastId]);

                    // CRASH
                    await crash();
                    await datasetProcessor.removeDataset(lastId);

                    await expectSuccessWhenRemovingValidId(beforeLastId);
                });
            });
        });
    });

    describe("#listDatasets", function () {
        it("should list no dataset when nothing added before", async function () {
            // act
            const actualResult = await datasetProcessor.listDatasets();
            // assert
            const expectedResult: InsightDataset[] = [];
            expect(actualResult).to.be.instanceOf(Array);
            expect(actualResult).to.have.length(expectedResult.length);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should list one Courses dataset when one valid dataset added before if NO CRASH", async function () {
            this.timeout(10000);
            const id: string = "courses";
            // arrange
            await addCoursesWithIds([id]);
            // act
            const actualResult: InsightDataset[] = await datasetProcessor.listDatasets();
            // assert
            const expectedResult: InsightDataset[] = [{
                id,
                kind: InsightDatasetKind.Courses,
                numRows: 64612,
            }];
            expect(actualResult).to.be.instanceOf(Array);
            expect(actualResult).to.have.length(expectedResult.length);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should list one Rooms dataset when one valid dataset added before if NO CRASH", async function () {
            const id: string = "rooms";
            // arrange
            await addRoomsWithIds([id]);
            // act
            const actualResult: InsightDataset[] = await datasetProcessor.listDatasets();
            // assert
            const expectedResult: InsightDataset[] = [{
                id,
                kind: InsightDatasetKind.Rooms,
                numRows: 284,
            }];
            expect(actualResult).to.be.instanceOf(Array);
            expect(actualResult).to.have.length(expectedResult.length);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should list one Courses dataset when one valid dataset added before if CRASH", async function () {
            const id: string = "courses";
            // arrange
            await addCoursesWithIds([id]);
            // CRASH
            await crash();
            // act
            const actualResult: InsightDataset[] = await datasetProcessor.listDatasets();
            // assert
            const expectedResult: InsightDataset[] = [{
                id,
                kind: InsightDatasetKind.Courses,
                numRows: 64612,
            }];
            expect(actualResult).to.be.instanceOf(Array);
            expect(actualResult).to.have.length(expectedResult.length);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should list one Rooms dataset when one valid dataset added before if CRASH", async function () {
            const id: string = "rooms";
            // arrange
            await addRoomsWithIds([id]);
            // CRASH
            await crash();
            // act
            const actualResult: InsightDataset[] = await datasetProcessor.listDatasets();
            // assert
            const expectedResult: InsightDataset[] = [{
                id,
                kind: InsightDatasetKind.Rooms,
                numRows: 284,
            }];
            expect(actualResult).to.be.instanceOf(Array);
            expect(actualResult).to.have.length(expectedResult.length);
            expect(actualResult).to.deep.equal(expectedResult);
        });
        it("should list multiple Courses datasets when multiple valid datasets added before if NO CRASH",
            async function () {
                this.timeout(10000);
                const id = "courses";
                const validId2 = "courses-2";
                await addCoursesWithIds([id, validId2]);
                const actualResult: InsightDataset[] = await datasetProcessor.listDatasets();
                const expectedResult: InsightDataset[] = [{
                    id,
                    kind: InsightDatasetKind.Courses,
                    numRows: 64612,
                }, {
                    id: validId2,
                    kind: InsightDatasetKind.Courses,
                    numRows: 64612,
                }];
                expect(actualResult).to.be.instanceOf(Array);
                expect(actualResult).to.have.length(expectedResult.length);
                expect(actualResult).to.have.deep.members(expectedResult);
            });
        it("should list multiple Rooms datasets when multiple valid datasets added before if NO CRASH",
            async function () {
                const id = "rooms";
                const validId2 = "rooms-2";
                // arrange
                await addRoomsWithIds([id, validId2]);
                // act
                const actualResult: InsightDataset[] = await datasetProcessor.listDatasets();
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
                expect(actualResult).to.be.instanceOf(Array);
                expect(actualResult).to.have.length(expectedResult.length);
                expect(actualResult).to.have.deep.members(expectedResult);
            });
        it("should list multiple Courses datasets when multiple valid datasets added before if CRASH",
            async function () {
                this.timeout(10000);
                const id = "courses";
                const validId2 = "courses-2";
                // arrange
                await addCoursesWithIds([id, validId2]);
                // CRASH
                await crash();
                // act
                const actualResult: InsightDataset[] = await datasetProcessor.listDatasets();
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
                expect(actualResult).to.be.instanceOf(Array);
                expect(actualResult).to.have.length(expectedResult.length);
                expect(actualResult).to.have.deep.members(expectedResult);
            });
        it("should list multiple Rooms datasets when multiple valid datasets added before if CRASH",
            async function () {
                const id = "rooms";
                const validId2 = "rooms-2";
                // arrange
                await addRoomsWithIds([id, validId2]);
                // CRASH
                await crash();
                // act
                const actualResult: InsightDataset[] = await datasetProcessor.listDatasets();
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
                expect(actualResult).to.be.instanceOf(Array);
                expect(actualResult).to.have.length(expectedResult.length);
                expect(actualResult).to.have.deep.members(expectedResult);
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
                const actualResult: InsightDataset[] = await datasetProcessor.listDatasets();
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
                expect(actualResult).to.be.instanceOf(Array);
                expect(actualResult).to.have.length(expectedResult.length);
                expect(actualResult).to.have.deep.members(expectedResult);
            });
    });
    describe("#hasNoDatasets", function () {
        it("should be true when nothing added", function () {
            return expect(datasetProcessor.hasNoDatasets()).to.be.true;
        });
        it("should be false when added 1 dataset", async function () {
            this.timeout(10000);
            const validId = "courses";
            await addCoursesWithIds([validId]);
            return expect(datasetProcessor.hasNoDatasets()).to.be.false;
        });
    });
    describe("#hasSuchDataset", function () {
        it("should be true when added 1 dataset with same Id", async function () {
            this.timeout(10000);
            const validId = "courses";
            const validKind = "courses";
            await addCoursesWithIds([validId]);
            return expect(datasetProcessor.hasSuchDataset(validId, validKind)).to.be.true;
        });
        it("should be false when added 1 dataset with other Id", async function () {
            this.timeout(10000);
            const validId = "courses";
            const otherValidId = "otherValidId";
            const validKind = "courses";
            await addCoursesWithIds([validId]);
            return expect(datasetProcessor.hasSuchDataset(otherValidId, validKind)).to.be.false;
        });
        it("should be false when added 1 dataset with same Id, but wrong kind", async function () {
            this.timeout(10000);
            const validId = "courses";
            const invalidKind = "rooms";
            await addCoursesWithIds([validId]);
            return expect(datasetProcessor.hasSuchDataset(validId, invalidKind)).to.be.false;
        });
    });
});
