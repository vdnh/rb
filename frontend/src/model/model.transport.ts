export class Transport{
    id:number;
    dateDepart=new Date();
    
    nomEntreprise="";
    nomClient="";
    telClient="";
    timeCall= (new Date().getHours().toString().length==2?new Date().getHours().toString():'0'+new Date().getHours().toString())+':'+ 
        (new Date().getMinutes().toString().length==2?new Date().getMinutes().toString():'0'+new Date().getMinutes().toString())  //"00:00";
    timeResrvation="";
    // add more
    nomDispatch="";
    dateReserve=new Date();
    driverNote="";
    telClient2em="";
    numPO=""; //Numero PO - Pucharge Number
    nomContact="";
    telContact="";
    extTelContact="";
    emailContact="";
    
    insurrance="";
    equifax="";
    transCreditCA="";
    authority="";
    transCreditUS="";
    webInfo="";
    
    longueur:number;
    largeur:number;
    hauteur:number;
    poids:number;
    valeur:number;
    totalpoints:number;
    typeCamion="";
    optionDemande="";       

    nomIntervenant="";
    telIntervenant="";
    emailIntervenant="";
    idEntreprise:number;  // bientot id de Shipper
    sent=false; // sent or didn't send to driver
    camionAttribue="";
    signature="";
    nomSignature="";
    porterAuCompte:number=0.00; 
    collecterArgent:number=0.00; 
    //
    distance:number=0.00;
    origin:string="";
    originAdresse="";
    originVille="";
    originProvince="Quebec";
    destination="";
    destAdresse="";
    destVille="";
    destProvince="Quebec";
    // il vaut mieur de garder coordonees
    originLat:number=0.00;
    originLong:number=0.00;
    destLat:number=0.00;
    destLong:number=0.00;
    comments="";    // description plus
    
    prixBase:number=0.00;
    prixKm:number=0.00;
    inclus:number=0.00;
    //typeService="";
    // services
    // panne=false;
    // accident=false;
    // pullOut=false;
    // debaragePorte=false;
    // survoltage=false;
    // essence=false;
    // changementPneu=false;
    // autres=false;
    // fin de service
    // status
    fini=false;
    //
    //prix total
    horstax=0.00;
    tps=0.00;
    tvq=0.00;
    total=0.00;
    //fin de prix total
}