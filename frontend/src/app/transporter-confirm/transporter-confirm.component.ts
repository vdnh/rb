import { Component, OnInit } from '@angular/core';
import { TransportersService } from 'src/services/transporters.service';
import { Transporter } from 'src/model/model.transporter';
import { ConfirmTransportService } from 'src/services/confirmTransport.service';
import { ConfirmTransport } from 'src/model/model.confirmTransport';

@Component({
  selector: 'app-transporter-confirm',
  templateUrl: './transporter-confirm.component.html',
  styleUrls: ['./transporter-confirm.component.css']
})
export class TransporterConfirmComponent implements OnInit {
  confirmTransport:ConfirmTransport;
  transporter: Transporter;
  imgLogoUrl: string;

  constructor(public transportersService:TransportersService,
    public confirmTransportService : ConfirmTransportService) { 

    }

  idTransporter:number;
  selfName=""
  selfnid="9299-9101 Quebec Inc"
  selfnir="NIR  R-1091728"
  selfAddress=""
  selfVille=""
  selfCodePostal=""
  selfTel="450-974-9111"
  selfContact='' // if there are many names, separate with /
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
  formContact='Marc-André / Steven'
  formTel=''
  formEmail=''

  listConfirm: Array<ConfirmTransport> = [];

  ngOnInit() {
    this.confirmTransport=new ConfirmTransport();
    this.transportersService.getDetailTransporter(Number(localStorage.getItem('idTransporter'))).subscribe(async(data:Transporter)=>{
      this.transporter=data;
      this.idTransporter=data.id;
      this.imgLogoUrl=this.transporter.photo
      this.formTel=this.transporter.tel
      this.formEmail=this.transporter.email
      this.confirmTransportService.confirmTransportsDeTransporter(data.id).subscribe((dt:Array<ConfirmTransport>)=>{
        this.listConfirm=dt.sort((b,a)=>Number(a.formNumero)-Number(b.formNumero));
        // console.log("this.listConfirm.length : "+this.listConfirm.length)
      })
      // this.confirmTransportService.getDetailConfirmTransport(10228).subscribe((data:ConfirmTransport)=>{
      //   console.log('data.id : '+data.id + ' = 10228 ????')
      //   this.confirmTransport=data;
      //   console.log('this.confirmTransport.id : '+this.confirmTransport.id)
      // })
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
  
  copyForm(){
    this.formNumero=''
    this.confirmTransport=new ConfirmTransport(); //.id=null;  
  }

  newForm(){
    this.confirmTransport = new ConfirmTransport();

    this.selfName=""
    this.selfnid="9299-9101 Quebec Inc"
    this.selfnir="NIR  R-1091728"
    this.selfAddress=""
    this.selfVille=""
    this.selfCodePostal=""
    this.selfTel="450-974-9111"
    this.selfContact='' // if there are many names, separate with /
    this.datePick=new Date();
    this.dateDrop=new Date();

    this.comName=''
    this.comContact=''
    this.comAddress=''
    this.comVille=''
    this.comTel=''

    this.pickFrom=''
    this.pickName=''
    this.pickAddress=''
    this.pickVille=''
    this.pickCodePostal=''

    this.shipTo=''
    this.shipName=''
    this.shipAddress=''
    this.shipVille=''
    this.shipCodePostal=''

    this.formNumero=''
    this.formDescription=''
    this.formMontant=''
    this.formPickUp=''
    this.formDrop=''
    this.formNotes=''
    this.formContact='Marc-André / Steven'
    //this.formTel=''
    //this.formEmail=''
  }
  
  cloneConfirmTransport(ct:ConfirmTransport){
    ct.comAddress=this.comAddress
    ct.comContact=this.comContact
    ct.comName=this.comName
    ct.comTel=this.comTel
    ct.comVille=this.comVille
    ct.dateDrop=this.dateDrop
    ct.datePick=this.datePick
    ct.formContact=this.formContact
    ct.formDescription=this.formDescription
    ct.formDrop=this.formDrop
    ct.formEmail=this.formEmail
    ct.formMontant=this.formMontant
    ct.formNotes=this.formNotes
    ct.formNumero=this.formNumero
    ct.formPickUp=this.formPickUp
    ct.formTel=this.formTel
    ct.idTransporter=this.idTransporter
    ct.pickAddress=this.pickAddress
    ct.pickCodePostal=this.pickCodePostal
    ct.pickFrom=this.pickFrom
    ct.pickName=this.pickName
    ct.pickVille=this.pickVille
    ct.selfAddress=this.selfAddress
    ct.selfCodePostal=this.selfCodePostal
    ct.selfnir=this.selfnir
    ct.selfnid=this.selfnid
    ct.selfName=this.selfName
    ct.selfTel=this.selfTel
    ct.selfVille=this.selfVille
    ct.shipAddress=this.shipAddress
    ct.shipCodePostal=this.shipCodePostal
    ct.shipName=this.shipName
    ct.shipTo=this.shipTo
    ct.shipVille=this.shipVille
  }

  confirmFound(ct:ConfirmTransport){
    this.comAddress=ct.comAddress
    this.comContact=ct.comContact
    this.comName=ct.comName
    this.comTel=ct.comTel
    this.comVille=ct.comVille
    this.dateDrop=ct.dateDrop
    this.datePick=ct.datePick
    this.formContact=ct.formContact
    this.formDescription=ct.formDescription
    this.formDrop=ct.formDrop
    this.formEmail=ct.formEmail
    this.formMontant=ct.formMontant
    this.formNotes=ct.formNotes
    this.formNumero=ct.formNumero
    this.formPickUp=ct.formPickUp
    this.formTel=ct.formTel
    this.idTransporter=ct.idTransporter
    this.pickAddress=ct.pickAddress
    this.pickCodePostal=ct.pickCodePostal
    this.pickFrom=ct.pickFrom
    this.pickName=ct.pickName
    this.pickVille=ct.pickVille
    this.selfAddress=ct.selfAddress
    this.selfCodePostal=ct.selfCodePostal
    this.selfnir=ct.selfnir
    this.selfnid=ct.selfnid
    this.selfName=ct.selfName
    this.selfTel=ct.selfTel
    this.selfVille=ct.selfVille
    this.shipAddress=ct.shipAddress
    this.shipCodePostal=ct.shipCodePostal
    this.shipName=ct.shipName
    this.shipTo=ct.shipTo
    this.shipVille=ct.shipVille
  }

  print(cmpId){
    if(this.formNumero.length==0){
      this.transportersService.getDetailTransporter(Number(localStorage.getItem('idTransporter'))).subscribe((data:Transporter)=>{
        this.transporter=data;
        this.transporter.lastNumber=this.transporter.lastNumber+1
        this.formNumero=this.transporter.lastNumber.toString()
        this.transportersService.saveTransporters(this.transporter).subscribe(dt=>{
          const printContent = document.getElementById(cmpId);     
          const WindowPrt = window.open();
          WindowPrt.document.write(printContent.innerHTML);
          WindowPrt.document.close();
          WindowPrt.focus();
          WindowPrt.print();
          WindowPrt.close();
          this.cloneConfirmTransport(this.confirmTransport)
          // console.log('this.confirmTransport.id at begining: '+this.confirmTransport.id)
          this.confirmTransportService.saveConfirmTransports(this.confirmTransport).
          subscribe((d:ConfirmTransport)=>{
            // console.log('d.id after creating: '+d.id)
            this.confirmTransport=d;
            this.listConfirm.push(this.confirmTransport);
            this.listConfirm.sort((b,a)=>Number(a.formNumero)-Number(b.formNumero));
            // console.log('this.confirmTransport.id after creating : '+d.id)
          }, err=>{console.log(err)})
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
      this.cloneConfirmTransport(this.confirmTransport)
      // console.log('this.confirmTransport.id at begining modify: '+this.confirmTransport.id)
      this.confirmTransportService.saveConfirmTransports(this.confirmTransport).
          subscribe((d:ConfirmTransport)=>{
            // console.log('d.id after modifying: '+this.confirmTransport.id)
            this.confirmTransport=d;
            // console.log('this.confirmTransport.id after modifying: '+this.confirmTransport.id)
          }, err=>{console.log(err)})
    }
  }
  
}
