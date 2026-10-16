import {expect} from "chai";

import Log from "../src/Util";
import TestUtil from "./TestUtil";
import {ZipProcessor} from "../src/model/datasetprocessor/ZipProcessor";
import {InsightDatasetKind} from "../src/controller/IInsightFacade";
import {CoursesParser } from "../src/model/datasetprocessor/datasetparser/CoursesParser";
import {IDataset} from "../src/model/datasetprocessor/DatasetProcessor";

describe("ZipProcessor test", function () {
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
        valid_courses_small: "./test/data/valid_courses1_sections1.zip",
    };

    let datasets: { [id: string]: string };
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
    });

    after(function () {
        Log.test(`After: ${this.test.parent.title}`);
    });

    afterEach(function () {
        Log.test(`AfterTest: ${this.currentTest.title}`);
    });

    describe("#process", function () {
        describe("INVALID content", function () {
            const expectErrorWhenProcessInvalidContent = async function (invalidContent: string) {
                try {
                    await ZipProcessor.process(new CoursesParser(), invalidContent);
                    expect.fail("Should not reach this line");
                } catch (err) {
                    expect(err).to.be.an.instanceOf(Error);
                }
            };
            it("should ERROR not zip file", async function () {
                const invalidContent = datasets["invalid_notZipFile"];
                await expectErrorWhenProcessInvalidContent(invalidContent);
            });
            it("should ERROR empty zip file", async function () {
                const invalidContent = datasets["emptyZipFile"];
                await expectErrorWhenProcessInvalidContent(invalidContent);
            });
            it("should ERROR zip file with missing courses folder", async function () {
                const invalidContent = datasets["invalid_noCoursesFolder"];
                await expectErrorWhenProcessInvalidContent(invalidContent);
            });
            it("should ERROR zip file with empty courses folder", async function () {
                const invalidContent = datasets["invalid_emptyCoursesFolder"];
                await expectErrorWhenProcessInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder but non csv files", async function () {
                const invalidContent = datasets["coursesFolderWithNoCSVFile"];
                await expectErrorWhenProcessInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder csv files but no AUDIT column", async function () {
                const invalidContent = datasets["invalid_courses1_sections1_noAuditColumn"];
                await expectErrorWhenProcessInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder csv files but no AVG column", async function () {
                const invalidContent = datasets["invalid_courses1_sections1_noAvgColumn"];
                await expectErrorWhenProcessInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder csv files but no COURSE column", async function () {
                const invalidContent = datasets["invalid_courses1_sections1_noCourseColumn"];
                await expectErrorWhenProcessInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder csv files but no FAIL column", async function () {
                const invalidContent = datasets["invalid_courses1_sections1_noFailColumn"];
                await expectErrorWhenProcessInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder csv files but no ID column", async function () {
                const invalidContent = datasets["invalid_courses1_sections1_noIdColumn"];
                await expectErrorWhenProcessInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder csv files but no PASS column", async function () {
                const invalidContent = datasets["invalid_courses1_sections1_noPassColumn"];
                await expectErrorWhenProcessInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder csv files but no PROFESSOR column", async function () {
                const invalidContent = datasets["invalid_courses1_sections1_noProfessorColumn"];
                await expectErrorWhenProcessInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder csv files but no SUBJECT column", async function () {
                const invalidContent = datasets["invalid_courses1_sections1_noSubjectColumn"];
                await expectErrorWhenProcessInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder csv files but no TITLE column", async function () {
                const invalidContent = datasets["invalid_courses1_sections1_noTitleColumn"];
                await expectErrorWhenProcessInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder INVALID CSV fields > headers", async function () {
                const invalidContent = datasets["invalid_courses1_sections1_nbrFieldsGreaterThanHeaders"];
                await expectErrorWhenProcessInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder INVALID CSV fields < headers", async function () {
                const invalidContent = datasets["invalid_courses1_sections1_nbrFieldsLessThanHeaders"];
                await expectErrorWhenProcessInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder 1 valid csv file but 0 sections", async function () {
                const invalidContent = datasets["invalid_courses1_sections0"];
                await expectErrorWhenProcessInvalidContent(invalidContent);
            });
            it("should ERROR zip file with courses folder many valid csv files but 0 sections", async function () {
                const invalidContent = datasets["invalid_manyCSVnoSections"];
                await expectErrorWhenProcessInvalidContent(invalidContent);
            });
            it("should ERROR when content string is not base64 encoded", async function () {
                const invalidContent: string = "??yeU????u??l??????????????E??I?u";
                await expectErrorWhenProcessInvalidContent(invalidContent);
            });
        });
        describe("VALID content", function () {
            it("should return array", async function () {
                const validContent = datasets["valid_courses_small"];
                const actualResult: IDataset = {
                    kind: InsightDatasetKind.Courses,
                    rows: [
                        {
                            Title: "probability ii",
                            id: "4011",
                            Professor: "nachmias, asaf",
                            Audit: 0,
                            Year: 2011,
                            Course: "545",
                            Pass: 6,
                            Fail: 0,
                            Avg: 96.83,
                            Subject: "math",
                            Section: "201",
                        },
                    ],
                    numRows: 1,
                };
                const expectedResult = await ZipProcessor.process(new CoursesParser(), validContent);
                expect(actualResult.kind).to.deep.equal(expectedResult.kind);
                expect(actualResult.rows).to.have.length(expectedResult.rows.length);
                expect(actualResult.rows).to.have.deep.members(expectedResult.rows);
                expect(actualResult.numRows).to.deep.equal(expectedResult.numRows);
            });
        });
    });
});
