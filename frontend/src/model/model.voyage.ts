export class Voyage{
    id:number;
    dateCree:Date;
    dateDepart:Date;    
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
}