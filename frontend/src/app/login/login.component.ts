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

  //mode:number=0;
  roles:Array<Role>;

  constructor(private authService:AuthenticationService, private router:Router) { }

  ngOnInit() {
  }

  onLogin(dataForm){
    this.authService.login(dataForm)
    .subscribe(resp=>{
        let jwtToken=resp.headers.get('Authorization');
        this.authService.saveTonken(jwtToken);
        //console.log(jwtToken);        
        this.authService.getUserInfo().subscribe((res:Array<Role>)=>{
          this.roles = res
        }, err=>{
          console.log(err);
        })
        //if(this.roles.
        this.router.navigateByUrl('/tasks');
    },err=>{
      console.log(err);  
    })

  }

}
