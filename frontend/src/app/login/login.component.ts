import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';
import { Router } from '@angular/router';
// import { AppComponent } from '../app.component';
import {Role} from '../../model/model.role';
import { Message } from 'src/model/model.message';
import { MessagesService } from 'src/services/messages.service';
import { VarsGlobal } from 'src/services/VarsGlobal';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  mode:number=0;  // to control password
  role:string="";
  idUser:number=0;
  imgUrl = "assets/images/cargo.png";
  userId: string;

  constructor(private authService:AuthenticationService, private router:Router,
    public messagesService:MessagesService, 
    public varsGlobal:VarsGlobal) { }

  ngOnInit() {
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
            //console.log('res.id : '+res.id)
            this.userId=localStorage.getItem('userId')
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
    this.router.navigateByUrl('/login');
  }
  test(){

  }
}
