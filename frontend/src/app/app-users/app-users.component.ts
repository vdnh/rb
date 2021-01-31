import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { AppUser } from 'src/model/model.appUser';
import { AuthenticationService } from 'src/services/authentication.service';
import { Shipper } from 'src/model/model.shipper';
import { ShippersService } from 'src/services/shippers.service';
import { TransportersService } from 'src/services/transporters.service';
import { Transporter } from 'src/model/model.transporter';
import { PlanPrice } from 'src/model/model.planPrice';
import { PlanPriceService } from 'src/services/planPrice.service';

@Component({
  selector: 'app-app-users',
  templateUrl: './app-users.component.html',
  styleUrls: ['./app-users.component.css']
})
export class AppUsersComponent implements OnInit {

  roleTypes = [
    "ADMIN", 
    "SHIPPER", 
    "TRANSPORTER", 
    "DISPATCH", 
    "TECHNICIEN", 
    "CHAUFFEUR",
    "TERMINAL"
  ];
  planPrice : PlanPrice = new PlanPrice();
  appUser : AppUser = new AppUser();
  appUserToMod : AppUser = new AppUser();
  appUserToDel : AppUser = new AppUser();
  listAppUsers : Array<AppUser> = [];
  passwordCheck=''
  passwordCheckToMod=''
  disabledIdUser=false;
  disabledIdSecond=false;
  listShippers: Array<Shipper>=[];
  listTrans: Array<Transporter>=[];
  listPros: any[];
  listPros2em: any[];
  //listUser: Array<AppUser>;
  
  onCreatUserTest(){
    console.log(this.appUser)
    alert('User a ete cree!!')
    this.appUser = new AppUser();
    this.passwordCheck='';
  }

  async onCreatUser(){
    let exist=false; // this loginName doesn't exist yet
    await this.listAppUsers.forEach(aU=>{
      if(aU.username.includes(this.appUser.username)&&(aU.username.length==this.appUser.username.length))
        {
          alert("Username existe deja. Choisir un autre username, SVP!");
          exist=true; // this loginName exist already
        }
    })
    if(!exist){
      this.authenticationService.createAppUser(this.appUser).subscribe((data:AppUser)=>{
        this.appUser = new AppUser();
        this.passwordCheck='';
        console.log('User was created.')
      }, err=>{
        console.log(err);
      });
    }
  }
  
  typeRoleChange(type){
    this.appUser.roleSimple=type
    if(this.appUser.roleSimple.includes('ADMIN')){
      this.disabledIdUser=true;
      this.disabledIdSecond=true;
    }
    else if(this.appUser.roleSimple.includes('SHIPPER')){
      this.disabledIdUser=false;
      this.disabledIdSecond=false;
      this.listPros=this.listShippers
      this.listPros2em=this.listTrans
    }
    else if(this.appUser.roleSimple.includes('TRANSPORTER')){
      this.disabledIdUser=false;
      this.disabledIdSecond=false;
      this.listPros=this.listTrans
      this.listPros2em=this.listShippers
    }
    else if(this.appUser.roleSimple.includes('DISPATCH')){
      this.disabledIdUser=false;
      this.disabledIdSecond=true; // reserve for future
    }
    else if(this.appUser.roleSimple.includes('TECHNICIEN')){
      this.disabledIdUser=false;
      this.disabledIdSecond=true; // reserve for future
    }
    else if(this.appUser.roleSimple.includes('CHAUFFEUR')){
      this.disabledIdUser=false;
      this.disabledIdSecond=true; // reserve for future
    }
    else if(this.appUser.roleSimple.includes('TERMINAL')){
      this.disabledIdUser=false;
      this.disabledIdSecond=true; // reserve for future
    }
  }
  constructor(public authenticationService:AuthenticationService,
    public shipperservice:ShippersService,
    public transporterservice:TransportersService,
    public planPriceService:PlanPriceService) { 

    }

  ngOnInit() {
    this.appUser.roleSimple=this.roleTypes[0];
    this.planPriceService.getAllPlanPrices().subscribe((data:Array<PlanPrice>)=>{
      if(data!=null && data.length>0){
        this.planPrice=data[0]
      }
    }, err=>{console.log(err)})
    // getShippersTransporter
    if(localStorage.getItem('idTransporter')!=null && Number(localStorage.getItem('idTransporter'))>0){
      // this.shipperservice.getAllShippers().subscribe(async (data:Array<Shipper>)=>{
      this.shipperservice.getShippersTransporter(Number(localStorage.getItem('idTransporter'))).subscribe((data:Array<Shipper>)=>{
        this.listShippers=data;
        // this.transporterservice.getAllTransporters().subscribe((data:Array<Transporter>)=>{
        this.transporterservice.getDetailTransporter(Number(localStorage.getItem('idTransporter'))).subscribe((data:Transporter)=>{
          this.listTrans.push(data);
          // this.listTrans = data;
          this.typeRoleChange(this.roleTypes[0]);
        }, err=>{
          console.log(err)
        })
      }, err=>{
        console.log(err)
      })
    }
    else{
      this.shipperservice.getAllShippers().subscribe(async (data:Array<Shipper>)=>{
        // this.shipperservice.getShippersTransporter(Number(localStorage.getItem('idTransporter'))).subscribe((data:Array<Shipper>)=>{
          this.listShippers=data;
          this.transporterservice.getAllTransporters().subscribe((data:Array<Transporter>)=>{
          // this.transporterservice.getDetailTransporter(Number(localStorage.getItem('idTransporter'))).subscribe((data:Transporter)=>{
            // this.listTrans.push(data);
            this.listTrans = data;
            this.typeRoleChange(this.roleTypes[0]);
          }, err=>{
            console.log(err)
          })
        }, err=>{
          console.log(err)
        })
    }
    
    
    if(localStorage.getItem('idTransporter')!=null){
      this.roleTypes = [
        "DISPATCH", 
        "TECHNICIEN", 
        // "TERMINAL"
      ];
      this.authenticationService.getAllUsersByIdTransporter(Number(localStorage.getItem('idTransporter'))).subscribe((data:Array<AppUser>)=>{
        this.listAppUsers=data.filter(x=>(!x.roleSimple.includes("TERMINAL")));
      },
      err=>{
        console.log(err)
      })
    }
    else{
      this.authenticationService.getAllAppUsers().subscribe((data:Array<AppUser>)=>{
        this.listAppUsers=data;
      },
      err=>{
        console.log(err)
      })
    }
    
  }
  
  idUserChange(){
    let temp = this.appUser.idUser;
    let strings:Array<string>=this.appUser.idUser.split(" ");
    this.appUser.idUser=strings[1];
    this.appUser.entrepriseNom = temp.split(this.appUser.idUser)[1]
    if(strings[0]=='Trans') this.listPros2em = this.listShippers
    else if(strings[0]=='Ship') this.listPros2em = this.listTrans
  }
  
  idSecondChange(){
    let strings:Array<string>=this.appUser.idSecond.split(" ")
    this.appUser.idSecond=strings[0]
  }

  onModifyUser(){
    this.authenticationService.modifyAppUser(this.appUserToMod).subscribe((data:AppUser)=>{
      //this.appUser = new AppUser();
      //this.passwordCheckToMod='';
      alert('User was modified.')
      console.log('User was modified.')
      this.ngOnInit()
      // this.authenticationService.getAllAppUsers().subscribe((data:Array<AppUser>)=>{
      //   this.listAppUsers=data;
      // },
      // err=>{
      //   console.log(err)
      // })
    }, err=>{
      console.log(err);
    });
  }

  onDeleteUser(){
    this.authenticationService.deleteAppUser(this.appUserToMod).subscribe((data:AppUser)=>{
      //this.appUser = new AppUser();
      //this.passwordCheckToMod='';
      alert('User was deleted.')
      console.log('User was deleted.')
      this.ngOnInit()
      // this.authenticationService.getAllAppUsers().subscribe((data:Array<AppUser>)=>{
      //   this.listAppUsers=data;
      // },
      // err=>{
      //   console.log(err)
      // })
    }, err=>{
      console.log(err);
    });
  }

  setPlanPrice(){
    this.planPriceService.savePlanPrice(this.planPrice).subscribe((data:PlanPrice)=>{
      this.planPrice=data
      alert("Plan Price was set.")
    }, err=>{console.log(err)})
  }
}
