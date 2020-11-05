export class LoadFrequent{
    id:number;
    idTransporter:number;
    idShipper:number;
    description='';
    nom='';
    longueur:number;
    largeur:number;
    hauteur:number;
    poids:number;

    priceBase:number;
    priceMinimum:number;
    priceKmType1:number; // <=100 kms
    priceKmType2:number; // >100 kms
}