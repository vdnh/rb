export class PlanOrder{
    id:number;
    idTransporter:number;

    dateOrder = new Date();
    dateEnding = new Date();
    datePayed = new Date();
    payed = false;
    trucks:number;
    clientsPros:number;
    terminals:number;
    planName='';
    price:number; 
    priceBase:number; // price base principal
    daysPlan:number; // days total of plan name
    imgUrl=""; // proof pay in image

    // date in milliseconds
    dateOrderMillis:number= new Date().getTime();
    dateEndingMillis:number;
    datePayedMillis:number;
}