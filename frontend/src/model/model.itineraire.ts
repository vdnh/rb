export class Itineraire{
    id:number;
    dateCreate=new Date();
    
    origin:string="";
    destination="";
    
    datePick:Date=new Date(); //=new Date().setUTCFullYear(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() );
    dateDrop:Date=new Date(); //=new Date().setUTCFullYear(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() );
    longueur:number;
    camionAttribue="";
    
    idCamion:number;
    idPickStone:number; // Repere Pick
    idDropStone:number; // Repere Drop

    idRouteFather:number; // to find route father if there is
    idRouteFatherF1; // to find route father F1 if there is

    idEntreprise:number;  // bientot id de Shipper
    nomEntreprise="";  // bientot nom de Shipper
    idTransporter:number;  // id de Transporter
    distance:number=0.00;
    
    // il vaut mieur de garder coordonees
    originLat:number=0.00;
    originLong:number=0.00;
    destLat:number=0.00;
    destLong:number=0.00;

    dispoReste:number;
    radiusSearch:number; // par defaut rayon recherche : 50 km
    
    dPick=""; // new Date().getDate().toString() //this.datePick.getDate()
    mPick=""; // new Date().getMonth().toString()
    yPick=""; // new Date().getFullYear().toString()

    dDrop=""; // new Date().getDate().toString()
    mDrop=""; // new Date().getMonth().toString()
    yDrop=""; // new Date().getFullYear().toString()

    horstax=0.00;
    tps=0.00;
    tvq=0.00;
    total=0.00;
    fini=false; //Itineraire finished, false by default
    cancelled=false; //Itineraire cancelled, false by default
    archive=false; // Itineraire archived after finished, false by default
    imgUrl="";

    idTransport:number;
    idRemorquage:number;
    timeResrvation="";
}