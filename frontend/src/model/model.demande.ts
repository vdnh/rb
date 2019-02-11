export class Demande{
    id:number;
    dateCree:Date;
    dateDepart:Date;
    dateArrive:Date;
    longueur:number=0.00;
    largeur:number=0.00;
    hauteur:number=0.00;
    poids:number=0.00;
    valeur:number=0.00;
    distance:number=0.00;
    origin:string;
    destination:string;
    totalpoints:number=0.00;
    prixSugere:number=0.00;
    typeCamion:string;
    roleDemander:string; // possiblement SHIPPER ou TRANSPORTER ou ADMIN
    idDemander:number=0.00;   // dans le cas SHIPPER ou TRANSPORTER 
    nomDemander:string; // possiblement SHIPPER ou TRANSPORTER ou ADMIN
}