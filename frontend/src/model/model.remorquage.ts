export class Remorquage{
    id:number;
    dateDepart=new Date();
    distance:number=0.00;
    origin:string="";
    originAdresse="";
    originVille="";
    originProvince="";
    destination="";
    destAdresse="";
    destVille="";
    destProvince="";
    // il vaut mieur de garder coordonees
    originLat:number=0.00;
    originLong:number=0.00;
    destLat:number=0.00;
    destLong:number=0.00;
    comments="";    // description plus
    
    prixBase:number=0.00;
    prixKm:number=0.00;
    inclus:number=0.00;
    typeService="";
}