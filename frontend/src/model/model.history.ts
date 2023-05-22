export class History{
    id:number;
    idOwner:number;
    dateDoneText=''; // date in text
    dateDone:Date= null //new Date(); // date in Date
    note:string='';    
    sent=false; // false do not sent yet, true have been sent
    memo = false; // use just case history of drive, false : evenement, true: memo
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
    /*// 
        the sellers' Report form date text : yyyy-mm-dd
        JavaScript accept form date text mm-dd-yyyy
        (also with form text yyyy-mm-dd, but the time will be + or - the time offset compare to midnight time 00:00)
        therefore, we change the form date yyyy-mm-dd to form mm-dd-yyyy before 
    //*/
    // public stringToDate(){
    //     // this.dateDone=new Date(this.datePipe.transform(this.dateDoneText,"yyyy-mm-dd"));
    //     this.dateDone=new Date(this.yyyymmddToMmddyyyy(this.dateDoneText)); //+" | yyyy-mm-dd"        
    //     console.log(this.dateDoneText + ' in text to date : ' + this.dateDone.toString())
    //     console.log(this.dateDoneText + ' in text to LocaleString date : ' + this.dateDone.toLocaleString())
    // }
}
