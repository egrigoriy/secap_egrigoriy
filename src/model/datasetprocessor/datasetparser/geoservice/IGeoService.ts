export interface GeoResponse {
    lat?: number;
    lon?: number;
    error?: string;
}
export interface IGeoService {
    getLatLon(address: string): Promise<GeoResponse>;
}
