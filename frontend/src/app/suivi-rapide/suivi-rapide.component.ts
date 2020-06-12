import { Component, OnInit } from '@angular/core';
import { Remorquage } from 'src/model/model.remorquage';
import { Transport } from 'src/model/model.transport';
import { TransportsService } from 'src/services/transports.service';
import { RemorquagesService } from 'src/services/remorquages.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthenticationService } from 'src/services/authentication.service';
import { TransportersService } from 'src/services/transporters.service';
import { Transporter } from 'src/model/model.transporter';

//import {SignaturePad} from 'angular2-signaturepad/signature-pad';

@Component({
  selector: 'app-suivi-rapide',
  templateUrl: './suivi-rapide.component.html',
  styleUrls: ['./suivi-rapide.component.css']
})
export class SuiviRapideComponent implements OnInit {
  transporter: Transporter;

  constructor(private transportService: TransportsService, 
    private remorquageService: RemorquagesService,
    private authService:AuthenticationService,
    private fb:FormBuilder,
    public transportersService:TransportersService,) 
  {
    this.form = fb.group({
      username:'chauffeur',
      password:'chauffeur'
    })
  }

  remorquage: Remorquage = new Remorquage();
  transport: Transport = new Transport();
  numBon:number; // #bon ou #reference pour chercher
  result="";
  userId:any=null; // userId!=null c'est dispatch-pro
  role='';
  form:FormGroup;  // use for chauffeur
  
  ngOnInit() {
    this.userId= localStorage.getItem('userId')
  }
  
  textResult(sent:boolean, fini:boolean, driverNote:String){
    if(driverNote.includes("!!Cancelled!!")) this.result = " annulee !!"
    else {
      if(!sent) this.result = " en attente.";
      if(sent && !fini) this.result = " en cour.";
      if(fini) this.result = " bien termine.";
    }
  }
  onResearh(){
    
    // before finding, we must clear the lasts remorquage and transport
    this.remorquage = new Remorquage();
    this.transport = new Transport();

    if(this.numBon==undefined){
      this.result="Veuillez entrer de #Bon"
      return;
    }

    if(localStorage.getItem('role')==undefined){ // find by visitor
      const user=this.form.value;
      this.authService.loginDefaultDriver(user).subscribe(resp=> {
        let jwtToken=resp.headers.get('Authorization');
        this.authService.saveTonken(jwtToken);
        // begin find #Bon - in case visitor
        this.remorquageService.getDetailRemorquage(this.numBon).subscribe((data:Remorquage)=>{
          this.textResult(data.sent, data.fini, data.driverNote)
          this.result = "Remorquage #Bon " +this.numBon+ ': ' + this.result + " Connectez-vous pour le detail."
          localStorage.clear()
        }, 
        err=>{
          this.transportService.getDetailTransport(this.numBon).subscribe((data:Transport)=>{
            this.textResult(data.sent, data.fini, data.driverNote)
            this.result = "Transport #Bon " +this.numBon+ ': ' + this.result + " Connectez-vous pour le detail."
            localStorage.clear()
          }, err=>{
            this.result="#Bon " +this.numBon+ " est invalide ou il n'existe pas."
            localStorage.clear()
          })
        })
        
        // end of find #Bon - in case visitor

      });
      return
    }

    if(localStorage.getItem('role').includes('ADMIN')){ // find by admin
      this.role=localStorage.getItem('role')
      this.remorquageService.getDetailRemorquage(this.numBon).subscribe((data:Remorquage)=>{
        this.remorquage=data;
        this.textResult(data.sent, data.fini, data.driverNote)
        this.result = "Remorquage #Bon " +this.numBon+ ': ' + this.result
        this.transportersService.getDetailTransporter(data.idTransporter).subscribe((tr:Transporter)=>{
          this.transporter = tr;
        }, err=>{console.log(err)})
      }, 
      err=>{
        this.transportService.getDetailTransport(this.numBon).subscribe((data:Transport)=>{
          this.transport=data;
          this.textResult(data.sent, data.fini, data.driverNote)
          this.result = "Transport #Bon " +this.numBon+ ': ' + this.result
          this.transportersService.getDetailTransporter(data.idTransporter).subscribe((tr:Transporter)=>{
            this.transporter = tr;
          }, err=>{console.log(err)})
        }, err=>{
          this.result="#Bon " +this.numBon+ " est invalide ou il n'existe pas."
        })
      })
      return 
    }

    this.remorquageService.getDetailRemorquage(this.numBon).subscribe((data:Remorquage)=>{
      if(data.idTransporter==Number(localStorage.getItem('idTransporter')))
      {
        if(localStorage.getItem('userId')!=undefined){ // si c'est dispatch-pro - parce userId pas null
          //alert('data.nomEntreprise : '+data.nomEntreprise + "localStorage.getItem('entrepriseNom'): "+localStorage.getItem('entrepriseNom'))
          if(data.nomEntreprise.includes(localStorage.getItem('entrepriseNom'))){ // on verifie entreprisename
            this.remorquage=data;
            this.textResult(data.sent, data.fini, data.driverNote)
            this.result = "Remorquage #Bon " +this.numBon+ ': ' + this.result
          }
          else 
            this.result="#Bon " +this.numBon+ " ne vous appartient pas"
        }
        else{ // si c'est dispatch - parce userid est null (dispatch de Transporter)
          this.remorquage=data;
          this.textResult(data.sent, data.fini, data.driverNote)
          this.result = "Remorquage #Bon " +this.numBon+ ': ' + this.result
          //alert('this is a remorquage')
        }
      }
      else this.result="#Bon " +this.numBon+ " ne vous appartient pas"
      //   {
      //     this.remorquage=data
      //     alert('this is a remorquage')
      //   }
      // else alert('Ce #Bon ne vous appartient pas')
    }, 
    err=>{
      this.transportService.getDetailTransport(this.numBon).subscribe((data:Transport)=>{
        if(data.idTransporter==Number(localStorage.getItem('idTransporter')))
        {
          if(localStorage.getItem('userId')!=undefined){ // si c'est dispatch-pro - parce userId pas null
            //alert('data.nomEntreprise : '+data.nomEntreprise + "localStorage.getItem('entrepriseNom'): "+localStorage.getItem('entrepriseNom'))
            if(data.nomEntreprise.includes(localStorage.getItem('entrepriseNom'))){ // on verifie entreprisename
              this.transport=data;
              this.textResult(data.sent, data.fini, data.driverNote)
              this.result = "Transport #Bon " +this.numBon+ ': ' + this.result
              //alert('this is a transport')  
            }
            else 
            this.result="#Bon " +this.numBon+ " ne vous appartient pas"
          }
          else{ // si c'est dispatch - parce userid est null (dispatch de Transporter)
            this.transport=data;
            this.textResult(data.sent, data.fini, data.driverNote)
            this.result = "Transport #Bon " +this.numBon+ ': ' + this.result
            //alert('this is a transport')
          }
        }
        else this.result="#Bon " +this.numBon+ " ne vous appartient pas"
      }, err=>{
        this.result="#Bon " +this.numBon+ " est invalide ou il n'existe pas."
      })
    })
  }
  
  problemService(){
    let probSer=" ";
    if(this.remorquage.panne)
      probSer=probSer+"Panne, "
    if(this.remorquage.accident)
      probSer=probSer+"Accident, "
    if(this.remorquage.pullOut)
      probSer=probSer+"PullOut, "
    if(this.remorquage.debaragePorte)
      probSer=probSer+"Debarage Porte, "
    if(this.remorquage.survoltage)
      probSer=probSer+"Survoltage, "
    if(this.remorquage.essence)
      probSer=probSer+"Essence, "
    if(this.remorquage.changementPneu)
      probSer=probSer+"Changement Pneu, "
    return probSer;
  }

  gotoDetailRemorquage(r:Remorquage){
    window.open("/detail-remorquage/"+r.id, "_blank")
  }

  gotoDetailTransport(t:Transport){
    window.open("/detail-transport/"+t.id, "_blank")
  }
}
