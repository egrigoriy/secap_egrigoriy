import * as http from "http";
import {GeoResponse, IGeoService} from "./IGeoService";

export class UBCGeoService implements IGeoService {
    public getLatLon(address: string): Promise<GeoResponse> {
        const url = "http://sdmm.cs.ubc.ca:11316/api/v1/team_egrigoriy/" + encodeURIComponent(address);
        return new Promise((resolve, reject) => {
            http.get(url, (res) => {
                res.setEncoding("utf8");
                let rawData = "";
                res.on("data", (chunk) => { rawData += chunk; });
                res.on("end", () => {
                    try {
                        resolve(JSON.parse(rawData));
                    } catch (e) {
                        reject(e.message);
                    }
                });
            });
        });
    }
}
