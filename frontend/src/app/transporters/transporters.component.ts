import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { TransportersService } from '../../services/transporters.service';
import { Router } from '@angular/router';
import { PageTransporter } from 'src/model/model.pageTransporter';
import { Transporter } from 'src/model/model.transporter';
import { VarsGlobal } from 'src/services/VarsGlobal';

@Component({
  selector: 'app-transporters',
  templateUrl: './transporters.component.html',
  styleUrls: ['./transporters.component.css']
})
export class TransportersComponent implements OnInit {

  pageTransporter:PageTransporter= new PageTransporter();
  motCle:string="";
  currentPage:number=0;
  size:number=25;

  pages:Array<number>;

  constructor(public transporterservice:TransportersService, public router:Router, public varsGlobal : VarsGlobal) { }

  ngOnInit() {
    this.doSearch();
  }

  doSearch(){
    this.transporterservice.getTransporters(this.motCle, this.currentPage, this.size).subscribe((data:PageTransporter)=>{
      this.pageTransporter=data;
      this.pages=new Array(data.totalPages);
    }, err=>{
      console.log(err);
    })
  }
  chercher(){
    this.doSearch();
  }
  gotoPage(i:number){
    this.currentPage=i;
    this.doSearch();
  }
  gotoDetailTransporter(id:number){
    this.router.navigate(['detail-transporter',id]);
  }

  deleteTransporter(transporter: Transporter){
    var r = confirm("Are you sure to delete this transporter : " + transporter.nom)
    this.transporterservice.deleteTransporter(transporter.id)
    .subscribe(data=>{
      this.doSearch();
    }, err=>{
      console.log(err);
    });
    /*
    this.gotoPage(this.currentPage);
    alert("Avoir rafraichi apres delete!!");//*/
  }

}
