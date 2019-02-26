export class BonDeTravail{    
    id:number;
    date:Date;
    idCamion:number;
    technicien:string;
    mecanique:boolean=false;
    carrosserie:boolean=false;
    piece:boolean=false;
    sablageAuJet:boolean=false;
    entreposage:boolean=false;
    remarque:string;
    sousTotal:number=0.00;
    tps:number=0.00;
    tvq:number=0.00;
    total:number=0.00;
}