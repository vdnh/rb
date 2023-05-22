
export class AutreEntretien{
    id:number;
    idCamion:number;
    nom:string="";
    kmTrage:number; // km a faire
    kmAvertir:number; //=5000; //km a avertir avant
    odoFait:number;
    dateFait:Date;
    dateFaitMiliseconds:number;
    message:string="";
    unite:string="";   
    
    sendEmail=false; // need send email or not, by default no need -  false
    daysTodo:number; // number of days to do this task
    daysToWarn:number; // number of days to begin warn this task
}