import {Demande} from '../model/model.demande'

export class PageDemande{
    content:Demande[]=[];
    totalPages:number;
    totalElements:number;
    last:boolean;
    size:number;
    first:boolean;
    sort:string;
    numberofElements:number
}