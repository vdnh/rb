export class Shipper{
    id:number;
    nom:string="";
    raison_sociale:string="";
    email:string="";
    depuis:Date;
    tel:number=0;
    fax:number=0;
    photo:string="";
    // prix remorquage (bas - km - inclus)
    prixBase1=85.00;
    prixKm1=2.65;
    inclus1=5.00; 
    prixBase2=95.00;
    prixKm2=3.15;
    inclus2=5.00;
    prixBase3=105.00;
    prixKm3=3.80;
    inclus3=7.00;
}