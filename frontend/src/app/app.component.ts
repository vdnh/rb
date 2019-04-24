import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/services/authentication.service';
import { Role } from 'src/model/model.role';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'CTS';
  mode:number=0;  // to control password
  role:string="";
  constructor(private authService:AuthenticationService, private router:Router) { }

  ngOnInit() {
    //*
    if (localStorage.getItem('role')!=null){
      this.role=localStorage.getItem('role');
      if(this.role.includes('TRANSPORTER')) {         
        this.router.navigateByUrl('/detail-transporter/'+ localStorage.getItem('userId'));
        //localStorage.setItem('userId', res.id.toString());
      }  
      if(this.role.includes('SHIPPER')) {         
        this.router.navigateByUrl('/detail-shipper/'+ localStorage.getItem('userId'));
        //localStorage.setItem('userId', res.id.toString());
      }
      this.mode=0;
      //console.log("this role : "+this.role)
    }
    //*/
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
          if(res.roleName.includes('TRANSPORTER')) {         
            this.router.navigateByUrl('/detail-transporter/'+ res.id);
            localStorage.setItem('userId', res.id.toString());
          }  
          if(res.roleName.includes('SHIPPER')) {         
            this.router.navigateByUrl('/detail-shipper/'+ res.id);
            localStorage.setItem('userId', res.id.toString());
          }
          this.mode=0;
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
    this.role="";
    //this.log=1;
    //window.open("http://192.168.0.131")
    this.router.navigateByUrl("");
    //window.close();
  }
  // on close window
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event){
    alert("I'm leaving the app");
    localStorage.clear();
  }
  onTransporter(){
    let role = localStorage.getItem('role')
    let userId = localStorage.getItem('userId')       
    if(role.includes('TRANSPORTER')) {         
      this.router.navigateByUrl('/detail-transporter/'+ userId);
    }
    else
      this.router.navigateByUrl('/transporters/');
  }
  onShipper(){
    let role = localStorage.getItem('role')
    let userId = localStorage.getItem('userId')       
    if(role.includes('SHIPPER')) {         
      this.router.navigateByUrl('/detail-shipper/'+ userId);
    }
    else
      this.router.navigateByUrl('/shippers/');
  }
}
