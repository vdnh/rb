export class Reparation{
    id:number;
    idBon:number;
    reparationEffectuer:string;
    piece:string;
    fournisseur:string;
    garantie:Date;
    heures:number;
    taux:number;
    prix:number=0.00;
    // status
    saved=false;
}