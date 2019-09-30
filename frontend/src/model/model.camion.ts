export class Camion{
    id:number=0;
    unite:string="";
    uniteMonitor:string="";
    monitor:string="";
    plaque:string;
    marque:string; // camionfermee, flatbed, ...
    niv:string; // numero identificatrion vehicule (numero serie)
    modele:string;
    annee:string;
    type:string; // remorque:1, semiRemorque:2, camionPorteur:3, tracteur:4, camionfermee:5, flatbed:6, autres:7...
    massNet:string;
    odometre:number; //=0; 
    inspect6m:Date; // jj-mmm,  On fait l'inspection 2 fois chaque annee
    ent1:number=25000;
    ent2:number=50000;
    ent3:number=100000;
    filHydrolique:number; // km a changer filtre hydrolique
    filAntigel:number; // km a changer filtre antigel
    huileAntigel:number; // km a changer d'huile antigel
    huileTransmission:number; // km a changer d'huile transmission
    huileDifferentiel:number; // km a changer d'huile differentiel
    message01:string="Changement huile moteur, filtre moteur, graissage, ajustement des freins.";
    message02:string="Changement filtre a l'air, filtre a fuel.";
    message03:string="Changement filtre a polene.";
    message04:string="Changement filtre hydrolique.";
    message05:string="Changement filtre antigel.";
    message06:string="Changement antigel.";
    message07:string="Changement huile transmission.";
    message08:string="Changement huile differentiel.";
    
    latitude:number; //=45.568806;
    longtitude:number; //=-73.918333;    
    direction:number; // 0.00 - 359.99 -- north-east-south-west;    
    speed: number;
    stopDuration:number=0; // in minute
    status:boolean=false;   // en mission ou non
    localDepart:string="";
    destination:string="";
    //Entretien Control
    ent1Fait:Date;
    odo1Fait:number=0;
    ent2Fait:Date;
    odo2Fait:number=0;
    ent3Fait:Date;
    odo3Fait:number=0;
    ent4Fait:Date;
    odo4Fait:number=0;
    ent5Fait:Date;
    odo5Fait:number=0;
    ent6Fait:Date;
    odo6Fait:number=0;
    ent7Fait:Date;
    odo7Fait:number=0;
    ent8Fait:Date;
    odo8Fait:number=0;    
    //inspect01:Date; // = new Date("10-jul-2018");
    
    idFichePhysiqueEntretien:number; // faut creer une ligne dans la table FichePhysiqueEntretien parce que one to one
    idFichePhysiqueEntretienCont:number;  // faut creer une ligne dans la table FichePhysiqueEntretienCont parce que one to one
    idTransporter:number=0;

}