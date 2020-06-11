import { Component, OnInit } from '@angular/core';
import { Remorquage } from 'src/model/model.remorquage';
import { Transport } from 'src/model/model.transport';
import { TransportsService } from 'src/services/transports.service';
import { RemorquagesService } from 'src/services/remorquages.service';

@Component({
  selector: 'app-suivi-rapide',
  templateUrl: './suivi-rapide.component.html',
  styleUrls: ['./suivi-rapide.component.css']
})
export class SuiviRapideComponent implements OnInit {

  constructor(private transportService: TransportsService, 
    private remorquageService: RemorquagesService) 
  {}

  remorquage: Remorquage = new Remorquage();
  transport: Transport = new Transport();
  numBon:number=0; // #bon ou #reference pour chercher
  result="";
  ngOnInit() {
  }
  
  textResult(sent:boolean, fini:boolean, driverNote:String){
    if(driverNote.includes("!!Cancelled!!")) this.result = "#Bon Annulee !!"
    else {
      if(!sent) this.result = "En attente ";
      if(sent && !fini) this.result = "En cour.";
      if(fini) this.result = "Bien termine.";
    }
  }
  onResearh(){
    this.remorquageService.getDetailRemorquage(this.numBon).subscribe((data:Remorquage)=>{
      if(data.idTransporter==Number(localStorage.getItem('idTransporter')))
      {
        if(localStorage.getItem('userId')!=undefined){ // si c'est dispatch-pro - parce userId pas null
          //alert('data.nomEntreprise : '+data.nomEntreprise + "localStorage.getItem('entrepriseNom'): "+localStorage.getItem('entrepriseNom'))
          if(data.nomEntreprise.includes(localStorage.getItem('entrepriseNom'))){ // on verifie entreprisename
            this.remorquage=data;
            this.textResult(data.sent, data.fini, data.driverNote)
            //alert('this is a remorquage')  
          }
          else 
            this.result='Ce #Bon ne vous appartient pas'
        }
        else{ // si c'est dispatch - parce userid est null (dispatch de Transporter)
          this.remorquage=data;
          this.textResult(data.sent, data.fini, data.driverNote)
          //alert('this is a remorquage')
        }
      }
      else this.result='Ce #Bon ne vous appartient pas'
      //   {
      //     this.remorquage=data
      //     alert('this is a remorquage')
      //   }
      // else alert('Ce #Bon ne vous appartient pas')
    }, err=>{
      this.transportService.getDetailTransport(this.numBon).subscribe((data:Transport)=>{
        if(data.idTransporter==Number(localStorage.getItem('idTransporter')))
        {
          if(localStorage.getItem('userId')!=undefined){ // si c'est dispatch-pro - parce userId pas null
            //alert('data.nomEntreprise : '+data.nomEntreprise + "localStorage.getItem('entrepriseNom'): "+localStorage.getItem('entrepriseNom'))
            if(data.nomEntreprise.includes(localStorage.getItem('entrepriseNom'))){ // on verifie entreprisename
              this.transport=data;
              this.textResult(data.sent, data.fini, data.driverNote)
              //alert('this is a transport')  
            }
            else 
            this.result='Ce #Bon ne vous appartient pas'
          }
          else{ // si c'est dispatch - parce userid est null (dispatch de Transporter)
            this.transport=data;
            this.textResult(data.sent, data.fini, data.driverNote)
            //alert('this is a transport')
          }
        }
        else this.result='Ce #Bon ne vous appartient pas'
      }, err=>{
        this.result="Le #Bon est invalide ou il n'existe pas."
      })
    })
  }

}
