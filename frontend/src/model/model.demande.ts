export class Demande{
    id:number;
    dateCree:Date;
    dateDepart:Date=new Date();
    dateArrive:Date;
    longueur:number=0.00;
    largeur:number=0.00;
    hauteur:number=0.00;
    poids:number=0.00;
    valeur:number=0.00;
    distance:number=0.00;
    origin:string="";
    destination:string="";
    originLat:number;
    originLong:number;
    destLat:number;
    destLong:number;
    totalpoints:number=0.00;
    prixSugere:number=0.00;
    typeCamion:string="";
    optionDemande:string="";
    roleDemander:string=""; // possiblement SHIPPER ou TRANSPORTER ou ADMIN
    idDemander:number=0.00;   // dans le cas SHIPPER ou TRANSPORTER 
    nomDemander:string=""; // possiblement SHIPPER ou TRANSPORTER ou ADMIN
    idsVoyageMatchings:string=""; // ids de Voyages matching avec ce Demande
    idsVoyagePasBesoins:string=""; // ids de Voyages matching mais pas besoins
    idsVoyageContactes:string=""; // ids de Voyages contactes
    idsUsersPasBesoins:string=""; // ids de Users (Shipper or Transporter) pas besoins
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