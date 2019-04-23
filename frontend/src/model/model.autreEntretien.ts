
export class AutreEntretien{
    id:number;
    idCamion:number;
    nom:string="";
    kmTrage:number; // km a faire
    kmAvertir:number=5000; //km a avertir avant
    odoFait:number;
    dateFait:Date;
    message:string="";
    unite:string="";    
}