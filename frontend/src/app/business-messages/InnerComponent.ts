import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'inner-component',
    templateUrl: './inner-component.html',
    styleUrls: ['./inner-component.scss']
   })
   export class InnerComponent {
      @Input()
      inputData: number;
   
      constructor(public router:Router){

      }

      methodThatWillBeCalled(){
       //do you logic on this.inputData
       this.router.navigate(['detail-demande',this.inputData]);
      }
   }