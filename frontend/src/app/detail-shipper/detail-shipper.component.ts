import { Component, OnInit } from '@angular/core';
import { Shipper } from '../../model/model.shipper';
import { ShippersService } from '../../services/shippers.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
//import { Message } from '@angular/compiler/src/i18n/i18n_ast';
//import { Alert } from 'selenium-webdriver';
import { Contact } from 'src/model/model.contact';
import { ContactsService } from '../../services/contacts.service';
//import { forEach } from '@angular/router/src/utils/collection';
//import { Location } from '@angular/common';
import { Adresse } from 'src/model/model.adresse';
import { AdressesService } from '../../services/adresses.service';
import { AuthenticationService } from 'src/services/authentication.service';
import { AppUser } from 'src/model/model.appUser';
import { VarsGlobal } from 'src/services/VarsGlobal';
import { LoadFrequent } from 'src/model/model.loadFrequent';
import { LoadFrequentsService } from 'src/services/loadFrequents.Service';

@Component({
  selector: 'app-detail-shipper',
  templateUrl: './detail-shipper.component.html',
  styleUrls: ['./detail-shipper.component.css']
})
export class DetailShipperComponent implements OnInit {
  role:string="";
  shipper:Shipper=new Shipper();
  id:number; // this is the id of shipper
  mode:number=1;
  contacts:Array<Contact>=[];
  adresses:Array<Adresse>=[];
  addcontact:Contact=new Contact(); // to add more contact
  addadresse:Adresse=new Adresse(); // to add more adresse
  appUser: AppUser;
  loadFrequent= new LoadFrequent();
  loadFrequents: Array<LoadFrequent>=[];
  shippers: Array<Shipper>=[];
  
  constructor(public authenticationService:AuthenticationService, 
    public activatedRoute:ActivatedRoute, 
    public shippersService:ShippersService, 
    public contactsService:ContactsService,
    public adressesService:AdressesService, 
    public varsGlobal:VarsGlobal,
    public loadFrequentService:LoadFrequentsService,
    public router:Router){    
    this.id=activatedRoute.snapshot.params['id'];
    //this.id=Number(localStorage.getItem('userId'))
  }

  ngOnInit() {
    this.role=localStorage.getItem('role');
    this.shippersService.getDetailShipper(this.id).subscribe((data:Shipper)=>{
      this.shipper=data;
      if(localStorage.getItem('role').includes('TRANSPORTER')){  // in the cas Transporter want to view detail contact
        this.mode=3;
      }
      else{ // in the cas Shipper want to view detail himsefl
        this.mode=1;
        localStorage.setItem('nom', this.shipper.nom);
        localStorage.setItem('tel', this.shipper.tel.toString());
        localStorage.setItem('email', this.shipper.email);
      }
      this.authenticationService.getAllAppUsers().subscribe((data:Array<AppUser>)=>{
        data.forEach(aU=>{
          if(aU.username.includes(this.shipper.loginName)&&(aU.username.length==this.shipper.loginName.length)){
            this.appUser = aU
          }
        })
      }, err=>{console.log(err)})
    }, err=>{
      console.log(err);
    });
    this.contactsService.contactsDeShipper(this.id).subscribe((data:Array<Contact>)=>{
      this.contacts=data;
    }, err=>{
      console.log(err);
    });
    this.adressesService.adressesDeShipper(this.id).subscribe((data:Array<Adresse>)=>{
      this.adresses=data;
      // this.adresses.forEach(a=>{
      //   console.log("Adress : "+a.num+" "+a.rue )
      // })
    }, err=>{
      console.log();
    });
    this.loadFrequentService.loadFrequentsDeShipper(this.id).subscribe((data:Array<LoadFrequent>)=>{
      this.loadFrequents=data.sort((a, b)=>{return a.nom.localeCompare(b.nom)});
      // this.adresses.forEach(a=>{
      //   console.log("Adress : "+a.num+" "+a.rue )
      // })
    }, err=>{
      console.log();
    });
    
    // get the list shippers if idTransporter > 0
    if(localStorage.getItem('idTransporter')!=null && Number(localStorage.getItem('idTransporter'))>0)
    this.shippersService.getShippersTransporter(Number(localStorage.getItem('idTransporter'))).subscribe((data:Array<Shipper>)=>{
      this.shippers=data;
      // sort list of shippers
      this.shippers.sort((a, b)=>{
        return a.nom.localeCompare(b.nom)
      })
    }, err=>{
      console.log(err);
    })
  }

  printPriceList(cmpId){
    let envoy = document.getElementById('toprint').innerHTML;
    const printContent = document.getElementById(cmpId);
    const WindowPrt = window.open();
    WindowPrt.document.write('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

  listLoginName:Array<string>=[];
  checkLoginName(){
    if(this.shipper.loginName.length<4)
      alert('LoginName doit avoir au moins 4 characteres!')
    if(this.shipper.loginName.length>=4){
      // if login name change
      if(this.appUser.username.length!=this.shipper.loginName.length ||
        this.appUser.username.localeCompare(this.shipper.loginName)!=0)
      {
        // in case shipper.loginname changed, set appUser.username = shipper.loginName
        // this.appUser.username = this.shipper.loginName
        console.log('LoginName was changed.')
        // must check UserName in list
        this.authenticationService.getAllAppUsers().subscribe((data:Array<AppUser>)=>{
          data.forEach(aU=>{
            this.listLoginName.push(aU.username)
          })
          let exist=false; // this loginName doesn't exist yet
          this.listLoginName.forEach(loginName=>{
            if(loginName.includes(this.shipper.loginName)&&(loginName.length==this.shipper.loginName.length))
              {
                alert("Username existe deja. Choisir un autre username, SVP!");
                exist=true; // this loginName exist already
              }
          })
          if(!exist)
          {
            this.appUser.username = this.shipper.loginName
            this.saveShipper()
          }
        }, err=>{console.log(err)})
      }
      // if login name don't change
      else{
        this.saveShipper()
      }
    }
  }
  
  saveShipper(){
    if(this.shipper.password.length>=4){
      if(this.shipper.idTransporter==undefined && localStorage.getItem('idTransporter')!=undefined){ // checker si shipper n'appartient aucun transporter, et dispatch transporter modifie son shipper
        this.shipper.idTransporter=Number(localStorage.getItem('idTransporter'))
      }
      if(this.appUser.idTransporter==undefined && localStorage.getItem('idTransporter')!=undefined){
        this.appUser.idTransporter=Number(localStorage.getItem('idTransporter'))
      }
      this.shippersService.saveShippers(this.shipper).subscribe(data=>{
        //alert("Mise a jour.");
        this.onModifyUser();
        this.contacts.forEach(obj => {
          this.contactsService.saveContacts(obj).subscribe(data=>{
          }, err=>{
            console.log(err)
          })
        });    
        this.adresses.forEach(obj => {
          this.adressesService.saveAdresses(obj).subscribe(data=>{
          }, err=>{
            console.log(err)
          })
        });
        this.loadFrequents.forEach(obj => {
          this.loadFrequentService.saveLoadFrequent(obj).subscribe(data=>{
          }, err=>{
            console.log(err)
          })
        });
        alert("C'est enregistre.")
        if(this.role.includes('DISPATCH')) 
          this.router.navigate(['']);
        else this.ngOnInit() //this.mode=2;
      }, err=>{
        console.log(err);
      });
    }
    else {
      alert('Password doit avoir au moins 4 characteres!')
    }
  }

  reformTelEvent(tel:any){
    if(tel.target.value.indexOf('-')<0)
      {
        let sub1 = tel.target.value.substr(0,3)
        let sub2 = tel.target.value.substr(3,3)
        let sub3 = tel.target.value.substr(6,tel.target.value.length-6)
        tel.target.value=sub1+'-'+sub2+'-'+sub3
      }
    //console.log("tel after: " + tel.target.value)
    return tel.target.value;
  }

  addContact(){
    this.addcontact.id_shipper=this.id;
    this.contactsService.saveContacts(this.addcontact).subscribe((data:Contact)=>{
      //alert("Adresse added.");
      this.contacts.push(data)
      this.addcontact=new Contact()
    }, err=>{
      console.log(err)
    })
  }

  deleteContact(id:number){
    this.contactsService.deleteContact(id).subscribe((data:Contact)=>{
      //alert("Contact : "+this.addcontact.nom+" a ete supprime.");
      this.contacts.splice(this.contacts.indexOf(data),1)
      //this.demandes.splice(this.demandes.indexOf(demande), 1)
    }, err=>{
      console.log(err);
    });
  }

  addAdresse(){
    this.addadresse.id_shipper=this.id;
    this.adressesService.saveAdresses(this.addadresse).subscribe((data:Adresse)=>{
      alert("Adresse added.");
      this.adresses.push(data)
    }, err=>{
      console.log(err)
    })
  }

  addLoadFrequent(){
    this.loadFrequent.idShipper=this.id;
    this.loadFrequentService.saveLoadFrequent(this.loadFrequent).subscribe((data:LoadFrequent)=>{
      alert("LoadFrequent added.");
      this.loadFrequents.push(data)
      this.loadFrequent=new LoadFrequent();
    }, err=>{
      console.log(err)
    })
  }

  deleteAdresse(id:number){
    this.adressesService.deleteAdresse(id).subscribe((data:Adresse)=>{
      alert("Adresse : "+data.num+" a ete supprime.");
      this.adresses.splice(this.adresses.indexOf(data),1)
    }, err=>{
      console.log(err);
    });
  }  

  deleteLoadFrequent(lf:LoadFrequent){
    this.loadFrequentService.deleteLoadFrequent(lf.id).subscribe((data:LoadFrequent)=>{
      // alert("LoadFrequent : "+lf.nom+" a ete supprime.");
      this.loadFrequents.splice(this.loadFrequents.indexOf(lf),1)
    }, err=>{
      console.log(err);
    });
  }

  onModifyUser(){
    if(this.shipper.password.length<4)
      alert('Password doit avoir au moins 4 characteres!')
    if(this.shipper.password.length>=4){
      this.appUser.password = this.shipper.password
      this.authenticationService.modifyAppUser(this.appUser).subscribe((data:AppUser)=>{
        //alert('Password was modified.')
        console.log('Password was modified.')
      }, err=>{
        console.log(err);
      });
    }
  }

  refresh(): void {
    //window.location.reload();
  }

  shipperCopy:Shipper
  shipperCopyChange(){
    if(this.shipperCopy!=null){
      var r = confirm('Copy Transport price of ' + this.shipperCopy.nom + ' ?' )
      if(r) 
        this.loadFrequentService.loadFrequentsDeShipper(this.shipperCopy.id).subscribe((data:Array<LoadFrequent>)=>{
          data.forEach(lf=>{
            lf.id=null; // modify to null in order to create new load frequent for this shipper
            lf.idShipper=this.id;
            this.loadFrequentService.saveLoadFrequent(lf).subscribe((data:LoadFrequent)=>{
              this.loadFrequents.push(data)
              this.loadFrequents.sort((a, b)=>{return a.nom.localeCompare(b.nom)})
            }, err=>{
              console.log(err)
            })
          })
        }, err=>{
          console.log();
        });
      else{this.shipperCopy=null}
    }
    else {this.shipperCopy=null}
    
  }
}
