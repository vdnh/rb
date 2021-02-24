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
import { PlanOrderService } from 'src/services/planOrder.service';
import { PlanOrder } from 'src/model/model.planOrder';

@Component({
  selector: 'app-app-users',
  templateUrl: './app-users.component.html',
  styleUrls: ['./app-users.component.css']
})
export class AppUsersComponent implements OnInit {

  role = ''; // role of login, localStorage.getItem('role')
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
  listAppUsersAll : Array<AppUser> = []; // to compare if there is already an username
  passwordCheck=''
  passwordCheckToMod=''
  disabledIdUser=false;
  disabledIdSecond=false;
  listShippers: Array<Shipper>=[];
  listTrans: Array<Transporter>=[];
  listPros: any[];
  listPros2em: any[];
  //listUser: Array<AppUser>;
  
  listPlanOrders:Array<PlanOrderTransporter>=[];
  listPlanOrdersArchived:Array<PlanOrderTransporter>=[];

  onCreatUserTest(){
    console.log(this.appUser)
    alert('User a ete cree!!')
    this.appUser = new AppUser();
    this.passwordCheck='';
  }

  async onCreatUser(){
    let exist=false; // this loginName doesn't exist yet
    await this.listAppUsersAll.forEach(aU=>{
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
    public planPriceService:PlanPriceService,
    public planOrderService:PlanOrderService) { 

    }

  ngOnInit() {
    this.role = localStorage.getItem('role')
    this.appUser.roleSimple=this.roleTypes[0];
    
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
            this.planPriceService.getAllPlanPrices().subscribe((data:Array<PlanPrice>)=>{
              if(data!=null && data.length>0){
                this.planPrice=data[0]
              }
              this.planOrderService.allPlanOrders().subscribe((d:Array<PlanOrder>)=>{
                if(d!=null && d.length>0) d.forEach((po)=>{
                  // filter the orders didn't pay yet
                  if(!po.payed) {
                    let plTr = new PlanOrderTransporter()
                    plTr.planOrder=po
                    plTr.transporter=this.listTrans.find(x=>x.id===plTr.planOrder.idTransporter)
                    // this.camionsGPSAndNoGPS.find(x=>x.id===a.idCamion)
                    this.listPlanOrders.push(plTr)
                  }
                  // filter the orders payed
                  else {
                    let plTr = new PlanOrderTransporter()
                    plTr.planOrder=po
                    plTr.transporter=this.listTrans.find(x=>x.id===plTr.planOrder.idTransporter)
                    this.listPlanOrdersArchived.push(plTr)
                  }
                })
                if(this.listPlanOrders!=null) this.listPlanOrders.sort((b,a)=>{
                  if(a.planOrder.id>b.planOrder.id)
                    return 1;
                  if(a.planOrder.id<b.planOrder.id)
                    return 0;
                  return 0;
                })

                if(this.listPlanOrdersArchived!=null) this.listPlanOrdersArchived.sort((b,a)=>{
                  if(a.planOrder.id>b.planOrder.id)
                    return 1;
                  if(a.planOrder.id<b.planOrder.id)
                    return 0;
                  return 0;
                })
                // this.listPlanOrders=data.filter(pl=>(!pl.payed))
                
                // this.listPlanOrdersArchived=data.filter(pl=>(pl.payed))
              }, err=>{
                console.log(err)
              })
            }, err=>{console.log(err)})
          }, err=>{
            console.log(err)
          })
        }, err=>{
          console.log(err)
        })
    }
    
    this.authenticationService.getAllAppUsers().subscribe((data:Array<AppUser>)=>{
      this.listAppUsersAll=data;
      if(localStorage.getItem('idTransporter')!=null){
        this.roleTypes = [
          "DISPATCH", 
          "TECHNICIEN", 
          // "TERMINAL"
        ];
        this.listAppUsers=data.filter(x=>(
          x.idTransporter==Number(localStorage.getItem('idTransporter')) &&
          !x.roleSimple.includes("TERMINAL")
        ));
      }
      else this.listAppUsers=data;
    }, err=>{console.log(err)})
    
    /*//
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
    //*/
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

  onValidPlanOrder(pO:PlanOrderTransporter){
    /*//
      // in case renew plan 
      if(!this.flagNewPlan){ 
        today = this.planOrder.dateEnding = new Date() ;// new Date(this.transporter.endDatePlan).setHours(today.getHours()+timeLag));
        this.planOrder.dateEnding.setTime(timeEndDatelan + (timeLag*60*60*1000))
        today.setTime(timeEndDatelan + (timeLag*60*60*1000))
        // let heure = today.getHours()
        // today.setHours(heure)
        // this.planOrder.dateEnding.setHours(heure)
        //this.planOrder.dateEnding.setHours(today.getHours()+timeLag);
      }

    //*/
    
     
    pO.planOrder.payed=true;
    pO.planOrder.datePayed = new Date() // pay day is today
    pO.planOrder.datePayedMillis = new Date().getTime();
    pO.planOrder.dateEnding = new Date()
    pO.planOrder.dateEnding.setTime(pO.planOrder.dateEndingMillis)
    pO.planOrder.dateOrder = new Date()
    pO.planOrder.dateOrder.setTime(pO.planOrder.dateOrderMillis)
    if(pO.planOrder.planName.includes("Extension")){  // and then no need update date validation
      pO.transporter.trucks = pO.transporter.trucks + pO.planOrder.trucks
      pO.transporter.clientsPros = pO.transporter.clientsPros + pO.planOrder.clientsPros
      pO.transporter.terminals = pO.transporter.terminals + pO.planOrder.terminals
    }
    else{ // 3 months, 1 year, 2 years  then update the date validation
      let dayTemp =new Date()
      let timeZone= new Date().getTimezoneOffset()
      let timeEndDatePlan = new Date(pO.planOrder.dateEnding).getTime()
      // console.log('timeZone: '+timeZone)
      let timeLag = timeZone/60
      // console.log("timeLag: "+ timeLag )
      pO.transporter.planActual=pO.planOrder.planName
      pO.transporter.trucks = pO.planOrder.trucks
      pO.transporter.clientsPros = pO.planOrder.clientsPros
      pO.transporter.terminals = pO.planOrder.clientsPros
      pO.transporter.daysPlan = pO.planOrder.daysPlan
      
      dayTemp = new Date(pO.planOrder.dateEnding)
      dayTemp.setTime(timeEndDatePlan + (timeLag*60*60*1000))
      pO.transporter.endDatePlan = dayTemp
      pO.transporter.dateEndingMillis = pO.planOrder.dateEndingMillis
    }
    this.planOrderService.savePlanOrder(pO.planOrder).subscribe(data=>{
      this.transporterservice.saveTransporters(pO.transporter).subscribe((data:Transporter)=>{}, err=>{console.log()})
    }, err=>{console.log(err)})
    // this.reps.splice(this.reps.indexOf(r),1)
    this.listPlanOrders.splice(this.listPlanOrders.indexOf(pO), 1)
    if(this.listPlanOrders!=null) this.listPlanOrders.sort((b,a)=>{
      if(a.planOrder.id>b.planOrder.id)
        return 1;
      if(a.planOrder.id<b.planOrder.id)
        return 0;
      return 0;
    })

    this.listPlanOrdersArchived.push(pO)
    if(this.listPlanOrdersArchived!=null) this.listPlanOrdersArchived.sort((b,a)=>{
      if(a.planOrder.id>b.planOrder.id)
        return 1;
      if(a.planOrder.id<b.planOrder.id)
        return 0;
      return 0;
    })
  }
  
}

export class PlanOrderTransporter{
  planOrder:PlanOrder
  transporter:Transporter
}