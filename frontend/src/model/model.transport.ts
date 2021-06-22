export class Transport{
    id:number;
    dateDepart=new Date();
    
    nomEntreprise="";
    // begin special for contact origin and destination
    nomClient="";//nom contact origin
    telClient="";//tel1 contact origin
    telClient2em="";//tel2 contact origin
    contactDest="";//nom contact destination
    tel1Dest="";//tel1 contact destination
    tel2Dest="";//tel2 contact destination
    // end special for contact origin and destination
    timeCall= (new Date().getHours().toString().length==2?new Date().getHours().toString():'0'+new Date().getHours().toString())+':'+ 
        (new Date().getMinutes().toString().length==2?new Date().getMinutes().toString():'0'+new Date().getMinutes().toString())  //"00:00";
    timeResrvation="";
    // add more
    nomDispatch="";
    dateReserve=new Date();
    driverNote="";
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
    askDescription="";
    quantity: Number;

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
    distance:number;
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

    // the name of the model usually used
    modelName="";
    taxable=false; // by default no tax between 2 enterprises
    idVoyage:number;  // to identify the voyage he belong
    idCamion:number;
    idTrailer1:number;
    trailer1="";  // name of trailer1
    idTrailer2:number;
    trailer2="";  // name of trailer2

    // Volume available actual
    longueurDispo:number;
    largeurDispo:number;
    hauteurDispo:number;
    poidsDispo:number;

    //Mode payement
    debit=false; // porter au compte
    atPlace=false; // collecter d'argent
    byCash=false; // cash
    byCheck=false; // cheque
    creditCard=false; // carte credit
    byInterac=false; // interac
    transfer=false; // virement
    //fin mode payement
    
    // waiting time and price
    waitingTime:number=0.00;
    waitingPrice:number=0.00; // per hours
    waitingFee:number=0.00;   // = waitingTime * waitingPrice

    // PTO time and price
    ptoTime:number;
    ptoPrice:number; // per hours
    ptoFee:number;   // = ptoTime * ptoPrice
    
    loadsFee:number;   // 

    taxProvince="";  // province where apply tax for this towing

    typeDoc:number=0; // 0 at initial, Evaluation=1 or Command=2, reserve for another tpydoc 3 4 5 ....

    archive=false; // Transport archived after finished, false by default

    // multi address
    pickAddress=""; // all pick address beside principal origin address; separated by **--**
    dropAddress=""; // all drop address beside principal destination address; separated by **--**

    evaluatedTimes = 0;
    
    textTimes = "";
}