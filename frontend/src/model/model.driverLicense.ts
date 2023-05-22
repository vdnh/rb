export class DriverLicense{
    id:number;
    idOwner:number;
    // dateDoneText=''; // date in text
    // dateDone:Date; // date in Date
    // note:string='';    
    dateExpirationText=''; // dateExpiration in text
    dateExpiration:Date=null //new Date(); // dateExpiration in Date
    dateIssuedText=''; // date in text
    datedateIssued:Date=null //new Date(); // date in Date
    
    imgFront="";
    imgBack="";
    remark="";
    theValidity=false; // false is driver license, true is the page validity
    // function to convert string yyyy-mm-dd to string mm-dd-yyyy
    // public yyyymmddToMmddyyyy(yyyymmdd:string){
    //     let mmddyyyy:string=''
    //     let dd:string=''
    //     let mm:string=''
    //     let yyyy:string=''
    //     let arrayStr = yyyymmdd.trim().split('-')
    //     dd=arrayStr[2]
    //     mm=arrayStr[1]
    //     yyyy=arrayStr[0]
    //     mmddyyyy=mm+'-'+dd+'-'+yyyy
    //     return mmddyyyy;
    // }
    
    // public stringToDate(){
    //     this.dateExpiration=new Date(this.yyyymmddToMmddyyyy(this.dateExpirationText)); //+" | yyyy-mm-dd"        
    //     this.datedateIssued=new Date(this.yyyymmddToMmddyyyy(this.dateIssuedText)); //+" | yyyy-mm-dd"        
    // }
}
