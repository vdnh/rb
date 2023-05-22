import {Voyage} from '../model/model.voyage'

export class PageVoyage{
    content:Voyage[]=[];
    totalPages:number;
    totalElements:number;
    last:boolean;
    size:number;
    first:boolean;
    sort:string;
    numberofElements:number
}