export class Voyage{
    id:number;
    dateCree:Date;
    dateDepart:Date;    
    origin:string;
    destination:string;
    radiusOrigin:number=0.00;
    radiusDestination:number=0.00;
    typeCamion:string;
    chercheCorridor:boolean=false;
    idTransporter:number=0.00; 
    nomTransporter:string;
}