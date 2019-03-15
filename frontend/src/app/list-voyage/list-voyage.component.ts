import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageVoyage } from 'src/model/model.pageVoyage';
import { VoyagesService } from 'src/services/voyages.service';
import { Voyage } from 'src/model/model.voyage';

@Component({
  selector: 'app-list-voyage',
  templateUrl: './list-voyage.component.html',
  styleUrls: ['./list-voyage.component.css']
})
export class ListVoyageComponent implements OnInit {
  modeModif=0;
  pageVoyage:PageVoyage = new  PageVoyage();  // pour tenir des Voyages
  motCle:string="";
  currentPage:number=0;
  size:number=5;
  pages:Array<number>;  // pour tenir des numeros des pages
  voyages:Array<Voyage>;
  role:string="";
  constructor(public voyagesService:VoyagesService, public router:Router) { }

  ngOnInit() {
    this.role=localStorage.getItem("role");
    this.doSearch()
  }
  doSearch(){
    if(this.role.includes("TRANSPORTER") && localStorage.getItem("userId")!=null){
      this.voyagesService.voyagesDeTransporter(Number(localStorage.getItem("userId")))
      .subscribe((data:Array<Voyage>)=>{
        this.voyages=data
      }, err=>{
        console.log(err)
      })
    }
    else{
      this.voyagesService.getVoyages(this.motCle, this.currentPage, this.size).subscribe((data:PageVoyage)=>{
        this.pageVoyage=data;
        this.pages=new Array(data.totalPages);
      }, err=>{
        console.log(err);
      })
    }  
  }
  chercher(){
    this.doSearch();
  }
  gotoPage(i:number){
    this.currentPage=i;
    this.doSearch();
  }

  gotoDetailVoyage(v:Voyage){
    this.modeModif=1;
    //this.router.navigate(['detail-voyage',v.id]);
  }

  deleteVoyage(id:number){
    this.voyagesService.deleteVoyage(id).subscribe(data=>{

    }, err=>{
      console.log(err)
    })
    this.doSearch();
  }

}
