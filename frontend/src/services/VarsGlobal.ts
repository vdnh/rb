import { Injectable } from '@angular/core';
import { MessagesService } from 'src/services/messages.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { UserLogs } from 'src/model/model.userLogs';

@Injectable()
export class VarsGlobal{
  
  nombreMessages:number=0; // number of messages 
  session='no'; // no mean we are not in session particular
  pro='no'; // no mean we are not in session professionnal
  userLogs : UserLogs = new UserLogs();
  
  constructor(public messagesService: MessagesService){}
  refreshData(){
    //this.router.navigateByUrl("");
    //this.ngOnInit();
    this.messagesService.messagesReceived(Number(localStorage.getItem('userId'))).subscribe(
      (data:Array<Message>)=>{
        this.nombreMessages=data.length
      }, err=>{
        console.log(err)
      }
    )
  }
}