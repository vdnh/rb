import { Component, OnInit } from '@angular/core';
//import {Http} from '@angular/http';
import { map } from 'rxjs/operators';
import { ShippersService } from '../../services/shippers.service';
import { Router } from '@angular/router';
import { PageShipper } from 'src/model/model.pageShipper';
import { AuthenticationService } from 'src/services/authentication.service';
import { Shipper } from 'src/model/model.shipper';
import { AppUser } from 'src/model/model.appUser';
//import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-shippers',
  templateUrl: './shippers.component.html',
  styleUrls: ['./shippers.component.css']
})
export class ShippersComponent implements OnInit 
{
  pageShipper:PageShipper = new  PageShipper();  // pour tenir des Shippers
  motCle:string="";
  currentPage:number=0;
  size:number=50;
  pages:Array<number>;  // pour tenir des numeros des pages
  role: string;
  //index=1;

  //*/
  constructor(public authenticationService:AuthenticationService, public shipperservice:ShippersService, public router:Router) { }

  ngOnInit() {
    //this.index=1;
    this.role=localStorage.getItem('role');
    this.doSearch();
    console.log("this from shippers component")
  }
//*
  doSearch(){
    if(localStorage.getItem('idTransporter')!=undefined)
    {
      let idTransporter = Number(localStorage.getItem('idTransporter'))
      this.shipperservice.getShippersByIdTransporter(this.motCle, idTransporter, this.currentPage, this.size).subscribe((data:PageShipper)=>{
        this.pageShipper=data;
        // sort list of shippers
        this.pageShipper.content.sort((a, b)=>{
          return a.nom.localeCompare(b.nom)
        })
        //
        this.pages=new Array(data.totalPages);
      }, err=>{
        console.log(err);
      })
    }
    else{
      this.shipperservice.getShippers(this.motCle, this.currentPage, this.size).subscribe((data:PageShipper)=>{
        this.pageShipper=data;
        // sort list of shippers
        this.pageShipper.content.sort((a, b)=>{
          return a.nom.localeCompare(b.nom)
        })
        //
        this.pages=new Array(data.totalPages);
      }, err=>{
        console.log(err);
      })
    }
    // this.shipperservice.getShippers(this.motCle, this.currentPage, this.size).subscribe((data:PageShipper)=>{
    //   this.pageShipper=data;
    //   // sort list of shippers
    //   this.pageShipper.content.sort((a, b)=>{
    //     return a.nom.localeCompare(b.nom)
    //   })
    //   //
    //   this.pages=new Array(data.totalPages);
    // }, err=>{
    //   console.log(err);
    // })
  }
  chercher(){
    this.doSearch();
  }
  gotoPage(i:number){
    this.currentPage=i;
    this.doSearch();
  }
  gotoDetailShipper(id:number){
    this.router.navigate(['detail-shipper',id]);
  }

  gotoDetailShipperParticulier(id:number){
    
    // check if idTransporter exist to confirm idTransporter
    if(localStorage.getItem('idTransporter')!=undefined) 
      id=Number(localStorage.getItem('idTransporter'))
    
    this.router.navigate(['detail-shipper-particulier',id]);
  }

  deleteShipper(id:number){
    this.shipperservice.deleteShipper(id).subscribe((shipper:Shipper)=>{
      this.deleteAppUser(shipper);
      //this.pageShipper.content.splice(this.pageShipper.content.indexOf(shipper), 1)
      this.gotoPage(this.currentPage);
    }, err=>{
      console.log(err);
    });

    //this.gotoPage(this.currentPage);
    //alert("Avoir rafraichi apres delete!!");
  }

  deleteAppUser(shipper:Shipper){
    console.log('shipper.loginName :  '+shipper.loginName)
      this.authenticationService.getAllAppUsers().subscribe((appUsers:Array<AppUser>)=>{
        appUsers.forEach(aU=>{
          if(aU.username.includes(shipper.loginName)&&(aU.username.length==shipper.loginName.length)){
            this.authenticationService.deleteAppUser(aU).subscribe((data:AppUser)=>{
              console.log("Clients' appUser was deleted too.")
            }, err=>{
              console.log(err);
            });
          }
        })
      }, err=>{console.log(err)})
  }
//*/
}
