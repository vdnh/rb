import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/services/authentication.service';
import { Role } from 'src/model/model.role';
import { MessagesService } from 'src/services/messages.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import {VarsGlobal} from 'src/services/VarsGlobal'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'CTS';
  mode:number=0;  // to control password
  role:string="";
  modeSignUp=0;
  textSign="Nouveau Transporter ou Shipper"

  // to control if we are in the session
  session='no';

  //nombreMessages: number=this.varsGlobal.nombreMessages;
  constructor(private authService:AuthenticationService, public messagesService:MessagesService, 
              public varsGlobal:VarsGlobal, private router:Router) { }

  ngOnInit() {
    //*
    if (localStorage.getItem('role')!=null){
      this.messagesService.messagesReceived(Number(localStorage.getItem('userId'))).subscribe(
        (data:Array<Message>)=>{
          this.varsGlobal.nombreMessages=data.length
        }, err=>{
          console.log(err)
        }
      )
      this.role=localStorage.getItem('role');
      if(this.role.includes('TRANSPORTER')) {         
        this.router.navigateByUrl('/detail-transporter/'+ localStorage.getItem('userId'));
        //this.router.navigateByUrl('/business-messages/');
        //localStorage.setItem('userId', res.id.toString());
      }  
      if(this.role.includes('SHIPPER')) {         
        this.router.navigateByUrl('/detail-shipper/'+ localStorage.getItem('userId'));
        //this.router.navigateByUrl('/business-messages/');
        //localStorage.setItem('userId', res.id.toString());
      }
      this.mode=0;
      //console.log("this role : "+this.role)
    }
    //*/
    sessionStorage.setItem('temporary', 'no')
    if(sessionStorage.getItem('temporary')!=null)
      this.session=this.varsGlobal.session; // sessionStorage.getItem('temporary')
  }

  signing(){
    if(this.modeSignUp==0){
      this.modeSignUp=1;
      this.textSign="Sign in"
    }
    else{
      this.modeSignUp=0;
      this.textSign="Nouveau Transporter ou Shipper";      
      this.router.navigateByUrl("");
    }
  }
  
  refreshData(){
    //this.router.navigateByUrl("");
    //this.ngOnInit();
    /* this.messagesService.messagesReceived(Number(localStorage.getItem('userId'))).subscribe(
      (data:Array<Message>)=>{
        this.varsGlobal.nombreMessages=data.length
      }, err=>{
        console.log(err)
      }
    ) */
    this.varsGlobal.refreshData();
  }

  onLogin(dataForm){
    this.authService.login(dataForm)
    .subscribe(resp=> {
        let jwtToken=resp.headers.get('Authorization');
        this.authService.saveTonken(jwtToken);
        //console.log(jwtToken);        
        //*
        this.authService.getUserInfo().subscribe((res:Role)=>{
          this.role = res.roleName;
          localStorage.setItem('role', this.role);          
          if(res.id!=null) localStorage.setItem('userId', res.id.toString());
          console.log('res.id : '+res.id)
          if(res.idSecond!=null) localStorage.setItem('idSecond', res.idSecond.toString());
          if(res.roleName.includes('TRANSPORTER')) {         
            //this.router.navigateByUrl('/detail-transporter/'+ res.id, {skipLocationChange: true});
            this.router.navigate(['/detail-transporter/'+ res.id], {skipLocationChange: true});
            //localStorage.setItem('userId', res.id.toString());
          }  
          if(res.roleName.includes('SHIPPER')) {         
            //this.router.navigateByUrl('/detail-shipper/'+ res.id, {skipLocationChange: true});
            this.router.navigate(['/detail-shipper/'+ res.id], {skipLocationChange: true});
            //localStorage.setItem('userId', res.id.toString());
          }
          if(res.roleName.includes('DISPATCH')) {         
            if(res.id!=null) this.router.navigate(['/remorquageClient/'+ res.id], {skipLocationChange: true});
            else this.router.navigate(['/remorquage/'], {skipLocationChange: true});
            //localStorage.setItem('userId', res.id.toString());
          }
          //http://localhost:4200/remorquage
          this.mode=0;
          this.messagesService.messagesReceived(Number(localStorage.getItem('userId'))).subscribe(
            (data:Array<Message>)=>{
              this.varsGlobal.nombreMessages=data.length
            }, err=>{
              console.log(err)
            }
          )
        //}
        }, err=>{          
          console.log(err);
        });//*/
        //this.authService.getUserInfo();
        //this.role=this.authService.role;
        //console.log('Role is : '+this.role);
        //if(this.roles.
        this.router.navigateByUrl('/propos');
    },err=>{
      this.mode=1; // appear the message bad password
      console.log(err);  
    });
    /*
    this.authService.getUserInfo().subscribe((res:string)=>{
      this.role = res;
      console.log('Role is : '+this.role)
    }, err=>{
      console.log(err);
    });//*/
    //this.router.navigateByUrl('/tasks');
    //console.log('One more time, Role is : '+this.role)
  }

  logout(){
    localStorage.clear();
    // localStorage.removeItem('tonken');
    // localStorage.removeItem('nom');
    // localStorage.removeItem('tel');
    // localStorage.removeItem('role');
    // localStorage.removeItem('email');
    // localStorage.removeItem('userId');
    //this.router.navigateByUrl("");
    this.role="";
    //this.log=1;
    //window.open("http://192.168.0.131")
    this.router.navigateByUrl("");
    //window.close();
  }
  /*/ on close window
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event){
    //alert("I'm leaving the app");
    //localStorage.clear();
    localStorage.removeItem('tonken');
    localStorage.removeItem('nom');
    localStorage.removeItem('tel');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    this.role="";
    this.router.navigateByUrl("");
  }//*/
  onTransporter(){
    let role = localStorage.getItem('role')
    let userId = localStorage.getItem('userId')       
    if(role.includes('TRANSPORTER')) {         
      //this.router.navigateByUrl('/detail-transporter/'+ userId);
      this.router.navigate(['/detail-transporter/'+ userId], {skipLocationChange: true});
      //this.router.navigateByUrl('/business-messages/');
    }
    else
      this.router.navigateByUrl('/transporters/');
  }
  onShipper(){
    let role = localStorage.getItem('role')
    let userId = localStorage.getItem('userId')       
    if(role.includes('SHIPPER')) {         
      //this.router.navigateByUrl('/detail-shipper/'+ userId);
      this.router.navigate(['/detail-shipper/'+ userId], {skipLocationChange: true});
      //this.router.navigateByUrl('/business-messages/');
    }
    else
      this.router.navigateByUrl('/shippers/');
  }

  switchRole(){
    let temp=localStorage.getItem('userId')   // take userId actual
    let idSecond=localStorage.getItem('idSecond') //take secondId if it has
    if(idSecond!=null && idSecond.length>0){ // if it have secondId
      if(localStorage.getItem('role').includes('SHIPPER')){ // if it was Shipper
        localStorage.setItem('idSecond', temp)      // modify secondId
        localStorage.setItem('role', 'TRANSPORTER') // modify role to Transporter
        localStorage.setItem('userId', idSecond)  // modify userId to second
        //this.router.navigate(['detail-transporter',idSecond]);
        //this.onTransporter()
        this.ngOnInit() // re-init 
      }
      else if (localStorage.getItem('role').includes('TRANSPORTER')){
        localStorage.setItem('idSecond', temp)
        localStorage.setItem('role', 'SHIPPER') 
        localStorage.setItem('userId', idSecond) 
        //this.router.navigate(['detail-shipper',idSecond]);
        //this.onShipper()
        this.ngOnInit()
      }
    }
    else 
      alert("Votre role n'est que : " + localStorage.getItem('role') + ". Contactez votre fournisseur si vous voulez autre role.")
  }

}
