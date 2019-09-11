import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/services/authentication.service';
import { Role } from 'src/model/model.role';
import { MessagesService } from 'src/services/messages.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import {VarsGlobal} from 'src/services/VarsGlobal'
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'CTS';
  usernameLogin='';
  entrepriseNom='';
  mode:number=0;  // 0: to control password, 1: to wrong password, 2: to bad url or bad domain
  role:string="";
  modeSignUp=0;
  textSign="Nouveau Transporter ou Shipper"
  userId=""; // use to identify dispatch of shipper or dispatch general (by defaul "" general)

  // to control if we are in the session
  session='no';

  //nombreMessages: number=this.varsGlobal.nombreMessages;

  form:FormGroup;  // use for chauffeur
  formExpress:FormGroup;  // use for dispatch express
  idRemorquage: any;
  idTransport: string;

  constructor(private authService:AuthenticationService, public messagesService:MessagesService, 
    private fb:FormBuilder, public varsGlobal:VarsGlobal, private router:Router) 
    {
      this.form = fb.group({
        username:'chauffeur',
        password:'chauffeur'
      })
      this.formExpress = fb.group({
        username:'dispatch1',
        password:'dispatch1'
      })
  }

  ngOnInit() {
    if(localStorage.getItem('role')&&localStorage.getItem('role').includes('CHAUFFEUR'))
      localStorage.clear();
    if(localStorage.getItem('usernameLogin')) 
      this.usernameLogin = localStorage.getItem('usernameLogin')
    if(localStorage.getItem("entrepriseNom"))
      this.entrepriseNom=localStorage.getItem("entrepriseNom")
    //*
    if(location.href.includes("/remorquage-client/"))
    {
      //this.mode=2 // show the message for bad url
      console.log('Nous sommes dans : /remorquage-client/')
      console.log('location.href : '+location.href)
      const stringsd:string[]=location.href.split('/remorquage-client/')
      //console.log('stringsd[0]: '+(this.idRemorquage=stringsd[0]))
      this.idRemorquage=stringsd[1]
      //this.idRemorquage=location.href.substring
      console.log('this.idRemorquage : '+this.idRemorquage)
      const user=this.form.value;
      //*
      this.authService.loginDefaultDriver(user).subscribe(resp=> {
          this.usernameLogin=user.username;  // to get usename
          localStorage.setItem('usernameLogin', this.usernameLogin)
          console.log('this.usernameLogin : '+ this.usernameLogin)
          let jwtToken=resp.headers.get('Authorization');
          this.authService.saveTonken(jwtToken);
          //console.log(jwtToken);        
          this.authService.getUserInfo().subscribe((res:Role)=>{
            this.role = res.roleName;
            localStorage.setItem('role', this.role);          
            if(res.id!=null) {
              localStorage.setItem('userId', res.id.toString());
              //console.log('res.id : '+res.id)
              this.userId=localStorage.getItem('userId')
            }
            this.router.navigate(['/remorquage-client/'+this.idRemorquage]); //1753//location.href
            /*/if(res.idSecond!=null) localStorage.setItem('idSecond', res.idSecond.toString());
            if(res.roleName.includes('DISPATCH')) {         
              if(res.id!=null) this.router.navigate(['/remorquage-pro/'], {skipLocationChange: true});
              else this.router.navigate(['/remorquage/'], {skipLocationChange: true});
            }//*/
          }, err=>{          
            console.log(err);
          });
          this.router.navigateByUrl('/propos');
      },err=>{
        this.mode=1; // appear the message bad password
        console.log(err);  
      });//*/
    }
    //*
    if(location.href.includes("/transport-client/"))
    {
      //this.mode=2 // show the message for bad url
      console.log('Nous sommes dans : /transport-client/')
      console.log('location.href : '+location.href)
      const stringsd:string[]=location.href.split('/transport-client/')
      this.idTransport=stringsd[1]
      console.log('this.idTransport : '+this.idTransport)
      const user=this.form.value;
      //*
      this.authService.loginDefaultDriver(user).subscribe(resp=> {
          this.usernameLogin=user.username;  // to get usename
          localStorage.setItem('usernameLogin', this.usernameLogin)
          console.log('this.usernameLogin : '+ this.usernameLogin)
          let jwtToken=resp.headers.get('Authorization');
          this.authService.saveTonken(jwtToken);
          //console.log(jwtToken);        
          this.authService.getUserInfo().subscribe((res:Role)=>{
            this.role = res.roleName;
            localStorage.setItem('role', this.role);          
            if(res.id!=null) {
              localStorage.setItem('userId', res.id.toString());
              //console.log('res.id : '+res.id)
              this.userId=localStorage.getItem('userId')
            }
            this.router.navigate(['/transport-client/'+this.idTransport]); 
          }, err=>{          
            console.log(err);
          });
          this.router.navigateByUrl('/propos');
      },err=>{
        this.mode=1; // appear the message bad password
        console.log(err);  
      });//*/
    }
    else if(location.href.includes("/detail-remorquage-express/"))
    {
      //this.mode=2 // show the message for bad url
      console.log('Nous sommes dans : /detail-remorquage-express/')
      console.log('location.href : '+location.href)
      const stringsd:string[]=location.href.split('/detail-remorquage-express/')
      //console.log('stringsd[0]: '+(this.idRemorquage=stringsd[0]))
      this.idRemorquage=stringsd[1]
      //this.idRemorquage=location.href.substring
      console.log('this.idRemorquage : '+this.idRemorquage)
      const user=this.formExpress.value;
      //*
      this.authService.loginDefaultDriver(user).subscribe(resp=> {
          this.usernameLogin=user.username;  // to get usename
          localStorage.setItem('usernameLogin', this.usernameLogin)
          console.log('this.usernameLogin : '+ this.usernameLogin)
          let jwtToken=resp.headers.get('Authorization');
          this.authService.saveTonken(jwtToken);
          //console.log(jwtToken);        
          this.authService.getUserInfo().subscribe((res:Role)=>{
            this.role = res.roleName;
            localStorage.setItem('role', this.role);          
            if(res.id!=null) {
              localStorage.setItem('userId', res.id.toString());
              //console.log('res.id : '+res.id)
              this.userId=localStorage.getItem('userId')
            }
            this.router.navigate(['/detail-remorquage-express/'+this.idRemorquage]); //1753//location.href
            /*/if(res.idSecond!=null) localStorage.setItem('idSecond', res.idSecond.toString());
            if(res.roleName.includes('DISPATCH')) {         
              if(res.id!=null) this.router.navigate(['/remorquage-pro/'], {skipLocationChange: true});
              else this.router.navigate(['/remorquage/'], {skipLocationChange: true});
            }//*/
          }, err=>{          
            console.log(err);
          });
          this.router.navigateByUrl('/propos');
      },err=>{
        this.mode=1; // appear the message bad password
        console.log(err);  
      });//*/
    }
    else if(location.href.includes("/detail-transport-express/"))
    {
      //this.mode=2 // show the message for bad url
      console.log('Nous sommes dans : /detail-transport-express/')
      console.log('location.href : '+location.href)
      const stringsd:string[]=location.href.split('/detail-transport-express/')
      //console.log('stringsd[0]: '+(this.idRemorquage=stringsd[0]))
      this.idTransport=stringsd[1]
      //this.idRemorquage=location.href.substring
      console.log('this.idTransport : '+this.idTransport)
      const user=this.formExpress.value;
      //*
      this.authService.loginDefaultDriver(user).subscribe(resp=> {
          this.usernameLogin=user.username;  // to get usename
          localStorage.setItem('usernameLogin', this.usernameLogin)
          console.log('this.usernameLogin : '+ this.usernameLogin)
          let jwtToken=resp.headers.get('Authorization');
          this.authService.saveTonken(jwtToken);
          //console.log(jwtToken);        
          this.authService.getUserInfo().subscribe((res:Role)=>{
            this.role = res.roleName;
            localStorage.setItem('role', this.role);          
            if(res.id!=null) {
              localStorage.setItem('userId', res.id.toString());
              //console.log('res.id : '+res.id)
              this.userId=localStorage.getItem('userId')
            }
            this.router.navigate(['/detail-transport-express/'+this.idTransport]); 
          }, err=>{          
            console.log(err);
          });
          this.router.navigateByUrl('/propos');
      },err=>{
        this.mode=1; // appear the message bad password
        console.log(err);  
      });//*/
    }
    else if( !location.href.includes("cts.sosprestige.com") && !location.href.includes("localhost") && !location.href.includes("192.168.0.") )
    {
      this.mode=2 // show the message for bad url
      console.log('Notre site : cts.sosprestige.com')
    }
    else { console.log("There is no cas special!")}
    if(localStorage.getItem('userId')!=null) {
      //console.log('res.id : '+res.id)
      this.userId=localStorage.getItem('userId')
    }
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
        //this.router.navigateByUrl('/detail-transporter/'+ res.id, {skipLocationChange: true});
        this.router.navigate(['/detail-transporter/'+ this.userId], {skipLocationChange: true});
        //localStorage.setItem('userId', res.id.toString());
      }  
      if(this.role.includes('SHIPPER')) {         
        //this.router.navigateByUrl('/detail-shipper/'+ res.id, {skipLocationChange: true});
        this.router.navigate(['/detail-shipper/'+ this.userId], {skipLocationChange: true});
        //localStorage.setItem('userId', res.id.toString());
      }
      //*
      if(this.role.includes('DISPATCH')) {         
        //if(res.id!=null) this.router.navigate(['/remorquage-client/'+ res.id], {skipLocationChange: true});
        if(!location.href.includes("detail-remorquage")){
          if(location.href.includes("detail-transport-pro")){
            const stringsd:string[]=location.href.split('/detail-transport-pro/')
            let id=stringsd[1]
            this.router.navigate(['/detail-transport-pro/'+ id], {skipLocationChange: true})
          }
          else if(location.href.includes("detail-transport")){
            const stringsd:string[]=location.href.split('/detail-transport/')
            let id=stringsd[1]
            this.router.navigate(['/detail-transport/'+ id], {skipLocationChange: true})
          }
          else if(location.href.includes("/transport")){
            this.router.navigate(['/transport/'], {skipLocationChange: true})            
          }
          else if(this.userId.length>0) this.router.navigate(['/remorquage-pro/'], {skipLocationChange: true});
          else this.router.navigate(['/remorquage/'], {skipLocationChange: true});
        }
        //localStorage.setItem('userId', res.id.toString());
      }//*/
      /*
      if(this.role.includes('TRANSPORTER')) {         
        this.router.navigateByUrl('/detail-transporter/'+ localStorage.getItem('userId'));
        //this.router.navigateByUrl('/business-messages/');
        //localStorage.setItem('userId', res.id.toString());
      }  
      if(this.role.includes('SHIPPER')) {         
        this.router.navigateByUrl('/detail-shipper/'+ localStorage.getItem('userId'));
        //this.router.navigateByUrl('/business-messages/');
        //localStorage.setItem('userId', res.id.toString());
      }//*/
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
          if(res.id!=null) {
            localStorage.setItem('userId', res.id.toString());
            localStorage.setItem('entrepriseNom', res.entrepriseNom);
            this.userId=localStorage.getItem('userId')
            this.entrepriseNom=localStorage.getItem('entrepriseNom')
          }
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
            //if(res.id!=null) this.router.navigate(['/remorquage-client/'+ res.id], {skipLocationChange: true});
            if(res.id!=null) this.router.navigate(['/remorquage-pro/'], {skipLocationChange: true});
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
        //this.router.navigateByUrl('/propos');
        this.usernameLogin=dataForm.username;  // to get usename
        localStorage.setItem('usernameLogin', this.usernameLogin)
        console.log('this.usernameLogin : '+ this.usernameLogin)
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
    this.role="";
    
    this.usernameLogin='';
    this.entrepriseNom='';
    this.mode=0;  // 0: to control password, 1: to wrong password, 2: to bad url or bad domain
    this.role="";
    this.modeSignUp=0;
    this.textSign="Nouveau Transporter ou Shipper"
    this.userId="";
    this.varsGlobal.nombreMessages=0;
    this.varsGlobal.session='no'; 
    this.varsGlobal.pro='no';

    this.router.navigateByUrl("");
    //location.reload();
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
export interface User{
  username:string;
  password:string;
}