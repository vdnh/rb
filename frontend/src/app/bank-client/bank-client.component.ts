import { Component, OnInit } from '@angular/core';
import { BankClient } from 'src/model/model.bankClient';
import { BankClientsService } from 'src/services/bankClients.service';
import { EmailMessage } from 'src/model/model.emailMessage';

@Component({
  selector: 'app-bank-client',
  templateUrl: './bank-client.component.html',
  styleUrls: ['./bank-client.component.css']
})
export class BankClientComponent implements OnInit {

  modeClient=1;
  modeEmail=0
  motCle:string="";
  bankClients:Array<BankClient>=[];
  addClient:BankClient=new BankClient();
  em:EmailMessage=new EmailMessage();
  constructor( public bankClientsService:BankClientsService) { 
    //*
    this.bankClientsService.getBankClients().subscribe((data:Array<BankClient>)=>{
      this.bankClients=data;
    },err=>{
      console.log(err)
    })//*/
  }

  ngOnInit() {
    //this.doSearch();
  }

 async onBankClients(){
    this.modeClient=1;
    this.modeEmail=0;
    this.motCle="";
    await this.bankClientsService.getBankClients().subscribe((data:Array<BankClient>)=>{
      this.bankClients=data;
    },err=>{
      console.log(err)
    })
  }

  onEmailToAll(){
    this.modeClient=0;
    this.modeEmail=1
  }

  onAddClient(){
    this.bankClientsService.saveClients(this.addClient).subscribe((data:BankClient)=>{
      this.bankClients.push(data);
      this.addClient=new BankClient();
    }, err=>{
      console.log(err);
    })
    
  }

  onEnvoyer(){
    this.em.addressCondition=this.motCle; // pour limiter region - par example Quebec, Montreal, Toronto, ...
    this.bankClientsService.envoyerMailToAll(this.em).subscribe(data=>{
      this.em=new EmailMessage();
    }, err=>{
      console.log()
    })//*/
  }
  async doSearch(){
    await this.bankClientsService.chercher(this.motCle).subscribe((data:Array<BankClient>)=>{
      this.bankClients=data;
      this.bankClients.forEach(obj=>{
        console.log(obj.address)
      })
    }, err=>{
      console.log(err);
    })
  }
  chercher(){
    this.doSearch();
  }
  onSortClients(){
    this.bankClients.sort((a, b) => a.nom.localeCompare(b.nom));
    //array.sort((a,b) => a.title.rendered.localeCompare(b.title.rendered));
  }
  onSaveClient(){

  }
}
