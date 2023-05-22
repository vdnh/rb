import { Component, OnInit, ViewChild } from '@angular/core';
import { AppUser } from 'src/model/model.appUser';
import { ReportSeller } from 'src/model/model.reportSeller';
import { AuthenticationService } from 'src/services/authentication.service';
import { ReportSellerService } from 'src/services/reportSeller.service';
import { VarsGlobal } from 'src/services/VarsGlobal';

import { } from 'googlemaps';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { GeocodingService } from 'src/services/geocoding.service';

@Component({
  selector: 'app-marketing',
  templateUrl: './marketing.component.html',
  styleUrls: ['./marketing.component.css']
})
export class MarketingComponent implements OnInit {

  @ViewChild("placesRef") placesRef : GooglePlaceDirective;
  options={
    types: [],
    componentRestrictions: { country: ["CA","US"] }
  }

  public async handleAddressChange(address: Address) {
    this.addReport.address=await address.formatted_address;
  }

  public async handleSubAddressChange(rp:ReportSeller) {
    // rp.address=await address.formatted_address;

    let geocoding = new GeocodingService() // here we don't need any more because this.latLngDestination already
     geocoding.codeAddress(rp.address).forEach(
      (results: google.maps.GeocoderResult[]) => {
            if(results[0].geometry.location.lat()>0){
              let latLng= new google.maps.LatLng(
              results[0].geometry.location.lat(),
              results[0].geometry.location.lng()                            
              )
              geocoding.geocode(new google.maps.LatLng(              
                latLng.lat(),
                latLng.lng()
              ))
              .forEach(
                (results: google.maps.GeocoderResult[]) => {
                  rp.address=results[0].formatted_address;
                }
              )
              // rp.address= results[0].formatted_address
            }
            else
              {
                // do nothing
              }
    })
    
    // this.reportSellerService.saveReportSeller(rp).subscribe(()=>{}, err=>{console.log(err)})
  }

  constructor(public varsGlobal:VarsGlobal, public authenticationService:AuthenticationService, 
    public reportSellerService : ReportSellerService, ) {}

  idTransporter:number;
  listAppUsers : Array<AppUser> = [];
  appUserToUse : AppUser = new AppUser();
  ngOnInit():void {
    // this.idTransporter=localStorage.getItem('idTransporter')
    // this.addReport.address='428 Aimé-Vincent V-Dorion'
    if(localStorage.getItem('idTransporter')!=null) {
      this.idTransporter = Number(localStorage.getItem('idTransporter'))
      this.authenticationService.getAllAppUsers().subscribe((data:Array<AppUser>)=>{
        this.listAppUsers=data.filter(x=>(
          x.idTransporter==Number(localStorage.getItem('idTransporter')) &&
          !x.roleSimple.includes("TECHNICIEN") &&
          !x.roleSimple.includes("TERMINAL") 
          && (x.idUser==undefined || x.idUser.length==0)
        ));
      }, err=>{console.log(err)})
    }
  }

  showReport=true;
  onModeShowReports(){
    this.showReport=true
    this.reportsMaster=[]
    this.reports=[]
    this.appUserToUse= new AppUser()
  }

  onModeAddReports(){
    this.showReport=false
    this.reportsMaster=[]
    this.reports=[]
    this.appUserToUse= new AppUser()
  }

  loadWaiting = false;
  listDateTextToAvoidDuplicate : Array<string>=[] // use in case Read file text
  onChangeSeller(){
    this.emptyListFilter();
    // in case show reports
    if(this.showReport){
      // see all reports of transporter
      if(this.appUserToUse==null || this.appUserToUse.id==null || this.appUserToUse.id<=0){
        this.loadWaiting=true // to turn on message waiting
        this.reportSellerService.getReportSellersTransporter(this.idTransporter).
        subscribe((data:Array<ReportSeller>)=>{
          this.reportsMaster=this.reports= data.sort((b,a)=>{
            // this.reports= this.reports.sort((b,a)=>{return (a.id-b.id)})
            let temp = new Date(a.dateDone).getTime() - new Date(b.dateDone).getTime()
            if(temp!=0) return temp 
            else return (a.id-b.id)
          })
          this.loadWaiting=false // to turn off message waiting
        })
      }
      // see all reports of seller
      if(this.appUserToUse!=null && this.appUserToUse.id!=null && this.appUserToUse.id>0){
        this.loadWaiting=true // to turn on message waiting
        this.reportSellerService.getReportsSeller(this.appUserToUse.id).
        subscribe(async (data:Array<ReportSeller>)=>{
          // await data.forEach(dt=>(dt.stringToDate()))
          this.reportsMaster=this.reports=data.sort((b,a)=>{
            return new Date(a.dateDone).getTime() - new Date(b.dateDone).getTime()
          })
          // this.reportsMaster.forEach(rs=>{
          //   // test print dateDone to see
          //   console.log('dateDone to localeDateString: ' + (new Date(rs.dateDone).toLocaleDateString()))
          // })
          this.loadWaiting=false // to turn off message waiting
        })
      }
    }
    
    // in case adding reports
    else{
      this.emptyListFilter()
      this.listDateTextToAvoidDuplicate=[]
      // see all reports of seller
      if(this.appUserToUse!=null && this.appUserToUse.id!=null && this.appUserToUse.id>0){
        this.reportSellerService.getReportsSeller(this.appUserToUse.id).
        subscribe(async (data:Array<ReportSeller>)=>{
          data.forEach(rp=>{
            if(!this.listDateTextToAvoidDuplicate.includes(rp.dateDoneText)){
              this.listDateTextToAvoidDuplicate.push(rp.dateDoneText)
            }
          })
        })
      }
      // see all reports of transporter
      // if(this.appUserToUse==null || this.appUserToUse.id==null || this.appUserToUse.id<=0)
      else {
        // do nothing now
      }
    }
  }

  typeEnter=false; // false: enter manually; true: enter from file text

  onAddReport(){
    this.showReport=false;
  }

  accountFilter=''
  accountFilterChange(){
    // this.accountFilter=''
    this.addressFilter=''
    this.telFilter=''
    this.emailFilter=''
    this.dateFilter=null
    this.companyFilter=''
    this.contactFilter=''
    this.reports= this.reportsMaster.filter(x=>(x.account.includes(this.accountFilter)))
    this.reports= this.reports.sort((a,b)=>{return (a.id-b.id)})
  }

  telFilter=''
  telFilterChange(){
    // this.telFilter=''
    this.addressFilter=''
    this.emailFilter=''
    this.accountFilter=''
    this.dateFilter=null
    this.companyFilter=''
    this.contactFilter=''
    console.log('this.telFilter: '+this.telFilter)
    this.reports= this.reportsMaster.filter(x=>(
        x.telephone.replace(/[\r\n]+/g, " ").includes(this.telFilter) 
        // || 
        // this.telFilter.includes(x.telephone)
      ))
    this.reports= this.reports.sort((a,b)=>{return (a.id-b.id)})
  }

  emailFilter=''
  emailFilterChange(){
    // this.emailFilter=''
    this.addressFilter=''
    this.telFilter=''
    this.accountFilter=''
    this.dateFilter=null
    this.companyFilter=''
    this.contactFilter=''
    this.reports= this.reportsMaster.filter(x=>(x.email.replace(/[\r\n]+/g, " ").includes(this.emailFilter)))
    this.reports= this.reports.sort((a,b)=>{return (a.id-b.id)})
  }

  dateFilter:Date
  dateFilterChange(dateFilter:Date){
    this.accountFilter=''
    // this.dateFilter=null
    this.addressFilter=''
    this.telFilter=''
    this.emailFilter=''
    this.companyFilter=''
    this.contactFilter=''
    if(dateFilter==null) this.reports= this.reportsMaster
    else this.reports= this.reportsMaster.filter(x=>(x.dateDone.getTime()==dateFilter.getTime()))
    this.reports= this.reports.sort((a,b)=>{return (a.id-b.id)})
  }

  addressFilter=''
  addressFilterChange(addressFilter:string){
    // this.addressFilter=''
    this.accountFilter=''
    this.dateFilter=null
    this.telFilter=''
    this.emailFilter=''
    this.companyFilter=''
    this.contactFilter=''
    if(addressFilter==null) this.reports= this.reportsMaster
    else this.reports= this.reportsMaster.filter(x=>(this.strNoAccent(x.address.replace(/[\r\n]+/g, " ").toLowerCase()).includes(this.strNoAccent(addressFilter.toLowerCase()))))
    this.reports= this.reports.sort((a,b)=>{return (a.id-b.id)})
  }

  strNoAccent(a) {
    var b="áàâäãåçéèêëíïîìñóòôöõúùûüýÁÀÂÄÃÅÇÉÈÊËÍÏÎÌÑÓÒÔÖÕÚÙÛÜÝ",
        c="aaaaaaceeeeiiiinooooouuuuyAAAAAACEEEEIIIINOOOOOUUUUY",
        d="";
    for(var i = 0, j = a.length; i < j; i++) {
      var e = a.substr(i, 1);
      d += (b.indexOf(e) !== -1) ? c.substr(b.indexOf(e), 1) : e;
    }
    return d;
  }
  
  // strNoAccent('tést');

  companyFilter=''
  companyFilterChange(){
    this.accountFilter=''
    this.dateFilter=null
    // this.companyFilter=''
    this.addressFilter=''
    this.telFilter=''
    this.emailFilter=''
    this.contactFilter=''
    this.reports= this.reportsMaster.filter(x=>(x.company.replace(/[\r\n]+/g, " ").includes(this.companyFilter)))
    this.reports= this.reports.sort((a,b)=>{return (a.id-b.id)})
  }

  contactFilter=''
  contactFilterChange(){
    this.addressFilter=''
    this.accountFilter=''
    this.dateFilter=null
    this.companyFilter=''
    // this.contactFilter=''
    this.telFilter=''
    this.emailFilter=''
    this.reports= this.reportsMaster.filter(x=>(x.contact.replace(/[\r\n]+/g, " ").includes(this.contactFilter)))
    this.reports= this.reports.sort((a,b)=>{return (a.id-b.id)})
  }

  textContent:string=''
  reports:Array<ReportSeller>=[]
  reportsMaster:Array<ReportSeller>=[]
  addReport:ReportSeller = new ReportSeller();
  listAccount : Array<string>=[]
  listAddress : Array<string>=[]
  listTel : Array<string>=[]
  listEmail : Array<string>=[]
  listCompany : Array<string>=[]
  listContact : Array<string>=[]
  listDate : Array<Date>=[]
  listDateText : Array<string>=[]
  onFileTextUpLoad(event){
    let selectedFile : File=event.target.files[0];
    let size : number; // = selectedFile.size
    // let imgUrl=""
    if(selectedFile){
      size = selectedFile.size
      console.log('size file: '+ size)  // in Byte => 25 MByte ~ 26.000.000 Byte
      // console.log("selectedFile:  "+selectedFile)
    }    
    if(selectedFile && size<26000000 && 
        (
          selectedFile.name.includes(".txt")
        )
      ){
      const reader = new FileReader();
      reader.onload = ()=>{
        this.reportsMaster=this.reports=[]
        this.listAccount=[]
        this.listAddress=[]
        this.listTel=[]
        this.listEmail=[]
        this.listDateText=[]
        this.listDate=[]
        this.listCompany=[]
        this.listContact=[]
        this.textContent=reader.result.toString();
        // console.log("textContent:  "+this.textContent)
        // let linesNoTrimed = this.textContent.split('\n')
        // let lines=[]
        // linesNoTrimed.forEach(line=>{lines.push(line.trim())})
        let lines = this.textContent.split('\n')
        const regex = /([0-9]{10})/  // this is form of compte : 10 numbers
        console.log('lines length: ' + lines.length)
        for(let index=0; index<lines.length; index++){
          let reportSeller = new ReportSeller();
          let rapportTemp = new Rapport()
          // lines[index].trim()
          if(lines[index].match(regex))
          {
            rapportTemp = this.buildRapport(lines[index])
            rapportTemp.contact=rapportTemp.contact+' ' // serve in case name and then email contact
            // console.log('line '+ index+' : ' + lines[index])
            // lines[index+1].trim()
            while(lines[index+1]!=null && lines[index+1].trim().length>0){
              let rapportTt = new Rapport()
              index++;
              rapportTt= this.buildRapport(lines[index])
              // console.log('line '+ index+' : ' + lines[index])
              // lines[index+1].trim()
              rapportTemp.compte=rapportTemp.compte.concat(rapportTt.compte)
              rapportTemp.type=rapportTemp.type.concat(rapportTt.type)
              rapportTemp.date=rapportTemp.date.concat(rapportTt.date)
              rapportTemp.compagnie=rapportTemp.compagnie.concat(' '+rapportTt.compagnie)
              rapportTemp.contact=rapportTemp.contact.concat(rapportTt.contact)
              rapportTemp.telephone=rapportTemp.telephone.concat(rapportTt.telephone)
              rapportTemp.km=rapportTemp.km.concat(rapportTt.km)
              rapportTemp.suivi=rapportTemp.suivi.concat(' '+rapportTt.suivi)
            }
            reportSeller.account=rapportTemp.compte
            reportSeller.type=rapportTemp.type
            reportSeller.dateDoneText=rapportTemp.date
            // reportSeller.dateDone  done by sefl
            reportSeller.stringToDate()
            reportSeller.company=rapportTemp.compagnie
            reportSeller.contact=rapportTemp.contact
            reportSeller.telephone=rapportTemp.telephone
            reportSeller.km=rapportTemp.km
            reportSeller.report=rapportTemp.suivi
            reportSeller.idTransporter = this.idTransporter
            if(this.appUserToUse!=null) {
              reportSeller.idSeller=this.appUserToUse.id
              reportSeller.seller=this.appUserToUse.username
            }
            // console.log("Report to print by function toString() himself")
            // reportSeller.toString()

            // here to check if the date was in database actual
            if(!this.listDateTextToAvoidDuplicate.includes(reportSeller.dateDoneText)){
              this.reports.push(reportSeller)
              if(!this.listAccount.includes(reportSeller.account)){
                this.listAccount.push(reportSeller.account)
              }
              if(!this.listAddress.includes(reportSeller.address)){
                this.listAddress.push(reportSeller.address)
              }
              if(!this.listTel.includes(reportSeller.telephone)){
                this.listTel.push(reportSeller.telephone)
              }
              if(!this.listEmail.includes(reportSeller.email)){
                this.listEmail.push(reportSeller.email)
              }
              if(!this.listDateText.includes(reportSeller.dateDoneText)){
                this.listDateText.push(reportSeller.dateDoneText)
                this.listDate.push(reportSeller.dateDone)
              }
              if(!this.listCompany.includes(reportSeller.company)){
                this.listCompany.push(reportSeller.company)
              }
              if(!this.listContact.includes(reportSeller.contact)){
                this.listContact.push(reportSeller.contact)
              }  
            }
            // this.listDateTextToAvoidDuplicate.push(rp.dateDoneText)
            
            // console.log('reportSeller.stringToDate() - reportSeller.dateDone : ' + reportSeller.dateDone.toString())
            // console.log('rapportTemp: ' + rapportTemp.compte+' - '+rapportTemp.type+' - '+rapportTemp.date+' - '+rapportTemp.compagnie+' - '+rapportTemp.contact+' - '+rapportTemp.telephone+' - '+rapportTemp.km+' - '+rapportTemp.suivi)
          }
        }
        console.log('this.reports.length: '+this.reports.length)
        this.sortByDate(this.reports)
        this.reportsMaster=this.reports // asign reportMaster to keep the reports 
        // console.log('this.listAccount.length: '+this.listAccount.length)
        // console.log('this.listDate.length: '+this.listDate.length)
        this.listAccount=this.listAccount.sort((a,b)=>{
          if(a==null) a=''
          if(b==null) b=''
          return a.localeCompare(b)
        })
        this.listAddress=this.listAddress.sort((a,b)=>{
          if(a==null) a=''
          if(b==null) b=''
          return a.localeCompare(b)
        })
        this.listTel.sort((a,b)=>{
          if(a==null) a=''
          if(b==null) b=''
          return a.localeCompare(b)
        })
        this.listEmail.sort((a,b)=>{
          if(a==null) a=''
          if(b==null) b=''
          return a.localeCompare(b)
        })
        this.listDateText=this.listDateText.sort((a,b)=>{
          if(a==null) a=''
          if(b==null) b=''
          return a.localeCompare(b)
        })
        this.listDate=this.listDate.sort((a,b)=>{
          return a.getTime() - b.getTime()
        })
        this.listCompany=this.listCompany.sort((a,b)=>{
          if(a==null) a=''
          if(b==null) b=''
          return a.localeCompare(b)
        })
        this.listContact=this.listContact.sort((a,b)=>{
          if(a==null) a=''
          if(b==null) b=''
          return a.localeCompare(b)
        })
        // test line & recovery to form of kRapport
        // line : 5148382568         VISITE     2021-05-24     Agrikom                               Dominic Bernard                  514-838-2568             Lui est laisser carte il semble intéreser
        // let lineTest = '5148382568         VISITE     2021-05-24     Agrikom                               Dominic Bernard                  514-838-2568             Lui est laisser carte il semble intéreser'
        // lineTest = "4506800528         APPEL      2021-07-12     Rolled Alloys                         Michel Blain et Carolyne         450-680-0528      119    Parler Avec Michel Blain me dit qu`on a"
        // let linesTest = lineTest.split('     ') // 5 spaces
        // console.log('linesTest length: ' + linesTest.length)
        // for(let index=0; index<linesTest.length; index++){
        //   console.log('linesTest '+ index+' : ' + linesTest[index]) // .trim()
        // }
      }
      reader.readAsText(selectedFile)
    }
    else {
      this.textContent='';
      event.value = null;
      event = null;
      //(<HTMLFormElement>document.getElementById("formUpload")).reset();
      if(size >= 26000000){ 
        if(this.varsGlobal.language.includes('Francais'))
          alert("Ne pas attacher un fichier plus grand que 25 MB !!!")
        else alert("Can't upload file more than 25 MB !!!")
      }
    }
  }

  addReportSeller(){
    this.addReport.idTransporter = this.idTransporter
    if(this.appUserToUse!=null) {
      this.addReport.idSeller=this.appUserToUse.id
      this.addReport.seller=this.appUserToUse.username
    }
    // here we need date to text
    this.addReport.dateDoneText= this.addReport.dateDone.getUTCFullYear().toString()+'-'+
    (this.addReport.dateDone.getUTCMonth()+1).toString()+'-'+
    this.addReport.dateDone.getUTCDate().toString()

    //
    this.reportSellerService.saveReportSeller(this.addReport).
      subscribe(
        {
          next: (v:any) => {
            this.addReport.id=v.id;
            console.log('Added your 1 report.')
          },
          error: console.error,
          complete: () => {
            this.reports.push(this.addReport)
            this.reportsMaster.push(this.addReport)
            let tempreport = this.addReport
            this.addReport= new ReportSeller()
            this.addReport.dateDone=tempreport.dateDone
            this.addReport.dateDoneText=tempreport.dateDoneText
            console.log('Finished Adding your 1 report, then refresh your showing off.')
          } 
        }
      )
    //
    
    // this.reports.push(this.addReport)
    // this.reportsMaster.push(this.addReport)
    // this.addReport= new ReportSeller()
  }

  countTotalKm(){
    let totalKm=0;
    this.reports.forEach(rp=>{
      if(!isNaN(Number(rp.km.trim())))
        totalKm=totalKm + Number(rp.km.trim())
    })
    return totalKm;
  }

  public dateToMmddyyyy(date:Date){
    date = new Date(date)
    console.log('DateToMmddyyyy begin')
    let mmddyyyy:string=''
    let dd:string=date.getUTCDate().toString()
    console.log('date.getUTCHours(): '+date.getUTCHours())
    if(dd.length<2) dd='0'+dd
    console.log('dd: ' + dd)
    let mm:string=(date.getUTCMonth()+1).toString()  // month always + 1 
    if(mm.length<2) mm='0'+mm
    console.log('mm: ' + mm)
    let yyyy:string=date.getFullYear().toString()
    console.log('yyyy: ' + yyyy)
    
    mmddyyyy=mm+'-'+dd+'-'+yyyy
    console.log('mmddyyyy: ' + mmddyyyy)
    return mmddyyyy;
  }

  today=new Date();
  pickDateChange(event){
    this.addReport.dateDone= new Date(this.dateToMmddyyyy(event.target.value));
  }

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
  
  stringToDate(dateDoneText:string){
    return new Date(this.yyyymmddToMmddyyyy(dateDoneText)); //+" | yyyy-mm-dd"        
  }

  stringToDateFromReport(reportSeller:ReportSeller){
    reportSeller.dateDone = new Date(this.yyyymmddToMmddyyyy(reportSeller.dateDoneText)); //+" | yyyy-mm-dd"        
    if(!this.listAccount.includes(reportSeller.account)){
      this.listAccount.push(reportSeller.account)
    }
    if(!this.listAddress.includes(reportSeller.address)){
      this.listAddress.push(reportSeller.address)
    }
    if(!this.listTel.includes(reportSeller.telephone)){
      this.listTel.push(reportSeller.telephone)
    }
    if(!this.listEmail.includes(reportSeller.email)){
      this.listEmail.push(reportSeller.email)
    }
    if(!this.listDateText.includes(reportSeller.dateDoneText)){
      this.listDateText.push(reportSeller.dateDoneText)
      this.listDate.push(reportSeller.dateDone)
    }
    if(!this.listCompany.includes(reportSeller.company)){
      this.listCompany.push(reportSeller.company)
    }
    if(!this.listContact.includes(reportSeller.contact)){
      this.listContact.push(reportSeller.contact)
    }
    return reportSeller.dateDone
  }

  emptyListFilter(){
    this.listAccount=[]
    this.listAddress=[]
    this.listTel=[]
    this.listEmail=[]
    this.listDateText=[]
    this.listDate=[]
    this.listCompany=[]
    this.listContact=[]
    this.reports=[]
    this.reportsMaster=[]

    // also criteria
    this.accountFilter=''
    this.addressFilter=''
    this.dateFilter=null
    this.companyFilter=''
    this.contactFilter=''
    this.telFilter=''
    this.emailFilter=''
  }

  onDeleteReport(reportSeller:ReportSeller, reports:Array<ReportSeller>, index:number){
    // if not show report, just delete in liste of report 
    if(!this.showReport){
      reports=reports.splice(index, 1)
      this.reportsMaster=this.reportsMaster.splice(this.reportsMaster.indexOf(reportSeller), 1)
    }
    // if show report, must also delete in database and liste of report
    // throwError('I am an error').subscribe({error: console.error});
    else {
      reports=reports.splice(index, 1)
      // reports=this.reportsMaster=this.reportsMaster.splice(this.reportsMaster.indexOf(reportSeller), 1)
      if(this.accountFilter.length>0) this.accountFilterChange()
      if(this.dateFilter!=null) this.dateFilterChange(this.dateFilter)
      if(this.companyFilter.length>0) this.companyFilterChange()
      if(this.contactFilter.length>0) this.contactFilterChange()

      this.reportSellerService.deleteReportSeller(reportSeller.id).subscribe(
        {
          next: (v:Array<any>) => {console.log('v toString : '+v.toString())},
          error: console.error,
          complete: () => {
            // reports=reports.splice(index, 1)
            // this.reportsMaster=this.reportsMaster.splice(this.reportsMaster.indexOf(reportSeller), 1)
            // console.log("Finished Delete and modify 2 lists reports and reportMaster.")
            console.info('complete')
          } 
        }
      )
    }
    /*//
    .subscribe({
    next: (v) => console.log(v),
    error: (e) => console.error(e),
    complete: () => console.info('complete') 
})
    //* */
    // this.reportSellerService.deleteReportSeller(reportSeller.id).subscribe(()=>{}, err=>{console.log(err)})
  }

  onSaveReport(r:ReportSeller){
    this.reportSellerService.saveReportSeller(r).subscribe((data:any)=>{}, err=>(console.log(err)))
  }

  // save only 1 reportSeller belong to Array ReportSellers
  saveReportBelongArray(r:ReportSeller, index:number){
    this.reportSellerService.saveReportSeller(r).subscribe((data:any)=>{
      r=data;
      index++;
    }), err=>(console.log(err))
  }
  
  async onSaveReportsRecursive(){
    await this.reportsMaster.forEach(r=>{
      this.reportSellerService.saveReportSeller(r).
      // subscribe(
      //   (data:any)=>{
      //     let dt :ReportSeller = data
      //     console.log('data account saved: ' + dt.account.toString())
      //   }
      // ), err=>(console.log(err))
      subscribe(
        {
          next: (v:any) => {
            // console.log('v.account: '+v.account)
            // console.log('v.company: '+v.company)
            r=v;
          },
          error: console.error,
          complete: () => {
            // console.log("Finished adding. -  by console.log")
            // console.info('complete adding - by console.info')
          } 
        }
      )
    })
    // this.reportsMaster=[]
    // this.reports=[]
    if(this.varsGlobal.language.includes('Francais')) alert("C'est enregistre.")
    else alert("Ok, saved.")
    this.emptyListFilter();
    // if(this.reportsMaster.length>0){
    //   let index = 0;
    //   this.reportSellerService.saveReportSeller(this.reportsMaster[index]).subscribe((data:any)=>{
    //     this.reportsMaster[index]=data
    //     index++
    //     while (index<this.reportsMaster.length){
    //       this.reportSellerService.saveReportSeller(this.reportsMaster[index]).subscribe((data:any)=>{
    //         this.reportsMaster[index]=data
    //         index++
    //       }), err=>(console.log(err))
    //     }
    //   }), err=>(console.log(err))
    // }
  }

  sortAsc=false; // cause we run always sortByDate, so after sort sortAsc=!sortAsc
  sortByAccount(reports:Array<ReportSeller>){
    if(this.sortAsc) reports.sort((a,b)=>{
      if(a.account==null) a.account=''
      if(b.account==null) b.account=''
      let resultCompare =0;
      resultCompare= a.account.localeCompare(b.account)
      if(resultCompare==0) resultCompare = (a.id-b.id)
      return resultCompare
    })
    else reports.sort((b,a)=>{
      if(a.account==null) a.account=''
      if(b.account==null) b.account=''
      let resultCompare =0;
      resultCompare= a.account.localeCompare(b.account)
      if(resultCompare==0) resultCompare = (a.id-b.id)
      return resultCompare
    })
    this.sortAsc=!this.sortAsc
  }
  sortByDate(reports:Array<ReportSeller>){
    if(this.sortAsc) reports.sort((a,b)=>{
      // if(a.account==null) a.account=''
      // if(b.account==null) b.account=''
      let resultCompare =0;
      resultCompare= a.dateDone.getTime() - b.dateDone.getTime()
      if(resultCompare==0) resultCompare = (a.account.localeCompare(b.account))
      return resultCompare
    })
    else reports.sort((b,a)=>{
      // if(a.account==null) a.account=''
      // if(b.account==null) b.account=''
      let resultCompare =0;
      resultCompare= a.dateDone.getTime() - b.dateDone.getTime()
      if(resultCompare==0) resultCompare = (a.account.localeCompare(b.account))
      return resultCompare
    })
    this.sortAsc=!this.sortAsc
  }
  sortByContact(reports:Array<ReportSeller>){
    if(this.sortAsc) reports.sort((a,b)=>{
      if(a.contact==null) a.contact=''
      if(b.contact==null) b.contact=''
      let resultCompare =0;
      resultCompare= a.contact.localeCompare(b.contact)
      if(resultCompare==0) resultCompare = (a.id-b.id)
      return resultCompare
    })
    else reports.sort((b,a)=>{
      if(a.contact==null) a.contact=''
      if(b.contact==null) b.contact=''
      let resultCompare =0;
      resultCompare= a.contact.localeCompare(b.contact)
      if(resultCompare==0) resultCompare = (a.id-b.id)
      return resultCompare
    })
    this.sortAsc=!this.sortAsc
  }
  sortByCompany(reports:Array<ReportSeller>){
    if(this.sortAsc) reports.sort((a,b)=>{
      if(a.company==null) a.company=''
      if(b.company==null) b.company=''
      let resultCompare =0;
      resultCompare= a.company.localeCompare(b.company)
      if(resultCompare==0) resultCompare = (a.id-b.id)
      return resultCompare
    })
    else reports.sort((b,a)=>{
      if(a.company==null) a.company=''
      if(b.company==null) b.company=''
      let resultCompare =0;
      resultCompare= a.company.localeCompare(b.company)
      if(resultCompare==0) resultCompare = (a.id-b.id)
      return resultCompare
    })
    this.sortAsc=!this.sortAsc
  }
  // build rapport from line text
  buildRapport(line:string){
    let rapport = new Rapport()
    rapport.compte = line.substr(0, 20).trim()
    rapport.type = line.substr(20, 11).trim()
    rapport.date = line.substr(31, 15).trim()
    rapport.compagnie = line.substr(46, 38).trim()
    rapport.contact = line.substr(84, 33).trim()
    rapport.telephone = line.substr(117, 18).trim()
    rapport.km = line.substr(135, 7).trim()
    // rapport.suivi = line.substr(142).trim()
    rapport.suivi = line.substring(142).trim()
    // console.log('rapport: ' + rapport.compte+' - '+rapport.type+' - '+rapport.date+' - '+rapport.compagnie+' - '+rapport.contact+' - '+rapport.telephone+' - '+rapport.km+' - '+rapport.suivi)
    return rapport;
  }

  // printReport(){
  //   alert("This is Print Reports' button ")
  // }
  printReport(cmpId){
    const printContent = document.getElementById(cmpId);
    //const WindowPrt = window.open('','','left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    const WindowPrt = window.open();
    WindowPrt.document.write('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
    /*
    let printContents = document.getElementById(cmpId).innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;

    window.print();
    document.body.innerHTML=originalContents;//*/
  }
  
}
 
class Rapport{
  compte=''
  type=''
  date=''
  compagnie=''
  contact=''
  telephone=''
  km=''
  suivi=''
}