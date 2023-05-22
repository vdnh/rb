import { Injectable } from '@angular/core';
import { MessagesService } from 'src/services/messages.service';
import { Message } from 'src/model/model.message';
import { UserLogs } from 'src/model/model.userLogs';

@Injectable()
export class VarsGlobal{
  language='Francais'  // language by default is Francais
  languages=['Francais', 'English'] // language list
  switchLanguage=true; // allow to switch language
  nombreMessages:number=0; // number of messages 
  session='no'; // no mean we are not in session particular
  pro='no'; // no mean we are not in session professionnal
  userLogs : UserLogs = new UserLogs();
  addressCookie='' // separate by "; " - semicolon and space
  addressCookieToList:Array<string>=[]; // reform by varsGlobal.addressCookie.split(";;-;; ")
  
  // parameter for dispatch see the fleet
  dispatchSee:boolean=false;

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