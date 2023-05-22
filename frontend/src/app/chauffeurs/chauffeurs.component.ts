import { Component, OnInit } from '@angular/core';
import { ChauffeursService } from 'src/services/chauffeurs.service';
import { Chauffeur } from 'src/model/model.chauffeur';
import { VarsGlobal } from 'src/services/VarsGlobal';
import { Router } from '@angular/router';
import { DriverLicenseService } from 'src/services/driverLicense.service';
import { HistoriesService } from 'src/services/histories.service';
import { DriverLicense } from 'src/model/model.driverLicense';
import { History } from 'src/model/model.history';

@Component({
  selector: 'app-chauffeurs',
  templateUrl: './chauffeurs.component.html',
  styleUrls: ['./chauffeurs.component.css']
})
export class ChauffeursComponent implements OnInit {

  chauffeurs:Array<Chauffeur>=[];
  driversArchiveds:Array<Chauffeur>=[];
  addchauffeur:Chauffeur=new Chauffeur(); // to add more chauffeur
  idTransporter = Number(localStorage.getItem('idTransporter'))
  
  constructor(public chauffeursService:ChauffeursService, public router:Router,
    public driverLicenseService:DriverLicenseService, public historiesService:HistoriesService,          
    public varsGlobal:VarsGlobal,) 
  { 

  }

  ngOnInit() {
    // here we find drivers of SOSPrestige, therefore, id transporter = 8
    
    this.chauffeursService.chauffeursDeTransporter(this.idTransporter).subscribe((data:Array<Chauffeur>)=>{
      if(data!=null)
      {
        data.forEach(dr=>{
          if(dr.prenom==null) dr.prenom=''
          if(dr.nom==null) dr.nom=''
          if(dr.archive==null || !dr.archive) this.chauffeurs.push(dr)
          else {
            let yearInMilliseconds = 3*366*24*60*60*1000  // archive 3 years
            if((new Date().getTime() - new Date(dr.lastDate).getTime()>yearInMilliseconds))
              this.onDeleteDriverArchived(dr)
            else this.driversArchiveds.push(dr)
          }
        })
        // this.chauffeurs=data;
        this.chauffeurs.sort((a, b)=>{
          return (a.prenom+" "+a.nom).localeCompare(b.prenom+" "+b.nom)
        })
        this.driversArchiveds.sort((a, b)=>{
          return (a.prenom+" "+a.nom).localeCompare(b.prenom+" "+b.nom)
        })
      }
    }, err=>{
      console.log(err);
    });
  }

  saveChauufeurs(){
    this.chauffeurs.forEach(obj => {
      this.chauffeursService.saveChauffeurs(obj).subscribe(data=>{
      }, err=>{
        console.log(err)
      })
    });
  }

  addChauffeur(){
    this.addchauffeur.idTransporter=this.idTransporter // here we find drivers of SOSPrestige, therefore, id transporter = 8
    this.chauffeursService.saveChauffeurs(this.addchauffeur).subscribe((data:Chauffeur)=>{
      //alert("Chauffeur added.");
      //this.refresh()
      this.chauffeurs.push(data)
      this.chauffeurs.sort((a, b)=>{
        return (a.prenom+" "+a.nom).localeCompare(b.prenom+" "+b.nom)
      })
      this.addchauffeur = new Chauffeur();
    }, err=>{
      console.log(err)
    })
  }

  deleteChauffeur(ch:Chauffeur){
    let r = confirm('Archiver '+ch.nom.toLocaleUpperCase() + ' ? (Ses infos vont)')
    if(r){
      this.chauffeursService.deleteChauffeur(ch.id).subscribe((data:Chauffeur)=>{
        alert("Chauffeur : "+ch.nom+" a ete supprime.");
        this.chauffeurs.splice(this.chauffeurs.indexOf(ch), 1)
        this.chauffeurs.sort((a,b)=>{
          return (a.prenom+" "+a.nom).localeCompare(b.prenom+" "+b.nom)
        })
      }, err=>{
        console.log(err);
      });
    }
  }

  onDeleteDriverArchived(driver:Chauffeur){
    this.chauffeursService.deleteChauffeur(driver.id).subscribe((data:Chauffeur)=>{
      this.driverLicenseService.driverLicensesOfOwner(driver.id).subscribe((data:Array<DriverLicense>)=>{
        if(data!=null){
          data.forEach(dl=>{
            this.driverLicenseService.deleteDriverLicense(dl.id).subscribe();
          })
        } 
      }, err=>{console.log(err)})
      this.historiesService.historiesOfOwner(driver.id).subscribe((data:Array<History>)=>{
        if(data!=null){
          data.forEach(h=>{
            this.historiesService.deleteHistory(h.id).subscribe();
          })
        }
      }, err=>{console.log(err)})
    }, err=>{
      console.log(err);
    });
  }

  tempList=[];
  archive=false // to show drivers archives or not archives
  archiveDriver(ch:Chauffeur){
    let r = confirm('Archiver '+ch.prenom.toLocaleUpperCase()+' '+ch.nom.toLocaleUpperCase() + ' ?')
    ch.archive=true
    if(r){
      this.chauffeursService.saveChauffeurs(ch).subscribe((data:Chauffeur)=>{
        // ch=data
        // alert("Chauffeur : "+ch.nom+" reste en archive dans 1 an.");
        // this.driversArchiveds.push(ch)
        // this.driversArchiveds.sort((a,b)=>{
        //   return a.nom.localeCompare(b.nom)
        // })
        // this.chauffeurs.splice(this.chauffeurs.indexOf(ch), 1)
        // this.chauffeurs.sort((a,b)=>{
        //   return a.nom.localeCompare(b.nom)
        // })
        // begin refresh 2 lists
        this.tempList=this.chauffeurs.concat(this.driversArchiveds)
        this.chauffeurs=[]
        this.driversArchiveds=[]
        this.tempList.forEach(dr=>{
          if(dr.archive==null || !dr.archive) this.chauffeurs.push(dr)
          else this.driversArchiveds.push(dr)
        })
        this.chauffeurs.sort((a, b)=>{
          return (a.prenom+" "+a.nom).localeCompare(b.prenom+" "+b.nom)
        })
        this.driversArchiveds.sort((a, b)=>{
          return (a.prenom+" "+a.nom).localeCompare(b.prenom+" "+b.nom)
        })
        this.tempList=[]
        // end refresh 2 list
      }, err=>{
        console.log(err);
      });
    }
  }
  
  resumeDriver(ch:Chauffeur){
    let r = confirm('Reprendre '+ch.prenom.toLocaleUpperCase()+' '+ch.nom.toLocaleUpperCase() + ' ?')
    // ch.archive=false;
    if(r){
      ch.archive=false;
      this.chauffeursService.saveChauffeurs(ch).subscribe((data:Chauffeur)=>{
        this.tempList=this.chauffeurs.concat(this.driversArchiveds)
        this.chauffeurs=[]
        this.driversArchiveds=[]
        this.tempList.forEach(dr=>{
          if(dr.archive==null || !dr.archive) this.chauffeurs.push(dr)
          else this.driversArchiveds.push(dr)
        })
        this.chauffeurs.sort((a, b)=>{
          return (a.prenom+" "+a.nom).localeCompare(b.prenom+" "+b.nom)
        })
        this.driversArchiveds.sort((a, b)=>{
          return (a.prenom+" "+a.nom).localeCompare(b.prenom+" "+b.nom)
        })
        this.tempList=[]
        // end refresh 2 list
      }, err=>{
        console.log(err);
      });
    }
  }

  modifyChauffeur(ch:Chauffeur){
    alert("Coming soon")
    // this.chauffeursService.saveChauffeurs(ch).subscribe((data:Chauffeur)=>{
    //   alert("Chauffeur : "+ch.nom+" a ete modifie.");
    //   this.chauffeurs.sort((a, b)=>{
    //     return a.nom.localeCompare(b.nom)
    //   })
    //   //this.chauffeurs.splice(this.chauffeurs.indexOf(data), 1)
    // }, err=>{
    //   console.log(err);
    // });
  }

  onDriver(driver:Chauffeur){
    let id = driver.id
    console.log("We are in onDriver(driver:Chauffeur)")
    // this.router.navigateByUrl('http://localhost:4200/chauffeurs/detail-chauffeur', {skipLocationChange: true});
    
    // this.router.navigate(['detail-chauffeur'], {skipLocationChange: true});
    this.router.navigate(['driver',id], {skipLocationChange: true});
    // this.router.navigate(['/driver/'+id], {skipLocationChange: true});
    // this.router.navigate(['/transport-client/'+this.idTransport]);
    // this.router.navigate(['camion',id], {skipLocationChange: true}); // ok form

    // console.log('location.href before modifying: '+location.href)
    // let stringsd:string[]=location.href.split('/chauffeurs')  
    // location.href = stringsd[0]
    // console.log('first part of location.href after spilit: '+stringsd)
    // this.router.navigate(['driver', 22539]);
    
    // this.router.navigate(['detail-chauffeur'], {skipLocationChange: true});
    // this.router.navigate(['propos'], {skipLocationChange: true});
    
    // this.router.navigate(['detail-chauffeur'], {skipLocationChange: true});
    // this.router.navigateByUrl(stringsd[0]+'/detail-chauffeur', {skipLocationChange: true});
    // window.open(stringsd[0]+"/detail-chauffeur", '_self');
  }

  reformTelEvent(tel:any){
    if(tel.target.value.indexOf('-')<0)
      {
        let sub1 = tel.target.value.substr(0,3)
        let sub2 = tel.target.value.substr(3,3)
        let sub3 = tel.target.value.substr(6,tel.target.value.length-6)
        tel.target.value=sub1+'-'+sub2+'-'+sub3
      }
    return tel.target.value;
  }

  printBonDeRemorquage(cmpId){
    let envoy = document.getElementById('toprint').innerHTML;
    //console.log('Toprint : ' + document.getElementById('toprint').innerHTML + ' endOfToprint')
    //console.log(envoy)
    const printContent = document.getElementById(cmpId);
    //console.log('printContent.innerHTML : '+printContent.innerHTML+' *** end.')
    //const WindowPrt = window.open('','','left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    const WindowPrt = window.open();
    WindowPrt.document.write('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

}
