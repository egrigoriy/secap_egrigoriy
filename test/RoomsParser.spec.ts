import {IDataset} from "../src/model/datasetprocessor/DatasetProcessor";
import {expect} from "chai";
import {InsightDatasetKind} from "../src/controller/IInsightFacade";
import {RoomsParser} from "../src/model/datasetprocessor/datasetparser/RoomsParser";
import {GeoResponse, IGeoService} from "../src/model/datasetprocessor/datasetparser/geoservice/IGeoService";
import {StubGeoService} from "../src/model/datasetprocessor/datasetparser/geoservice/StubGeoService";

describe("RoomsParser test", async function () {
    const expectSameDatasets = function (actualResult: IDataset, expectedResult: IDataset) {
        expect(actualResult.rows).to.have.deep.members(expectedResult.rows);
        expect(actualResult.kind).to.deep.equal(expectedResult.kind);
        expect(actualResult.rows.length).to.deep.equal(expectedResult.rows.length);
        expect(actualResult.numRows).to.deep.equal(expectedResult.numRows);
    };
    describe("single input file", async function () {
        it("should parse only rooms in buildings referenced by index.xml",
            async function () {
                const fileName1 = "index.xml";
                const fileContent1 = `<?xml version="1.0" encoding="UTF-8"?>
<buildings>
   <building code="ACU" name="Acute Care Unit" path="./campus/discover/buildings-and-classrooms/ACU">
      <location address="2211 Wesbrook Mall" />
   </building>
   <building code="ALRD" name="Allard Hall (LAW)" path="./campus/discover/buildings-and-classrooms/ALRD">
      <location address="1822 East Mall" />
   </building>
   <building code="ANSO" name="Anthropology and Sociology" path="./campus/discover/buildings-and-classrooms/ANSO">
      <location address="6303 North West Marine Drive" />
   </building>
</buildings>`;

                const fileName2 = "campus/discover/buildings-and-classrooms/ALRD";
                const fileContent2 = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<building id="ALRD" address="1822 East Mall" name="Allard Hall (LAW)">
  <rooms>
    <room number="105">
      <web link="http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ALRD-105"/>
      <space seats="94" furniture="Classroom-Fixed Tables/Movable Chairs" type="Case Style"/>
    </room>
    <room number="112">
      <web link="http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ALRD-112"/>
      <space seats="20" furniture="Classroom-Movable Tables + Chairs" type="Open Design General Purpose"/>
    </room>
    <room number="113">
      <web link="http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ALRD-113"/>
      <space seats="20" furniture="Classroom-Movable Tables + Chairs" type="Open Design General Purpose"/>
    </room>
  </rooms>
</building>`;
                const fileName3 = "campus/discover/buildings-and-classrooms/ANSO";
                const fileContent3 = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<building id="ANSO" address="6303 North West Marine Drive" name="Anthropology and Sociology">
<rooms>
  <room number="202">
    <web link="http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANSO-202"/>
    <space seats="26" furniture="Classroom-Movable Tables + Chairs" type="Small Group"/>
  </room>
  <room number="203">
    <web link="http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANSO-203"/>
    <space seats="33" furniture="Classroom-Moveable Tables + Chairs" type="Small Group"/>
  </room>
</rooms>
</building>`;
                const files = new Map<string, string>([
                    [fileName1, fileContent1],
                    [fileName2, fileContent2],
                    [fileName3, fileContent3],
                ]);
                const expectedResult: IDataset = {
                    kind: InsightDatasetKind.Rooms,
                    rows: [
                        {
                            address: "1822 East Mall",
                            fullname: "Allard Hall (LAW)",
                            furniture: "Classroom-Fixed Tables/Movable Chairs",
                            href: "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ALRD-105",
                            lat: 49.2699,
                            lon: -123.25318,
                            name: "ALRD_105",
                            number: "105",
                            seats: 94,
                            shortname: "ALRD",
                            type: "Case Style",
                        },
                        {
                            address: "1822 East Mall",
                            fullname: "Allard Hall (LAW)",
                            furniture: "Classroom-Movable Tables + Chairs",
                            href: "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ALRD-112",
                            lat: 49.2699,
                            lon: -123.25318,
                            name: "ALRD_112",
                            number: "112",
                            seats: 20,
                            shortname: "ALRD",
                            type: "Open Design General Purpose",
                        },
                        {
                            address: "1822 East Mall",
                            fullname: "Allard Hall (LAW)",
                            furniture: "Classroom-Movable Tables + Chairs",
                            href: "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ALRD-113",
                            lat: 49.2699,
                            lon: -123.25318,
                            name: "ALRD_113",
                            number: "113",
                            seats: 20,
                            shortname: "ALRD",
                            type: "Open Design General Purpose",
                        },
                        {
                            address: "6303 North West Marine Drive",
                            fullname: "Anthropology and Sociology",
                            furniture: "Classroom-Movable Tables + Chairs",
                            href: "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANSO-202",
                            lat: 49.26958,
                            lon: -123.25741,
                            name: "ANSO_202",
                            number: "202",
                            seats: 26,
                            shortname: "ANSO",
                            type: "Small Group",
                        },
                        {
                            address: "6303 North West Marine Drive",
                            fullname: "Anthropology and Sociology",
                            furniture: "Classroom-Moveable Tables + Chairs",
                            href: "http://students.ubc.ca/campus/discover/buildings-and-classrooms/room/ANSO-203",
                            lat: 49.26958,
                            lon: -123.25741,
                            name: "ANSO_203",
                            number: "203",
                            seats: 33,
                            shortname: "ANSO",
                            type: "Small Group",
                        },
                    ],
                    numRows: 5,
                };
                const actualResult = await new RoomsParser(new StubGeoService()).parse(files);
                expectSameDatasets(actualResult, expectedResult);
            });
    });
})
;
