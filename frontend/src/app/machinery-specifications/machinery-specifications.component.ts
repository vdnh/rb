import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VarsGlobal } from 'src/services/VarsGlobal';

@Component({
  selector: 'app-machinery-specifications',
  templateUrl: './machinery-specifications.component.html',
  styleUrls: ['./machinery-specifications.component.css']
})
export class MachinerySpecificationsComponent implements OnInit {

  name = 'Set iframe source';
  url: string = '';
  urlSafe: SafeResourceUrl;

  nameMachine=''
  machines=['mach01 test genie 1506','engin02 roller 65p','roller03 nacelle t 890']

  imgUrl='';
  imgUrlSafe: SafeResourceUrl;

  imgUrl02='';
  imgUrlSafe02: SafeResourceUrl;

  imgUrl03='';
  imgUrlSafe03: SafeResourceUrl;
  
  // specs
  spec:{name:string, descrip:string}={name:"", descrip:""}
  specs=[] //:[{name:string, descrip:string}, ]
  constructor(public sanitizer: DomSanitizer, public varsGlobal:VarsGlobal,) {}

  ngOnInit():void {
    // this.specs.push(this.spec)
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  nameMachineChange(){
    if(!this.machines.includes(this.nameMachine)) this.machines.push(this.nameMachine)
    else alert(this.nameMachine + " exist")
  }

  onSiteReferChange(){
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  onFileUpLoad(event, imgUrl="", imgUrlSafe:SafeResourceUrl){
    let selectedFile : File=event.target.files[0];
    let size : number; // = selectedFile.size
    // let imgUrl=""
    if(selectedFile){
      size = selectedFile.size
      console.log('size file: '+ size)  // in Byte => 25 MByte ~ 26.000.000 Byte
      // console.log("selectedFile:  "+selectedFile)
    }    
    if(selectedFile && size<26000000 && 
        (
        selectedFile.name.includes(".png") ||
        selectedFile.name.includes(".gif") ||
        selectedFile.name.includes(".jfif") ||
        selectedFile.name.includes(".pjeg") ||
        selectedFile.name.includes(".jpeg") ||
        selectedFile.name.includes(".pjp") ||
        selectedFile.name.includes(".jpg") ||
        selectedFile.name.includes(".svg")
        )
      ){
//      this.em.nameAttached=selectedFile.name
      // console.log('selectedFile.name : ' + selectedFile.name)
      const reader = new FileReader();
      reader.onload = ()=>{
        imgUrl=reader.result.toString();
        console.log("imgUrl:  "+imgUrl)
        imgUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(imgUrl);
      }
      reader.readAsDataURL(selectedFile)
    }
    else {
      imgUrl='';
      event.value = null;
      event = null;
      //(<HTMLFormElement>document.getElementById("formUpload")).reset();
      if(size >= 26000000){ 
        if(this.varsGlobal.language.includes('Francais'))
          alert("Ne pas attacher un fichier plus grand que 25 MB !!!")
        else alert("Can't upload file more than 25 MB !!!")
      }
    }

  }

  onFileUpLoadTest(event){
    let selectedFile : File=event.target.files[0];
    let size : number; // = selectedFile.size
    // let imgUrl=""
    if(selectedFile){
      size = selectedFile.size
      console.log('size file: '+ size)  // in Byte => 25 MByte ~ 26.000.000 Byte
      // console.log("selectedFile:  "+selectedFile)
    }    
    if(selectedFile && size<26000000 && 
        (
        selectedFile.name.includes(".png") ||
        selectedFile.name.includes(".gif") ||
        selectedFile.name.includes(".jfif") ||
        selectedFile.name.includes(".pjeg") ||
        selectedFile.name.includes(".jpeg") ||
        selectedFile.name.includes(".pjp") ||
        selectedFile.name.includes(".jpg") ||
        selectedFile.name.includes(".svg")
        )
      ){
//      this.em.nameAttached=selectedFile.name
      // console.log('selectedFile.name : ' + selectedFile.name)
      const reader = new FileReader();
      reader.onload = ()=>{
        this.imgUrl=reader.result.toString();
        console.log("imgUrl:  "+this.imgUrl)
        this.imgUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.imgUrl);
      }
      reader.readAsDataURL(selectedFile)
    }
    else {
      this.imgUrl='';
      this.imgUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.imgUrl);
      event.value = null;
      event = null;
      //(<HTMLFormElement>document.getElementById("formUpload")).reset();
      if(size >= 26000000){ 
        if(this.varsGlobal.language.includes('Francais'))
          alert("Ne pas attacher un fichier plus grand que 25 MB !!!")
        else alert("Can't upload file more than 25 MB !!!")
      }
    }
  }

  onFileUpLoadTest02(event){
    let selectedFile : File=event.target.files[0];
    let size : number; // = selectedFile.size
    // let imgUrl=""
    if(selectedFile){
      size = selectedFile.size
      console.log('size file: '+ size)  // in Byte => 25 MByte ~ 26.000.000 Byte
      // console.log("selectedFile:  "+selectedFile)
    }    
    if(selectedFile && size<26000000 && 
        (
        selectedFile.name.includes(".png") ||
        selectedFile.name.includes(".gif") ||
        selectedFile.name.includes(".jfif") ||
        selectedFile.name.includes(".pjeg") ||
        selectedFile.name.includes(".jpeg") ||
        selectedFile.name.includes(".pjp") ||
        selectedFile.name.includes(".jpg") ||
        selectedFile.name.includes(".svg")
        )
      ){
//      this.em.nameAttached=selectedFile.name
      // console.log('selectedFile.name : ' + selectedFile.name)
      const reader = new FileReader();
      reader.onload = ()=>{
        this.imgUrl02=reader.result.toString();
        console.log("imgUrl02:  "+this.imgUrl02)
        this.imgUrlSafe02 = this.sanitizer.bypassSecurityTrustResourceUrl(this.imgUrl02);
      }
      reader.readAsDataURL(selectedFile)
    }
    else {
      this.imgUrl02='';
      this.imgUrlSafe02 = this.sanitizer.bypassSecurityTrustResourceUrl(this.imgUrl02);
      event.value = null;
      event = null;
      //(<HTMLFormElement>document.getElementById("formUpload")).reset();
      if(size >= 26000000){ 
        if(this.varsGlobal.language.includes('Francais'))
          alert("Ne pas attacher un fichier plus grand que 25 MB !!!")
        else alert("Can't upload file more than 25 MB !!!")
      }
    }
  }

  onFileUpLoadTest03(event){
    let selectedFile : File=event.target.files[0];
    let size : number; // = selectedFile.size
    // let imgUrl=""
    if(selectedFile){
      size = selectedFile.size
      console.log('size file: '+ size)  // in Byte => 25 MByte ~ 26.000.000 Byte
      // console.log("selectedFile:  "+selectedFile)
    }    
    if(selectedFile && size<26000000 && 
        (
        selectedFile.name.includes(".png") ||
        selectedFile.name.includes(".gif") ||
        selectedFile.name.includes(".jfif") ||
        selectedFile.name.includes(".pjeg") ||
        selectedFile.name.includes(".jpeg") ||
        selectedFile.name.includes(".pjp") ||
        selectedFile.name.includes(".jpg") ||
        selectedFile.name.includes(".svg")
        )
      ){
//      this.em.nameAttached=selectedFile.name
      // console.log('selectedFile.name : ' + selectedFile.name)
      const reader = new FileReader();
      reader.onload = ()=>{
        this.imgUrl03=reader.result.toString();
        console.log("imgUrl03:  "+this.imgUrl03)
        this.imgUrlSafe03 = this.sanitizer.bypassSecurityTrustResourceUrl(this.imgUrl03);
      }
      reader.readAsDataURL(selectedFile)
    }
    else {
      this.imgUrl03='';
      this.imgUrlSafe03 = this.sanitizer.bypassSecurityTrustResourceUrl(this.imgUrl03);
      event.value = null;
      event = null;
      //(<HTMLFormElement>document.getElementById("formUpload")).reset();
      if(size >= 26000000){ 
        if(this.varsGlobal.language.includes('Francais'))
          alert("Ne pas attacher un fichier plus grand que 25 MB !!!")
        else alert("Can't upload file more than 25 MB !!!")
      }
    }
  }
}
