import {Transporter} from '../model/model.transporter'

export class PageTransporter{
    content:Transporter[];
    totalPages:number;
    totalElements:number;
    last:boolean;
    size:number;
    first:boolean;
    sort:string;
    numberofElements:number
}