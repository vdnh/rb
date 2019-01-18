import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import {Role} from '../../model/model.role';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  mode:number=0;  // to control password
  role:string="";
  idUser:number=0;

  constructor(private authService:AuthenticationService, private router:Router) { }

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
          this.idUser=res.id;
          console.log('Role is : '+this.role);
          console.log('IdUser is : '+this.idUser);
          if(this.role.includes('TRANSPORTER'))
            //this.router.navigate(['detail-transporter',this.idUser]);
            this.router.navigateByUrl('/detail-transporter/'+ this.idUser);
          //AppComponent.mode=1;
        }, err=>{          
          console.log(err);
        });//*/
        //this.authService.getUserInfo();
        //this.role=this.authService.role;
        //console.log('Role is : '+this.role);
        //if(this.roles.
        //this.router.navigateByUrl('/tasks');
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
