export class Remorquage{
    id:number;
    dateDepart=new Date();
    
    nomEntreprise="";
    nomClient="";
    telClient="";
    timeCall="00:00";
    timeResrvation="";
    // add more
    dateReserve=new Date();
    driverNote="";
    telClient2em="";
    numPO=""; //Numero PO - Pucharge Number
    nomContact="";
    telContact="";
    extTelContact="";
    marque="";
    modele="";
    plaque="";
    couleur="";
    serie="";
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
    typeService="";
    // services
    panne=false;
    accident=false;
    pullOut=false;
    debaragePorte=false;
    survoltage=false;
    essence=false;
    changementPneu=false;
    autres=false;
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