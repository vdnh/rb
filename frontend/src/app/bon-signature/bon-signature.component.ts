import { Component, OnInit, ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad';

@Component({
  selector: 'app-bon-signature',
  templateUrl: './bon-signature.component.html',
  styleUrls: ['./bon-signature.component.css']
})
export class BonSignatureComponent implements OnInit {

  constructor() { }

//for signature pad

signature:string="";

@ViewChild('SignaturePad') signaturePad: SignaturePad;
public signaturePadOptions: Object = {
  'minWidth': 1,
  'background-color': '#fff',
  'canvasWidth': 816,
  'canvasHeight': 1054,
};
drawComplete(data) {
  this.signature=this.signaturePad.toDataURL()
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

printBon(cmpId){
  //let envoy = document.getElementById('toprint').innerHTML;
  console.log('Toprint : ' + document.getElementById('toprint').innerHTML + ' endOfToprint')
  //console.log(envoy)
  const printContent = document.getElementById(cmpId);
  console.log('printContent.innerHTML : '+printContent.innerHTML+' *** end.')
  //const WindowPrt = window.open('','','left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
  const WindowPrt = window.open();
  WindowPrt.document.write('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
  WindowPrt.document.write(printContent.innerHTML.replace('Re-signer', ''));
  WindowPrt.document.close();
  WindowPrt.focus();
  WindowPrt.print();
  WindowPrt.close();
}

  ngOnInit() {
  }

}
