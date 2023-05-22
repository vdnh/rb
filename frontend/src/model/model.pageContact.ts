import {Contact} from '../model/model.contact'

export class PageContact{
    content:Contact[];
    totalPages:number;
    totalElements:number;
    last:boolean;
    size:number;
    first:boolean;
    sort:string;
    numberofElements:number
}