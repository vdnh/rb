import {Adresse} from '../model/model.adresse'

export class PageAdresse{
    content:Adresse[];
    totalPages:number;
    totalElements:number;
    last:boolean;
    size:number;
    first:boolean;
    sort:string;
    numberofElements:number
}