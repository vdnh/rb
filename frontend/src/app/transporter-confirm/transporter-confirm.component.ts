import { Component, OnInit } from '@angular/core';
import { TransportersService } from 'src/services/transporters.service';
import { Transporter } from 'src/model/model.transporter';

@Component({
  selector: 'app-transporter-confirm',
  templateUrl: './transporter-confirm.component.html',
  styleUrls: ['./transporter-confirm.component.css']
})
export class TransporterConfirmComponent implements OnInit {
  transporter: Transporter;
  imgLogoUrl: string;

  constructor(public transportersService:TransportersService,) { }

  selfName=""
  selfNId=""
  selfNIR="NIR  R-1091728"
  selfAddress=""
  selfVille=""
  selfCodePostal=""
  selfTel="450-974-9111"
  datePick:Date=new Date();
  dateDrop:Date=new Date();

  comName=''
  comContact=''
  comAddress=''
  comVille=''
  comTel=''

  pickFrom=''
  pickName=''
  pickAddress=''
  pickVille=''
  pickCodePostal=''

  shipTo=''
  shipName=''
  shipAddress=''
  shipVille=''
  shipCodePostal=''

  formNumero=''
  formDescription=''
  formMontant=''
  formPickUp=''
  formDrop=''
  formNotes=''

  ngOnInit() {
    this.transportersService.getDetailTransporter(Number(localStorage.getItem('idTransporter'))).subscribe(async(data:Transporter)=>{
      this.transporter=data;
      this.imgLogoUrl=this.transporter.photo
    }, err=>{console.log(err)})
    // let selectedFile : File=new File(["logoSOSPrestige"],"assets/images/logoSOSPrestige.jpg", {type:'image/jpg',});
    // if(selectedFile){
    //   const reader = new FileReader();
    //   reader.onload = ()=>{this.imgLogoUrl=reader.result.toString();}
    //   reader.readAsDataURL(selectedFile)
    //   console.log('this.imgLogoUrl: '+this.imgLogoUrl)
    // }
    // else this.imgLogoUrl='';

    // let fileName= "assets/images/logoSOSPrestige.jpg";
    // let blob = new Blob
    
  }
  
  dateChange(event, dt){
    dt =event.target.value
  }
  datePickChange(event){
    this.datePick =event.target.value
  }
  dateDropChange(event){
    this.dateDrop =event.target.value
  }
  
  print(cmpId){
    if(this.selfNId.length==0){
      this.transportersService.getDetailTransporter(Number(localStorage.getItem('idTransporter'))).subscribe((data:Transporter)=>{
        this.transporter=data;
        this.transporter.lastNumber=this.transporter.lastNumber+1
        this.selfNId=this.transporter.lastNumber.toString()
        this.transportersService.saveTransporters(this.transporter).subscribe(dt=>{
          const printContent = document.getElementById(cmpId);     
          const WindowPrt = window.open();
          WindowPrt.document.write(printContent.innerHTML);
          WindowPrt.document.close();
          WindowPrt.focus();
          WindowPrt.print();
          WindowPrt.close();
        }, 
          err=>{console.log(err)})
      }, err=>{console.log(err)})
    }
    else{
      const printContent = document.getElementById(cmpId);
      const WindowPrt = window.open();
      // WindowPrt.document.write('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
      WindowPrt.document.write(printContent.innerHTML);
      WindowPrt.document.close();
      WindowPrt.focus();
      WindowPrt.print();
      WindowPrt.close();
    }
  }
  
}
