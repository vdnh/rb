export class Terminal{
    id:number;
    idTransporter:number;
    idTruck:number; // id camion go with this terminal
    idDriver:number;
    name:string=""; //name
    
    latitude:number;
    longitude:number;
    
    direction:number; // 0.00 - 359.99 -- north-east-south-west;    
    speed:number;
    stopDuration=0; // in minute
    timeStop:number; // the time when terminal stopped;  new Date().getTime()
    status:boolean=true; // exploit or non
    loginName:string;
    password:string;
    accepts:string=""; // all devices accepted    
}