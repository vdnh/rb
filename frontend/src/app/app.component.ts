import { Component, OnInit, HostListener, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/services/authentication.service';
import { Role } from 'src/model/model.role';
import { MessagesService } from 'src/services/messages.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import {VarsGlobal} from 'src/services/VarsGlobal'
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserLogsService } from 'src/services/userLogs.service';
import { UserLogs } from 'src/model/model.userLogs';
import { GeolocationService } from 'src/services/geolocation.service';
import { GeocodingService } from 'src/services/geocoding.service';
import { HttpClient } from '@angular/common/http';

declare global {
  interface Window {
    rTCPeerConnection: RTCPeerConnection;
    mozRTCPeerConnection: RTCPeerConnection;
    webkitRTCPeerConnection: RTCPeerConnection;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  private ipRegex = new RegExp(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/);
  title = 'CTS';
  usernameLogin='';
  entrepriseNom='';
  mode:number=0;  // 0: to control password, 1: to wrong password, 2: to bad url or bad domain
  role:string="";
  modeSignUp=0; // 0: sign in; 1: sign up; 2: demande express
  textSign="Nouveau Transporter ou Shipper"
  userId=""; // use to identify dispatch of shipper or dispatch general (by defaul "" general)

  // to control if we are in the session
  session='no';
  
  // pour verifier usernamelogin  et role
  roleUsernameLogin='';
  eligible=true;

  //nombreMessages: number=this.varsGlobal.nombreMessages;

  form:FormGroup;  // use for chauffeur
  //formExpress:FormGroup;  // use for dispatch express
  idRemorquage: any;
  idTransport: string;  // c'est numero bon de transport
  textExpressSign="Demande Express";

  modeExpress=0; // to switch - modeExpress==1 : Remorquage Express; modeExpress==2 : Transport Express; 
  soumission: boolean=false;
  gererCompte: boolean=true; // a default paraitre gererCompte

  constructor(private authService:AuthenticationService, public messagesService:MessagesService, 
    private fb:FormBuilder, public varsGlobal:VarsGlobal, private router:Router,
    private geolocation : GeolocationService, public geocoding : GeocodingService, 
    public userLogsService: UserLogsService, private http: HttpClient, private zone: NgZone) 
    {
      this.form = fb.group({
        username:'chauffeur',
        password:'chauffeur'
      })
      /*
      this.formExpress = fb.group({
        username:'dispatch1',
        password:'dispatch1'
      })//*/
  }

  private determineLocalIp() {
    window.rTCPeerConnection  = this.getRTCPeerConnection();

    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel('');
    pc.createOffer().then(pc.setLocalDescription.bind(pc));

    pc.onicecandidate = (ice) => {
      this.zone.run( () => {
        if (!ice || !ice.candidate || !ice.candidate.candidate) {
          return;
        }
        if (!ice.candidate.candidate.includes('local')){
          //console.log('ice.candidate.candidate : '+ice.candidate.candidate)
          //console.log('ice.candidate.ip : '+ice.candidate.ip)
          //console.log('ice.candidate.toJSON().candidate : '+ice.candidate.toJSON().candidate)
          //console.log('ice.candidate.component : '+ice.candidate.component.toString())
          this.varsGlobal.userLogs.ipLocal = this.ipRegex.exec(ice.candidate.candidate)[1]
          console.log('this.varsGlobal.userLogs.ipLocal : '+this.varsGlobal.userLogs.ipLocal)
        }
        else {
          this.varsGlobal.userLogs.ipLocal = ice.candidate.candidate
          console.log('this.varsGlobal.userLogs.ipLocal : '+this.varsGlobal.userLogs.ipLocal)
        }
        pc.onicecandidate = () => {};
        pc.close();
      });
    };
  }

  getRTCPeerConnection() {
    return window.rTCPeerConnection ||
      window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection;
  }

  ngOnInit() {    
    //await this.determineLocalIp();
    if(localStorage.getItem('role')) 
      this.role = localStorage.getItem('role')
    if(localStorage.getItem('role')&&localStorage.getItem('role').includes('CHAUFFEUR'))
      localStorage.clear();
    if(localStorage.getItem('usernameLogin')) {
      this.usernameLogin = localStorage.getItem('usernameLogin');
      this.roleUsernameLogin=btoa(this.role+this.usernameLogin)
      //console.log('this.roleUsernameLogin : '+ this.roleUsernameLogin)
      this.eligible=this.roleUsernameLogin.includes(localStorage.getItem('eligible'))
      if(!this.eligible){
        localStorage.clear()
      }
      else{
        let userLogsId = Number (localStorage.getItem('userLogsId'))
        this.userLogsService.getDetailUserLogs(userLogsId).subscribe((data:UserLogs)=>{
          this.varsGlobal.userLogs=data;
        }, err=>{console.log(err)})
      }
    }
    if(localStorage.getItem("entrepriseNom"))
      this.entrepriseNom=localStorage.getItem("entrepriseNom")
    //*
    if(location.href.includes("/remorquage-client/"))
    {
      //this.mode=2 // show the message for bad url
      console.log('Nous sommes dans : /remorquage-client/')
      console.log('location.href : '+location.href)
      const stringsd:string[]=location.href.split('/remorquage-client/')
      //console.log('stringsd[0]: '+(this.idRemorquage=stringsd[0]))
      this.idRemorquage=stringsd[1]
      //this.idRemorquage=location.href.substring
      console.log('this.idRemorquage : '+this.idRemorquage)
      const user=this.form.value;
      //*
      this.authService.loginDefaultDriver(user).subscribe(resp=> {
          this.usernameLogin=user.username;  // to get usename
          localStorage.setItem('usernameLogin', this.usernameLogin)
          console.log('this.usernameLogin : '+ this.usernameLogin)
          let jwtToken=resp.headers.get('Authorization');
          this.authService.saveTonken(jwtToken);
          //console.log(jwtToken);        
          this.authService.getUserInfo().subscribe(async (res:Role)=>{
            this.role = res.roleName;
            this.roleUsernameLogin=await btoa(this.role+this.usernameLogin)
            localStorage.setItem('eligible',this.roleUsernameLogin)
            localStorage.setItem('role', this.role);
            if(res.id!=null) {
              localStorage.setItem('userId', res.id.toString());
              //console.log('res.id : '+res.id)
              this.userId=localStorage.getItem('userId')
            }
            this.router.navigate(['/remorquage-client/'+this.idRemorquage]); //1753//location.href
            /*/if(res.idSecond!=null) localStorage.setItem('idSecond', res.idSecond.toString());
            if(res.roleName.includes('DISPATCH')) {         
              if(res.id!=null) this.router.navigate(['/remorquage-pro/'], {skipLocationChange: true});
              else this.router.navigate(['/remorquage/'], {skipLocationChange: true});
            }//*/
          }, err=>{          
            console.log(err);
          });
          this.router.navigateByUrl('/propos');
      },err=>{
        this.mode=1; // appear the message bad password
        console.log(err);  
      });//*/
    }
    //*
    if(location.href.includes("/transport-client/"))
    {
      //this.mode=2 // show the message for bad url
      console.log('Nous sommes dans : /transport-client/')
      console.log('location.href : '+location.href)
      const stringsd:string[]=location.href.split('/transport-client/')
      this.idTransport=stringsd[1]
      console.log('this.idTransport : '+this.idTransport)
      const user=this.form.value;
      //*
      this.authService.loginDefaultDriver(user).subscribe(resp=> {
          this.usernameLogin=user.username;  // to get usename
          localStorage.setItem('usernameLogin', this.usernameLogin)
          console.log('this.usernameLogin : '+ this.usernameLogin)
          let jwtToken=resp.headers.get('Authorization');
          this.authService.saveTonken(jwtToken);
          //console.log(jwtToken);        
          this.authService.getUserInfo().subscribe(async (res:Role)=>{
            this.role = res.roleName;
            this.roleUsernameLogin=await btoa(this.role+this.usernameLogin)
            localStorage.setItem('eligible',this.roleUsernameLogin)
            localStorage.setItem('role', this.role);          
            if(res.id!=null) {
              localStorage.setItem('userId', res.id.toString());
              //console.log('res.id : '+res.id)
              this.userId=localStorage.getItem('userId')
            }
            this.router.navigate(['/transport-client/'+this.idTransport]); 
          }, err=>{          
            console.log(err);
          });
          this.router.navigateByUrl('/propos');
      },err=>{
        this.mode=1; // appear the message bad password
        console.log(err);  
      });//*/
    }
    // else if(location.href.includes("/detail-remorquage-express/"))
    // {
    //   //this.mode=2 // show the message for bad url
    //   console.log('Nous sommes dans : /detail-remorquage-express/')
    //   console.log('location.href : '+location.href)
    //   const stringsd:string[]=location.href.split('/detail-remorquage-express/')
    //   //console.log('stringsd[0]: '+(this.idRemorquage=stringsd[0]))
    //   this.idRemorquage=stringsd[1]
    //   //this.idRemorquage=location.href.substring
    //   console.log('this.idRemorquage : '+this.idRemorquage)
    //   const user=this.formExpress.value;
    //   //*
    //   this.authService.loginDefaultDriver(user).subscribe(resp=> {
    //       this.usernameLogin=user.username;  // to get usename
    //       localStorage.setItem('usernameLogin', this.usernameLogin)
    //       console.log('this.usernameLogin : '+ this.usernameLogin)
    //       let jwtToken=resp.headers.get('Authorization');
    //       this.authService.saveTonken(jwtToken);
    //       //console.log(jwtToken);        
    //       this.authService.getUserInfo().subscribe(async (res:Role)=>{
    //         this.role = res.roleName;
    //         this.roleUsernameLogin=await btoa(this.role+this.usernameLogin)
    //         localStorage.setItem('eligible',this.roleUsernameLogin)
    //         localStorage.setItem('role', this.role);          
    //         if(res.id!=null) {
    //           localStorage.setItem('userId', res.id.toString());
    //           //console.log('res.id : '+res.id)
    //           this.userId=localStorage.getItem('userId')
    //         }
    //         this.router.navigate(['/detail-remorquage-express/'+this.idRemorquage]); //1753//location.href
    //       }, err=>{          
    //         console.log(err);
    //       });
    //       this.router.navigateByUrl('/propos');
    //   },err=>{
    //     this.mode=1; // appear the message bad password
    //     console.log(err);  
    //   });//*/
    // }
    // else if(location.href.includes("/detail-transport-express/"))
    // {
    //   //this.mode=2 // show the message for bad url
    //   console.log('Nous sommes dans : /detail-transport-express/')
    //   console.log('location.href : '+location.href)
    //   const stringsd:string[]=location.href.split('/detail-transport-express/')
    //   //console.log('stringsd[0]: '+(this.idRemorquage=stringsd[0]))
    //   this.idTransport=stringsd[1]
    //   //this.idRemorquage=location.href.substring
    //   console.log('this.idTransport : '+this.idTransport)
    //   const user=this.formExpress.value;
    //   //*
    //   this.authService.loginDefaultDriver(user).subscribe(resp=> {
    //       this.usernameLogin=user.username;  // to get usename
    //       localStorage.setItem('usernameLogin', this.usernameLogin)
    //       console.log('this.usernameLogin : '+ this.usernameLogin)
    //       let jwtToken=resp.headers.get('Authorization');
    //       this.authService.saveTonken(jwtToken);
    //       //console.log(jwtToken);        
    //       this.authService.getUserInfo().subscribe(async (res:Role)=>{
    //         this.role = res.roleName;
    //         this.roleUsernameLogin=await btoa(this.role+this.usernameLogin)
    //         localStorage.setItem('eligible',this.roleUsernameLogin)
    //         localStorage.setItem('role', this.role);          
    //         if(res.id!=null) {
    //           localStorage.setItem('userId', res.id.toString());
    //           //console.log('res.id : '+res.id)
    //           this.userId=localStorage.getItem('userId')
    //         }
    //         this.router.navigate(['/detail-transport-express/'+this.idTransport]); 
    //       }, err=>{          
    //         console.log(err);
    //       });
    //       this.router.navigateByUrl('/propos');
    //   },err=>{
    //     this.mode=1; // appear the message bad password
    //     console.log(err);  
    //   });//*/
    // }
    else if( !location.href.includes("sosprestige.com") && !location.href.includes("localhost") && !location.href.includes("ctstrack.") && !location.href.includes("192.168.0.") )
    {
      location.href='https://cts.sosprestige.com';
      this.mode=2 // show the message for bad url
      console.log('Notre site : cts.sosprestige.com')
    }
    else { console.log("There is no cas special!")}
    if(localStorage.getItem('userId')!=null) {
      //console.log('res.id : '+res.id)
      this.userId=localStorage.getItem('userId')
    }
    if (localStorage.getItem('role')!=null){
      this.messagesService.messagesReceived(Number(localStorage.getItem('userId'))).subscribe(
        (data:Array<Message>)=>{
          this.varsGlobal.nombreMessages=data.length
        }, err=>{
          console.log(err)
        }
      )
      this.role=localStorage.getItem('role');
      if(this.role.includes('TRANSPORTER')) {         
        //this.router.navigateByUrl('/detail-transporter/'+ res.id, {skipLocationChange: true});
        this.router.navigate(['/detail-transporter/'+ this.userId], {skipLocationChange: true});
        //localStorage.setItem('userId', res.id.toString());
      }  
      if(this.role.includes('TECHNICIEN')) {         
        this.router.navigate(['/detail-transporter/'+ this.userId], {skipLocationChange: true});
      }
      if(this.role.includes('SHIPPER')) {         
        //this.router.navigateByUrl('/detail-shipper/'+ res.id, {skipLocationChange: true});
        this.router.navigate(['/detail-shipper/'+ this.userId], {skipLocationChange: true});
        //localStorage.setItem('userId', res.id.toString());
      }
      //*
      if(this.role.includes('DISPATCH')) {  
        //localStorage.setItem('idTransporter',this.us)       
        //if(res.id!=null) this.router.navigate(['/remorquage-client/'+ res.id], {skipLocationChange: true});
        if(!location.href.includes("detail-remorquage")){
          if(location.href.includes("detail-transport-pro")){
            const stringsd:string[]=location.href.split('/detail-transport-pro/')
            let id=stringsd[1]
            this.router.navigate(['/detail-transport-pro/'+ id], {skipLocationChange: true})
          }
          else if(location.href.includes("detail-transport")){
            const stringsd:string[]=location.href.split('/detail-transport/')
            let id=stringsd[1]
            this.router.navigate(['/detail-transport/'+ id], {skipLocationChange: true})
          }
          else if(location.href.includes("/transport")){
            this.router.navigate(['/transport/'], {skipLocationChange: true})            
          }
          /*/
          else if(this.userId.length>0) this.router.navigate(['/remorquage-pro/'], {skipLocationChange: true});
          else this.router.navigate(['/remorquage/'], {skipLocationChange: true});
          //*/
          else if(this.userId.length>0) this.router.navigate(['/'], {skipLocationChange: true});
          else this.router.navigate(['/'], {skipLocationChange: true});
        }
        //localStorage.setItem('userId', res.id.toString());
      }//*/
      /*
      if(this.role.includes('TRANSPORTER')) {         
        this.router.navigateByUrl('/detail-transporter/'+ localStorage.getItem('userId'));
        //this.router.navigateByUrl('/business-messages/');
        //localStorage.setItem('userId', res.id.toString());
      }  
      if(this.role.includes('SHIPPER')) {         
        this.router.navigateByUrl('/detail-shipper/'+ localStorage.getItem('userId'));
        //this.router.navigateByUrl('/business-messages/');
        //localStorage.setItem('userId', res.id.toString());
      }//*/
      this.mode=0;
      //console.log("this role : "+this.role)
    }
    //*/
    sessionStorage.setItem('temporary', 'no')
    if(sessionStorage.getItem('temporary')!=null)
      this.session=this.varsGlobal.session; // sessionStorage.getItem('temporary')
  }

  signing(){
    if(this.modeSignUp==0){
      this.modeSignUp=1;
      this.textSign="Sign in"
    }
    else{
      this.modeSignUp=0;
      this.textSign="Nouveau Transporter ou Shipper";      
      this.router.navigateByUrl("");
    }
  }
  demandeExpress(){
    if(this.modeSignUp==0){
      this.modeSignUp=2;
      this.textExpressSign="Retour Sign in"
      this.router.navigate(['/appel-express-visitor/'], {skipLocationChange: true});
    }
    else{
      this.modeSignUp=0;
      this.textExpressSign="Demande Express";      
      this.router.navigateByUrl("");
    }
  }
  refreshMessages(){
    //this.router.navigateByUrl("");
    //this.ngOnInit();
    /* this.messagesService.messagesReceived(Number(localStorage.getItem('userId'))).subscribe(
      (data:Array<Message>)=>{
        this.varsGlobal.nombreMessages=data.length
      }, err=>{
        console.log(err)
      }
    ) */
    this.varsGlobal.refreshData();
  }

  async onLogin(dataForm){
    await this.authService.login(dataForm).subscribe(resp=> {
      let jwtToken=resp.headers.get('Authorization');
      this.authService.saveTonken(jwtToken);
      //console.log(jwtToken);        
      //*
      this.authService.getUserInfo().subscribe(async (res:Role)=>{
        this.role = res.roleName;
        localStorage.setItem('role', this.role);
        this.usernameLogin=dataForm.username;  // to get usename
        localStorage.setItem('usernameLogin', this.usernameLogin)
        this.roleUsernameLogin=await btoa(this.role+this.usernameLogin)
        localStorage.setItem('eligible',this.roleUsernameLogin) 
        //console.log('res.idTransporter : '+res.idTransporter)
        
        if(res.idTransporter != undefined) {
          localStorage.setItem('idTransporter',res.idTransporter.toString())
          localStorage.setItem('entrepriseNom', res.entrepriseNom);
          this.entrepriseNom=res.entrepriseNom;
        } // prendre idTransporter s'il en a
        
        if(res.id!=null) {
          localStorage.setItem('userId', res.id.toString());
          localStorage.setItem('entrepriseNom', res.entrepriseNom);
          this.userId=localStorage.getItem('userId')
          this.entrepriseNom=localStorage.getItem('entrepriseNom')
        }
        if(res.idSecond!=null) localStorage.setItem('idSecond', res.idSecond.toString());
        if(res.fullName!=null) localStorage.setItem('fullName', res.fullName);
        // begin to write info to userLogs
        await this.determineLocalIp();
        this.varsGlobal.userLogs.entreprise=res.entrepriseNom;
        this.varsGlobal.userLogs.entrepriseId=localStorage.getItem('userId'); //res.id.toString();
        this.varsGlobal.userLogs.usernameLogin=this.usernameLogin;
        this.varsGlobal.userLogs.role=res.roleName;
        this.varsGlobal.userLogs.loginTime=new Date();
        //console.log('await new Date(await new Date().toLocaleString()) :'+await new Date(await new Date().toLocaleString()))
        //console.log('this.varsGlobal.userLogs.loginTime : '+this.varsGlobal.userLogs.loginTime)
        this.varsGlobal.userLogs.token=jwtToken;
        await this.http.get('https://api.ipify.org?format=json').subscribe(async data => {
          this.varsGlobal.userLogs.ipPublic=data['ip'];
          await this.geolocation.getCurrentPosition().subscribe(async (data:Position)=>{
            //this.varsGlobal.userLogs.longtitude=data.coords.longitude;
            //this.varsGlobal.userLogs.latitude=data.coords.latitude;
            await this.geocoding.geocode(new google.maps.LatLng(              
              this.varsGlobal.userLogs.latitude=data.coords.latitude,
              this.varsGlobal.userLogs.longtitude=data.coords.longitude
            ))
            .forEach(
              (results: google.maps.GeocoderResult[]) => {
                this.varsGlobal.userLogs.place=results[0].formatted_address;
                //console.log('results[0].formatted_address : '+results[0].formatted_address)
                //console.log('results[0].address_components.long_name : '+results[0].address_components[0].long_name)
                //console.log('results[0].address_components.short_name : '+results[0].address_components[0].short_name)
                //console.log('results[0].address_components.types : '+results[0].address_components[0].types)
                //console.log('results[0].geometry : '+results[0].geometry.location)
                //console.log('results[0].postcode_localities : '+results[0].postcode_localities.values)
                //console.log('results[0].place_id : '+results[0].place_id)
                //console.log('results[0].types : '+results[0].types)
              }
            )            
            this.userLogsService.saveUserLogs(this.varsGlobal.userLogs).subscribe((data:UserLogs)=>{
              this.varsGlobal.userLogs=data;
              localStorage.setItem('userLogsId',data.id.toString())
              if(res.id==undefined && res.roleName.includes('DISPATCH') && (location.href.includes('/detail-remorquage/')||location.href.includes('/detail-transport/')))
              {
                sessionStorage.setItem('temporary', 'yes') // to control we are in session
                this.varsGlobal.session='yes'  // to control we are in session  
                location.reload();
                //let stringsd:string=location.href  //split('/detail-remorquage-express/')
                //console.log('stringsd[0] : '+stringsd[0])
                //console.log('stringsd[0] : '+stringsd[1])
                //let siteAddress=stringsd[1].split('/')[0]
                //console.log('siteAddress : '+siteAddress)
                //this.router.navigate(['/']);
                //this.router.navigateByUrl(stringsd);

              }
            }, err=>{
              console.log(err)
            })
          },err=>{console.log(err)})
        });
        
        // end of writting infos to userLogs

        if(res.roleName.includes('TRANSPORTER')) {         
          //this.router.navigateByUrl('/detail-transporter/'+ res.id, {skipLocationChange: true});
          this.router.navigate(['/detail-transporter/'+ res.id], {skipLocationChange: true});
          //localStorage.setItem('userId', res.id.toString());
        }  
        if(res.roleName.includes('TECHNICIEN')) {                  
          this.router.navigate(['/detail-transporter/'+ res.id], {skipLocationChange: true});
        }
        if(res.roleName.includes('SHIPPER')) {         
          //this.router.navigateByUrl('/detail-shipper/'+ res.id, {skipLocationChange: true});
          this.router.navigate(['/detail-shipper/'+ res.id], {skipLocationChange: true});
          //localStorage.setItem('userId', res.id.toString());
        }
        if(res.roleName.includes('DISPATCH')) {         
          //if(res.id!=null) this.router.navigate(['/remorquage-client/'+ res.id], {skipLocationChange: true});
          //if(res.id!=null) this.router.navigate(['/'], {skipLocationChange: true});
          //else this.router.navigate(['/'], {skipLocationChange: true}); //  /calculer-express
          //
          if(res.id==undefined && (location.href.includes('/detail-remorquage/')||location.href.includes('/detail-transport/')))
          {
            sessionStorage.setItem('temporary', 'yes') // to control we are in session
            this.varsGlobal.session='yes'  // to control we are in session  
            // the rest we do them after saveUserLogs
          }  
          else{
            //let stringsd:string[]=location.href.split('://')  //split('/detail-remorquage-express/')
            //console.log('stringsd[0] : '+stringsd[0])
            //console.log('stringsd[0] : '+stringsd[1])
            //let siteAddress=stringsd[1].split('/')[0]
            //console.log('siteAddress : '+siteAddress)
            sessionStorage.setItem('temporary', 'no') // to control we aren't in session
            this.varsGlobal.session='no'  // to control we are in session  
            this.router.navigate(['/']);
            //window.open(stringsd[0]+'://'+siteAddress, '_self');
          }
          //*/
          //localStorage.setItem('userId', res.id.toString());
        }
        //http://localhost:4200/remorquage
        this.mode=0;
        this.messagesService.messagesReceived(Number(localStorage.getItem('userId'))).subscribe(
          (data:Array<Message>)=>{
            this.varsGlobal.nombreMessages=data.length
          }, err=>{
            console.log(err)
          }
        )

      //}
      }, err=>{          
        console.log(err);
      });//*/
      //this.authService.getUserInfo();
      //this.role=this.authService.role;
      //console.log('Role is : '+this.role);
      //if(this.roles.
      //this.router.navigateByUrl('/propos');
      /*
      this.usernameLogin=dataForm.username;  // to get usename
      localStorage.setItem('usernameLogin', this.usernameLogin)
      this.roleUsernameLogin=btoa(this.role+this.usernameLogin)
      localStorage.setItem('eligible',this.roleUsernameLogin)
      //*/
    },err=>{
      this.mode=1; // appear the message bad password
      console.log(err);  
      const user=this.form.value;
      this.authService.loginDefaultDriver(user).subscribe( async resp=> {
        let jwtToken=resp.headers.get('Authorization');
        this.authService.saveTonken(jwtToken);
        await this.determineLocalIp();
        this.varsGlobal.userLogs.entreprise='Login failed';
        this.varsGlobal.userLogs.usernameLogin=dataForm.username
        this.varsGlobal.userLogs.role=dataForm.password
        this.varsGlobal.userLogs.loginTime=new Date();
        await this.http.get('https://api.ipify.org?format=json').subscribe(async data => {
          this.varsGlobal.userLogs.ipPublic=data['ip'];
          await this.geolocation.getCurrentPosition().subscribe(async (data:Position)=>{
            await this.geocoding.geocode(new google.maps.LatLng(              
              this.varsGlobal.userLogs.latitude=data.coords.latitude,
              this.varsGlobal.userLogs.longtitude=data.coords.longitude
            ))
            .forEach(
              (results: google.maps.GeocoderResult[]) => {
                this.varsGlobal.userLogs.place=results[0].formatted_address;
              }
            )            
            this.userLogsService.saveUserLogs(this.varsGlobal.userLogs).subscribe((data:UserLogs)=>{
              localStorage.clear();  //  erase localstorage after sent sms and email
              this.varsGlobal.userLogs = new UserLogs();
            }, err=>{
              console.log(err)
            })
          },err=>{console.log(err)})
        });
      }, err=>{          
        console.log(err);
      });
    });
    /*
    this.authService.getUserInfo().subscribe((res:string)=>{
      this.role = res;
      console.log('Role is : '+this.role)
    }, err=>{
      console.log(err);
    });//*/
    //this.router.navigateByUrl('/tasks');
    //console.log('One more time, Role is : '+this.role)
  }

  async logout(){
    this.modeExpress=0; // to switch - modeExpress==1 : Remorquage Express; modeExpress==2 : Transport Express; 
    if(this.varsGlobal.userLogs.loginTime!=null){
      this.varsGlobal.userLogs.logoutTime=new Date();
      this.varsGlobal.userLogs.loginTime=new Date(this.varsGlobal.userLogs.loginTime);
      console.log("this.varsGlobal.userLogs.logoutTime.getTime() : "+this.varsGlobal.userLogs.logoutTime.getTime());
      console.log("this.varsGlobal.userLogs.loginTime.getTime() : "+this.varsGlobal.userLogs.loginTime.getTime());
      console.log("this.varsGlobal.userLogs.ipLocal : "+this.varsGlobal.userLogs.ipLocal)
      this.varsGlobal.userLogs.duration = 
        await (this.varsGlobal.userLogs.logoutTime.getTime() - this.varsGlobal.userLogs.loginTime.getTime())/1000/60  // to find minutes
      await this.userLogsService.saveUserLogs(this.varsGlobal.userLogs).subscribe((data:UserLogs)=>{
        this.varsGlobal.userLogs=new UserLogs();
      }, err=>{
        console.log(err)
      })
    }
    //this.varsGlobal.userLogs=new UserLogs();
    localStorage.clear();
    this.role="";
    
    this.usernameLogin='';
    this.entrepriseNom='';
    this.mode=0;  // 0: to control password, 1: to wrong password, 2: to bad url or bad domain
    this.role="";
    this.modeSignUp=0;
    this.textSign="Nouveau Transporter ou Shipper"
    this.userId="";
    this.varsGlobal.nombreMessages=0;
    this.varsGlobal.session='no'; 
    this.varsGlobal.pro='no';
    this.roleUsernameLogin='';
    await this.router.navigateByUrl("");
    // console.log('location.host : '+location.host)
    // console.log('location.href : '+location.href)
    location.reload();
    //window.close();
  }
  /*/ on close window
  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event){
    //alert("I'm leaving the app");
    //localStorage.clear();
    localStorage.removeItem('tonken');
    localStorage.removeItem('nom');
    localStorage.removeItem('tel');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    this.role="";
    this.router.navigateByUrl("");
  }//*/
  onTransporter(){
    this.soumission=false;
    this.gererCompte=true;
    let role = localStorage.getItem('role')
    let userId = localStorage.getItem('userId')       
    if(role.includes('TRANSPORTER') || role.includes('TECHNICIEN')) {         
      //this.router.navigateByUrl('/detail-transporter/'+ userId);
      this.router.navigate(['/detail-transporter/'+ userId], {skipLocationChange: true});
      //this.router.navigateByUrl('/business-messages/');
    }
    /*
    if(role.includes('TECHNICIEN')) {         
      this.router.navigate(['/detail-transporter/'+ userId], {skipLocationChange: true});
    }//*/
    else
      this.router.navigateByUrl('/transporters/');
  }
  onShipper(){
    let role = localStorage.getItem('role')
    let userId = localStorage.getItem('userId')       
    if(role.includes('SHIPPER')) {         
      //this.router.navigateByUrl('/detail-shipper/'+ userId);
      this.router.navigate(['/detail-shipper/'+ userId], {skipLocationChange: true});
      //this.router.navigateByUrl('/business-messages/');
    }
    else
      this.router.navigateByUrl('/shippers/');
  }

  switchRole(){
    let temp=localStorage.getItem('userId')   // take userId actual
    let idSecond=localStorage.getItem('idSecond') //take secondId if it has
    if(idSecond!=null && idSecond.length>0){ // if it have secondId
      if(localStorage.getItem('role').includes('SHIPPER')){ // if it was Shipper
        localStorage.setItem('idSecond', temp)      // modify secondId
        localStorage.setItem('role', 'TRANSPORTER') // modify role to Transporter
        localStorage.setItem('userId', idSecond)  // modify userId to second
        //this.router.navigate(['detail-transporter',idSecond]);
        //this.onTransporter()
        this.ngOnInit() // re-init 
      }
      else if (localStorage.getItem('role').includes('TRANSPORTER')){
        localStorage.setItem('idSecond', temp)
        localStorage.setItem('role', 'SHIPPER') 
        localStorage.setItem('userId', idSecond) 
        //this.router.navigate(['detail-shipper',idSecond]);
        //this.onShipper()
        this.ngOnInit()
      }
    }
    else 
      alert("Votre role n'est que : " + localStorage.getItem('role') + ". Contactez votre fournisseur si vous voulez autre role.")
  }

  //for dispatch switch role : remor - trans - ressource - suivi
  remor:boolean=false;
  trans:boolean=false;
  ressource:boolean=false;
  suivi:boolean=false;
  onRemor(){
    this.remor=true;
    this.trans=false;
    this.ressource=false;
    this.suivi=false;
  }
  onTrans(){
    this.remor=false;
    this.trans=true;
    this.ressource=false;
    this.suivi=false;
  }
  onRessource(){
    this.remor=false;
    this.trans=false;
    this.ressource=true;
    this.suivi=false;
  }
  onSuivi(){
    this.remor=true;
    this.trans=false;
    this.ressource=false;
    this.suivi=true;
  }
  alertComingSoon(){
    alert('Coming soon ...')
  }
}
export interface User{
  username:string;
  password:string;
}