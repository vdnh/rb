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
    idPickStone:number; // Repere Pick
    idDropStone:number; // Repere Drop

    idEntreprise:number;  // bientot id de Shipper
    idTransporter:number;  // id de Transporter
    distance:number=0.00;
    
    // il vaut mieur de garder coordonees
    originLat:number=0.00;
    originLong:number=0.00;
    destLat:number=0.00;
    destLong:number=0.00;

    dispoReste:number;
    radiusSearch:number; // par defaut rayon recherche : 50 km
    
    horstax=0.00;
    tps=0.00;
    tvq=0.00;
    total=0.00;
    
}