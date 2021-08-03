import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MachineSpecs } from 'src/model/model.machineSpecs';
import { MachineSpecsService } from 'src/services/machineSpecs.service';
import { VarsGlobal } from 'src/services/VarsGlobal';

@Component({
  selector: 'app-machinery-specifications',
  templateUrl: './machinery-specifications.component.html',
  styleUrls: ['./machinery-specifications.component.css']
})
export class MachinerySpecificationsComponent implements OnInit {

  mode=0; // 0: just view, 1: add or modify
  name = 'Set iframe source';
  url: string = '';
  urlSafe: SafeResourceUrl;

  nameMachine=''
  // machines=['mach01 test genie 1506','engin02 roller 65p','roller03 nacelle t 890']
  machines=[]
  ids=[]
  machineSpecs:MachineSpecs; // = new MachineSpecs();

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
  // keyword01 = 'value';
  clearInput(){
    // console.log("clearInput")
    // this.nameMachine=''
    this.onChangeSearch01("")
  }
  selectEvent01(item) {
    // do something with selected item
    this.machineSpecs=new MachineSpecs()
    this.nameMachine=''
    this.imgUrl=''
    this.imgUrl02=''
    this.imgUrl03=''
    this.url=''
    this.specs=[]

    console.log('selectEvent01');
    console.log('item: ' + item);
    this.nameMachine=item
    console.log('machines.indexOf : '+ this.machines.indexOf(item))
    
    console.log('id machine : '+ this.ids[this.machines.indexOf(item)])

    this.machineSpecsService.getDetailMachineSpecs(Number(this.ids[this.machines.indexOf(item)])).subscribe((data:MachineSpecs)=>{
      this.machineSpecs=data
      if(this.machineSpecs.name!=null) this.nameMachine=this.machineSpecs.name
      if(this.machineSpecs.photo01!=null) this.imgUrl=this.machineSpecs.photo01
      if(this.machineSpecs.photo02!=null) this.imgUrl02=this.machineSpecs.photo02
      if(this.machineSpecs.photo03!=null) this.imgUrl03=this.machineSpecs.photo03
      if(this.machineSpecs.link!=null) this.url=this.machineSpecs.link
      // this.specs=this.machineSpecs.specs.split('****')   see later
      this.rebuildSpecs(this.machineSpecs.specs)
      this.sanitizerAfterLoad()
    }, err=>{console.log(err)})
  }

  sanitizerAfterLoad(){
    this.onSiteReferChange()
    this.imgUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.imgUrl);
    this.imgUrlSafe02 = this.sanitizer.bypassSecurityTrustResourceUrl(this.imgUrl02);
    this.imgUrlSafe03 = this.sanitizer.bypassSecurityTrustResourceUrl(this.imgUrl03);
  }
  onChangeSearch01(search: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    // console.log('onChangeSearch01');
    // this.nameMachine=''
    this.machineSpecs=null; //new MachineSpecs()
    this.nameMachine=''
    this.imgUrl=''
    this.imgUrl02=''
    this.imgUrl03=''
    this.url=''
    this.specs=[]
    this.sanitizerAfterLoad()
  }

  onFocused01(e) {
    // do something
    // console.log('onFocused01');
    // this.nameMachine=e
  }

  onModify(){
    this.mode=1;
    // this.machineSpecsService.saveMachineSpecs(this.machineSpecs).subscribe(()=>{},err=>{console.log(err)})
  }

  onDelete(){
    this.machineSpecsService.deleteMachineSpecs(this.machineSpecs.id).subscribe(()=>{},err=>{console.log(err)})
    this.ids.splice(this.ids.indexOf(this.machineSpecs.id),1)
    this.machines.splice(this.machines.indexOf(this.machineSpecs.name),1)
    this.mode=0;
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
  idTransporter:number;
  constructor(public sanitizer: DomSanitizer, public varsGlobal:VarsGlobal, public machineSpecsService:MachineSpecsService) {}

  ngOnInit():void {
    this.userId=localStorage.getItem('userId')
    this.idTransporter=Number(localStorage.getItem('idTransporter'))
    if(this.userId==null) { // it is transporter
      this.userId=""
      // this.mode=1; // dispatch transporter
    }
    // this.specs.push(this.spec)
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    this.machineSpecsService.getAllLightMachines(this.idTransporter).subscribe((data:Map<number, string>)=>{
      // :Map<number, string>
      if(data==null) console.log('No Machine for now')
      else {
        // console.log('data.size: '+data.size)
        const keysorigin = Object.keys(data)
        const values = Object.keys(data).map(value=>data[value])
        this.ids=keysorigin;
        this.machines=values;
        // const values = Object.values(data).map(value=>data[value])
        console.log('keysorigin.toString() : '+ keysorigin.toString())
        console.log('values.toString() : '+ values.toString()) 
        console.log("Ok done.")
        keysorigin.forEach(key=>{
          this.allLightMachines.set(Number(key), values[keysorigin.indexOf(key)])
        })
        this.allLightMachines.set(103, 'machin03')
        console.log("allLightMachines.size: " + this.allLightMachines.size)
        console.log("allLightMachines.get(101): " + this.allLightMachines.get(101))
        console.log("allLightMachines.get(102): " + this.allLightMachines.get(102))
        console.log("allLightMachines.get(103): " + this.allLightMachines.get(103))
        // console.log("keys.length: "+ keys.length + ' - ' + keys.toString())
        // console.log('values.length: '+ values.length + ' - ' + values.toString())
        
        // this.allLightMachines = data.keys(key => data[key]).map(value=>data[value])
        // console.log("data.keys.length: "+data.keys.length) 
        // console.log("data.values.length: "+data.values.length) 
        // this.allLightMachines=data
        // console.log("data.lenght: " + data.entries.length)
        // console.log("data.entry: " + data.entries.toString())
        // console.log("allLightMachines.lenght: " + this.allLightMachines.entries.length)
        // console.log("allLightMachines.entry: " + this.allLightMachines.entries.toString())
      }
    }, err=>{console.log(err)})
  }

  newMachineSpecs(){
    this.machineSpecs= new MachineSpecs()
    if(this.machineSpecs.name!=null) this.nameMachine=this.machineSpecs.name
    if(this.machineSpecs.photo01!=null) this.imgUrl=this.machineSpecs.photo01
    if(this.machineSpecs.photo02!=null) this.imgUrl02=this.machineSpecs.photo02
    if(this.machineSpecs.photo03!=null) this.imgUrl03=this.machineSpecs.photo03
    if(this.machineSpecs.link!=null) this.url=this.machineSpecs.link
    this.rebuildSpecs(this.machineSpecs.specs)
    this.sanitizerAfterLoad()
    
    this.mode=1
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
    this.machineSpecs.link=this.url
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

  onDeletePhoto01(){
    this.imgUrl='';
    this.machineSpecs.photo01=this.imgUrl
    this.sanitizerAfterLoad()
  }
  onDeletePhoto02(){
    this.imgUrl02='';
    this.machineSpecs.photo02=this.imgUrl02
    this.sanitizerAfterLoad()
  }
  onDeletePhoto03(){
    this.imgUrl03='';
    this.machineSpecs.photo03=this.imgUrl03
    this.sanitizerAfterLoad()
  }

  onFileUpLoadTest(event){
    console.log('event : ' + ((event)?"yes" : "null or no choix"))
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
        this.machineSpecs.photo01=this.imgUrl
        // console.log("imgUrl:  "+this.imgUrl)
        this.imgUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.imgUrl);
      }
      reader.readAsDataURL(selectedFile)
    }
    else {
      this.imgUrl='';
      this.machineSpecs.photo01=this.imgUrl
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
        // console.log("imgUrl02:  "+this.imgUrl02)
        this.machineSpecs.photo02=this.imgUrl02
        this.imgUrlSafe02 = this.sanitizer.bypassSecurityTrustResourceUrl(this.imgUrl02);
      }
      reader.readAsDataURL(selectedFile)
    }
    else {
      this.imgUrl02='';
      this.machineSpecs.photo02=this.imgUrl02
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
        this.machineSpecs.photo03=this.imgUrl03
        // console.log("imgUrl03:  "+this.imgUrl03)
        this.imgUrlSafe03 = this.sanitizer.bypassSecurityTrustResourceUrl(this.imgUrl03);
      }
      reader.readAsDataURL(selectedFile)
    }
    else {
      this.imgUrl03='';
      this.machineSpecs.photo03=this.imgUrl03
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

  // from specs in database
  rebuildSpecs(stringSpecs:string){
    this.specs=[]
    let spec:{name:string, descrip:string}={name:"", descrip:""}
    let listString=stringSpecs.split("**..**")
    // let i=0;
    listString.forEach(str=>{
      // console.log('time: '+ i++ +"str: " + str)
      if(str!=null && str.length>0){
        let listSupStr=str.split("**--**")
        spec={name:listSupStr[0], descrip:listSupStr[1]}
        this.specs.push(spec); 
        // spec={name:'', descrip:''}
      }
    })
  }

  // from specs of frontend
  buildSpecs(){
    this.machineSpecs.specs=''
    this.specs.forEach(sp=>{
      let tempspec=sp.name+"**--**"+sp.descrip+"**..**"
      this.machineSpecs.specs=this.machineSpecs.specs + tempspec
    })
  }

  onAddingSpec(){
    // let tempspec=this.spec.name+"**--**"+this.spec.descrip+"**..**"
    this.specs.push(this.spec); 
    this.spec={name:'', descrip:''}
    // this.machineSpecs.specs=this.machineSpecs.specs + tempspec
    this.buildSpecs()
  }
  onDeletingSpec(sp:{name:string, descrip:string}){
    // let tempspec=sp.name+"**--**"+sp.descrip+"**..**"
    this.specs.splice(this.specs.indexOf(sp), 1)
    // this.machineSpecs.specs=this.machineSpecs.specs.replace(tempspec,"")
    this.buildSpecs()
  }
}
