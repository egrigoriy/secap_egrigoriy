import Server from "../src/rest/Server";
import {expect} from "chai";
import {Repository} from "../src/repository/Repository";
import InsightFacade from "../src/controller/InsightFacade";
import {InsightDatasetKind} from "../src/controller/IInsightFacade";
import chai = require("chai");
import chaiHttp = require("chai-http");
import Response = ChaiHttp.Response;

describe.skip("Server test", function () {
    let server: Server = null;
    const SERVER_URL = "localhost:4321";

    chai.use(chaiHttp);

    before(async function () {
        server = new Server(4321);
        await server.start();
    });

    after(async function () {
        await server.stop();
    });

    beforeEach(function () {
        // might want to add some process logging here to keep track of what"s going on
        // Repository.getInstance().clean();
    });

    afterEach(function () {
        // might want to add some process logging here to keep track of what"s going on
    });

    const putZip = async (id: string, kind: string, zip: string) => {
        return chai.request(SERVER_URL)
            .put(`/dataset/${id}/${kind}`)
            .attach("body", zip, `${id}.zip`)
            .set("Content-Type", "application/zip");
    };
    const putInvalidCourses = async (id: string) => {
        const kind = "courses";
        const invalidZip = "./test/data/invalid_manyCSVnoSections.zip";
        return putZip(id, kind, invalidZip);
    };
    const putValidCourses = async (id: string) => {
        const kind = "courses";
        const validZip = "./test/data/valid_courses6_sections44.zip";
        return putZip(id, kind, validZip);
    };
    const putValidRooms = async (id: string) => {
        const kind = "rooms";
        const validZip = "./test/data/rooms.zip";
        return putZip(id, kind, validZip);
    };

    describe("PUT /dataset/:id/:kind", function () {
        it("should 204 when put COURSES (valid zip, valid id, valid kind)", async function () {
            const validId = "coursesAdd";
            return putValidCourses(validId)
                .then((res) => {
                    expect(res.status).to.be.equal(204);
                })
                .catch((err) => {
                    expect.fail();
                });
        });
        it("should 204 when put ROOMS (valid zip, valid id, valid kind)", async function () {
            const validId = "roomsAdd";

            return putValidRooms(validId)
                .then((res) => {
                    expect(res.status).to.be.equal(204);
                })
                .catch((err) => {
                    expect.fail();
                });
        });
        it("should 400 when put COURSES (INVALID zip, valid id, valid kind)", async function () {
            const validId = "coursesAdd";

            return putInvalidCourses(validId)
                .then((res) => {
                    expect.fail();
                })
                .catch((err) => {
                    expect(err.status).to.be.equal(400);
                });
        });
        it("should 400 when put COURSES with INVALID id with underscore", async function () {
            const invalidId = "cour_ses";
            return putValidCourses(invalidId)
                .then((res) => {
                    expect.fail();
                })
                .catch((err) => {
                    expect(err.status).to.be.equal(400);
                });
        });
        it("should 400 when put COURSES with INVALID id with space", async function () {
            const invalidId = "cour ses";
            return putValidCourses(invalidId)
                .then((res) => {
                    expect.fail();
                })
                .catch((err) => {
                    expect(err.status).to.be.equal(400);
                });
        });
        it("should 400 when put COURSES with INVALID kind rooms", async function () {
            const validId = "courses";
            const invalidKind = "rooms";
            const validZip = "./test/data/valid_courses6_sections44.zip";
            return putZip(validId, invalidKind, validZip)
                .then((res) => {
                    expect.fail();
                })
                .catch((err) => {
                    expect(err.status).to.be.equal(400);
                });
        });
        it("should 400 when put ROOMS with INVALID kind courses", async function () {
            const validId = "rooms";
            const invalidKind = "courses";
            const validZip = "./test/data/rooms.zip";

            return putZip(validId, invalidKind, validZip)
                .then((res) => {
                    expect.fail();
                })
                .catch((err) => {
                    expect(err.status).to.be.equal(400);
                });
        });
        it("should 400 when put COURSES with INVALID kind not courses/rooms", async function () {
            const validId = "courses";
            const invalidKind = "someKind";
            const validZip = "./test/data/valid_courses6_sections44.zip";

            return putZip(validId, invalidKind, validZip)
                .then((res) => {
                    expect.fail();
                })
                .catch((err) => {
                    expect(err.status).to.be.equal(400);
                });
        });
        it("should 400 when put COURSES with id added before NO SHUTDOWN in between", async function () {
            const validId = "coursesAddedBefore";

            return putValidCourses(validId)
                .then(() => putValidCourses(validId))
                .then((res) => {
                    expect.fail();
                })
                .catch((err) => {
                    expect(err.status).to.be.equal(400);
                });
        });
        it("should 400 when put COURSES with id added before SHUTDOWN in between", async function () {
            const validId = "coursesAddedBefore";

            return putValidCourses(validId)
                .then(() => server.stop())
                .then(() => server.start())
                .then(() => putValidCourses(validId))
                .then((res) => {
                    expect.fail();
                })
                .catch((err) => {
                    expect(err.status).to.be.equal(400);
                });
        });
        it("should Server reject to add COURSES with id added before by Facade", async function () {
            const validZip = "./test/data/valid_courses6_sections44.zip";
            const facade = new InsightFacade();

            const validId = "coursesAddedBefore";
            return facade.addDataset(validId, validZip.toString(), InsightDatasetKind.Courses)
                .then(() => putValidCourses(validId))
                .then(() => {
                    expect.fail();
                })
                .catch((err) => {
                    expect(err.code).to.be.equal(400);
                });
        });

    });
    describe("DELETE /dataset/:id", function () {
        it("should 204 when valid id and same id added before", async function () {
            const validId = "courseToDelete";

            return putValidCourses(validId)
                .then(() => {
                    return chai.request(SERVER_URL)
                        .del(`/dataset/${validId}`);
                })
                .then((res) => {
                    expect(res.status).to.be.equal(204);
                })
                .catch((err) => {
                    expect.fail();
                });
        });
        it("should 404 when delete INVALID id with underscore", async function () {
            const validId = "courseToDelete";
            const invalidId = "course_Delete";

            return putValidCourses(validId)
                .then(() => {
                    return chai.request(SERVER_URL)
                        .del(`/dataset/${invalidId}`);
                })
                .then((res) => {
                    expect.fail();
                })
                .catch((err) => {
                    expect(err.status).to.be.equal(404);
                });
        });
        it("should 404 when INVALID id with space", async function () {
            const validId = "courseToDelete";
            const invalidId = "course Delete";

            return putValidCourses(validId)
                .then(() => {
                    return chai.request(SERVER_URL)
                        .del(`/dataset/${invalidId}`);
                })
                .then((res) => {
                    expect.fail();
                })
                .catch((err) => {
                    expect(err.status).to.be.equal(404);
                });
        });
        it("should 404 when INVALID id undefined", async function () {
            const validId = "courseToDelete";
            const invalidId: any = undefined;

            return putValidCourses(validId)
                .then(() => {
                    return chai.request(SERVER_URL)
                        .del(`/dataset/${invalidId}`);
                })
                .then((res) => {
                    expect.fail();
                })
                .catch((err) => {
                    expect(err.status).to.be.equal(404);
                });
        });
        it("should 404 when INVALID id null", async function () {
            const validId = "courseToDelete";
            const invalidId: any = null;

            return putValidCourses(validId)
                .then(() => {
                    return chai.request(SERVER_URL)
                        .del(`/dataset/${invalidId}`);
                })
                .then((res) => {
                    expect.fail();
                })
                .catch((err) => {
                    expect(err.status).to.be.equal(404);
                });
        });
        it("should 404 when valid id no added before", async function () {
            const invalidId = "foo";

            return chai.request(SERVER_URL)
                .del(`/dataset/${invalidId}`)
                .then((res) => {
                    expect.fail();
                })
                .catch((err) => {
                    expect(err.status).to.be.equal(404);
                });
        });
    });
    describe("GET /datasets", function () {
        it("should GET no datasets", async function () {
            return chai.request(SERVER_URL)
                .get("/datasets")
                .then(function (res: Response) {
                    expect(res.status).to.be.equal(200);
                    expect(res.body.result).to.deep.equal([]);
                })
                .catch(function (err) {
                    expect.fail();
                });
        });
        it("should GET 1 dataset when added before", async function () {
            const validId = "courseslist1";

            return putValidCourses(validId)
                .then((res) => {
                    return chai.request(SERVER_URL)
                        .get("/datasets");
                })
                .then((res) => {
                    const expectedResult = [
                        {
                            id: validId,
                            kind: "courses",
                            numRows: 44,
                        },
                    ];
                    expect(res.status).to.be.equal(200);
                    const actualResult = res.body.result;
                    expect(actualResult).to.deep.equal(expectedResult);
                })
                .catch(function (err) {
                    expect.fail();
                });
        });
        it("should GET 2 dataset when added before no CRASH", async function () {
            const validCoursesId = "courseslist2";
            const validRoomsId = "roomslist2";

            return putValidCourses(validCoursesId)
                .then(() => putValidRooms(validRoomsId))
                .then(() => {
                    return chai.request(SERVER_URL)
                        .get("/datasets");
                })
                .then((res) => {
                    const expectedResult = [
                        {
                            id: validCoursesId,
                            kind: "courses",
                            numRows: 44,
                        },
                        {
                            id: validRoomsId,
                            kind: "rooms",
                            numRows: 284,
                        },
                    ];
                    const actualResult = res.body.result;
                    expect(res.status).to.be.equal(200);
                    expect(actualResult).to.have.deep.members(expectedResult);
                    expect(actualResult).to.have.length(expectedResult.length);
                })
                .catch(function (err) {
                    expect.fail();
                });
        });
        it("should GET 2 dataset when added before CRASH", async function () {
            const validCoursesId = "courseslist2";
            const validRoomsId = "roomslist2";

            return putValidCourses(validCoursesId)
                .then(() => putValidRooms(validRoomsId))
                .then(() => server.stop())
                .then(() => server.start())
                .then(() => {
                    return chai.request(SERVER_URL)
                        .get("/datasets");
                })
                .then((res) => {
                    const expectedResult = [
                        {
                            id: validCoursesId,
                            kind: "courses",
                            numRows: 44,
                        },
                        {
                            id: validRoomsId,
                            kind: "rooms",
                            numRows: 284,
                        },
                    ];
                    const actualResult = res.body.result;
                    expect(res.status).to.be.equal(200);
                    expect(actualResult).to.have.deep.members(expectedResult);
                    expect(actualResult).to.have.length(expectedResult.length);
                })
                .catch(function (err) {
                    expect.fail();
                });
        });
    });
    describe("POST /query", function () {
        it("should 400 when Invalid query", async function () {
            const validId = "coursesAdd";
            const invalidQuery = "foo";

            return putValidCourses(validId)
                .then((res) => {
                    return chai.request(SERVER_URL)
                        .post("/query")
                        .set("Content-Type", "application/json")
                        .send(JSON.stringify(invalidQuery));
                })
                .then((res) => {
                    expect.fail();
                })
                .catch((err) => {
                    return expect(err.status).to.be.equal(400);
                });
        });
        it("should 400 when valid query, but no added dataset", async function () {
            const validQuery = {
                query: "In courses dataset coursesAdd, " +
                    "find entries whose Average is greater than 97; " +
                    "show Department and Average; " +
                    "sort in ascending order by Average.",
            };

            return chai.request(SERVER_URL)
                .post("/query")
                .set("Content-Type", "application/json")
                .send(JSON.stringify(validQuery))
                .then((res) => {
                    expect.fail();
                })
                .catch((err) => {
                    return expect(err.status).to.be.equal(400);
                });
        });
        it("should 200 when added dataset and valid query", async function () {
            const validId = "coursesAdd";
            const validQuery = {
                query: "In courses dataset coursesAdd, " +
                    "find entries whose Average is greater than 97; " +
                    "show Department and Average; " +
                    "sort in ascending order by Average.",
            };

            return putValidCourses(validId)
                .then((res) => {
                    return chai.request(SERVER_URL)
                        .post("/query")
                        .set("Content-Type", "application/json")
                        .send(JSON.stringify(validQuery.query));
                })
                .then((res) => {
                    return expect(res.status).to.be.equal(200);
                })
                .catch((err) => {
                    expect.fail();
                });
        });
    });
});
