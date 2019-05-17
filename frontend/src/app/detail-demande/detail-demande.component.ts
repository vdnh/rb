import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Transporter } from 'src/model/model.transporter';
import { Shipper } from 'src/model/model.shipper';
import { Demande } from 'src/model/model.demande';
import { Contact } from 'src/model/model.contact';
import { Adresse } from 'src/model/model.adresse';
import { ActivatedRoute, Router } from '@angular/router';
import { ShippersService } from '../../services/shippers.service';
import { TransportersService } from '../../services/transporters.service';
import { ContactsService } from '../../services/contacts.service';
import { AdressesService } from '../../services/adresses.service';
import { DemandesService } from 'src/services/demandes.service';
import { GeocodingService } from 'src/services/geocoding.service';
import { } from 'googlemaps';
import { Voyage } from 'src/model/model.voyage';
import { VoyagesService } from 'src/services/voyages.service';
import { LatLngLiteral } from '@agm/core';
import { Message } from 'src/model/model.message';
import { MessagesService } from 'src/services/messages.service';
import * as myGlobals from 'src/services/globals'; //<==== to use variables from globals.ts
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-detail-demande',
  templateUrl: './detail-demande.component.html',
  styleUrls: ['./detail-demande.component.css']
})
export class DetailDemandeComponent implements OnInit {
  //*  for calculprix
  searchTruck=true; //desactiver poster et rechercher
  //* pour checkBox list
  formGroup: FormGroup;
  camionTypes = myGlobals.camionTypes;
  
  provinceList=myGlobals.provinceList ;
  
  villeListO= myGlobals.villeList ;
  
  villeListD=this.villeListO;
  
  AlbertaVilles=myGlobals.AlbertaVilles;
  
  BritishColumbiaVilles=myGlobals.BritishColumbiaVilles;
  
  ManitobaVilles=myGlobals.ManitobaVilles;
  
  NewBrunswickVilles=myGlobals.NewBrunswickVilles;
  
  NewfoundlandLabradorVilles=myGlobals.NewfoundlandLabradorVilles;
  
  NorthwestTerritoriesVilles=myGlobals.NorthwestTerritoriesVilles;
  
  NovaScotiaVilles=myGlobals.NovaScotiaVilles;
  
  NunavutVilles=myGlobals.NunavutVilles;
  
  OntarioVilles=myGlobals.OntarioVilles;
  
  PrinceEdwardIslandVilles=myGlobals.PrinceEdwardIslandVilles;
  
  QuebecVilles=myGlobals.QuebecVilles;
  
  SaskatchewanVilles=myGlobals.SaskatchewanVilles;
  
  YukonVilles=myGlobals.YukonVilles;

  mode=1; // en pouce et lbs   - Si : mode = 2 on est en cm et kg
  // les details de marchandise
  longeur:number=0.00;
  largeur:number=0.00;
  hauteur:number=0.00;
  poids:number=0.00;
  valeur:number=0.00;
  distance:number=0.00; // en miles
  distanceKm:number=0.00; // en km

  heurs_supl:number=0.00;

  totalPoints:number=0.00;
  // le prix sugere
  prix:number=0.00;

  //demande:Demande=new Demande();

  // */
  role:string="";  // role of user login
  demande:Demande=new Demande();
  shipper:Shipper=new Shipper();
  transporter:Transporter=new Transporter();
  id:number; // this is the id of shipper
  //mode:number=1;
  contacts:Array<Contact>;
  adresses:Array<Adresse>;

  //* Pour ajouter des circles and markers sur la carte
  // google maps zoom level
  zoom: number = 6;
  
  // initial center position for the map
  lat: number = 45.503964;
  lng: number = -73.567426;

  center : google.maps.LatLng=null;
  latLngOrigin:google.maps.LatLng =null;
  latLngDestination:google.maps.LatLng =null;
  
  //* default 
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  // outils draw and geometry
  drawingManager: any;
  infoWindow : any;
  spherical: typeof google.maps.geometry.spherical;
  //fin
  centerCoord={lat:45.568806, lng:-73.918333}  // location of SOS Prestige
  //
  //message:Message=null;
  today=new Date();

  constructor(public messagesService : MessagesService, public activatedRoute:ActivatedRoute, public shippersService:ShippersService, public contactsService:ContactsService,
    public voyagesService:VoyagesService, public adressesService:AdressesService, public demandesService:DemandesService, 
    public transportersService : TransportersService, public geocoding : GeocodingService, public router:Router){    
    this.id=activatedRoute.snapshot.params['id'];
  }
  //constructor(public demandesService : DemandesService, public geocoding : GeocodingService, public router:Router) { }
  async ngOnInit() {
    this.role=localStorage.getItem('role');
    await this.demandesService.getDetailDemande(this.id).subscribe((data:Demande)=>{
      this.demande=data;
      this.originChange(); // to find coordinates origin
      this.destinationChange(); // to find coordinates destination
      this.longeur=this.demande.longueur
      this.largeur=this.demande.largeur
      this.hauteur=this.demande.hauteur
      this.poids=this.demande.poids
      this.valeur=this.demande.valeur
      this.distance=this.demande.distance
      if(this.demande.roleDemander.includes('SHIPPER')){
        this.shippersService.getDetailShipper(this.demande.idDemander).subscribe((data:Shipper)=>{
          this.shipper=data;
        }, err=>{
          console.log(err);
        });
        this.contactsService.contactsDeShipper(this.demande.idDemander).subscribe((data:Array<Contact>)=>{
          this.contacts=data;
        }, err=>{
          console.log(err);
        });
        this.adressesService.adressesDeShipper(this.demande.idDemander).subscribe((data:Array<Adresse>)=>{
          this.adresses=data;
          this.gotoTop();
        }, err=>{
          console.log();
        });
      }
      if(this.demande.roleDemander.includes('TRANSPORTER')){
        this.transportersService.getDetailTransporter(this.demande.idDemander).subscribe((data:Transporter)=>{
          this.transporter=data;
        }, err=>{
          console.log(err);
        });
        this.contactsService.contactsDeTransporter(this.demande.idDemander).subscribe((data:Array<Contact>)=>{
          this.contacts=data;
        }, err=>{
          console.log(err);
        });
        this.adressesService.adressesDeTransporter(this.demande.idDemander).subscribe((data:Array<Adresse>)=>{
          this.adresses=data;
          this.gotoTop();
        }, err=>{
          console.log();
        });
      }
      /*this.messagesService.messageDemandeContacted(Number(localStorage.getItem('userId')), this.demande.id)
      .subscribe((data:Message)=>{
        this.message=data;
        //console.log("this.message.idSender : "+this.message.idSender)
        //console.log("this.message.idDemande : "+this.message.idDemande)
      }, err=>{
        console.log()
      })//*/
    }
    , err=>{
      console.log(err)
    })    
  }
//* function from calcul prix
changeUnite(){
  if (this.mode==1){
    this.mode=2; // pouce en cm 
    this.poids=Math.round(this.poids / 2.2046);
    this.longeur=Math.round(this.longeur / 0.39370);
    this.largeur=Math.round(this.largeur / 0.39370);
    this.hauteur=Math.round(this.hauteur / 0.39370);
  }
  else{
    this.mode=1; // cm en pouce
    this.poids=Math.round(this.poids * 2.2046);
    this.longeur=Math.round(this.longeur * 0.39370);
    this.largeur=Math.round(this.largeur * 0.39370);
    this.hauteur=Math.round(this.hauteur * 0.39370);
  }
}

// kg en lbs   ---    lb = kg * 2.2046
kgEnLbs(poids:number){
  poids = poids * 2.2046;
  console.log(poids);
}

// cm en pouce  ---   pouce = cm * 0.39370
cmEnPouce(longeur:number){
  longeur = longeur * 0.39370;
  console.log(longeur);
}

// km en mile
kmEnMile(distance:number){
  distance = distance * 0.621371;
  console.log(distance);
}

// calcule le pointage de poids (en lbs)
poidsPointage(poids:number, mode:number){
  if (mode == 2)
    poids = poids * 2.2046;
  if (poids>0 && poids<=10000)    
    return 1;
  if (poids>10000 && poids<=20000)    
    return 2;
  if (poids>20000 && poids<=30000)    
    return 3;
  if (poids>30000 && poids<=40000)    
    return 4;
  if (poids>40000 )    
    return 5;    
  return 0;        
}

// calcule le pointage de longueur (en pouce)
longeurPointage(longeur:number, mode:number){
  if (mode == 2)
    longeur = longeur * 0.39370;
  if (longeur>0 && longeur<=120)    
    return 1;
  if (longeur>121 && longeur<=240)    
    return 2;
  if (longeur>240 && longeur<=360)    
    return 3;
  if (longeur>360 && longeur<=480)    
    return 4;
  if (longeur>480 )    
    return 5;
  return 0;            
}

// calcule le pointage de largeur (en pouce)
largeurPointage(largeur:number, mode:number){
  if (mode == 2)
    largeur = largeur * 0.39370;
  if (largeur>0 && largeur<=48)    
    return 1;
  if (largeur>48 && largeur<=102)    
    return 2;
  if (largeur>102 && largeur<=120)    
    return 4;
  if (largeur>120 && largeur<=144)    
    return 6;
  if (largeur>144)   // on va ajouter encore des paremes
    return 6;
  return 0;            
}

// calcule le pointage de hauteur (en pouce)
hauteurPointage(hauteur:number, mode:number){
  if (mode == 2)
    hauteur = hauteur * 0.39370;
  if (hauteur>0 && hauteur<=92)    
    return 1;
  if (hauteur>92 && hauteur<=120)    
    return 2;
  if (hauteur>120)  // on va ajouter encore des paremes  
    return 4;   
  return 0;            
}

// prix depart
prixDepart(totalPoints:number){
  
  return 250.00;
}
prixDistance(totalPoints:number){
  
  return 250.00;
}
prixToile(totalPoints:number){
  
  return 250.00;
}
prixAttendre(totalPoints:number){
  
  return 0.00;
}
prixSuplement(totalPoints:number, heurs_supl:number){
  
  return 0.00;
}
onOk(){    
  //this.distance=this.calculateDistance() / 1000
  //this.distance2Ads(this.demande.origin, this.demande.destination)
  this.setDistanceTravel(this.demande.origin, this.demande.destination)
  this.totalPoints = this.longeurPointage(this.longeur, this.mode) + this.largeurPointage(this.largeur, this.mode) + this.hauteurPointage(this.hauteur, this.mode) 
    + this.poidsPointage(this.poids, this.mode); // + this.valeur + this.distance;
  
  this.prix = this.prixDepart(this.totalPoints) + this.prixDistance(this.totalPoints) + this.prixToile(this.totalPoints)
    + this.prixAttendre(this.totalPoints) + this.prixSuplement(this.totalPoints, this.heurs_supl);
  this.searchTruck=false; //activer poster et rechercher

}

onRetour(){
  if(this.role.includes('SHIPPER'))
    this.router.navigateByUrl("/list-demande-de-chaque/shipper")
  if(this.role.includes('TRANSPORTER'))
    this.router.navigateByUrl("/list-demande")
}
disableContactDemande():boolean{
  let disableContact:boolean=false;  // by default, contact is actif
  if((this.demande.idsVoyageContactes+',').includes(','+localStorage.getItem("userId")+','))
    disableContact=true;
  return disableContact;
}
onContact(){
  //console.log("OK, We have had your message!")
  let message= new Message()
  this.demande.idsVoyageContactes=this.demande.idsVoyageContactes+","+localStorage.getItem('userId')
  message.idSender=Number(localStorage.getItem('userId'));
  message.roleSender=localStorage.getItem('role');
  message.idReceiver=this.demande.idDemander;
  message.roleReceiver="SHIPPER";
  message.idDemande=this.demande.id;
  //message.idVoyage=
  /*
  message.message=localStorage.getItem('nom') +" - tel:  "+localStorage.getItem('tel')
  +" - email:  " + localStorage.getItem('email')
  +" -  On peut charger votre demande de  "+ this.demande.origin +"  a  " + this.demande.destination; 
  //*/
  //let messagesService : MessagesService
  //*
  let temp1Tel:string= '<strong><a href="tel:'
  let temp1Mail:string='<strong><a href="mailto:'
  let temp2:string='">'
  let temp3:string='</a></strong>'
  
  message.message=localStorage.getItem('nom') +" - Tel:  "
  + temp1Tel+localStorage.getItem('tel')+temp2+localStorage.getItem('tel')+temp3
  + " - Email:  " 
  + temp1Mail+localStorage.getItem('email')+temp2+localStorage.getItem('email')+temp3
  + " -  On peut charger votre demande de  "+ this.demande.origin +"  a  " + this.demande.destination;
  //*/
  this.messagesService.saveMessages(message).subscribe(data=>{
    this.demandesService.updateDemande(this.demande.id, this.demande).subscribe(data=>{},err=>{console.log(err)})
  }, err=>{console.log(err)})
  alert("Votre demande a ete envoye!")
}

  //* calculer distance
  async search(address: string) {
  let point:google.maps.LatLng =null;
  if (address != "") {
      await this.geocoding.codeAddress(address).forEach(
          (results: google.maps.GeocoderResult[]) => {
                if(results[0].geometry.location.lat()>0){
                  console.log('results[0].geometry.location.lat() : '+results[0].geometry.location.lat().toPrecision(8));
                  console.log('results[0].geometry.location.lng() : '+results[0].geometry.location.lng().toPrecision(8));                                    
                  point= new google.maps.LatLng(
                    Number(results[0].geometry.location.lat().toPrecision(8)),
                    Number(results[0].geometry.location.lng().toPrecision(8))                            
                  )
                  console.log('Dedans de If'+point.toString())
                }
          })
          .then(() => {
              console.log('Geocoding service: completed.');
          })
          .catch((error: google.maps.GeocoderStatus) => {
              if (error === google.maps.GeocoderStatus.ZERO_RESULTS) {
                  console.log('Ne pas pour prendre coordonnees de cette point!!')
              }
          });
      //return point;
  }
  }

  async distance2Ads(address1: string, address2:string) {
  let point1:google.maps.LatLng =null;
  let point2:google.maps.LatLng =null;
  if (address1 != "" && address2!=null) {
      await this.geocoding.codeAddress(address1).forEach(
          (results: google.maps.GeocoderResult[]) => {
                if(results[0].geometry.location.lat()>0){
                  point1= new google.maps.LatLng(
                    results[0].geometry.location.lat(),
                    results[0].geometry.location.lng()                            
                  )
                }
          })
          .then(() => {
              console.log('Geocoding service: completed.');
          })
          .catch((error: google.maps.GeocoderStatus) => {
              if (error === google.maps.GeocoderStatus.ZERO_RESULTS) {
                  console.log('Ne pas pouvoir prendre coordonnees de cette point!!')
              }
          });
          await this.geocoding.codeAddress(address2).forEach(
            (results: google.maps.GeocoderResult[]) => {
                  if(results[0].geometry.location.lat()>0){
                    point2= new google.maps.LatLng(
                      results[0].geometry.location.lat(),
                      results[0].geometry.location.lng()                            
                    )
                  }
            })
            .then(() => {
                console.log('Geocoding service: completed.');
            })
            .catch((error: google.maps.GeocoderStatus) => {
                if (error === google.maps.GeocoderStatus.ZERO_RESULTS) {
                    console.log('Ne pas pouvoir prendre coordonnees de cette point!!')
                }
            });
      this.calculateDistance(point1, point2)
  }
  }

  calculateDistance(point1:google.maps.LatLng, point2:google.maps.LatLng) {
  this.distance = Math.round(google.maps.geometry.spherical.computeDistanceBetween(point1, point2)/1000/1.609344) ;
  this.distanceKm = Math.round(this.distance*1.609344)
  }

  //* calculer distance travel en miles + kms
  setDistanceTravel(address1: string, address2:string) {
    let service = new google.maps.DistanceMatrixService;// = new google.maps.DistanceMatrixService()
    // calculate load distance - ld
    service.getDistanceMatrix({
      'origins': [address1], 'destinations': [address2], travelMode:google.maps.TravelMode.DRIVING
    }, (results: any) => {    
      this.distance= Math.round((results.rows[0].elements[0].distance.value)/1000/1.609344)  
      this.distanceKm = Math.round(this.distance*1.609344)
    });  
  }

  onSearchTruck(){
    this.getMatchingVoyages();
  }
  doSearchTruck(){
    //this.demande.idDemander - deja
    //this.demande.roleDemander - deja
    // this.demande.dateDepart - deja
    // mode=1 - en pouce, lbs - par default dans database 
    // this.demande.nomDemander
    if(this.mode==1){
      this.demande.longueur = this.longeur
      this.demande.largeur =this.largeur
      this.demande.hauteur = this.hauteur
      this.demande.poids = this.poids
    }
    // mode=1 - en cm, kg
    if(this.mode==2){
      this.cmEnPouce(this.demande.longueur = this.longeur)
      this.cmEnPouce(this.demande.largeur =this.largeur)
      this.cmEnPouce(this.demande.hauteur = this.hauteur)
      this.kgEnLbs(this.demande.poids = this.poids)
    }
    this.demande.valeur=this.valeur
    this.demande.distance = this.distance;  // par default en miles
    this.demande.totalpoints=this.totalPoints;
    this.demande.prixSugere=this.prix
    this.demandesService.saveDemandes(this.demande).subscribe((data:Demande)=>{
      //this.demande=data;
      localStorage.setItem('idDemande', data.id.toString());
      this.router.navigateByUrl("/list-voyage");
    }
    , err=>{
      console.log(err)
    })
  }
  //*// function to take list Matching Voyage
  async getMatchingVoyages(){  // && this.demande.destination.length!=0){
    let voyages:Array<Voyage>;
    let listIdVoyages:Array<string>=[]
    let dLatLngOrigin= new google.maps.LatLng(
      this.demande.originLat,
      this.demande.originLong
    )                            
    let dLatLngDestination= new google.maps.LatLng(
      this.demande.destLat,
      this.demande.destLong
    )
    await this.voyagesService.matchingVoyages(this.demande.typeCamion, this.demande.optionDemande)
    .subscribe(async (data:Array<Voyage>)=>{
      let matchVoyages:Array<Voyage>=[]
      // we filter voyages here
      await data.forEach(async voyage=>{
        console.log(voyage.origin)
        console.log(voyage.destination)
        console.log(voyage.radiusOrigin)
        console.log(voyage.radiusDestination)
        console.log(voyage.paths)
        // Rebuild paths
        let pathsRebuild = voyage.paths.split(",")
        console.log("pathsRebuild : "+pathsRebuild)
        let testPaths:Array<LatLngLiteral>= []; // rebuild from array of string
        for(var i=0; i<=pathsRebuild.length-2; i=i+2){
          testPaths.push({lat:Number(pathsRebuild[i]), lng:Number(pathsRebuild[i+1])})
        }
        let paths=testPaths;
        console.log("testPaths.toString() : ")
        testPaths.forEach((y:LatLngLiteral)=>{        
          console.log('lat : '+y.lat + ' lng : '+y.lng)
        })

        let latLngOriginV= new google.maps.LatLng(
          voyage.originLat,
          voyage.originLong                            
        )

        let latLngDestinationV= new google.maps.LatLng(
          voyage.destLat,
          voyage.destLong                            
        )

        let originCircle = new google.maps.Circle({
          center: new google.maps.LatLng(latLngOriginV.lat(), latLngOriginV.lng()),
          radius: voyage.radiusOrigin*1.60934*1000,  // mile en metre
          fillColor: '#FFFF00',
          //editable: false,
          //draggable: false,
        });

        let destCircle1 = new google.maps.Circle({
          center: new google.maps.LatLng(latLngDestinationV.lat(), latLngDestinationV.lng()),
          radius: voyage.radiusDestination*1.60934*1000, // mile en metre
          fillColor: '#FF00FF',
          //editable: false,
          //draggable: false,
        })
        //
        let polygon= new google.maps.Polygon();
        let angle:number;  // to get angle of voyage and demande 
        if(paths.length>0){
          polygon = new google.maps.Polygon({
            paths: paths,
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF00EE',
            fillOpacity: 0.35,
            //editable: (this.role.includes('TRANSPORTER')),
            //draggable:false,
          });
          this.spherical = google.maps.geometry.spherical;
          //var F: google.maps.LatLng = this.latLngOrigin //new google.maps.LatLng(this.latLngOrigin.lat(), this.latLngOrigin.lng()); 
          //var T: google.maps.LatLng = this.latLngDestination  //new google.maps.LatLng(this.latLngDestination.lat(), this.latLngDestination.lng()); 
          // Get direction of the segment
          let heading:number = this.spherical.computeHeading(latLngOriginV, latLngDestinationV);
          let dHeading:number = this.spherical.computeHeading(this.latLngOrigin, this.latLngDestination);
          angle=Math.abs(dHeading-heading);
          console.log('dHeading - heading = ' + angle)
        }    //*/   
        if(originCircle.getBounds().contains(this.latLngOrigin) && destCircle1.getBounds().contains(this.latLngDestination)){
          //matchVoyages.push(voyage);
          listIdVoyages.push(voyage.id.toString())
          //return;
        }
        if(originCircle.getBounds().contains(this.latLngOrigin) && originCircle.getBounds().contains(this.latLngDestination)){
          //matchVoyages.push(voyage)
          listIdVoyages.push(voyage.id.toString())
          //return;
        }
        if(destCircle1.getBounds().contains(this.latLngOrigin) && destCircle1.getBounds().contains(this.latLngDestination)){
          //matchVoyages.push(voyage)
          listIdVoyages.push(voyage.id.toString())
          //return;
        }
        
        if(paths.length>0){
          if(
            !originCircle.getBounds().contains(this.latLngOrigin) // originDemande not in origin
            && !destCircle1.getBounds().contains(this.latLngOrigin) // originDemande not in destination
            && google.maps.geometry.poly.containsLocation(this.latLngOrigin, polygon) // originDemande in corridor
            && destCircle1.getBounds().contains(this.latLngDestination)) // destinationDemande in destination
          {
            //matchVoyages.push(voyage)
            listIdVoyages.push(voyage.id.toString())
            //return;
          }
          if(
            !destCircle1.getBounds().contains(this.latLngDestination) // destinationDemande not in destination
            && !originCircle.getBounds().contains(this.latLngDestination) // destinationDemande not in origin
            && google.maps.geometry.poly.containsLocation(this.latLngDestination, polygon) // destinationDemande in corridor
            && originCircle.getBounds().contains(this.latLngOrigin)) // originDemande in origin
          {
            //matchVoyages.push(voyage)
            listIdVoyages.push(voyage.id.toString())
            //return;
          }
          // */
          if(
            !originCircle.getBounds().contains(this.latLngOrigin) // originDemande not in origin
            && !destCircle1.getBounds().contains(this.latLngOrigin) // originDemande not in destination
            && google.maps.geometry.poly.containsLocation(this.latLngOrigin, polygon) // originDemande in corridor
            && !destCircle1.getBounds().contains(this.latLngDestination) // destinationDemande not in destination 
            && !originCircle.getBounds().contains(this.latLngDestination) // destinationDemande not in origin
            && google.maps.geometry.poly.containsLocation(this.latLngDestination, polygon) // destinationDemande in corridor
            && (angle<=90 || angle>=270))
          {
            //matchVoyages.push(voyage)
            listIdVoyages.push(voyage.id.toString())
            //return;
          }
        }
        //if(google.maps.geometry.poly.containsLocation(this.dLatLngOrigin, this.polygon)){}          
      })
      //voyages=matchVoyages
      this.demande.idsVoyageMatchings=listIdVoyages.toString();
      console.log('this.demande.idsVoyageMatchings : ' + this.demande.idsVoyageMatchings)
      this.doSearchTruck();
    }, err=>{
      console.log(err)
    })
  }//*/
  onReset(){
    this.longeur=0.00;
    this.largeur=0.00;
    this.hauteur=0.00;
    this.poids=0.00;
    this.valeur=0.00;
    this.distance=0.00; // en miles
    this.distanceKm=0.00; // en km
    this.heurs_supl=0.00;
    this.totalPoints=0.00;
    this.prix=0.00;
    this.searchTruck=true; //desactiver poster et rechercher
    this.demande=new Demande();
    this.ngOnInit();
  }
  //*/
  //* to show map
  showMap() {
    let mapProp = {
      center: new google.maps.LatLng(this.centerCoord.lat, this.centerCoord.lng),
      zoom: 6,
      //mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    var directionsDisplay = new google.maps.DirectionsRenderer; // declare google display
    var directionsService = new google.maps.DirectionsService; // declare google service
    /*var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,
      center: {lat: 41.85, lng: -87.65}
    });//*/
    directionsDisplay.setMap(this.map); // to see the routes on the map
    //directionsDisplay.setPanel(document.getElementById('right-panel')); // to see the routes just by the text

    this.infoWindow = new google.maps.InfoWindow;
    let markerOrigin = new google.maps.Marker({
      position: this.latLngOrigin,
      map: this.map,
      //icon: 'https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png', //;this.iconBase + this.selectedMarkerType,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 4
      },
      title: this.demande.origin
    });
    let markerDestination = new google.maps.Marker({
      position: this.latLngDestination,
      map: this.map,
      //icon: 'https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png', //;this.iconBase + this.selectedMarkerType,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 4
      },
      title: this.demande.destination
    });
    // centrer la carte
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(this.latLngOrigin);
    bounds.extend(this.latLngDestination);
    this.map.fitBounds(bounds);
    //*/
    //* line fron origin to destination
    var flightPlanCoordinates = [
      {lat: this.latLngOrigin.lat(), lng: this.latLngOrigin.lng()},
      {lat: this.latLngDestination.lat(), lng: this.latLngDestination.lng()}
    ];
    var flightPath = new google.maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2,
      icons: [{
        icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW},
        offset: '100%'
      }]
    });
    flightPath.setMap(this.map);
    /*/
    //* Totest find my route/
    //var start = document.getElementById('start').textContent;
    //var end = document.getElementById('end').textContent;
    directionsService.route({
      origin: this.demande.origin,
      destination: this.demande.destination,
      travelMode: google.maps.TravelMode.DRIVING
    }, async function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        //await directionsDisplay.setDirections(response);
        //console.log('response : '+response.routes.toString())
        let result = await document.getElementById('right-panel').textContent;
        //console.log('result : '+result)
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
    
    //*/

  }
  //*
  async originChange(){
    //*
    
    await this.geocoding.codeAddress(this.demande.origin).forEach(
      (results: google.maps.GeocoderResult[]) => {
            if(results[0].geometry.location.lat()>0){
              this.latLngOrigin= new google.maps.LatLng(
                results[0].geometry.location.lat(),
                results[0].geometry.location.lng()                            
              )
              //alert("En deplacant, attendre 2 secondes svp, puis press OK.")
            }
            else
              alert("Ne pas trouver de coordonnees de ce origin")
    });//*/
    //this.showMap();
  }

  async destinationChange(){
    //*
    await this.geocoding.codeAddress(this.demande.destination).forEach(
      (results: google.maps.GeocoderResult[]) => {
            if(results[0].geometry.location.lat()>0){
              this.latLngDestination= new google.maps.LatLng(
                results[0].geometry.location.lat(),
                results[0].geometry.location.lng()                            
              )
              //alert("En deplacant, attendre 2 secondes svp, puis press OK.")
            }
            else
              alert("Ne pas trouver de coordonnees de cet destination")
    });//*/
    //this.showMap();
  }
  //*/ end to show map

  isShow: boolean;
  topPosToStartShowing = 100;
  @HostListener('window:scroll')
  checkScroll() {
      
    // window의 scroll top
    // Both window.pageYOffset and document.documentElement.scrollTop returns the same result in all the cases. window.pageYOffset is not supported below IE 9.

    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    //console.log('[scroll]', scrollPosition);
    
    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  // TODO: Cross browsing
  gotoTop() {
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }
  gotoBottom() {
    window.scroll({ 
      top: document.documentElement.scrollHeight, 
      left: 0, 
      behavior: 'smooth' 
    });
  }
}
