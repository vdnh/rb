export class Camion{
    id:number=0;
    nom:string;
    plaque:string;
    type:string; // camionfermee, flatbed, ...
    latitude:number=45.568806;
    longtitude:number=-73.918333;    
    status:boolean=false;   // en mission ou non
    localDepart:string="";
    destination:string="";
    id_transporter:number=0;
}