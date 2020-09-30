export class Terminal{
    id:number;
    idTransporter:number;
    idTruck:number;
    idDriver:number;
    name:string=""; //name
    
    latitude:number;
    longitude:number;
    
    direction:number; // 0.00 - 359.99 -- north-east-south-west;    
    speed:number;
    stopDuration=0; // in minute
    status:boolean=true; // exploit or non
    loginName:string;
    password:string;    
}