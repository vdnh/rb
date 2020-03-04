import {ShipperParticulier} from '../model/model.shipperParticulier'

export class PageShipperParticulier{
    content:ShipperParticulier[];
    totalPages:number;
    totalElements:number;
    last:boolean;
    size:number;
    first:boolean;
    sort:string;
    numberofElements:number
}