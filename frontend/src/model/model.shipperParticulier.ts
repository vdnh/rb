export class ShipperParticulier{
    id:number;
    idTransporter:number=8;  // id de Transporter (par default : SOSPrestige id=8)
    nom:string="";
    raison_sociale:string="";
    email:string="";
    depuis:Date;
    tel:string="";
    fax:string="";
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
    inclus3=5.00;
    // prix remorquage par cas
    panne1=100;
    panne2=165;
    panne3=315;
    accident1=385;
    accident2=485;
    accident3=850;
    pullOut1=95;
    pullOut2=175;
    pullOut3=350;
    debarragePorte1=65;
    debarragePorte2=75;
    debarragePorte3=75;
    boost1=65;
    boost2=75;
    boost3=85;
    essence1=75;
    essence2=100;
    essence3=175;
    changementPneu1=75;
    changementPneu2=250;
    changementPneu3=250;

    loginName:string;
    password:string;    
}