export class Camion{
    id:number=0;
    nunite:string;
    plaque:string;
    marque:string; // camionfermee, flatbed, ...
    latitude:number=45.568806;
    longtitude:number=-73.918333;    
    status:boolean=false;   // en mission ou non
    localDepart:string="";
    destination:string="";
    idTransporter:number=0;
}