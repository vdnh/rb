import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/services/authentication.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  mode:number=0;
  constructor(private authService:AuthenticationService, private router:Router) { }

  ngOnInit() {
  }

  onLogin(dataForm){
    this.authService.login(dataForm)
    .subscribe(resp=>{
        let jwtToken=resp.headers.get('Authorization');
        this.authService.saveTonken(jwtToken);
        //console.log(jwtToken);
        this.router.navigateByUrl('/tasks');
        //AppComponent.log=2;
        //this.authService.getTasks();
    },
      err=>{
        this.mode=1;
      })

  }

}
