import { Component, OnInit } from '@angular/core';
import { BankClient } from 'src/model/model.bankClient';
import { BankClientsService } from 'src/services/bankClients.service';

@Component({
  selector: 'app-bank-client',
  templateUrl: './bank-client.component.html',
  styleUrls: ['./bank-client.component.css']
})
export class BankClientComponent implements OnInit {

  bankClients:Array<BankClient>=[];
  
  addClient:BankClient=new BankClient();

  constructor( public bankClientsService:BankClientsService) { 

  }

  ngOnInit() {
    this.bankClientsService.getBankClients().subscribe((data:Array<BankClient>)=>{
      this.bankClients=data;
    },err=>{
      console.log(err)
    })
  }

  onBankClients(){

  }

  onEmailToAll(){

  }

  onAddClient(){
    this.bankClientsService.saveClients(this.addClient).subscribe(data=>{
      this.addClient=new BankClient();
    }, err=>{
      console.log(err);
    })
  }

  onSaveClient(){

  }
}
