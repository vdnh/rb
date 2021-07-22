import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MachineSpecsService } from 'src/services/machineSpecs.service';
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
  
  userId=""; // use to identify dispatch of shipper or dispatch general (by defaul "" general)
  
  // specs
  spec:{name:string, descrip:string}={name:"", descrip:""}
  specs=[] //:[{name:string, descrip:string}, ]

  // begin test ng-autocomplete
  
  keyword01 = 'machine';
  clearInput(){
    console.log("clearInput")
    this.nameMachine=''
  }
  selectEvent01(item) {
    // do something with selected item
    console.log('selectEvent01');
    console.log('item: ' + item);
    this.nameMachine=item
    // console.log('item.name: ' + item.name);
  }

  onChangeSearch01(search: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    // console.log('onChangeSearch01');
    this.nameMachine=''
  }

  onFocused01(e) {
    // do something
    // console.log('onFocused01');
    // this.nameMachine=e
  }

  // keyword = 'name';
  // public countries = [
  //   {
  //     id: 1,
  //     name: 'Albania country'
  //   },
  //   {
  //     id: 2,
  //     name: 'Belgium nation'
  //   },
  //   {
  //     id: 3,
  //     name: 'Denmark'
  //   },
  //   {
  //     id: 4,
  //     name: 'Montenegro'
  //   },
  //   {
  //     id: 5,
  //     name: 'Turkey'
  //   },
  //   {
  //     id: 6,
  //     name: 'Ukraine'
  //   },
  //   {
  //     id: 7,
  //     name: 'Macedonia'
  //   },
  //   {
  //     id: 8,
  //     name: 'Slovenia'
  //   },
  //   {
  //     id: 9,
  //     name: 'Georgia'
  //   },
  //   {
  //     id: 10,
  //     name: 'India'
  //   },
  //   {
  //     id: 11,
  //     name: 'Russia'
  //   },
  //   {
  //     id: 12,
  //     name: 'Switzerland'
  //   }
  // ];
  // selectEvent(item) {
  //   // do something with selected item
  //   console.log('selectEvent');
  //   console.log('item.id: ' + item.id);
  //   console.log('item.name: ' + item.name);
  // }

  // onChangeSearch(search: string) {
  //   // fetch remote data from here
  //   // And reassign the 'data' which is binded to 'data' property.
  //   console.log('onChangeSearch');
  // }

  // onFocused(e) {
  //   // do something
  //   console.log('onFocused');
  // }
  // end test ng-autocomplete 

  allLightMachines:Map<number, string>=new Map<number, string>();

  constructor(public sanitizer: DomSanitizer, public varsGlobal:VarsGlobal, public machineSpecsService:MachineSpecsService) {}

  ngOnInit():void {
    this.userId=localStorage.getItem('userId')
    if(this.userId==null) this.userId=""
    // this.specs.push(this.spec)
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    this.machineSpecsService.getAllLightMachines().subscribe((data:Map<number, string>)=>{
      if(data==null) console.log('No Machine for now')
      else this.allLightMachines=data
    }, err=>{console.log(err)})
  }

  nameMachineChange(){
    if(!this.machines.includes(this.nameMachine)) this.machines.push(this.nameMachine)
    else alert(this.nameMachine + " exist")
  }

  onSiteReferChange(){
    if(this.url.length>0 && (this.url.includes("http://")||this.url.includes("https://")))
      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    else {
      this.urlSafe = null
      this.url=""
    }
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
