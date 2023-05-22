export class Chauffeur
{
    id : number;
    prenom='';
    nom='';
    tel='';
    email='';
    idTransporter: number;

    imgUrl="";
    entryDate:Date = null //new Date();
    lastDate:Date = null //new Date();
    archive=false;
    remark=""; // to note all histories in out function ()
    entryDateText=''; // date in text
    lastDateText=''; // date in text
}