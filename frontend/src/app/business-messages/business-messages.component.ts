import { Component, OnInit } from '@angular/core';
import { Message } from 'src/model/model.message';
import { MessagesService } from 'src/services/messages.service';

@Component({
  selector: 'app-business-messages',
  templateUrl: './business-messages.component.html',
  styleUrls: ['./business-messages.component.css']
})
export class BusinessMessagesComponent implements OnInit {
  messages:Array<Message>=[];
  constructor(public messagesService:MessagesService) { }

  ngOnInit() {
    this.messagesService.messagesReceived(Number(localStorage.getItem('userId'))).subscribe(
      (data:Array<Message>)=>{
        this.messages=data;
      }, err=>{
        console.log(err)
      }
    )
  }
  deleteMessage(id:number){
    this.messagesService.deleteMessage(id).subscribe(data=>{
      this.ngOnInit()
    }, err=>{
      console.log(err)
    })
  }
}
