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
    prixBase1=100.00;
    prixKm1=2.75;
    prixKm1P=2.75; // prixKm1P for Panne
    prixKm1A=3.50; // prixKm1A for Accident
    inclus1=5.00; 

    prixBase2=165.00;
    prixKm2=3.15;
    prixKm2P=3.15; // prixKm2P for Panne
    prixKm2A=4.50; // prixKm2A for Accident
    inclus2=5.00;
    
    prixBase3=315.00;
    prixKm3=3.50;
    prixKm3P=3.50; // prixKm3P for Panne
    prixKm3A=5.50; // prixKm3A for Accident
    inclus3=7.00;
    // prix remorquage par cas
    panne1=85;
    panne2=95;
    panne3=105;
    accident1=385;
    accident2=485;
    accident3=850;
    pullOut1=85;
    pullOut2=95;
    pullOut3=105;
    debarragePorte1=65;
    debarragePorte2=75;
    debarragePorte3=85;
    boost1=65;
    boost2=75;
    boost3=85;
    essence1=65;
    essence2=75;
    essence3=85;
    changementPneu1=85;
    changementPneu2=95;
    changementPneu3=105;
}