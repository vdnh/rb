import { Component, OnInit } from '@angular/core';
import { ChauffeursService } from 'src/services/chauffeurs.service';
import { Chauffeur } from 'src/model/model.chauffeur';

@Component({
  selector: 'app-chauffeurs',
  templateUrl: './chauffeurs.component.html',
  styleUrls: ['./chauffeurs.component.css']
})
export class ChauffeursComponent implements OnInit {

  chauffeurs:Array<Chauffeur>;
  addchauffeur:Chauffeur=new Chauffeur(); // to add more chauffeur

  constructor(public chauffeursService:ChauffeursService,) { }

  ngOnInit() {
    // here we find drivers of SOSPrestige, therefore, id transporter = 8
    this.chauffeursService.chauffeursDeTransporter(8).subscribe((data:Array<Chauffeur>)=>{
      this.chauffeurs=data;
      this.chauffeurs.sort((a, b)=>{
        return a.nom.localeCompare(b.nom)
      })
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
    this.addchauffeur.idTransporter=8 // here we find drivers of SOSPrestige, therefore, id transporter = 8
    this.chauffeursService.saveChauffeurs(this.addchauffeur).subscribe((data:Chauffeur)=>{
      //alert("Chauffeur added.");
      //this.refresh()
      this.chauffeurs.push(data)
      this.chauffeurs.sort((a, b)=>{
        return a.nom.localeCompare(b.nom)
      })
      this.addchauffeur = new Chauffeur();
    }, err=>{
      console.log(err)
    })
  }

  deleteChauffeur(ch:Chauffeur){
    this.chauffeursService.deleteChauffeur(ch.id).subscribe((data:Chauffeur)=>{
      alert("Chauffeur : "+ch.nom+" a ete supprime.");
      this.chauffeurs.splice(this.chauffeurs.indexOf(ch), 1)
      this.chauffeurs.sort((a,b)=>{
        return a.nom.localeCompare(b.nom)
      })
    }, err=>{
      console.log(err);
    });
  }
  
  modifyChauffeur(ch:Chauffeur){
    this.chauffeursService.saveChauffeurs(ch).subscribe((data:Chauffeur)=>{
      alert("Chauffeur : "+ch.nom+" a ete modifie.");
      this.chauffeurs.sort((a, b)=>{
        return a.nom.localeCompare(b.nom)
      })
      //this.chauffeurs.splice(this.chauffeurs.indexOf(data), 1)
    }, err=>{
      console.log(err);
    });
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
