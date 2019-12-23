import { Component, OnInit, ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad';

import { VERSION,ElementRef} from '@angular/core';
import {HttpClientModule, HttpClient, HttpRequest, HttpResponse, HttpEventType} from '@angular/common/http';

@Component({
  selector: 'app-bon-signature',
  templateUrl: './bon-signature.component.html',
  styleUrls: ['./bon-signature.component.css']
})
export class BonSignatureComponent implements OnInit {
  signe=false;
  readyToSign=false;
  width: number=816;
  height: number=1054;

  constructor() { }

//for signature pad
imgUrl ='' // "assets/images/TestAutorisation.jpg";
signature:string="";


@ViewChild('imgReview') imgReview:ElementRef;

@ViewChild('SignaturePad') signaturePad: SignaturePad;
public signaturePadOptions: Object = {
  'minWidth': 1,
  'background-color': '#fff',
  'canvasWidth': this.width,
  'canvasHeight': this.height,
};
drawComplete() {
  //this.signature=this.signaturePad.toDataURL()
  this.signe=true;
}

drawStart() {
  //console.log('begin drawing');
}
onSaveHandler(data) {
  console.log('onsave clicked');
  console.log(data);
  //window.open(data);
}
onClearHandler() {
  console.log('onclear clicked...');
}

okHandler(){
  //console.log('this.signaturePad.toDataURL() : '+this.signaturePad.toDataURL())
  // if(this.remorquage.nomSignature.length==0){
  //   alert("On a besoins votre nom, merci.")
  // }
  // /*else if(this.signaturePad.toDataURL().length==0){
  //   alert("On a besoins votre signature, merci.")
  // }//*/
  // else{
  //   //console.log(this.signaturePad.toDataURL('image/png', 0.5));
  //   this.remorquage.signature=this.signaturePad.toDataURL()
  //   this.onSave();
  //   //window.open(this.signaturePad.toDataURL(), ' blank')
  // }
}

clearHandler(){
  // if(this.signaturePad)
  // this.signaturePad.clear();
  // this.remorquage.signature="";
}
//end for signature pad

validateSign(){
  this.signature=this.signaturePad.toDataURL()
  this.readyToSign=false;
}

async toSign(){
  let imge = await document.getElementById('sky'); 
  let height = imge.clientHeight 
  var width = imge.clientWidth
  console.log('dw - dh : '+width +' - '+ height)
  this.signaturePadOptions = await {
    'minWidth': 1,
    'background-color': '#fff',
    'canvasWidth': width,
    'canvasHeight': height,
  };
  this.readyToSign=true;
  this.signe=false;
  //this.signaturePad.clear();
  this.signature=""
}

printBon(cmpId){
  //let envoy = document.getElementById('toprint').innerHTML;
  // console.log('Toprint : ' + document.getElementById('toprint').innerHTML + ' endOfToprint')
  //console.log(envoy)
  // const printContent = document.getElementById(cmpId);
  // console.log('printContent.innerHTML : '+printContent.innerHTML+' *** end.')
  //const WindowPrt = window.open('','','left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
  /*const WindowPrt = window.open();
  // WindowPrt.document.write("<style>#toprint {background-image: url('assets/images/TestAutorisation.jpg');} </style>");
  WindowPrt.document.write('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
  // WindowPrt.document.write('<style>@media print {.graph-img img { display: inline;}}</style>')
  WindowPrt.document.write(printContent.innerHTML.replace('Re-signer', ''));
  WindowPrt.document.close();
  WindowPrt.focus();
  WindowPrt.print();
  WindowPrt.close();//*/
  // window.document.clear();
  // window.document.write(printContent.innerHTML.replace('Re-signer', ''));
  // window.document.close();
  window.print();
}

  ngOnInit() {
  }

  getSize(){
    //this.percentDone = 100;
    //this.uploadSuccess = true;
    let image:any = this.imgUrl
    //this.size = image.size;
    let fr = new FileReader;
    fr.onload = () => { // when file has loaded
     let img = new Image();
  
     img.onload = () => {
         this.width = img.width;
         this.height = img.height;
     };
    };
    fr.readAsDataURL(image);
   }
   
   async onChange(evt:any){
    //let selectedFile :any =evt.target.files[0];
    let image:any = evt.target.files[0];
    console.log('selectedFile.size : '+image.size);
    //console.log('image.size : '+image.size);
    //let image:any = evt.target.files[0];
    // let fr = new FileReader;
    // fr.onload = () => { // when file has loaded
    // var img = new Image();
  
    // img.onload = () => {
    //     this.width = img.width;
    //     this.height = img.height;
    //     console.log('this.width : '+this.width)
    //     console.log('this.height : '+this.height)
    //     // set tail signPad
    //     this.signaturePadOptions = {
    //       'minWidth': 1,
    //       'background-color': '#fff',
    //       'canvasWidth': img.width,
    //       'canvasHeight': img.height,
    //     };
    //   };
    //   img.src = fr.result.toString(); // This is the data URL 
    // };
    // fr.readAsDataURL(selectedFile);
  
    //if(selectedFile){
      let reader = new FileReader();
      await reader.readAsDataURL(image);
      reader.onload = ()=>{
       /*
        var img = new Image();
        var myImg = document.querySelector("#sky");
        var realWidth = myImg.clientWidth
        var realHeight = myImg.clientHeight
        console.log('tw - th : '+realWidth +' - '+ realHeight)
        let image = document.getElementById('sky'); 
        let height = image.clientHeight 
        var width = image.clientWidth
        console.log('dw - dh : '+width +' - '+ height)
        //var realHeight = myImg.naturalHeight;
        console.log('img.width - '+img.width)
        console.log('img.clientWidth - '+img.clientWidth)
        console.log('img.offsetWidth - '+img.offsetWidth)
        console.log('img.scrollWidth - '+img.scrollWidth)
        console.log('img.naturalWidth - '+img.naturalWidth)
        this.width = img.width;
        this.height = img.height;
        console.log('this.width : '+this.width);
        console.log('this.height : '+this.height);
        // set tail signPad
        // this.signaturePadOptions = {
        //   'minWidth': 1,
        //   'background-color': '#fff',
        //   'canvasWidth': img.width,
        //   'canvasHeight': img.height,
        // };//*/
        this.imgUrl=reader.result.toString();
        //console.log('this.imgUrl : ' + this.imgUrl)
      };
      //reader.readAsDataURL(image);
      //reader.readAsDataURL(image);
      //this.imgReview.nativeElement.value = "";
      // this.width = this.imgType.nativeElement.offsetWidth
      // this.height = this.imgType.nativeElement.offsetHeight
      // console.log('this.width - new way : '+this.width)
      // console.log('this.height - new way : '+this.height)
    //}
    //else this.imgUrl='';
    // let imge = document.getElementById('sky'); 
    // let height = imge.clientHeight 
    // var width = imge.clientWidth
    // console.log('dw - dh : '+width +' - '+ height)
   }
  
}
