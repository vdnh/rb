//import { DatePipe, formatDate } from '@angular/common';

export class Voyage{
    id:number;
    //dateCree:Date=new Date(formatDate());
    //dateDepart:Date= new Date(new DatePipe().transform(new Date(), 'yyyy-MM-dd')); 
    dateDepart:Date = new Date();
    origin:string;
    destination:string;
    radiusOrigin:number=0.00;
    radiusDestination:number=0.00;
    // il vaut mieur de garder coordonees
    originLat:number;
    originLong:number;
    destLat:number;
    destLong:number;
    //
    typeCamion:string="";
    optionVoyage:string="";
    chercheCorridor:boolean=false;
    idTransporter:number=0.00; 
    nomTransporter:string;
    paths:string; // coordonnes de polygon en text
    idsDemandeMatchings:string=""; // ids de Demandes matching avec ce Voyage
    idsDemandePasBesoins:string=""; // ids de Demandes matching mais pas besoins
    idsDemandeContactes:string=""; // ids de Demandes contactes
    idsUsersPasBesoins:string; // ids de Users (Shipper or Transporter) pas besoins
    originAdresse:string="";
    originVille:string="";
    originProvince:string="";
    destAdresse:string="";
    destVille:string="";
    destProvince:string="";
    comments:string;    // description plus
    dfo:number=0.00; // distance from origin - temporaiment
    dfd:number=0.00; // distance from destination - temporaiment
    ld:number=0.00; // load distance - mode travel - temporaiment
}