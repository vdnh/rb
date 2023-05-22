export class Fuel{
    id:number;
    idOwner:number;
    dateDoneText=''; // date in text
    dateDone:Date= null //new Date(); // date in Date
    liters:number; 
    fee:number; // fee before tax
    odo:number; 
    rangeKms:number; // kms estimation
    feeKm:number; // fee per km estimation  

    note=''; // note
    price:number;
} 