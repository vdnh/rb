export class Itineraire{
    id:number;
    dateCreate=new Date();
    
    origin:string="";
    destination="";
    datePick=new Date();
    dateDrop=new Date();
    longueur:number;
    camionAttribue="";
    
    idCamion:number;
    
    idEntreprise:number;  // bientot id de Shipper
    idTransporter:number;  // id de Transporter
    distance:number=0.00;
    
    // il vaut mieur de garder coordonees
    originLat:number=0.00;
    originLong:number=0.00;
    destLat:number=0.00;
    destLong:number=0.00;
    
    horstax=0.00;
    tps=0.00;
    tvq=0.00;
    total=0.00;
    
}