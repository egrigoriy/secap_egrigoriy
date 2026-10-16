import {GeoResponse, IGeoService} from "./IGeoService";

export class StubGeoService implements IGeoService {
    private stubGeoData: any = {
            "1822 East Mall": {
                lat: 49.2699,
                lon: -123.25318,
            },
            "6303 North West Marine Drive": {
                lat: 49.26958,
                lon: -123.25741,
            },
            "2202 Main Mall": {
                lat: 49.26372,
                lon: -123.25099,
            },
            "6270 University Boulevard": {
                lat: 49.26479,
                lon: -123.25249,
            },
            "1874 East Mall": {
                lat: 49.26862,
                lon: -123.25237,
            },
            "2260 West Mall, V6T 1Z4": {
                lat: 49.26207,
                lon: -123.25314,
            },
            "2360 East Mall V6T 1Z3": {
                lat: 49.26228,
                lon: -123.24718,
            },
            "2036 Main Mall": {
                lat: 49.2659,
                lon: -123.25308,
            },
            "6250 Applied Science Lane": {
                lat: 49.26273,
                lon: -123.24894,
            },
            "2207 Main Mall": {
                lat: 49.26274,
                lon: -123.25224,
            },
            "2205 East Mall": {
                lat: 49.26414,
                lon: -123.24959,
            },
            "2424 Main Mall": {
                lat: 49.26044,
                lon: -123.24886,
            },
            "6350 Stores Road": {
                lat: 49.26176,
                lon: -123.25179,
            },
            "6333 Memorial Road": {
                lat: 49.26767,
                lon: -123.25583,
            },
            "2177 Wesbrook Mall V6T 1Z3": {
                lat: 49.26541,
                lon: -123.24608,
            },
            "1984 West Mall": {
                lat: 49.26605,
                lon: -123.25623,
            },
            "2045 East Mall": {
                lat: 49.2661,
                lon: -123.25165,
            },
            "6224 Agricultural Road": {
                lat: 49.26627,
                lon: -123.25374,
            },
            "2053 Main Mall": {
                lat: 49.26486,
                lon: -123.25364,
            },
            "6245 Agronomy Road V6T 1Z4": {
                lat: 49.26125,
                lon: -123.24807,
            },
            "1961 East Mall V6T 1Z1": {
                lat: 49.26766,
                lon: -123.2521,
            },
            "6356 Agricultural Road": {
                lat: 49.26545,
                lon: -123.25533,
            },
            "2350 Health Sciences Mall": {
                lat: 49.26236,
                lon: -123.24494,
            },
            "2356 Main Mall": {
                lat: 49.26176,
                lon: -123.24935,
            },
            "2357 Main Mall": {
                lat: 49.26114,
                lon: -123.25027,
            },
            "1984 Mathematics Road": {
                lat: 49.266463,
                lon: -123.255534,
            },
            "1986 Mathematics Road": {
                lat: 49.266089,
                lon: -123.254816,
            },
            "2125 Main Mall": {
                lat: 49.26398,
                lon: -123.2531,
            },
            "6363 Agronomy Road": {
                lat: 49.26048,
                lon: -123.24944,
            },
            "2405 Wesbrook Mall": {
                lat: 49.26229,
                lon: -123.24342,
            },
            "6445 University Boulevard": {
                lat: 49.264,
                lon: -123.2559,
            },
            "2206 East Mall": {
                lat: 49.2642,
                lon: -123.24842,
            },
            "6000 Student Union Blvd": {
                lat: 49.2683,
                lon: -123.24894,
            },
            "6081 University Blvd": {
                lat: 49.2663,
                lon: -123.2466,
            },
            "6174 University Boulevard": {
                lat: 49.26517,
                lon: -123.24937,
            },
            "2175 West Mall V6T 1Z4": {
                lat: 49.26293,
                lon: -123.25431,
            },
            "2194 Health Sciences Mall": {
                lat: 49.26478,
                lon: -123.24673,
            },
        };

    public getLatLon(address: string): Promise<GeoResponse> {
        return Promise.resolve(this.stubGeoData[address]);
    }
}
