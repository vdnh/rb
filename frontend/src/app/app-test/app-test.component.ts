import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-app-test',
  templateUrl: './app-test.component.html',
  styleUrls: ['./app-test.component.css']
})
export class AppTestComponent implements OnInit {

  asyncData : any;
  totalAngularPackages: any;

    constructor(
        private http : HttpClient
    ){}

    ngOnInit () {
        // this._http.get('https://client2.avltrack.com/webservice/monitoring.cfm?key=B2B533CA360E2D7208D2509B64265421&location=1')
        //     .map(this.extractData)
        //     .subscribe(this.handleData)
        //     .catch(this.handleError);

      // this.http.get('https://api.npms.io/v2/search?q=scope:angular').subscribe(data => {
      // //this.http.get<any>('https://api.npms.io/v2/search?q=scope:angular').subscribe(data => {
      //   // this.totalAngularPackages = data.total;
      //   // console.log('totalAngularPackages: '+ this.totalAngularPackages)
      //   this.asyncData=data
      //   console.log('asyncData: ' + this.asyncData)
      // })

      //https://client2.avltrack.com/webservice/monitoring.cfm?key=B2B533CA360E2D7208D2509B64265421&location=1
      // https://api.npms.io/v2/search?q=scope:angular
      this.http.get('https://client2.avltrack.com/webservice/monitoring.cfm?key=B2B533CA360E2D7208D2509B64265421&location=1' 
                 , { observe: 'body', responseType: 'text'} ).subscribe(valAsStr => {
                   console.log("valAsStr: "+valAsStr); 
                  });
    }

    // extractData (res:Response) {
    //     let body = res.json();
    //     return body.data || { };
    // }

    // handleData (data:any) {
    //     this.asyncData = data;
    // }

    // handleError (error:any) {
    //     console.error(error);
    // }

}
