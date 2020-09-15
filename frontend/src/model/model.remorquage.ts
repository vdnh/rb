export class Remorquage{
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
    marque="";
    modele="";
    plaque="";
    couleur="";
    serie="";
    nomIntervenant="";
    telIntervenant="";
    emailIntervenant="";
    idEntreprise:number;  // bientot id de Shipper
    idTransporter:number;  // id de Transporter
    sent=false; // sent or didn't send to driver
    camionAttribue="";
    signature="";
    nomSignature="";
    porterAuCompte:number=0.00; 
    collecterArgent:number=0.00; 
    valid=false; // valid=true after save bon
    imgUrl="";
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
    typeService="Leger";
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

    //Mode payement
    debit=false; // porter au compte
    atPlace=false; // collecter d'argent
    byCash=false; // cash
    byCheck=false; // cheque
    creditCard=false; // carte credit
    byInterac=false; // interac
    transfer=false; // virement
    //fin mode payement

    // text export
    sage="";
    excel="";
    //

    // status
    fini=false;
    //situation
    rush=false;  // se ruer, urgent
    //
    //prix total
    taxable=true;
    horstax=0.00;
    tps=0.00;
    tvq=0.00;
    total=0.00;
    taxProvince="";  // province where apply tax for this towing
    //fin de prix total
}