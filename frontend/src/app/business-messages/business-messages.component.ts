import { Component, OnInit } from '@angular/core';
import { Message } from 'src/model/model.message';
import { MessagesService } from 'src/services/messages.service';
import {VarsGlobal} from 'src/services/VarsGlobal'

@Component({
  selector: 'app-business-messages',
  templateUrl: './business-messages.component.html',
  styleUrls: ['./business-messages.component.css']
})
export class BusinessMessagesComponent implements OnInit {
  messages:Array<Message>=[];
  constructor(public messagesService:MessagesService, public varsGlobal:VarsGlobal) { }

  ngOnInit() {
    this.messagesService.messagesReceived(Number(localStorage.getItem('userId'))).subscribe(
      (data:Array<Message>)=>{
        this.messages=
        data.sort((a, b) => {
          if(a.id>b.id)
            return -1;
          if(a.id<b.id)
            return 1;
          return 0;
        });
      }, err=>{
        console.log(err)
      }
    )
  }
  deleteMessage(id:number){
    this.messagesService.deleteMessage(id).subscribe(data=>{
      if(this.varsGlobal.nombreMessages>=1)
        this.varsGlobal.nombreMessages=this.varsGlobal.nombreMessages-1
      this.ngOnInit()
    }, err=>{
      console.log(err)
    })
  }
}
