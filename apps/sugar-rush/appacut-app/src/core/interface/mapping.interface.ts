export interface IMappingPort {
    geocode(postcode: string): Promise<google.maps.GeocoderResponse>;
    
}