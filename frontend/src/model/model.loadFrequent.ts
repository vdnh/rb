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
    priceKmType1:number; // <=100 kms // actually, we need this to calculate price
    priceKmType2:number; // >100 kms // actually, we don't need the 2nd type
}