import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chauffeur } from 'src/model/model.chauffeur';
import { DriverLicense } from 'src/model/model.driverLicense';
import { EmailMessage } from 'src/model/model.emailMessage';
import { FileLogBook } from 'src/model/model.fileLogBook';
import { History } from 'src/model/model.history';
import { BankClientsService } from 'src/services/bankClients.service';
import { ChauffeursService } from 'src/services/chauffeurs.service';
import { DriverLicenseService } from 'src/services/driverLicense.service';
import { FileLogBookService } from 'src/services/fileLogBook.service';
import { HistoriesService } from 'src/services/histories.service';
import { VarsGlobal } from 'src/services/VarsGlobal';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css']
})
export class DriverComponent implements OnInit {

  constructor(
    public activatedRoute:ActivatedRoute,
    public chauffeursService:ChauffeursService, public router:Router,
    public varsGlobal:VarsGlobal,
    public driverLicenseService:DriverLicenseService, public historiesService:HistoriesService,
    public bankClientsService:BankClientsService, public fileLogBookService:FileLogBookService
    ) 
  {
    this.id=activatedRoute.snapshot.params['id'];
  }

  id:number //=22539;
  driver:Chauffeur = new Chauffeur();
  histories:Array<History>=[]
  addHistory:History=new History()
  driverLicenses:Array<DriverLicense>=[]
  validityLicenses:Array<DriverLicense>=[]
  addDriverLicense:DriverLicense=new DriverLicense()
  showReport=3; // 3 evenement, 1 permis, 2 validite, 4 Memo, 5 LogBooks
  today = new Date();

  ngOnInit(){
    // let chauffeursService:ChauffeursService;
    this.chauffeursService.getDetailChauffeur(this.id).subscribe((data:Chauffeur)=>{
      this.driver=data;
      if(this.driver.entryDateText!=null && this.driver.entryDateText.length>7) this.driver.entryDate = this.stringToDate(this.driver.entryDateText)
      if(this.driver.lastDateText!=null && this.driver.lastDateText.length>7) this.driver.lastDate = this.stringToDate(this.driver.lastDateText)
      this.driverLicenseService.driverLicensesOfOwner(this.driver.id).subscribe((data:Array<DriverLicense>)=>{
        if(data!=null){
          data.forEach((dl)=>{
            if(dl.dateExpirationText!=null && dl.dateExpirationText.length>7) dl.dateExpiration = this.stringToDate(dl.dateExpirationText)
            if(dl.dateIssuedText!=null && dl.dateIssuedText.length>7) dl.datedateIssued = this.stringToDate(dl.dateIssuedText)
            if(dl.theValidity==null || !dl.theValidity){
              this.driverLicenses.push(dl)
            }else{
              this.validityLicenses.push(dl)
            }
          })
          this.driverLicenses.sort((b,a)=>{
            return new Date(a.dateExpiration).getTime() - new Date(b.dateExpiration).getTime()
          })
          this.validityLicenses.sort((b,a)=>{
            return new Date(a.datedateIssued).getTime() - new Date(b.datedateIssued).getTime()
          })
        } 
      }, err=>{console.log(err)})
      this.historiesService.historiesOfOwner(this.driver.id).subscribe((data:Array<History>)=>{
        // if(data!=null) this.historiesMaster=this.histories=data.sort((b,a)=>{
        //   return new Date(a.dateDone).getTime() - new Date(b.dateDone).getTime()
        // })
        if(data!=null){
          data.forEach((h)=>{
            if(h.dateDoneText!=null && h.dateDoneText.length>7) h.dateDone = this.stringToDate(h.dateDoneText)
          })
          this.historiesMaster=this.histories=data.filter(x=>(x.memo==null || !x.memo)).sort((b,a)=>{
            let compare = new Date(a.dateDone).getTime() - new Date(b.dateDone).getTime()
            if(compare==0) compare = a.id - b.id
            return  compare
          })
          this.memosMaster=this.memos=data.filter(x=>(x.memo!=null && x.memo)).sort((b,a)=>{
            let compare = new Date(a.dateDone).getTime() - new Date(b.dateDone).getTime()
            if(compare==0) compare = a.id - b.id
            return  compare
          })
        }

        this.buildListDate();
        this.buildListDateMemo();
      }, err=>{console.log(err)})
    }, err=>{console.log(err)})
  }

  onDeleteChauffeur(){
    let r = confirm('Supprimer ' +this.driver.prenom.toLocaleUpperCase() + ' ' +this.driver.nom.toLocaleUpperCase() + ' ? ')
    if(r){
      this.chauffeursService.deleteChauffeur(this.driver.id).subscribe((data:Chauffeur)=>{
        alert("Chauffeur : "+this.driver.prenom.toLocaleUpperCase() + ' ' +this.driver.nom.toLocaleUpperCase()+" a ete supprime.");
        this.driverLicenses.forEach(dl=>{
          this.driverLicenseService.deleteDriverLicense(dl.id).subscribe();
        })
        this.histories.forEach(h=>{
          this.historiesService.deleteHistory(h.id).subscribe();
        })
        this.router.navigateByUrl('/chauffeurs', {skipLocationChange: true})
      }, err=>{
        console.log(err);
      });
    }
  }

  // build listDate
  buildListDate(){
    this.listDate = []
    this.listDateText = []
    this.historiesMaster.forEach(h=>{
      if(!this.listDateText.includes(h.dateDoneText)){
        this.listDateText.push(h.dateDoneText)
        this.listDate.push(h.dateDone)
      }
    })
    this.listDate.sort((b,a)=>{return new Date(a).getTime() - new Date(b).getTime()})
  }

  onAddHistory(){
    this.addHistory.idOwner=this.driver.id
    // if(!this.listDate.includes(this.addHistory.dateDone)){
    //   this.listDate.push(this.addHistory.dateDone)
    // }
    this.historiesService.saveHistory(this.addHistory).subscribe((h:History)=>{
      h.dateDone = this.stringToDate(h.dateDoneText)  // modify date once more time to use getDateLocal
      this.addHistory=h
      this.historiesMaster.push(this.addHistory)  // here will be added the saving in database
      this.historiesMaster.sort((b,a)=>{
        let compare = new Date(a.dateDone).getTime() - new Date(b.dateDone).getTime()
        if(compare==0) compare = a.id - b.id
        return  compare
      })
      this.dateFilter=null
      this.histories=this.historiesMaster
      this.addHistory=new History()
      this.buildListDate()
    }, err=>{console.log(err)})
    
  }

  showImgUrl=""
  onShowImg(showImgUrl:string){
    // if(this.showImgUrl.length==0){
      this.showImgUrl=showImgUrl
    // }
    // else this.showImgUrl=""
  }

  // frontFileName=''
  // backFileName=''
  onAddDriverLicense(){
    
    this.addDriverLicense.idOwner=this.driver.id

    this.driverLicenseService.saveDriverLicense(this.addDriverLicense).subscribe((dl:DriverLicense)=>{
      this.addDriverLicense.id = dl.id
      this.driverLicenses.push(this.addDriverLicense) 
      this.driverLicenses.sort((b,a)=>{
        return new Date(a.dateExpiration).getTime() - new Date(b.dateExpiration).getTime()
      })
      this.addDriverLicense=new DriverLicense()
    }, err=>{console.log(err)})
  }
  onLicense(){
    this.showReport=1; 
    this.addDriverLicense=new DriverLicense();
  }
  onValidity(){
    this.showReport=2; 
    this.addDriverLicense=new DriverLicense();
  }
  onMemo(){
    this.showReport=4; 
    this.addDriverLicense=new DriverLicense();
  }
  
  findingLogBook=false; // set false when finished finding, set true before enter in finding logBook
  onLogBooks(){
    this.showReport=5
    // find logbooks
    // this.fileLogBookService.fileLogBookOfOwner(this.id).subscribe((data:Array<FileLogBook>)=>{
    //   if(data!=null){
    //     data.sort((b,a)=>{
    //       let temp = new Date(a.dateLog).getTime() - new Date(b.dateLog).getTime()
    //       if(temp==0 && a.startTime.length>0 && b.startTime.length>0){
    //         temp=a.startTime.localeCompare(b.startTime)
    //       }
    //       if(temp==0){
    //         temp = a.id -b.id
    //       }
    //       return temp;
    //     })
    //     this.logBooks=data
    //   }
    // })

    // find and page
    this.findingLogBook=true
    this.pageLogBooks.content=[]
    this.fileLogBookService.getFileLogBookByOwner(this.id, this.currentPage, this.size).subscribe((data:PageFileLogBook)=>{
      this.pageLogBooks=data;
      // sort list of logBooks
      this.pageLogBooks.content.sort((b,a)=>{
        let temp = new Date(a.dateLog).getTime() - new Date(b.dateLog).getTime()
        if(temp==0 && a.startTime.length>0 && b.startTime.length>0){
          temp=a.startTime.localeCompare(b.startTime)
        }
        if(temp==0){
          temp = a.id -b.id
        }
        return temp;
      })
      //
      this.pages=new Array(data.totalPages);
      this.findingLogBook=false
    }, err=>{
      console.log(err);
    })
  }
  gotoPage(i:number){
    this.dateFindLog=null;
    this.currentPage=i;
    this.onLogBooks();
  }
  onAddLicenseValidity(){    
    this.addDriverLicense.theValidity=true; // to set this is paper validity
    this.addDriverLicense.idOwner=this.driver.id
    this.driverLicenseService.saveDriverLicense(this.addDriverLicense).subscribe((vl:DriverLicense)=>{
      this.addDriverLicense.id = vl.id
      this.validityLicenses.push(this.addDriverLicense) 
      this.validityLicenses.sort((b,a)=>{
        return new Date(a.datedateIssued).getTime() - new Date(b.datedateIssued).getTime()
      })
      this.addDriverLicense=new DriverLicense()
    }, err=>{console.log(err)})
  }

  testfunction(){
    alert('Hi, this is test, it works well !')
  }
  
  onDelHistory(h:History, index:number){
    this.historiesService.deleteHistory(h.id).subscribe(()=>{
      this.histories.splice(index, 1)
      // this.historiesMaster.splice(this.historiesMaster.indexOf(h),1)
      this.buildListDate()
    }, err=>{console.log(err)})
  }
  
  em:EmailMessage=new EmailMessage();
  onSendingEmail(driver:Chauffeur, history:History){
    if(driver.email!=null && driver.email.length>8 && driver.email.includes('@')){
      this.em.emailDest= this.driver.email; 

      if(this.varsGlobal.language.includes('English'))
        this.em.titre= "Evenement: " + this.dateToDdMmmyyyy(history.dateDone) //history.dateDone.toLocaleDateString()
          //history.dateDoneText  
      else this.em.titre= "Evenement: " + this.dateToDdMmmyyyy(history.dateDone) //history.dateDone.toLocaleDateString() 
          //history.dateDoneText 

      this.em.content='<div><p> '+  history.note + " <br><br> Dispatch, " + 
      " <br>"+localStorage.getItem('entrepriseNom').toUpperCase() + 
      " <br>" + localStorage.getItem('tel') + " " + localStorage.getItem('email') +
      " </p></div>"

      this.bankClientsService.envoyerMail(this.em).subscribe(data=>{
        if(this.varsGlobal.language.includes('Francais')) alert("Email a ete envoye.")
        if(this.varsGlobal.language.includes('English')) alert("Email was sent.")
        // after sent history, we must modify the status and save it 
        history.sent=true
        this.historiesService.saveHistory(history).subscribe(()=>{}, err=>{console.log(err)})
      }, err=>{
        if(this.varsGlobal.language.includes('Francais')) alert("Email n'a pas ete envoye. Re-essayez, svp")
        if(this.varsGlobal.language.includes('English')) alert("Email couldn't be sent. Try again, please")
        console.log(err)
      })
    }
    else {
      if(this.varsGlobal.language.includes('Francais')){
        alert("Il n'y a pas email adresse.")  
      }
      else{
        alert("There isn't email address.")  
      }
    }
  }

  onSendingHistory(history:History){
    this.onSendingEmail(this.driver, history)
  }

  onDelDriverLicense(dl:DriverLicense, index:number){
    if(dl.id!=null && dl.id>0) this.driverLicenseService.deleteDriverLicense(dl.id).subscribe(()=>{}, err=>{console.log(err)})
    this.driverLicenses.splice(index, 1)
  }

  onDelValidityLicense(vl:DriverLicense, index:number){
    if(vl.id!=null && vl.id>0) this.driverLicenseService.deleteDriverLicense(vl.id).subscribe(()=>{}, err=>{console.log(err)})
    this.validityLicenses.splice(index, 1)
  }

  onFileUpLoadFront(event, dr:DriverLicense){
    let selectedFile : File=event.target.files[0];
    if(selectedFile){
      const reader = new FileReader();
      reader.onload = ()=>{
        dr.imgFront=reader.result.toString();
      }
      reader.readAsDataURL(selectedFile)
    }
    else dr.imgFront='';
  }
  onFileUpLoadBack(event, dr:DriverLicense){
    let selectedFile : File=event.target.files[0];
    if(selectedFile){
      const reader = new FileReader();
      reader.onload = ()=>{
        dr.imgBack=reader.result.toString();
      }
      reader.readAsDataURL(selectedFile)
    }
    else dr.imgBack='';
  }
  onModifyDriver(){
    // let chauffeursService:ChauffeursService
    // here we need date to text
    // if(this.driver.entryDate!=null) this.driver.entryDateText= this.driver.entryDate.getUTCFullYear().toString()+'-'+
    // (this.driver.entryDate.getUTCMonth()+1).toString()+'-'+this.driver.entryDate.getUTCDate().toString()
    // if(this.driver.lastDate!=null) this.driver.lastDateText= this.driver.lastDate.getUTCFullYear().toString()+'-'+
    // (this.driver.lastDate.getUTCMonth()+1).toString()+'-'+this.driver.lastDate.getUTCDate().toString()
    console.log('Before modify driver, test date entry and last')
    console.log('this.driver.entryDateText: '+this.driver.entryDateText)
    console.log('this.driver.lastDateText: '+this.driver.lastDateText)
    this.chauffeursService.saveChauffeurs(this.driver).subscribe((data:Chauffeur)=>{
      alert("Ok")
    }, err=>{console.log(err)})    
  }

  onStatut(dr:DriverLicense){
    let statut=''
    let today = new Date()
    if((today.getTime() - new Date(dr.dateExpiration).getTime()) >=0 ) return statut="Expiration"
    else return statut="Valid"
  }
  codeCouleurStatut(dr:DriverLicense){
    let date = new Date();
    let days = (new Date(dr.dateExpiration).getTime() - date.getTime())/24/60/60/1000;
    if (days>30)
      return "btn-success";
    else if (days>0 && days<=30)
      return "btn-warning";
    else return ""
  }

  historiesMaster:Array<History>=[]
  dateFilter:Date
  dateFilterChange(dateFilter:Date){
    if(dateFilter==null) this.histories= this.historiesMaster
    else this.histories= this.historiesMaster.filter(x=>(
        new Date(x.dateDone).getTime()==new Date(dateFilter).getTime()
      ))
    this.histories= this.histories.sort((b,a)=>{
      let compare = new Date(a.dateDone).getTime() - new Date(b.dateDone).getTime()
        if(compare==0) compare = a.id - b.id
        return  compare
    })
    // this.historiesMaster.sort((b,a)=>{
    //   return new Date(a.dateDone).getTime() - new Date(b.dateDone).getTime()
    // })
  }

  listDate : Array<Date>=[]
  listDateText : Array<string>=[]
  // stringToDateFromReport(reportSeller:ReportSeller){
  //   reportSeller.dateDone = new Date(this.yyyymmddToMmddyyyy(reportSeller.dateDoneText)); //+" | yyyy-mm-dd"        
  //   if(!this.listAccount.includes(reportSeller.account)){
  //     this.listAccount.push(reportSeller.account)
  //   }
  //   if(!this.listDateText.includes(reportSeller.dateDoneText)){
  //     this.listDateText.push(reportSeller.dateDoneText)
  //     this.listDate.push(reportSeller.dateDone)
  //   }
  //   if(!this.listCompany.includes(reportSeller.company)){
  //     this.listCompany.push(reportSeller.company)
  //   }
  //   if(!this.listContact.includes(reportSeller.contact)){
  //     this.listContact.push(reportSeller.contact)
  //   }
  //   return reportSeller.dateDone
  // }

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

  // Date to dd mmm yyyy
  public dateToDdMmmyyyy(date:Date){
    date = new Date(date)
    console.log('DateToMmddyyyy begin')
    let mmddyyyy:string=''
    let ddmmyyyy:string=''
    let dd:string=date.getUTCDate().toString()
    console.log('date.getUTCHours(): '+date.getUTCHours())
    if(dd.length<2) dd='0'+dd
    console.log('dd: ' + dd)
    let mm:string=(date.getUTCMonth()+1).toString()  // month always + 1 
    if(mm.length<2) mm='0'+mm
    console.log('mm: ' + mm)
    let yyyy:string=date.getFullYear().toString()
    console.log('yyyy: ' + yyyy)
    
    // mmddyyyy=mm+'-'+dd+'-'+yyyy
    mm=this.mmToMmm(mm)
    ddmmyyyy=dd+'-'+mm+'-'+yyyy
    console.log('mmddyyyy: ' + mmddyyyy)
    return ddmmyyyy;
  }
  mmToMmm(mm:string){
    if(mm.includes('01')) return 'Jan'
    if(mm.includes('02')) return 'Feb'
    if(mm.includes('03')) return 'Mar'
    if(mm.includes('04')) return 'Apr'
    if(mm.includes('05')) return 'May'
    if(mm.includes('06')) return 'Jun'
    if(mm.includes('07')) return 'Jul'
    if(mm.includes('08')) return 'Aug'
    if(mm.includes('09')) return 'Sep'
    if(mm.includes('10')) return 'Oct'
    if(mm.includes('11')) return 'Nov'
    if(mm.includes('12')) return 'Dec'
    return ''
  }
  // today=new Date();
  pickDateChange(event, dt:Date, dateText:string){
    dt= new Date(this.dateToMmddyyyy(event.target.value));
    if(dt!=null) dateText= dt.getUTCFullYear().toString()+'-'+
    (dt.getUTCMonth()+1).toString()+'-'+dt.getUTCDate().toString()
    console.log("dateText: " + dateText)
  }
  onEntryDateChange(event){    
    // console.log('entryDate - event.target.value' + event.target.value)
    // console.log('entryDate - event.target.value toString' + event.target.value.toString())
    let d:Date =  new Date(event.target.value)
    if(d instanceof Date && !isNaN(d.getTime())){
    // if(new Date(event.target.value) instanceof Date){ // && !isNaN(event.target.value)
      this.driver.entryDate= d //new Date(event.target.value) //new Date(this.dateToMmddyyyy(event.target.value));
      this.driver.entryDateText= this.driver.entryDate.getUTCFullYear().toString()+'-'+
        (this.driver.entryDate.getUTCMonth()+1).toString()+'-'+this.driver.entryDate.getUTCDate().toString()
      console.log("driver.entryDate: " + this.driver.entryDate.toDateString())
      console.log("driver.entryDateText: " + this.driver.entryDateText)
      this.driver.entryDate = this.stringToDate(this.driver.entryDateText)
      console.log("driver.entryDateText - after: " + this.driver.entryDateText)
    } 
    else{
      this.driver.entryDate= null
      this.driver.entryDateText=""
    }
  }
  onLastDateChange(event){  
    // console.log('lastDate - event.target.value' + event.target.value)
    // console.log('lastDate - event.target.value toString' + event.target.value.toString()) 
    let d:Date =  new Date(event.target.value)
    if(d instanceof Date && !isNaN(d.getTime())){ //
      this.driver.lastDate= d //new Date(event.target.value)// new Date(this.dateToMmddyyyy(event.target.value));
      this.driver.lastDateText= this.driver.lastDate.getUTCFullYear().toString()+'-'+
        (this.driver.lastDate.getUTCMonth()+1).toString()+'-'+this.driver.lastDate.getUTCDate().toString()
      console.log("driver.lastDate: " + this.driver.lastDate.toDateString())
      console.log("driver.lastDateText: " + this.driver.lastDateText)
      this.driver.lastDate = this.stringToDate(this.driver.lastDateText)
      console.log("driver.lastDateText - after: " + this.driver.lastDateText)
    } 
    else{
      this.driver.lastDate=null
      this.driver.lastDateText=""
    }
  }

  onDateExpirationChange(event){  
    let d:Date =  new Date(event.target.value)
    if(d instanceof Date && !isNaN(d.getTime())){ //
      this.addDriverLicense.dateExpiration= d 
      this.addDriverLicense.dateExpirationText= this.addDriverLicense.dateExpiration.getUTCFullYear().toString()+'-'+
        (this.addDriverLicense.dateExpiration.getUTCMonth()+1).toString()+'-'+this.addDriverLicense.dateExpiration.getUTCDate().toString()
      this.addDriverLicense.dateExpiration = this.stringToDate(this.addDriverLicense.dateExpirationText)
    } 
    else{
      this.addDriverLicense.dateExpiration=null
      this.addDriverLicense.dateExpirationText=""
    }
  }

  onDatedateIssuedChange(event){  
    let d:Date =  new Date(event.target.value)
    if(d instanceof Date && !isNaN(d.getTime())){ //
      this.addDriverLicense.datedateIssued= d 
      this.addDriverLicense.dateIssuedText= this.addDriverLicense.datedateIssued.getUTCFullYear().toString()+'-'+
        (this.addDriverLicense.datedateIssued.getUTCMonth()+1).toString()+'-'+this.addDriverLicense.datedateIssued.getUTCDate().toString()
      this.addDriverLicense.datedateIssued = this.stringToDate(this.addDriverLicense.dateIssuedText)
    } 
    else{
      this.addDriverLicense.datedateIssued=null
      this.addDriverLicense.dateIssuedText=""
    }
  }

  onDateDoneChange(event){  
    let d:Date =  new Date(event.target.value)
    if(d instanceof Date && !isNaN(d.getTime())){ //
      this.addHistory.dateDone= d 
      this.addHistory.dateDoneText= this.addHistory.dateDone.getUTCFullYear().toString()+'-'+
        (this.addHistory.dateDone.getUTCMonth()+1).toString()+'-'+this.addHistory.dateDone.getUTCDate().toString()
      this.addHistory.dateDone = this.stringToDate(this.addHistory.dateDoneText)
    } 
    else{
      this.addHistory.dateDone=null
      this.addHistory.dateDoneText=""
    }
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
    let d=new Date();
    // timeZone offset in minute
    let timeZone=d.getTimezoneOffset() +60 // +60 cause time sumer vs winter     
    let dd:string=''
    let mm:string=''
    let yyyy:string=''
    let arrayStr = dateDoneText.trim().split('-')
    dd=arrayStr[2]; //console.log('dd: ' + dd)
    mm=arrayStr[1]; //console.log('mm: ' + mm)
    yyyy=arrayStr[0]; //console.log('yyyy: ' + yyyy)
    d = new Date(new Date(dateDoneText).getTime() + timeZone*60*1000);
    d.setDate(Number(dd));
    d.setMonth(Number(mm)-1);
    d.setFullYear(Number(yyyy));
    // console.log('date after set manual: ' + d.toString())
    return d;
    // return new Date(new Date(dateDoneText).getTime() + timeZone*60*1000);
  }

  resumeDriver(ch:Chauffeur){
    let r = confirm('Reprendre '+ch.prenom.toLocaleUpperCase()+' '+ch.nom.toLocaleUpperCase() + ' ?')
    if(r){
      ch.archive=false;
      ch.entryDate=null
      ch.entryDateText=''
      ch.lastDate=null
      ch.lastDateText=''
      this.chauffeursService.saveChauffeurs(ch).subscribe((data:Chauffeur)=>{}, err=>{console.log(err);});
    }
  }
  
  archiveDriver(ch:Chauffeur){
    let r = confirm('Archive '+ch.prenom.toLocaleUpperCase()+' '+ch.nom.toLocaleUpperCase() + ' ?')
    if(r){
      ch.archive=true;
      this.chauffeursService.saveChauffeurs(ch).subscribe((data:Chauffeur)=>{}, err=>{console.log(err);});
    }
  }

  // begin of memo
  memosMaster:Array<History>=[]
  memoDateFilter:Date
  memos:Array<History>=[]
  addMemo:History=new History()
  listDateMemo : Array<Date>=[]
  listDateTextMemo : Array<string>=[]
  
  // onDateDoneChange(
  onMemoDateDoneChange(event){  
    let d:Date =  new Date(event.target.value)
    if(d instanceof Date && !isNaN(d.getTime())){ //
      this.addMemo.dateDone= d 
      this.addMemo.dateDoneText= this.addMemo.dateDone.getUTCFullYear().toString()+'-'+
        (this.addMemo.dateDone.getUTCMonth()+1).toString()+'-'+this.addMemo.dateDone.getUTCDate().toString()
      this.addMemo.dateDone = this.stringToDate(this.addMemo.dateDoneText)
    } 
    else{
      this.addMemo.dateDone=null
      this.addMemo.dateDoneText=""
    }
  }
    
  // onAddHistory()
  onAddMemo(){
    this.addMemo.memo=true; // memo must be true to confirm this is memo
    this.addMemo.idOwner=this.driver.id
    this.historiesService.saveHistory(this.addMemo).subscribe((h:History)=>{
      h.dateDone = this.stringToDate(h.dateDoneText)  // modify date once more time to use getDateLocal
      this.addMemo=h
      this.memosMaster.push(this.addMemo)  // here will be added the saving in database
      this.memosMaster.sort((b,a)=>{
        let compare = new Date(a.dateDone).getTime() - new Date(b.dateDone).getTime()
        if(compare==0) compare = a.id - b.id
        return  compare
      })
      this.memoDateFilter=null
      this.memos=this.memosMaster
      this.addMemo=new History()
      this.buildListDateMemo()
    }, err=>{console.log(err)})
    
  }
  // buildListDate()
  buildListDateMemo(){
    this.listDateMemo = []
    this.listDateTextMemo = []
    this.memosMaster.forEach(h=>{
      if(!this.listDateTextMemo.includes(h.dateDoneText)){
        this.listDateTextMemo.push(h.dateDoneText)
        this.listDateMemo.push(h.dateDone)
      }
    })
    this.listDate.sort((b,a)=>{return new Date(a).getTime() - new Date(b).getTime()})
  }
  // dateFilterChange(dateFilter)
  dateMemoFilterChange(dateFilter:Date){
    if(dateFilter==null) this.memos= this.memosMaster
    else this.memos= this.memosMaster.filter(x=>(
        new Date(x.dateDone).getTime()==new Date(dateFilter).getTime()
      ))
    this.memos= this.memos.sort((b,a)=>{
      let compare = new Date(a.dateDone).getTime() - new Date(b.dateDone).getTime()
        if(compare==0) compare = a.id - b.id
        return  compare
    })
  }

  // let dt of listDateMemo
  // let history of memos

  // onSendingHistory(history)
  onSendingMemo(history:History){
    this.onSendingEmailMemo(this.driver, history)
  }
  emMemo:EmailMessage=new EmailMessage();
  onSendingEmailMemo(driver:Chauffeur, memo:History){
    if(driver.email!=null && driver.email.length>8 && driver.email.includes('@')){
      this.emMemo.emailDest= this.driver.email; 

      if(this.varsGlobal.language.includes('English'))
        this.emMemo.titre= "Memo: " + this.dateToDdMmmyyyy(memo.dateDone) //memo.dateDone.toLocaleDateString()
          //history.dateDoneText  
      else this.emMemo.titre= "Memo: " + this.dateToDdMmmyyyy(memo.dateDone) //memo.dateDone.toLocaleDateString() 
          //history.dateDoneText 

      this.emMemo.content='<div><p> '+  memo.note + " <br><br> Dispatch, " + 
      " <br>"+localStorage.getItem('entrepriseNom').toUpperCase() + 
      " <br>" + localStorage.getItem('tel') + " " + localStorage.getItem('email') +
      " </p></div>"

      this.bankClientsService.envoyerMail(this.emMemo).subscribe(data=>{
        if(this.varsGlobal.language.includes('Francais')) alert("Email a ete envoye.")
        if(this.varsGlobal.language.includes('English')) alert("Email was sent.")
        // after sent history, we must modify the status and save it 
        memo.sent=true
        this.historiesService.saveHistory(memo).subscribe(()=>{}, err=>{console.log(err)})
      }, err=>{
        if(this.varsGlobal.language.includes('Francais')) alert("Email n'a pas ete envoye. Re-essayez, svp")
        if(this.varsGlobal.language.includes('English')) alert("Email couldn't be sent. Try again, please")
        console.log(err)
      })
    }
    else {
      if(this.varsGlobal.language.includes('Francais')){
        alert("Il n'y a pas email adresse.")  
      }
      else{
        alert("There isn't email address.")  
      }
    }
  }
  // onDelHistory(history, i)
  onDelMemo(m:History, index:number){
    this.historiesService.deleteHistory(m.id).subscribe(()=>{
      this.memos.splice(index, 1)
      this.buildListDateMemo()
    }, err=>{console.log(err)})
  }

  // end of memo
  
  // begin for LogBooks
  testRowspan=2
  logBook:FileLogBook = new FileLogBook()
  logBooks:Array<FileLogBook>=[]
  onAddLogBook(){
    if(this.validTimeOut()){
      // console.log('Hi from onAddLogBook()')
      this.logBook.idOwner=this.id
      // save logBook and then update list logBooks and initial logBook
      this.fileLogBookService.saveFileLogBook(this.logBook).subscribe((data:FileLogBook)=>{
        // this.logBook.id = data.id
        this.logBooks.push(this.logBook)
        this.pageLogBooks.content.push(this.logBook)
        // this.logBooks
        this.pageLogBooks.content.sort((b,a)=>{
          let temp = new Date(a.dateLog).getTime() - new Date(b.dateLog).getTime()
          if(temp==0 && a.startTime.length>0 && b.startTime.length>0){
            temp=a.startTime.localeCompare(b.startTime)
          }
          if(temp==0){
            temp = a.id -b.id
          }
          return temp;
        })
        this.logBook = new FileLogBook()
      }, err=>{console.log(err)})
    }    
  }
  onDelLogBook(lb:FileLogBook){
    // console.log('lb.id: '+lb.id)
    this.fileLogBookService.deleteFileLogBook(lb.id).subscribe(()=>{
      // this.logBooks
      this.pageLogBooks.content.splice(this.pageLogBooks.content.indexOf(lb), 1)
      // this.logBooks
      this.pageLogBooks.content.sort((b,a)=>{
        let temp = new Date(a.dateLog).getTime() - new Date(b.dateLog).getTime()
        if(temp==0 && a.startTime.length>0 && b.startTime.length>0){
          temp=a.startTime.localeCompare(b.startTime)
        }
        if(temp==0){
          temp = a.id -b.id
        }
        return temp;
      })
      // console.log('lenght of logBooks after del lb: ' + this.logBooks.length)
    }, err=>{console.log(err)})
  }
  dateLogBookChange(event){
    this.logBook.dateLogText=event.target.value
  }
  findLogBookLoop(firstPage:number, lbs:Array<FileLogBook>){
    // let firstPage=0
    this.findingLogBook=true
    this.fileLogBookService.getFileLogBookByOwner(this.id, firstPage, this.size).subscribe((data:PageFileLogBook)=>{
      firstPage=firstPage+1
      data.content.forEach((fl)=>{
        if(fl.dateLogText.includes(this.dateLogTextFind)){
          lbs.push(fl)
          this.currentPage=0
        }
      })
      
      // console.log('data.content[last].dateLogText: '+data.content[data.content.length-1].dateLogText)
      if(firstPage<this.pages.length && this.dateLogTextFind.localeCompare(data.content[this.size-1].dateLogText)<=0){
        // && 0<=lbs.length && lbs.length<this.size 
      //   && this.dateLogTextFind.localeCompare(data.content[this.size-1].dateLogText)<=0){
        console.log('this.dateLogTextFind: '+this.dateLogTextFind)
        console.log('data.content[this.size-1].dateLogText: '+data.content[this.size-1].dateLogText)
        this.findLogBookLoop(firstPage, lbs)
      }
      this.findingLogBook=false
      // else{
      //   return
      // }
    }, err=>{
      console.log(err);
    })
  }
  dateLogTextFind=''
  dateLogBookFind(event){
    this.dateLogTextFind=event.target.value
    if(this.dateLogTextFind !=null || this.dateLogTextFind.length==0){
      let tempContent=this.pageLogBooks.content
      this.pageLogBooks.content=[]
      this.findLogBookLoop(0, this.pageLogBooks.content)
    }
    
    // console.log('pages length: ' + this.pages.length)
    // this.pages.forEach(page=>{
    //   console.log('page: ' +page)
    
      // this.fileLogBookService.getFileLogBookByOwner(this.id, 0, this.size).subscribe((data:PageFileLogBook)=>{
      //   // firstPage=firstPage+1
      //   data.content.forEach((fl)=>{
      //     if(fl.dateLogText.includes(this.dateLogTextFind)){
      //       this.pageLogBooks.content.push(fl)
      //     }
      //   })
      // }, err=>{
      //   console.log(err);
      // })

    // })
    // this.fileLogBookService.getFileLogBookByOwner(this.id, firstPage, this.size).subscribe((data:PageFileLogBook)=>{
    //   firstPage=firstPage+1
    //   data.content.forEach((fl)=>{
    //     if(fl.dateLogText.includes(this.dateLogTextFind)){
    //       this.pageLogBooks.content.push(fl)
    //     }
    //   })
    //   // this.pageLogBooks=data;
    //   // if (this.pageLogBooks.content.length>0) this.pageLogBooks.content.sort((b,a)=>{
    //   //   let temp = new Date(a.dateLog).getTime() - new Date(b.dateLog).getTime()
    //   //   if(temp==0 && a.startTime.length>0 && b.startTime.length>0){
    //   //     temp=a.startTime.localeCompare(b.startTime)
    //   //   }
    //   //   if(temp==0){
    //   //     temp = a.id -b.id
    //   //   }
    //   //   return temp;
    //   // })
    //   //
    //   // this.pages=new Array(data.totalPages);
    // }, err=>{
    //   console.log(err);
    // })
  }
  dateFindLog:Date
  // dateFindLogText=''
  // dateFindLogBookChange(event){
  //   this.dateFindLogText=event.target.value
  //   console.log('dateFindLogText: '+this.dateFindLogText)
  //   // and then find logBooks by this date
  // }
  onFileLogBook(event){
    let selectedFile : File=event.target.files[0];
    let size : number; // = selectedFile.size
    let filenameInLoweCase=''
    if(selectedFile){
      size = selectedFile.size
      filenameInLoweCase = selectedFile.name.toLowerCase()
    }    
    if(selectedFile && size<26000000 && 
        (filenameInLoweCase.includes(".pdf") || 
        filenameInLoweCase.includes(".png") ||
        filenameInLoweCase.includes(".gif") ||
        filenameInLoweCase.includes(".jfif") ||
        filenameInLoweCase.includes(".pjeg") ||
        filenameInLoweCase.includes(".jpeg") ||
        filenameInLoweCase.includes(".pjp") ||
        filenameInLoweCase.includes(".jpg")
        )
      ){
      this.logBook.name=selectedFile.name
      const reader = new FileReader();
      reader.onload = ()=>{this.logBook.urlData=reader.result.toString();}
      reader.readAsDataURL(selectedFile)
      // change filename to adapt all browsers
      if(filenameInLoweCase.includes(".pdf")){
        this.logBook.name="logBook_"+this.logBook.dateLogText+'_'+this.logBook.startTime+'-'+this.logBook.endTime+".pdf"
        this.logBook.type=".pdf"
      }
      if(filenameInLoweCase.includes(".png")){
        this.logBook.name="logBook_"+this.logBook.dateLogText+'_'+this.logBook.startTime+'-'+this.logBook.endTime+".png"
        this.logBook.type=".png"
      }
      if(filenameInLoweCase.includes(".gif")){
        this.logBook.name="logBook_"+this.logBook.dateLogText+'_'+this.logBook.startTime+'-'+this.logBook.endTime+".gif"
        this.logBook.type="gif"
      }
      if(filenameInLoweCase.includes(".jfif")){
        this.logBook.name="logBook_"+this.logBook.dateLogText+'_'+this.logBook.startTime+'-'+this.logBook.endTime+".jfif"
        this.logBook.type=".jfif"
      }
      if(filenameInLoweCase.includes(".pjeg")){
        this.logBook.name="logBook_"+this.logBook.dateLogText+'_'+this.logBook.startTime+'-'+this.logBook.endTime+".pjeg"
        this.logBook.type=".pjep"
      }
      if(filenameInLoweCase.includes(".jpeg")){
        this.logBook.name="logBook_"+this.logBook.dateLogText+'_'+this.logBook.startTime+'-'+this.logBook.endTime+".jpeg"
        this.logBook.type=".jpeg"
      }  
      if(filenameInLoweCase.includes(".pjp")){
        this.logBook.name="logBook_"+this.logBook.dateLogText+'_'+this.logBook.startTime+'-'+this.logBook.endTime+".pjp"
        this.logBook.type=".pjp"
      }
      if(filenameInLoweCase.includes(".jpg")){
        this.logBook.name="logBook_"+this.logBook.dateLogText+'_'+this.logBook.startTime+'-'+this.logBook.endTime+".jpg"
        this.logBook.type=".jpg"
      } 
      // end change filename
    }
    else {
      this.logBook.urlData='';
      document.getElementById("logBookAttachment").innerHTML=""
      document.getElementById("logBookAttachment").nodeValue=""
      document.getElementById("logBookAttachment").innerHTML=null
      document.getElementById("logBookAttachment").nodeValue=null
      document.getElementById("logBookAttachment").innerText=""
      event.value = null;
      event = null;
      (<HTMLFormElement>document.getElementById("logBookFormUpload")).reset();
      if(size >= 26000000){ 
        if(this.varsGlobal.language.includes('Francais'))
          alert("Ne pas attacher un fichier plus grand que 25 MB !!!")
        else alert("Can't upload file more than 25 MB !!!")
      }
    }
  }
  downloadAttachment(lb:FileLogBook){
    var link = document.createElement('a');
    link.innerHTML = 'Download file';
    let filename = ''
    filename=lb.name
    link.download = filename//'file.pdf';
    link.href =  lb.urlData;
    // 'data:application/octet-stream;base64,' +
    document.body.appendChild(link);
    link.click();
        setTimeout(function() {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href);  
        }, 0);
  }

  validTimeOut(){    
    if(this.logBook.startTime.length>0 && this.logBook.endTime.length>0){
      if(!this.logBook.nextDay){
        if(this.logBook.startTime.localeCompare(this.logBook.endTime)>0)
        {
          this.logBook.endTime='';
          alert("TimeOut must be greater than TimeIn")
          //this.logBook.endTime='';
          return false
        }
        else{
          // alert("time out greater than time in")
          this.changeFileName(this.logBook.name)
          // this.calculateServiceTime()
          return true;
        }
      }
      else{
        this.changeFileName(this.logBook.name)
        // this.calculateServiceTime()
        return true;
      }
      
    }
  }
  changeFileName(filenameInLoweCase:string){
    if(!this.logBook.nextDay)
      this.logBook.name="logBook_"+this.logBook.dateLogText+':'+this.logBook.startTime+'-'+this.logBook.endTime
    else
      this.logBook.name="logBook_"+this.logBook.dateLogText+':'+this.logBook.startTime+'-nextday-'+this.logBook.endTime
    // change filename to adapt all browsers
    if(filenameInLoweCase.includes(".pdf")){
      this.logBook.name=this.logBook.name+".pdf"
      // this.logBook.type=".pdf"
    }
    if(filenameInLoweCase.includes(".png")){
      this.logBook.name=this.logBook.name+".png"
      // this.logBook.type=".png"
    }
    if(filenameInLoweCase.includes(".gif")){
      this.logBook.name=this.logBook.name+".gif"
      // this.logBook.type="gif"
    }
    if(filenameInLoweCase.includes(".jfif")){
      this.logBook.name=this.logBook.name+".jfif"
      // this.logBook.type=".jfif"
    }
    if(filenameInLoweCase.includes(".pjeg")){
      this.logBook.name=this.logBook.name+".pjeg"
      // this.logBook.type=".pjep"
    }
    if(filenameInLoweCase.includes(".jpeg")){
      this.logBook.name=this.logBook.name+".jpeg"
      // this.logBook.type=".jpeg"
    }  
    if(filenameInLoweCase.includes(".pjp")){
      this.logBook.name=this.logBook.name+".pjp"
      // this.logBook.type=".pjp"
    }
    if(filenameInLoweCase.includes(".jpg")){
      this.logBook.name=this.logBook.name+".jpg"
      // this.logBook.type=".jpg"
    } 
    // end change filename
  }

  changeFileNameMultipCase(filenameInLoweCase:string, lb:FileLogBook){
    if(!lb.nextDay)
    lb.name="logBook_"+lb.dateLogText+':'+lb.startTime+'-'+lb.endTime+'-'+this.lbs.indexOf(lb)+1
    else
      lb.name="logBook_"+lb.dateLogText+':'+lb.startTime+'-nextday-'+lb.endTime
    // change filename to adapt all browsers
    if(filenameInLoweCase.includes(".pdf")){
      lb.name=lb.name+".pdf"
      // lb.type=".pdf"
    }
    if(filenameInLoweCase.includes(".png")){
      lb.name=lb.name+".png"
      // lb.type=".png"
    }
    if(filenameInLoweCase.includes(".gif")){
      lb.name=lb.name+".gif"
      // lb.type="gif"
    }
    if(filenameInLoweCase.includes(".jfif")){
      lb.name=lb.name+".jfif"
      // lb.type=".jfif"
    }
    if(filenameInLoweCase.includes(".pjeg")){
      lb.name=lb.name+".pjeg"
      // lb.type=".pjep"
    }
    if(filenameInLoweCase.includes(".jpeg")){
      lb.name=lb.name+".jpeg"
      // lb.type=".jpeg"
    }  
    if(filenameInLoweCase.includes(".pjp")){
      lb.name=lb.name+".pjp"
      // lb.type=".pjp"
    }
    if(filenameInLoweCase.includes(".jpg")){
      lb.name=lb.name+".jpg"
      // lb.type=".jpg"
    } 
    this.lbs.push(lb)
  }
  onAddLogBookMultiCase(lb:FileLogBook){
    // if(this.validTimeOut()){
      // console.log('Hi from onAddLogBook()')
      lb.dateLog= this.logBook.dateLog
      lb.dateLogText= this.logBook.dateLogText
      lb.note= this.logBook.note
      lb.idOwner=this.id
      // save logBook and then update list logBooks and initial logBook
      this.fileLogBookService.saveFileLogBook(lb).subscribe((data:FileLogBook)=>{
        // this.logBook.id = data.id
        this.logBooks.push(lb)
        this.pageLogBooks.content.push(lb)
        // this.logBooks
        this.pageLogBooks.content.sort((b,a)=>{
          let temp = new Date(a.dateLog).getTime() - new Date(b.dateLog).getTime()
          if(temp==0 && a.startTime.length>0 && b.startTime.length>0){
            temp=a.startTime.localeCompare(b.startTime)
          }
          if(temp==0){
            temp = a.id -b.id
          }
          return temp;
        })
      }, err=>{console.log(err)})
    // }    
  }
  lbs:Array<FileLogBook>=[];
  onSaveListLogBook(){
    // console.log('this.lbs.length: '+this.lbs.length)
    if(this.lbs.length>0){
      this.lbs.forEach(lb=>{
        lb.name=this.lbs.indexOf(lb)+'-'+lb.name
        lb.timeInService=this.logBook.timeInService
        this.onAddLogBookMultiCase(lb)
      })
      this.lbs=[];
      this.logBook=new FileLogBook()
    } 
    else{
      this.onAddLogBook()
    }
    
  }
  calculateServiceTime(){ //timeIn:string, timeOut:string
    let tIMinutes=0
    let tOMinutes=0
    let resH:string=""
    let resM:string=""
    tIMinutes=Number(this.logBook.startTime.split(":")[0])*60 + Number(this.logBook.startTime.split(":")[1])
    if(this.logBook.nextDay)
      tOMinutes=(Number(this.logBook.endTime.split(":")[0])+24)*60 + Number(this.logBook.endTime.split(":")[1])
    else tOMinutes=Number(this.logBook.endTime.split(":")[0])*60 + Number(this.logBook.endTime.split(":")[1])
    let minutesInService = tOMinutes-tIMinutes
    resH=((minutesInService-(minutesInService%60))/60).toString()
    resM=(minutesInService%60).toString()
    if(resH.length==1) resH='0'+resH
    if(resM.length==1) resM='0'+resM
    console.log('resH:resM '+resH+':'+resM)
    
    return this.logBook.timeInService=resH+':'+resM
  }
  calculateServiceTimeAll(logBooks:Array<FileLogBook>){
    let minutesInService=0
    let resH:string=""
    let resM:string=""
    if(logBooks.length>0){
      logBooks.forEach((lb)=>{
        let tIMinutes=0
        let tOMinutes=0
        tIMinutes=Number(lb.startTime.split(":")[0])*60 + Number(lb.startTime.split(":")[1])
        if(lb.nextDay)
          tOMinutes=(Number(lb.endTime.split(":")[0])+24)*60 + Number(lb.endTime.split(":")[1])
        else tOMinutes=Number(lb.endTime.split(":")[0])*60 + Number(lb.endTime.split(":")[1])
        minutesInService += tOMinutes-tIMinutes
      })
    }
    resH=((minutesInService-(minutesInService%60))/60).toString()
    resM=(minutesInService%60).toString()
    if(resH.length==1) resH='0'+resH
    if(resM.length==1) resM='0'+resM
    console.log('resH:resM '+resH+':'+resM)
    return resH+':'+resM   
  }

  // test read folder
  // onMultiFilesLogBook(event){
  //   let selectedFile : File=event.target.files[0];
  //   let size : number; // = selectedFile.size
  //   let filenameInLoweCase=''
  //   if(selectedFile){
  //     size = selectedFile.size
  //     filenameInLoweCase = selectedFile.name.toLowerCase()
  //   }    
  // }
  // async 
  onFilesChange(event:any) {
    // console.log("onFilesChange")
    if (event.target.files && event.target.files[0]) {
        var filesAmount = event.target.files.length;
        for (let i = 0; i < filesAmount; i++) {
            let lb=new FileLogBook();
            lb.dateLogText=this.logBook.dateLogText
            let selectedFile : File=event.target.files[i];
            let size : number; // = selectedFile.size
            let filenameInLoweCase = selectedFile.name.toLowerCase()
            // let dateModified = new Date(selectedFile.lastModified)
            // console.log("dateModified :" + dateModified)
            // console.log("onFilesChange - before if(selectedFile)")
            if(selectedFile){
              size = selectedFile.size
              if(selectedFile && size<26000000 && 
                (filenameInLoweCase.includes(".pdf") || 
                filenameInLoweCase.includes(".png") ||
                filenameInLoweCase.includes(".gif") ||
                filenameInLoweCase.includes(".jfif") ||
                filenameInLoweCase.includes(".pjeg") ||
                filenameInLoweCase.includes(".jpeg") ||
                filenameInLoweCase.includes(".pjp") ||
                filenameInLoweCase.includes(".jpg")
                )
              ){
                // console.log("onFilesChange - in if(selectedFile)")
                // this.logBook.name=selectedFile.name
                const reader = new FileReader();
                reader.onload = ()=>{
                  lb.urlData= reader.result.toString();
                  // console.log('lb.urlData: '+lb.urlData)
                  // this.changeFileNameMultipCase(filenameInLoweCase, lb)
                }
                reader.readAsDataURL(selectedFile)
                // filenameInLoweCase = selectedFile.name.toLowerCase()
                // console.log("filename-"+i+": "+filenameInLoweCase)
                // console.log("Last Modified-"+i+": "+dateModified.toDateString())
                // console.log("Last Modified-"+i+" local: "+dateModified.toLocaleDateString())
                // console.log("Last Modified-"+i+": "+dateModified.toString())
                // console.log("Last Modified-"+i+" local: "+dateModified.toLocaleString())
                // this.changeFileNameMultipCase(filenameInLoweCase, lb)
              }
              // console.log("onFilesChange - exit if(selectedFile)")
              this.changeFileNameMultipCase(filenameInLoweCase, lb)
            }    
                // var reader = new FileReader();
   
                // reader.onload = (event:any) => {
                //   console.log(event.target.result);
                //    this.images.push(event.target.result); 
   
                //    this.myForm.patchValue({
                //       fileSource: this.images
                //    });
                // }
  
                // reader.readAsDataURL(event.target.files[i]);
          // this.sleep(350)    
        }
    }
  }

  sleep(ms){
    return new Promise((resolve)=>{
      setTimeout(resolve, ms);
    })
  }

  pageLogBooks:PageFileLogBook = new  PageFileLogBook();  // pour tenir des Shippers
  currentPage:number=0;
  size:number=20;
  pages:Array<number>;  // pour tenir des numeros des pages
  // findLogBookByOwnerPage(){
  //   if(localStorage.getItem('idTransporter')!=undefined)
  //   {
  //     let idTransporter = Number(localStorage.getItem('idTransporter'))
  //     this.shipperservice.getShippersByIdTransporter(this.motCle, idTransporter, this.currentPage, this.size).subscribe((data:PageShipper)=>{
  //       this.pageShipper=data;
        
  //       this.pageShipper.content.sort((a, b)=>{
  //         return a.nom.localeCompare(b.nom)
  //       })
        
  //       this.pages=new Array(data.totalPages);
  //     }, err=>{
  //       console.log(err);
  //     })
  //   }
  //   else{
  //     this.shipperservice.getShippers(this.motCle, this.currentPage, this.size).subscribe((data:PageShipper)=>{
  //       this.pageShipper=data;
        
  //       this.pageShipper.content.sort((a, b)=>{
  //         return a.nom.localeCompare(b.nom)
  //       })
        
  //       this.pages=new Array(data.totalPages);
  //     }, err=>{
  //       console.log(err);
  //     })
  //   }
  // }
  // end for LogBooks
}
class PageFileLogBook{
  content:FileLogBook[];
  totalPages:number;
  totalElements:number;
  last:boolean;
  size:number;
  first:boolean;
  sort:string;
  numberofElements:number
}