export class Repere{
    id:number;
    dateCreate=new Date();
    nom:string="";
    address:string="";
    
    radius:number=100.00; // en metre
    
    idEntreprise:number;  // bientot id de Shipper
    idTransporter:number;  // id de Transporter
    
    // il vaut mieur de garder coordonees
    originLat:number=0.00;
    originLong:number=0.00;
    
}