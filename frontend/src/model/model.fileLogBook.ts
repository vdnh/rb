export class FileLogBook{
    id:number;
    idOwner:number;
    dateLog:Date;
    dateLogText=""
    startTime="00:00" // time start driving
    endTime="00:00" // time end driving
    nextDay=false; // true for endTime in the day after
    name:string=""; // name of file 
    type:string="";    // type of file
    urlData:string=""; // data of file
    note:string="";
    timeInService=''; //
}