import {CoursesParser, } from "../src/model/datasetprocessor/datasetparser/CoursesParser";
import {expect} from "chai";
import {InsightDatasetKind} from "../src/controller/IInsightFacade";
import {IDataset} from "../src/model/datasetprocessor/DatasetProcessor";

describe("CourseParser test", async function () {
    const expectSameDatasets = function (actualResult: IDataset, expectedResult: IDataset) {
        expect(actualResult.kind).to.deep.equal(expectedResult.kind);
        expect(actualResult.rows.length).to.deep.equal(expectedResult.rows.length);
        expect(actualResult.rows).to.have.deep.members(expectedResult.rows);
        expect(actualResult.numRows).to.deep.equal(expectedResult.numRows);

    };
    describe("single input file", async function () {
        it("should return empty array when csv file not in Course folder", async function () {
            const fileName = "foo/bar.csv";
            const fileContent = "Title|id|Professor|Audit|Year|Course|Pass|Fail|Avg|Subject|Section\r\n" +
                "gross anat limbs|12690|alimohammadi, majid|0|2014|392|83|0|83.65|anat|001\r\n" +
                "gross anat limbs|12691||0|2014|392|83|0|83.65|anat|overall\r\n";

            const files = new Map<string, string>([
                [fileName, fileContent],
            ]);
            try {
                await new CoursesParser().parse(files);
            } catch (e) {
               expect(e).to.be.instanceOf(Error);
            }
        });
        it("should return empty array when file in courses folder but is not csv", async function () {
            const fileName = "courses/bar.txt";
            const fileContent = "Title|id|Professor|Audit|Year|Course|Pass|Fail|Avg|Subject|Section\r\n" +
                "gross anat limbs|12690|alimohammadi, majid|0|2014|392|83|0|83.65|anat|001\r\n" +
                "gross anat limbs|12691||0|2014|392|83|0|83.65|anat|overall\r\n";

            const files = new Map<string, string>([
                [fileName, fileContent],
            ]);
            try {
                await new CoursesParser().parse(files);
            } catch (e) {
                expect(e).to.be.instanceOf(Error);
            }
        });
        it("should return empty array when file ok, but no sections", async function () {
            const fileName = "courses/bar.csv";
            const fileContent = "Title|id|Professor|Audit|Year|Course|Pass|Fail|Avg|Subject|Section\r\n";

            const files = new Map<string, string>([
                [fileName, fileContent],
            ]);
            try {
                await new CoursesParser().parse(files);
            } catch (e) {
                expect(e).to.be.instanceOf(Error);
            }
        });
        it("should return array of sections", async function () {
            const fileName = "courses/bar.csv";
            const fileContent = "Title|id|Professor|Audit|Year|Course|Pass|Fail|Avg|Subject|Section\r\n" +
                "gross anat limbs|12690|alimohammadi, majid|0|2014|392|83|0|83.65|anat|001\r\n" +
                "gross anat limbs|12691||0|2014|392|83|0|83.65|anat|overall\r\n";

            const files = new Map<string, string>([
                [fileName, fileContent],
            ]);
            const expectedResult: IDataset = {
                kind: InsightDatasetKind.Courses,
                rows: [
                    {
                        Title: "gross anat limbs",
                        id: "12690",
                        Professor: "alimohammadi, majid",
                        Audit: 0,
                        Year: 2014,
                        Course: "392",
                        Pass: 83,
                        Fail: 0,
                        Avg: 83.65,
                        Subject: "anat",
                        Section: "001",
                    },
                    {
                        Title: "gross anat limbs",
                        id: "12691",
                        Professor: "",
                        Audit: 0,
                        Year: 1900,
                        Course: "392",
                        Pass: 83,
                        Fail: 0,
                        Avg: 83.65,
                        Subject: "anat",
                        Section: "overall",
                    },
                ],
                numRows: 2,
            };
            const actualResult = await new CoursesParser().parse(files);
            expectSameDatasets(actualResult, expectedResult);
        });
        it("should replace empty numeric fields with 0", async function () {
            const fileName = "courses/bar.csv";
            const fileContent = "Title|id|Professor|Audit|Year|Course|Pass|Fail|Avg|Subject|Section\r\n" +
                "gross anat limbs|12690|alimohammadi, majid|||392||||anat|001\r\n" +
                "gross anat limbs|12691||0|2014|392|83|0|83.65|anat|overall\r\n";

            const files = new Map<string, string>([
                [fileName, fileContent],
            ]);
            const expectedResult: IDataset = {
                kind: InsightDatasetKind.Courses,
                rows: [
                    {
                        Title: "gross anat limbs",
                        id: "12690",
                        Professor: "alimohammadi, majid",
                        Audit: 0,
                        Year: 0,
                        Course: "392",
                        Pass: 0,
                        Fail: 0,
                        Avg: 0,
                        Subject: "anat",
                        Section: "001",
                    },
                    {
                        Title: "gross anat limbs",
                        id: "12691",
                        Professor: "",
                        Audit: 0,
                        Year: 1900,
                        Course: "392",
                        Pass: 83,
                        Fail: 0,
                        Avg: 83.65,
                        Subject: "anat",
                        Section: "overall",
                    },
                ],
                numRows: 2,
            };
            const actualResult = await new CoursesParser().parse(files);
            expectSameDatasets(actualResult, expectedResult);
        });
    });
    describe("multiple input files", async function () {
        it("should return empty array when csv file not in Course folder", async function () {
            const fileName1 = "foo/bar.csv";
            const fileName2 = "foo/baz.csv";
            const fileContent1 = "Title|id|Professor|Audit|Year|Course|Pass|Fail|Avg|Subject|Section\r\n" +
                "gross anat limbs|12690|alimohammadi, majid|0|2014|392|83|0|83.65|anat|001\r\n" +
                "gross anat limbs|12691||0|2014|392|83|0|83.65|anat|overall\r\n";
            const fileContent2 = "Title|id|Professor|Audit|Year|Course|Pass|Fail|Avg|Subject|Section\r\n" +
                "gross anat limbs|1845|alimohammadi, majid|0|2013|392|82|0|81.82|anat|001\r\n" +
                "gross anat limbs|1846||0|2013|392|82|0|81.82|anat|overall\r\n" +
                "gross anat limbs|12690|alimohammadi, majid|0|2014|392|83|0|83.65|anat|001\r\n";
            const files = new Map<string, string>([
                [fileName1, fileContent1],
                [fileName2, fileContent2],
            ]);
            try {
                await new CoursesParser().parse(files);
            } catch (e) {
                expect(e).to.be.instanceOf(Error);
            }
        });
        it("should return empty array when files in courses folder but is not csv", async function () {
            const fileName1 = "courses/bar.txt";
            const fileName2 = "courses/baz.zip";
            const fileContent1 = "Title|id|Professor|Audit|Year|Course|Pass|Fail|Avg|Subject|Section\r\n" +
                "gross anat limbs|12690|alimohammadi, majid|0|2014|392|83|0|83.65|anat|001\r\n" +
                "gross anat limbs|12691||0|2014|392|83|0|83.65|anat|overall\r\n";
            const fileContent2 = "Title|id|Professor|Audit|Year|Course|Pass|Fail|Avg|Subject|Section\r\n" +
                "gross anat limbs|1845|alimohammadi, majid|0|2013|392|82|0|81.82|anat|001\r\n" +
                "gross anat limbs|1846||0|2013|392|82|0|81.82|anat|overall\r\n" +
                "gross anat limbs|12690|alimohammadi, majid|0|2014|392|83|0|83.65|anat|001\r\n";
            const files = new Map<string, string>([
                [fileName1, fileContent1],
                [fileName2, fileContent2],
            ]);
            try {
                await new CoursesParser().parse(files);
            } catch (e) {
                expect(e).to.be.instanceOf(Error);
            }
        });
        it("should return empty array when file ok, but no sections", async function () {
            const fileName1 = "courses/bar.txt";
            const fileName2 = "courses/baz.zip";
            const fileContent1 = "Title|id|Professor|Audit|Year|Course|Pass|Fail|Avg|Subject|Section\r\n";
            const fileContent2 = "Title|id|Professor|Audit|Year|Course|Pass|Fail|Avg|Subject|Section\r\n";
            const files = new Map<string, string>([
                [fileName1, fileContent1],
                [fileName2, fileContent2],
            ]);
            try {
                await new CoursesParser().parse(files);
            } catch (e) {
                expect(e).to.be.instanceOf(Error);
            }
        });
        it("should return array of sections from one valid file", async function () {
            const fileName1 = "courses/bar.txt";
            const fileName2 = "courses/baz.csv";
            const fileContent1 = "Title|id|Professor|Audit|Year|Course|Pass|Fail|Avg|Subject|Section\r\n" +
                "gross anat limbs|12690|alimohammadi, majid|0|2014|392|83|0|83.65|anat|001\r\n" +
                "gross anat limbs|12691||0|2014|392|83|0|83.65|anat|overall\r\n";
            const fileContent2 = "Title|id|Professor|Audit|Year|Course|Pass|Fail|Avg|Subject|Section\r\n" +
                "gross anat limbs|1845|alimohammadi, majid|0|2013|392|82|0|81.82|anat|001\r\n" +
                "gross anat limbs|1846||0|2013|392|82|0|81.82|anat|overall\r\n" +
                "gross anat limbs|12690|alimohammadi, majid|0|2014|392|83|0|83.65|anat|001\r\n";
            const files = new Map<string, string>([
                [fileName1, fileContent1],
                [fileName2, fileContent2],
            ]);
            const expectedResult: IDataset = {
                kind: InsightDatasetKind.Courses,
                rows: [
                    {
                        Title: "gross anat limbs",
                        id: "1845",
                        Professor: "alimohammadi, majid",
                        Audit: 0,
                        Year: 2013,
                        Course: "392",
                        Pass: 82,
                        Fail: 0,
                        Avg: 81.82,
                        Subject: "anat",
                        Section: "001",
                    },
                    {
                        Title: "gross anat limbs",
                        id: "1846",
                        Professor: "",
                        Audit: 0,
                        Year: 1900,
                        Course: "392",
                        Pass: 82,
                        Fail: 0,
                        Avg: 81.82,
                        Subject: "anat",
                        Section: "overall",
                    },
                    {
                        Title: "gross anat limbs",
                        id: "12690",
                        Professor: "alimohammadi, majid",
                        Audit: 0,
                        Year: 2014,
                        Course: "392",
                        Pass: 83,
                        Fail: 0,
                        Avg: 83.65,
                        Subject: "anat",
                        Section: "001",
                    },
                ],
                numRows: 3,
            };
            const actualResult = await new CoursesParser().parse(files);
            expectSameDatasets(actualResult, expectedResult);
        });
        it("should return array of sections from two valid files", async function () {
            const fileName1 = "courses/bar.csv";
            const fileName2 = "courses/baz.csv";
            const fileContent1 = "Title|id|Professor|Audit|Year|Course|Pass|Fail|Avg|Subject|Section\r\n" +
                "gross anat limbs|12690|alimohammadi, majid|0|2014|392|83|0|83.65|anat|001\r\n" +
                "gross anat limbs|12691||0|2014|392|83|0|83.65|anat|overall\r\n";
            const fileContent2 = "Title|id|Professor|Audit|Year|Course|Pass|Fail|Avg|Subject|Section\r\n" +
                "gross anat limbs|1845|alimohammadi, majid|0|2013|392|82|0|81.82|anat|001\r\n" +
                "gross anat limbs|1846||0|2013|392|82|0|81.82|anat|overall\r\n" +
                "gross anat limbs|12690|alimohammadi, majid|0|2014|392|83|0|83.65|anat|001\r\n";
            const files = new Map<string, string>([
                [fileName1, fileContent1],
                [fileName2, fileContent2],
            ]);
            const expectedResult: IDataset = {
                kind: InsightDatasetKind.Courses,
                rows: [
                    {
                        Title: "gross anat limbs",
                        id: "12690",
                        Professor: "alimohammadi, majid",
                        Audit: 0,
                        Year: 2014,
                        Course: "392",
                        Pass: 83,
                        Fail: 0,
                        Avg: 83.65,
                        Subject: "anat",
                        Section: "001",
                    },
                    {
                        Title: "gross anat limbs",
                        id: "12691",
                        Professor: "",
                        Audit: 0,
                        Year: 1900,
                        Course: "392",
                        Pass: 83,
                        Fail: 0,
                        Avg: 83.65,
                        Subject: "anat",
                        Section: "overall",
                    },
                    {
                        Title: "gross anat limbs",
                        id: "1845",
                        Professor: "alimohammadi, majid",
                        Audit: 0,
                        Year: 2013,
                        Course: "392",
                        Pass: 82,
                        Fail: 0,
                        Avg: 81.82,
                        Subject: "anat",
                        Section: "001",
                    },
                    {
                        Title: "gross anat limbs",
                        id: "1846",
                        Professor: "",
                        Audit: 0,
                        Year: 1900,
                        Course: "392",
                        Pass: 82,
                        Fail: 0,
                        Avg: 81.82,
                        Subject: "anat",
                        Section: "overall",
                    },
                    {
                        Title: "gross anat limbs",
                        id: "12690",
                        Professor: "alimohammadi, majid",
                        Audit: 0,
                        Year: 2014,
                        Course: "392",
                        Pass: 83,
                        Fail: 0,
                        Avg: 83.65,
                        Subject: "anat",
                        Section: "001",
                    },
                ],
                numRows: 5,
            };
            const actualResult = await new CoursesParser().parse(files);
            expectSameDatasets(actualResult, expectedResult);
        });
    });
})
;
