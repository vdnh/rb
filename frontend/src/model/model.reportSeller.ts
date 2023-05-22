// import { DatePipe } from "@angular/common";

export class ReportSeller{
    // constructor(private datePipe: DatePipe)
    //           {   }
    id:number;

    account:string=''; // compte
    type:string='';
    // ddMMyyyy = this.datePipe.transform(new Date(),"dd-MM-yyyy");
    dateDoneText:string=''; // date in text
    dateDone:Date = new Date(); // date in Date
    company:string=""; // compagnie
    contact:string="";
    telephone:string="";
    km:string="";
    report:string=""; // suivi
    email:string="";
    address:string="";
    idTransporter:number;
    idSeller:number; // actual, it's idDispatch of transporter
    seller=''; // actual, it's dispatchs' name of transporter

    // function to convert string yyyy-mm-dd to string mm-dd-yyyy
    public yyyymmddToMmddyyyy(yyyymmdd:string){
        let mmddyyyy:string=''
        let dd:string=''
        let mm:string=''
        let yyyy:string=''
        let arrayStr = yyyymmdd.trim().split('-')
        dd=arrayStr[2]
        mm=arrayStr[1]
        yyyy=arrayStr[0]
        mmddyyyy=mm+'-'+dd+'-'+yyyy
        return mmddyyyy;
    }
    /*// 
        the sellers' Report form date text : yyyy-mm-dd
        JavaScript accept form date text mm-dd-yyyy
        (also with form text yyyy-mm-dd, but the time will be + or - the time offset compare to midnight time 00:00)
        therefore, we change the form date yyyy-mm-dd to form mm-dd-yyyy before 
    //*/
    public stringToDate(){
        // this.dateDone=new Date(this.datePipe.transform(this.dateDoneText,"yyyy-mm-dd"));
        this.dateDone=new Date(this.yyyymmddToMmddyyyy(this.dateDoneText)); //+" | yyyy-mm-dd"        
        console.log(this.dateDoneText + ' in text to date : ' + this.dateDone.toString())
        console.log(this.dateDoneText + ' in text to LocaleString date : ' + this.dateDone.toLocaleString())
    }
    toString(){
        console.log('Compte: ' + this.account + '\n')
        console.log('Type: ' + this.type + '\n')
        console.log('Date: ' + this.dateDoneText + '\n')
        console.log('Date Treated - toLocaleDateString: ' + this.dateDone.toLocaleDateString() + '\n')
        console.log('Compagnie: ' + this.company + '\n')
        console.log('Contact: ' + this.contact + '\n')
        console.log('Telephone: ' + this.telephone + '\n')
        console.log('Km: ' + this.km + '\n')
        console.log('Suivi: ' + this.report + '\n')
    }
}