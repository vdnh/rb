export class Transporter{
    id:number;
    nom:string="";
    raison_sociale:string="";
    email:string="";
    depuis:Date;
    tel:string="";
    fax:string="";
    photo:string=""; // imageUrl in text 
    emailTechnic:string="";
    lastNumber:number; // to keep the last number of confirmation
    nir:string="";  // license de circulation
    nid:string="";  // company number
    expressContact:string='' // if there are many names, separate with /
}