import { Component, OnInit, ViewChild } from '@angular/core';
import { Transporter } from '../../model/model.transporter';
import { TransportersService } from '../../services/transporters.service';
import { ActivatedRoute, Router } from '@angular/router';
//import { Contact } from 'src/model/model.contact';
//import { Chauffeur } from 'src/model/model.chauffeur';
//import { Adresse } from 'src/model/model.adresse';
import { ContactsService } from '../../services/contacts.service';
import { AdressesService } from '../../services/adresses.service';
import { CamionsService } from '../../services/camions.service';
//import { ServicesOffre } from 'src/model/model.servicesOffre';
import { Camion } from 'src/model/model.camion';
//import { FichePhysiqueEntretien } from 'src/model/model.fichePhysiqueEntretien';
//import { FichePhysiqueEntretienCont } from 'src/model/model.fichePhysiqueEntretienCont';
import { FichePhysiquesService } from 'src/services/fichePhysiques.service';
import { FichePhysiqueContsService } from 'src/services/fichePhysiqueConts.service';
//import { AutreEntretien } from 'src/model/model.autreEntretien';
import { AutreEntretiensService } from 'src/services/autreEntretiens.service';
//import { AutreEntretienList } from 'src/model/model.autreEntretienList';
import { Subscription, timer, interval } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ChauffeursService } from 'src/services/chauffeurs.service';
import { Itineraire } from 'src/model/model.itineraire';
import { async } from '@angular/core/testing';
import { GeocodingService } from 'src/services/geocoding.service';
import { GeolocationService } from 'src/services/geolocation.service';
import { Repere } from 'src/model/model.repere';
import { ItinerairesService } from 'src/services/itineraires.service';
import { ReperesService } from 'src/services/reperes.service';


@Component({
  selector: 'app-camions-list',
  templateUrl: './camions-list.component.html',
  styleUrls: ['./camions-list.component.css']
})
export class CamionsListComponent implements OnInit {
  
  imgArrow = "assets/images/arrow.png";
  
  itineraire:boolean=false;
  camionsList:boolean=true; // par default, on voit la liste de camions
  repere:boolean=false;

  itiner:Itineraire=new Itineraire();
  itiners:Array<Itineraire>=[];
  rep:Repere=new Repere();
  reps:Array<Repere>=[];

  //* for map flotte truck
  subscription : Subscription;
  //transporter:Transporter=new Transporter();
  camionMap:Camion=new Camion();
  camionsSurMap:Array<Camion>=[]; //new Array<Camion>();
  //idCamionMap:number=108;  // test wit Hino of SOS
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  markers=Array<google.maps.Marker>();
  carte:number=1; //-1;
  carteText:string="Reperer sur la carte";
  iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
  infoWindow: google.maps.InfoWindow;
  transporter: Transporter;
  camions: Camion[];
  camionsInOperation: Camion[];
  camionsOutOperation: Camion[];

  today=new Date();
  todaySuite = new Date(this.itiner.datePick);

  constructor(public activatedRoute:ActivatedRoute, public transportersService:TransportersService, public contactsService:ContactsService,
    public adressesService:AdressesService, public camionsService:CamionsService,  public fichePhysiquesService:FichePhysiquesService,
    public fichePhysiqueContsService:FichePhysiqueContsService, public autreEntretiensService:AutreEntretiensService, private router:Router,
    public chauffeursService:ChauffeursService, private sanitizer:DomSanitizer, public geocoding : GeocodingService,
    private geolocation : GeolocationService,
    private itinerairesService:ItinerairesService, private reperesService:ReperesService){    
    //this.id=activatedRoute.snapshot.params['id'];
    //this.avltrackLinkTrust=sanitizer.bypassSecurityTrustResourceUrl(this.avltrackLink)
  }

  ngOnInit() {
    this.camionsSurMap=[];
    this.transportersService.getDetailTransporter(Number(localStorage.getItem('idTransporter'))).subscribe(async(data:Transporter)=>{
      this.transporter=data;
     
      // get list itineraires
      await this.itinerairesService.itinerairesDeTransporter(this.transporter.id).subscribe((data:Array<Itineraire>)=>{
        if(data!=null) this.itiners=data
      },err=>{console.log(err)})
      
      //get list reperes
      await this.reperesService.reperesTransporter(this.transporter.id).subscribe((data:Array<Repere>)=>{
        if(data!=null) this.reps=data
      }, err=>{console.log(err)})
      
      this.onPress(); // show carte right now
      alert("Attendre 2 secondes, on loade la carte, SVP!")
      
    }, err=>{
      console.log(err);
    });
  }

  //myWindow: any;

  onPress(){
    //this.carte=-this.carte;
    if(this.carte==-1){
      //this.camionsSurMap=[];// to empty this list
      this.carteText='Reperer sur la carte'
      this.subscription.unsubscribe();
    }
    else{
      this.camionsSurMap=[];// to empty this list
      this.carteText='Fermer la carte'    
      var numbers = timer(2000);
      numbers.subscribe(x =>{
        this.camionsService.camionsDeTransporter(this.transporter.id).subscribe((data:Array<Camion>)=>{
          data.forEach(camion=>{
            if(camion.status && (camion.uniteMonitor!=null && camion.monitor!=null) && (camion.uniteMonitor.length!=0 && 
              camion.monitor.length!=0) && (!camion.uniteMonitor.includes('no-gps'))) // !camion.uniteMonitor.includes('no-gps') - means : there isn't GPS
              // this.geocoding.geocode(new google.maps.LatLng(              
              //   camion.latitude,
              //   camion.longtitude
              // ))
              // .forEach(
              //   (results: google.maps.GeocoderResult[]) => {
              //     console.log(results[0].formatted_address);
              //   }
              // ).then(()=>{
              //   this.camionsSurMap.push(camion)
                
              // })
              this.camionsSurMap.push(camion)
          })
          let mapProp = {
            center: new google.maps.LatLng(45.568806, -73.918333),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
          this.camionsSurMap.forEach(camion=>{
            if(camion.localName.length==0) this.belongingRepere(camion); //set repere si exist into
            //console.log("camion.id : "+ camion.id)
            if(camion.uniteMonitor!=null && camion.monitor!=null){
              //this.marker.setMap(null);
              let location1 = new google.maps.LatLng(camion.latitude, camion.longtitude);          
              let marker = new google.maps.Marker({
                position: location1,
                map: this.map,
                icon: {
                 // url:"http://maps.google.com/mapfiles/kml/shapes/truck.png",
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  //url:"http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                  scale:5,
                  rotation:camion.direction,
                  fillOpacity: 1,
                  fillColor: "#7FFF00", //"#FFFFFF"
                  strokeWeight: 2,
                  strokeColor: "#008088", //"#FFFFFF",//"red",
                },
                title: (camion.foreignName.length>0 ? camion.foreignName : (camion.unite+camion.type+camion.modele)),
                label: {text:(camion.foreignName.length>0 ? camion.foreignName : (camion.unite+camion.type+camion.modele)), color:"orange"},
              });
              this.infoWindow = new google.maps.InfoWindow;
              marker.addListener('click', (event)=>{
                //var contentString:string='unite : '+ camion.unite + '  -  Vitesse : ' + camion.speed;
                //var contentString:string='Montreal, Quebec - Alma, Quebec. Disponible : 25"';//'unite : '+ camion.unite + '  -  Vitesse : ' + camion.speed;
                //var contentString:string='<div><p> '+ 'Unite '+camion.unite+" <br>" +
                var contentString:string='<div><p> '+ (camion.foreignName.length>0 ? camion.foreignName : (camion.unite+camion.type+camion.modele))+" <br>" +
                  '<table border="1">' +
                  '<tr>'+
                    '<td>Itineraire</td>'+
                    '<td>PickDate</td>'+ 
                    "<td>DropDate</td>"+
                    '<td>Occup</td>'+
                    '<td>Dispo </td>'+
                  '</tr>'+
                  this.prepareText(camion)+
                  '</table>'+'<br>'
                  ' </p></div>'
                // if(camion.stopDuration>0)
                //   contentString='unite : '+ camion.unite + '  -  Arrete depuis : ' + this.showStopDuration(camion.stopDuration)//camion.stopDuration +' minutes.';
                // Replace the info window's content and position.
                this.infoWindow.setContent(contentString);
                this.infoWindow.setPosition(event.latLng);
                this.infoWindow.open(this.map);//*/
              })
              /*marker.setIcon({
                  url:"http://maps.google.com/mapfiles/kml/shapes/truck.png",
                  scale:0.1,
                  rotation:camion.direction,
                  fillColor:'red',
                })//*/
              this.markers.push(marker)
            }  
          })
          const source = interval(60000);
          this.subscription=source.subscribe(val=>{this.getLocalisation()})
          this.makeCIsLList(); // make the lists itiniers follow each camion
        }, err=>{
          console.log();
        })
      })      
    }
    //this.router.navigate(["/map-flotte", this.id]);
  }

  orientation(c:Camion){
    //let degreeText="rotate("+c.direction+"deg)";
    return "rotate("+c.direction+"deg)"; //degreeText;
  }

  // to show the stop duration in day-hours-minute
  showStopDuration(stopDuration:number){
    let duration='';
    let days =  Number.parseInt((stopDuration/1440).toString()) +' jour(s) '
    let hours = Number.parseInt(((stopDuration%1440)/60).toString()) +' heure(s) '
    let minutes = ((stopDuration%1440)%60).toString() +' minute(s) '
    
    if((stopDuration/1440)>=1)
      duration = duration+days;
    if(((stopDuration%1440)/24)>=1)
      duration=duration+hours
    duration=duration+minutes
    
    //duration = days+' jour(s) '+hours+' heure(s) '+minutes+' minute(s) '

    return duration;
  }
  prepareText(c:Camion){
    //find list itineraire
    let itiList= this.camionItinersFind(c.id)
    let tempText=''
    itiList.forEach(iti=>{
      //iti.datePick = new Date();
      //iti.dateDrop = new Date()
      tempText=tempText+
      '<tr>'+
        '<td>'+iti.origin +"  -  "+ iti.destination+'</td>'+
        '<td>'+ "<input type=date disabled value="+iti.datePick+" style='width: 17ch;'>"+" </input>"+"</td>"+ 
        "<td>"+ "<input type=date disabled value="+iti.dateDrop+" style='width: 17ch;'>"+" </input>"+"</td>"+
        '<td>'+(iti.longueur!=null ? iti.longueur+" ft" : '')+'</td>'+
        '<td style="color: black; background-color:greenyellow;"></td>'+
      '</tr>'
    })
    let textHtnl = ''
    //obj=this.camionsSurMap;
    //obj.for
    // obj.forEach(camion=>{
    //   textHtnl=textHtnl+'<tr *ngFor="let c of camionsSurMap">'+
    //   '<td>Montreal, Quebec - Alma, Quebec</td> <td>17-06-2020</td> <td>18-06-2020</td> '+
    //   '<td>50"</td> <td style="color: black; background-color:greenyellow;">25"</td>'+
    //   '</tr>'
    // })
    //obj.forEach(iti=>{
      textHtnl=textHtnl+tempText
      if(textHtnl.length==0) textHtnl=
      '<tr>'+
      '<td colspan="5">Auccun itineraire.</td>'+
      '</tr>'
      // '<tr *ngFor="let iti of camionItinersFind(c.id)">'+
      //   '<td>{{iti.origin +"  -  "+ iti.destination}}</td>'+
      //   "<td>Pick: {{iti.datePick | date: 'dd-MM-yyyy'}}</td>"+ 
      //   "<td>Drop: {{iti.dateDrop | date: 'dd-MM-yyyy'}}</td>"+
      //   '<td>Occupe: {{iti.longueur+" ft"}}</td>'+
      //   '<td style="color: black; background-color:greenyellow;">Dispo: 25 ft</td>'+
      // '</tr>'
    //})
    return textHtnl;
  }

  pickDateChange(event){
    this.itiner.dateDrop = this.todaySuite = this.itiner.datePick = event.target.value // new Date(event.target.value);
  }
  dropDateChange(event){
    this.itiner.dateDrop =event.target.value
  }
  onChange(){
    this.map.setCenter(new google.maps.LatLng(this.camionMap.latitude, this.camionMap.longtitude));
    var c= this.camionMap;
    //this.infoWindow.close();
    this.map.setCenter(new google.maps.LatLng(c.latitude, c.longtitude));
    // this.infoWindow = new google.maps.InfoWindow;
    // var contentString:string='<div><p> '+ 'Unite '+c.unite+" <br>" +
    // '<table border="1">' +
    //     '</table>'+'<br>'
    // ' </p></div>'
    // this.infoWindow.setContent(contentString);
    // this.infoWindow.setPosition(new google.maps.LatLng(c.latitude, c.longtitude));
    // this.infoWindow.open(this.map);//*/      
  }
  camionItinersFind(idCamion){
    return this.cIsLList.find(res=>res.camionId==idCamion).itiners
  }
  deleteRepere(r:Repere){
    this.reperesService.deleteRepere(r.id).subscribe(data=>{}, err=>console.log(err))
    this.reps.splice(this.reps.indexOf(r),1)
    // this.rep=new Repere()
  }
  deleteItiner(it:Itineraire){
    this.itinerairesService.deleteItineraire(it.id).subscribe(data=>{}, err=>{console.log(err)})
    this.itiners.splice(this.itiners.indexOf(it),1)
    this.makeCIsLList()
  }
  onAjouter(){
    //console.log('this.itiner.camionAttribue: '+this.itiner.camionAttribue)
    //let it=this.itiner
    this.itiner.idTransporter=this.transporter.id;
    this.itinerairesService.saveItineraires(this.itiner).subscribe((data:Itineraire)=>{
      //this.itiner=data
      this.itiners.push(data) // put this itinaire to the list of transporter
      this.cIsLList.find(res=>res.camionId==data.idCamion).itiners.push(data) // put this itineraire to this camion
      this.itiner=new Itineraire()
    }, err=>{console.log(err)})
    //this.itiners.push(it)
    // this.cIsLList.find(res=>res.camionId==it.idCamion).itiners.push(it) // put this itineraire to this camion
    // this.itiner=new Itineraire()
    //this.drawOrigin()
    
    if(this.originCircle){
      this.originCircle.setMap(null)
    }
    if(this.destCircle1)(
      this.destCircle1.setMap(null)
    )
    if(this.flightPath){
      this.flightPath.setMap(null)
    }
    this.latLngOrigin=null
    this.latLngDestination=null
    this.flightPath=null
    this.geolocation.getCurrentPosition().subscribe(async (data:Position)=>{
      this.map.setCenter(new google.maps.LatLng(data.coords.latitude, data.coords.longitude));
    })
    
  }

  camionTemp:Camion; // this is camion temporaire for list itineraires 
  findCamionById(id:number){
    //let c: Camion;
    this.camionTemp= this.camionsSurMap.find(x=>x.id===id)
    // this.infoWindow.close();
    // this.map.setCenter(new google.maps.LatLng(c.latitude, c.longtitude));
    // this.infoWindow = new google.maps.InfoWindow;
    // let contentString:string= (c.foreignName.length>0 ? c.foreignName : (c.unite+c.type+c.modele));
    // this.infoWindow.setContent(contentString);
    // this.infoWindow.setPosition(new google.maps.LatLng(c.latitude, c.longtitude));
    // this.infoWindow.open(this.map);//*/
    //return c;
  }
  onClickCamionId(id:number){
    let c: Camion;
    c= this.camionsSurMap.find(x=>x.id===id)
    this.infoWindow.close();
    this.map.setCenter(new google.maps.LatLng(c.latitude, c.longtitude));
    this.infoWindow = new google.maps.InfoWindow;
    let contentString:string= (c.foreignName.length>0 ? c.foreignName : (c.unite+c.type+c.modele));
    this.infoWindow.setContent(contentString);
    this.infoWindow.setPosition(new google.maps.LatLng(c.latitude, c.longtitude));
    this.infoWindow.open(this.map);//*/
  }
  onClickCamion(c:Camion){
    this.infoWindow.close();
    this.map.setCenter(new google.maps.LatLng(c.latitude, c.longtitude));
    this.infoWindow = new google.maps.InfoWindow;
    let contentString:string= (c.foreignName.length>0 ? c.foreignName : (c.unite+c.type+c.modele));
    this.infoWindow.setContent(contentString);
    this.infoWindow.setPosition(new google.maps.LatLng(c.latitude, c.longtitude));
    this.infoWindow.open(this.map);//*/
    // let placePresent :string;
    //this.placePresent(c, placePresent)
    // this.geocoding.geocode(new google.maps.LatLng(              
    //   c.latitude,
    //   c.longtitude
    // ))
    // .forEach(
    //   (results: google.maps.GeocoderResult[]) => {
    //     placePresent=results[0].formatted_address;
    //     // console.log('results[0].formatted_address : '+results[0].formatted_address)
    //     // console.log('results[0].address_components.long_name : '+results[0].address_components[0].long_name)
    //     // console.log('results[0].address_components.short_name : '+results[0].address_components[0].short_name)
    //     // console.log('results[0].address_components.types : '+results[0].address_components[0].types)
    //     // console.log('results[0].geometry : '+results[0].geometry.location)
    //   }
    // )
    // .then(()=>{
    //   //console.log('Place present dans pP(): '+placePresent)
    //   let contentString:string= ('Unite '+c.unite+' - '+'A: '+ placePresent);//'unite : '+ camion.unite + '  -  Vitesse : ' + camion.speed;
    //   this.infoWindow.setContent(contentString);
    //   this.infoWindow.setPosition(new google.maps.LatLng(c.latitude, c.longtitude));
    //   this.infoWindow.open(this.map);//*/
    // })
    // this.map.setCenter(new google.maps.LatLng(c.latitude, c.longtitude));
    // this.infoWindow = new google.maps.InfoWindow;
    // var contentString:string='Unite '+c.unite+' - '+'Montreal, Quebec - Alma, Quebec. Disponible : 25"';//'unite : '+ camion.unite + '  -  Vitesse : ' + camion.speed;
    // this.infoWindow.setContent(contentString);
    // this.infoWindow.setPosition(new google.maps.LatLng(c.latitude, c.longtitude));
    // this.infoWindow.open(this.map);//*/      
  }
  

  // pP(c:Camion, place:string){
  //   return this.geocoding.geocode(new google.maps.LatLng(              
  //     c.latitude,
  //     c.longtitude
  //   ))
  //   .forEach(
  //     (results: google.maps.GeocoderResult[]) => {
  //       place=results[0].formatted_address;
  //       //console.log('results[0].formatted_address : '+results[0].formatted_address)
  //       //console.log('results[0].address_components.long_name : '+results[0].address_components[0].long_name)
  //       //console.log('results[0].address_components.short_name : '+results[0].address_components[0].short_name)
  //       //console.log('results[0].address_components.types : '+results[0].address_components[0].types)
  //       //console.log('results[0].geometry : '+results[0].geometry.location)
  //       //console.log('results[0].postcode_localities : '+results[0].postcode_localities.values)
  //       //console.log('results[0].place_id : '+results[0].place_id)
  //       //console.log('results[0].types : '+results[0].types)
  //     }
  //   ).then(()=>{
  //     console.log('Place present dans pP(): '+place)
  //   })
  //   // console.log('Place present : '+placePresent)
  //   // return placePresent
  // }

  // placePresent(c:Camion, place:string){
  //   this.geocoding.geocode(new google.maps.LatLng(              
  //     c.latitude,
  //     c.longtitude
  //   ))
  //   .forEach(
  //     (results: google.maps.GeocoderResult[]) => {
  //       place=results[0].formatted_address;
  //       //console.log('results[0].formatted_address : '+results[0].formatted_address)
  //       //console.log('results[0].address_components.long_name : '+results[0].address_components[0].long_name)
  //       //console.log('results[0].address_components.short_name : '+results[0].address_components[0].short_name)
  //       //console.log('results[0].address_components.types : '+results[0].address_components[0].types)
  //       //console.log('results[0].geometry : '+results[0].geometry.location)
  //       //console.log('results[0].postcode_localities : '+results[0].postcode_localities.values)
  //       //console.log('results[0].place_id : '+results[0].place_id)
  //       //console.log('results[0].types : '+results[0].types)
  //     }
  //   )
  //   // console.log('Place present : '+placePresent)
  //   // return placePresent
  // }
  
  // adresse de point de repere
  latLngAddress:google.maps.LatLng =null;
  async addressChange(){
    this.latLngAddress=null
    await this.geocoding.codeAddress(this.rep.address).forEach(
      (results: google.maps.GeocoderResult[]) => {
        if(results[0].geometry.location.lat()>0){
          this.latLngAddress= new google.maps.LatLng(
            this.rep.originLat= results[0].geometry.location.lat(),
            this.rep.originLong= results[0].geometry.location.lng()                            
          )
        }
        else
          {
            alert("Ne pas pouvoir localiser de cette adresse.")
          }
    }).then(()=>{
      this.drawAddress();
    });
  }
  radiusChange(){
    this.drawAddress();
  }
  addressCircle = new google.maps.Circle(); 
  markerAdsress =new google.maps.Marker();
  drawAddress(){
    if(this.addressCircle){
      this.addressCircle.setMap(null)
    }
    if(this.markerAdsress){
      this.markerAdsress.setMap(null)
    }
    if(this.latLngAddress!=null){
      this.addressCircle = new google.maps.Circle({
        center: new google.maps.LatLng(this.latLngAddress.lat(), this.latLngAddress.lng()),
        radius: (this.rep.radius>0 ? this.rep.radius : 100), // en metre, 1 metre par defaut
        fillColor: '#FFFF00',
        editable: false,
        draggable: false,
      });
      this.addressCircle.setMap(this.map);
      this.markerAdsress = new google.maps.Marker({
        position: this.latLngAddress,
        map: this.map,
        icon: {
          //url:"http://maps.google.com/mapfiles/kml/shapes/truck.png",
          //path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          url:"http://maps.google.com/mapfiles/ms/icons/green-dot.png",
          scale:5,
          //rotation:camion.direction,
          fillOpacity: 1,
          fillColor: "#7FFF00", //"#FFFFFF"
          strokeWeight: 2,
          strokeColor: "#008088", //"#FFFFFF",//"red",
        },
        title: this.rep.nom,
        label: {text:this.rep.nom, color:"orange"},
      });
      //marker.setMap(this.map)
      this.map.setCenter(new google.maps.LatLng(this.latLngAddress.lat(), this.latLngAddress.lng()));
      this.map.setZoom(15) // Zoom actuel : 15  - Level 1->20 de petit a plus grand
    }
    
  }
  onDrawAddressPrecise(r:Repere){
    if(this.flightPath){
      this.flightPath.setMap(null)
    }
    if(this.originCircle){
      this.originCircle.setMap(null)
    }
    if(this.destCircle1){
      this.destCircle1.setMap(null)
    }
    if(this.addressCircle){
      this.addressCircle.setMap(null)
    }
    if(this.markerAdsress){
      this.markerAdsress.setMap(null)
    }
    //if(this.latLngAddress!=null){
      this.latLngAddress=new google.maps.LatLng(r.originLat, r.originLong)
      this.addressCircle = new google.maps.Circle({
        center: new google.maps.LatLng(r.originLat, r.originLong),
        radius: (r.radius>0 ? r.radius : 100), // en metre, 1 metre par defaut
        fillColor: '#FFFF00',
        editable: false,
        draggable: false,
      });
      this.addressCircle.setMap(this.map);
      this.markerAdsress = new google.maps.Marker({
        position: this.latLngAddress,
        map: this.map,
        icon: {
          //url:"http://maps.google.com/mapfiles/kml/shapes/truck.png",
          //path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          url:"http://maps.google.com/mapfiles/ms/icons/green-dot.png",
          scale:5,
          //rotation:camion.direction,
          fillOpacity: 1,
          fillColor: "#7FFF00", //"#FFFFFF"
          strokeWeight: 2,
          strokeColor: "#008088", //"#FFFFFF",//"red",
        },
        title: r.nom,
        label: {text:r.nom, color:"orange"},
      });
      //marker.setMap(this.map)
      this.map.setCenter(this.latLngAddress)// new google.maps.LatLng(this.latLngAddress.lat(), this.latLngAddress.lng()));
      this.map.setZoom(15) // Zoom actuel : 15  - Level 1->20 de petit a plus grand
    //}
    
  }
  onFocusAddress(){
    if(this.latLngAddress!=null){
      this.map.setCenter(new google.maps.LatLng(this.latLngAddress.lat(), this.latLngAddress.lng()));
      this.map.setZoom(15);
    }
  }
  onAjouterRepere(){
    this.rep.idTransporter=this.transporter.id;
    this.reperesService.saveReperes(this.rep).subscribe((data:Repere)=>{
      this.reps.push(data)
      this.rep=new Repere()
    }, err=>{console.log(err)})
    // let rep=this.rep
    // this.reps.push(rep)
    // this.rep=new Repere()
    if(this.addressCircle){
      this.addressCircle.setMap(null)
    }
    if(this.markerAdsress){
      this.markerAdsress.setMap(null)
    }
    this.geolocation.getCurrentPosition().subscribe(async (data:Position)=>{
      this.map.setCenter(new google.maps.LatLng(data.coords.latitude, data.coords.longitude));
    })
  }

  // latLngOrigin= new google.maps.LatLng(0,0);   //:any
  latLngOrigin:google.maps.LatLng =null;
  async originChange(){
    if(this.itiner.origin.length>4){ // address has at least 5 character
      this.latLngOrigin=null
    await this.geocoding.codeAddress(this.itiner.origin).forEach(
      (results: google.maps.GeocoderResult[]) => {
        if(results[0].geometry.location.lat()>0){
          this.latLngOrigin= new google.maps.LatLng(
            this.itiner.originLat= results[0].geometry.location.lat(),
            this.itiner.originLong= results[0].geometry.location.lng()                            
          )
          //this.drawOrigin();
          //if(this.latLngDestination!=null) this.drawDest()
        }
        else
          {
            // this.latLngOrigin=null;
            //this.latLngOrigin = new google.maps.LatLng(0,0);
            this.flightPath = new google.maps.Polyline(null)  //null;
            //this.drawOrigin()
            //this.drawflightPlan()
            //alert("Ne pas pouvoir localiser de cette endroit.")
          }
    }).then(()=>{
      this.drawOrigin();
      if(this.latLngDestination!=null) this.drawDest()
    });//*/
    // await this.drawOrigin();
    // if(this.latLngDestination!=null) await this.drawDest()
    }
    else {
      this.latLngOrigin=null
      //this.flightPath = new google.maps.Polyline(null)  //null; //alert("Ne pas pouvoir localiser de cette endroit.")
      if(this.flightPath){
        this.flightPath.setMap(null)
      }
      this.drawOrigin();
      //if(this.latLngDestination!=null) this.drawDest()
    }
    
  }
  
  // latLngDestination:any
  latLngDestination:google.maps.LatLng =null;
  async destinationChange(){
    if(this.itiner.destination.length>4){ // address has at least 5 character
      this.latLngDestination=null
    //if(this.latLngOrigin!=null)
      await this.geocoding.codeAddress(this.itiner.destination).forEach(
        (results: google.maps.GeocoderResult[]) => {
          if(results[0].geometry.location.lat()>0){
            this.latLngDestination= new google.maps.LatLng(
              this.itiner.destLat= results[0].geometry.location.lat(),
              this.itiner.destLong= results[0].geometry.location.lng()                            
            )
            //this.drawDest();
          }
          else
          {
            //this.latLngDestination= new google.maps.LatLng(0,0);
            this.flightPath = new google.maps.Polyline(null)  //null;this.flightPath=null;
            //this.drawDest();
            //alert("Ne pas pouvoir localiser cette endroit.")
          }
      }).then(()=>{
        this.drawDest();
      });//*/
    // else 
    //   alert("Ne pas pouvoir localiser d'Endroit Pick.")
    // await this.drawDest();
    }
    else {
      this.latLngDestination=null
      //this.flightPath = new google.maps.Polyline(null)  //null; this.flightPath=null; //alert("Ne pas pouvoir localiser de cette endroit.")
      if(this.flightPath){
        this.flightPath.setMap(null)
      }
      this.drawDest();
    }
    
  }
  onFocusOrigin(){
    if(this.latLngOrigin!=null){
      this.map.setCenter(new google.maps.LatLng(this.latLngOrigin.lat(), this.latLngOrigin.lng()));
      //alert('this.map.zoom: '+ this.map.getZoom())
      this.map.setZoom(9) // Zoom actuel : 15  - Level 1->20 de petit a plus grand
    }
  }

  onFocusDestination(){
    if(this.latLngDestination!=null){
      this.map.setCenter(new google.maps.LatLng(this.latLngDestination.lat(), this.latLngDestination.lng()));
      //alert('this.map.zoom: '+ this.map.getZoom())
      this.map.setZoom(9) // Zoom actuel : 15  - Level 1->20 de petit a plus grand
    }
  }
  

  originCircle = new google.maps.Circle(); 
  destCircle1 = new google.maps.Circle(); 
  flightPath = new google.maps.Polyline();
  flightPlanCoordinates:any;
  drawOrigin(){
    if(this.flightPath){
      this.flightPath.setMap(null)
    }
    if(this.originCircle){
      this.originCircle.setMap(null)
    }
    if(this.latLngOrigin!=null){
      this.originCircle = new google.maps.Circle({
        center: new google.maps.LatLng(this.latLngOrigin.lat(), this.latLngOrigin.lng()),
        radius: 10000, // par default 10 kms --------  this.mileEnKm(this.voyage.radiusOrigin)*1000,  // en metre
        fillColor: '#FFFF00',
        editable: false,
        draggable: false,
      });
      this.originCircle.setMap(this.map);
      this.map.setCenter(new google.maps.LatLng(this.latLngOrigin.lat(), this.latLngOrigin.lng()));

      if(this.latLngDestination!=null){
        this.flightPlanCoordinates = [
          {lat: this.latLngOrigin.lat(), lng: this.latLngOrigin.lng()},
          {lat: this.latLngDestination.lat(), lng: this.latLngDestination.lng()}
        ];
        this.flightPath = new google.maps.Polyline({
          path: this.flightPlanCoordinates,
          geodesic: true,
          strokeColor: 'Gray',
          strokeOpacity: 0.5,
          strokeWeight: 5,
          icons: [{
            icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW},
            offset: '100%'
          }]
        });
        this.flightPath.setMap(this.map);
      }

      this.map.setZoom(9) // Zoom actuel : 15  - Level 1->20 de petit a plus grand
      // this.originCircle.addListener('click', (event)=>{
      //   var contentString:string='Origin : '+ this.voyage.origin + '  -  Rayon : ' + this.voyage.radiusOrigin + ' miles.';
      //   // Replace the info window's content and position.
      //   this.infoWindow.setContent(contentString);
      //   this.infoWindow.setPosition(event.latLng);
      //   this.infoWindow.open(this.map);
      // })
    }
    
  }
  drawDest(){
    if(this.destCircle1){
      this.destCircle1.setMap(null)
    }
    if(this.flightPath){
      this.flightPath.setMap(null)
    }
    if(this.latLngDestination!=null){
      this.destCircle1 = new google.maps.Circle({
        center: new google.maps.LatLng(this.latLngDestination.lat(), this.latLngDestination.lng()),
        radius: 10000, // par default 10 kms --------this.mileEnKm(this.voyage.radiusDestination)*1000, // en metre
        fillColor: '#FF00FF',
        editable: false,
        draggable: false,
      })
      this.destCircle1.setMap(this.map);
      // this.destCircle1.addListener('click', (event)=>{
      //   var contentString:string='Destination : '+ this.voyage.destination + '  -  Rayon : ' + this.voyage.radiusDestination + ' miles.';
      //   // Replace the info window's content and position.
      //   this.infoWindow.setContent(contentString);
      //   this.infoWindow.setPosition(event.latLng);
      //   this.infoWindow.open(this.map);
      // })
      if(this.latLngOrigin!=null){
        this.flightPlanCoordinates = [
          {lat: this.latLngOrigin.lat(), lng: this.latLngOrigin.lng()},
          {lat: this.latLngDestination.lat(), lng: this.latLngDestination.lng()}
        ];
        this.flightPath = new google.maps.Polyline({
          path: this.flightPlanCoordinates,
          geodesic: true,
          strokeColor: 'Gray',
          strokeOpacity: 0.5,
          strokeWeight: 5,
          icons: [{
            icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW},
            offset: '100%'
          }]
        });
        this.flightPath.setMap(this.map);
      }
      
      this.map.setZoom(9) // Zoom actuel : 15  - Level 1->20 de petit a plus grand
    }
    
  }
  
  drawflightPlan(){
    if(this.flightPath){
      this.flightPath.setMap(null)
    }
    // this.destCircle1 = new google.maps.Circle({
    //   center: new google.maps.LatLng(this.latLngDestination.lat(), this.latLngDestination.lng()),
    //   radius: 10000, // par default 10 kms --------this.mileEnKm(this.voyage.radiusDestination)*1000, // en metre
    //   fillColor: '#FF00FF',
    //   editable: false,
    //   draggable: false,
    // })
    // this.destCircle1.setMap(this.map);
    // this.destCircle1.addListener('click', (event)=>{
    //   var contentString:string='Destination : '+ this.voyage.destination + '  -  Rayon : ' + this.voyage.radiusDestination + ' miles.';
    //   // Replace the info window's content and position.
    //   this.infoWindow.setContent(contentString);
    //   this.infoWindow.setPosition(event.latLng);
    //   this.infoWindow.open(this.map);
    // })
    var flightPlanCoordinates = [
      {lat: this.latLngOrigin.lat(), lng: this.latLngOrigin.lng()},
      {lat: this.latLngDestination.lat(), lng: this.latLngDestination.lng()}
    ];
    this.flightPath = new google.maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: 'Gray',
      strokeOpacity: 0.5,
      strokeWeight: 5,
      icons: [{
        icon: {path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW},
        offset: '100%'
      }]
    });
    this.flightPath.setMap(this.map);
  }
  onModifyRepere(r:Repere){
    this.rep=r;
    this.latLngAddress=new google.maps.LatLng(r.originLat, r.originLong)
    this.drawAddress();
  }
  onModify(it:Itineraire){
    //this.itiner=it;
    this.latLngOrigin=new google.maps.LatLng(it.originLat, it.originLong)
    this.latLngDestination=new google.maps.LatLng(it.destLat, it.destLong)
    this.drawOrigin();
    this.drawDest();
  }
  onSelectCamion(c:Camion){
    this.itiner.idCamion=c.id
    this.itiner.camionAttribue=(c.unite + ' - ' + c.marque +'  ' +c.modele);
    this.infoWindow.close();
    this.map.setCenter(new google.maps.LatLng(c.latitude, c.longtitude));
    this.infoWindow = new google.maps.InfoWindow;
    //let placePresent :string;
    //this.placePresent(c, placePresent)
    // this.geocoding.geocode(new google.maps.LatLng(              
    //   c.latitude,
    //   c.longtitude
    // ))
    // .forEach(
    //   (results: google.maps.GeocoderResult[]) => {
    //     placePresent=results[0].formatted_address;
    //   }
    // ).then(()=>{
      //console.log('Place present dans pP(): '+placePresent)
      let contentString:string= (c.foreignName.length>0 ? c.foreignName : (c.unite+c.type+c.modele));
      //let contentString:string= ('Unite '+c.unite+' - '+'A: '+ (c.localName.length>0 ? c.localName : c.location));//'unite : '+ camion.unite + '  -  Vitesse : ' + camion.speed;
      this.infoWindow.setContent(contentString);
      this.infoWindow.setPosition(new google.maps.LatLng(c.latitude, c.longtitude));
      this.infoWindow.open(this.map);//*/
    //})
    // this.pP(c, placePresent).then(()=>{
    //   let contentString:string= ('Unite '+c.unite+' - '+'PositionActuelle: '+ placePresent);//'unite : '+ camion.unite + '  -  Vitesse : ' + camion.speed;
    //   this.infoWindow.setContent(contentString);
    //   this.infoWindow.setPosition(new google.maps.LatLng(c.latitude, c.longtitude));
    //   this.infoWindow.open(this.map);//*/      
    // })
    
    // let contentString:string= ('Unite '+c.unite+' - '+'PositionActuelle: '+ placePresent);//'unite : '+ camion.unite + '  -  Vitesse : ' + camion.speed;
    // this.infoWindow.setContent(contentString);
    // this.infoWindow.setPosition(new google.maps.LatLng(c.latitude, c.longtitude));
    // this.infoWindow.open(this.map);//*/      
  }

  
  cIsLList: Array<CamionItinersList>=new Array<CamionItinersList>();
  makeCIsLList(){
    this.cIsLList=new Array<CamionItinersList>();
    let cIsL : CamionItinersList;
    this.camionsSurMap.forEach(c=>{
      cIsL= new CamionItinersList();
      cIsL.camionId=c.id
      cIsL.itiners= this.camionItiners(c.id)
      this.cIsLList.push(cIsL)
    })
    // let test :CamionItinersList;
    // test = this.cIsLList.find(res=>res.camionId==108)
    // console.log("this.cIsLList.length: "+ ' - ' +this.cIsLList.length + ' - '+ test.camionId.toString())
  }
  camionItiners(id:number){
    let cIs:Array<Itineraire>=[]
    if(this.itiners.length>0){
      //alert("Hi from camionItiners(): " + id)
      this.itiners.forEach(it=>{
       if(it.idCamion==id) cIs.push(it)
      })
      //alert("Hi from camionItiners() - nombre itiners: " + cIs.length)
      //return cIs
    }
    return cIs
  }
  getLocalisation(){
    this.camionsService.camionsDeTransporter(this.transporter.id).subscribe((data:Array<Camion>)=>{
      let camionsSurMap:Array<Camion>=new Array<Camion>();
      data.forEach(camion=>{
        if(camion.status && (camion.uniteMonitor!=null && camion.monitor!=null) && (camion.uniteMonitor.length!=0 && camion.monitor.length!=0) && 
        (!camion.uniteMonitor.includes('no-gps'))) // !camion.uniteMonitor.includes('no-gps') - means : there isn't GPS
          camionsSurMap.push(camion)
      })
      this.camionsSurMap=camionsSurMap;
      //* demarsk the list of trucks
      this.markers.forEach(marker=>{
        marker.setMap(null);
        marker=null;
      })
      this.markers = [];
      //*/
      this.camionsSurMap.forEach(camion=>{
        if(camion.localName.length==0) this.belongingRepere(camion); //set repere si exist into localname
        //console.log("camion.id : "+ camion.id)
        if(camion.uniteMonitor!=null && camion.monitor!=null){
          let location1 = new google.maps.LatLng(camion.latitude, camion.longtitude);          
          let marker = new google.maps.Marker({
            position: location1,
            map: this.map,
            icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              //url:"http://maps.google.com/mapfiles/kml/shapes/truck.png",
              //url:"http://maps.google.com/mapfiles/ms/icons/green-dot.png",
              // green-dot.png yellow-dot.png blue-dot.png
              scale:5,
              rotation:camion.direction,
              fillOpacity: 1,
              fillColor: "#7FFF00", //"#FFFFFF"
              strokeWeight: 2,
              strokeColor: "#008000", //"#FFFFFF""red",
            },
            label: {text:(camion.foreignName.length>0 ? camion.foreignName : (camion.unite+camion.type+camion.modele)), color:"orange",},
            title: (camion.foreignName.length>0 ? camion.foreignName : (camion.unite+camion.type+camion.modele)), //camion.unite,
          });
          this.infoWindow = new google.maps.InfoWindow;
          marker.addListener('click', (event)=>{
            //var contentString:string='Montreal, Quebec - Alma, Quebec. Disponible : 25"';//'unite : '+ camion.unite + '  -  Vitesse : ' + camion.speed;
            //var contentString:string='<div><p> '+ 'Unite '+camion.unite+" <br>" +
            var contentString:string='<div><p> '+ (camion.foreignName.length>0 ? camion.foreignName : (camion.unite+camion.type+camion.modele))+" <br>" +
                  '<table border="1">' +
                  '<tr>'+
                    '<td>Itineraire</td>'+
                    '<td>PickDate</td>'+ 
                    "<td>DropDate</td>"+
                    '<td>Occup</td>'+
                    '<td>Dispo </td>'+
                  '</tr>'+
                  this.prepareText(camion)+
                  '</table>'+'<br>'
                  ' </p></div>'
            // if(camion.stopDuration>0)
            //   contentString='unite : '+ camion.unite + '  -  Arrete depuis : ' + this.showStopDuration(camion.stopDuration)//camion.stopDuration +' minutes.';
            // Replace the info window's content and position.
            this.infoWindow.setContent(contentString);
            this.infoWindow.setPosition(event.latLng);
            this.infoWindow.open(this.map);//*/
          })
          /*marker.setIcon({
            url:"http://maps.google.com/mapfiles/kml/shapes/truck.png",
            scale:0.1,
            rotation:camion.direction,
            fillColor:'red',
          })//*/
          this.markers.push(marker);
        }  
      })
    }, err=>{
      console.log();
    })
  }
  
  //this is to check whe we need compare between 2 functions calculate the distance
  calculateDistanceWithGoogle(point1:google.maps.LatLng, point2:google.maps.LatLng) { // must pass by Google Maps
    return Math.round(google.maps.geometry.spherical.computeDistanceBetween(point1, point2));
    // this.distance = Math.round(google.maps.geometry.spherical.computeDistanceBetween(point1, point2)/1000/1.609344) ;
    // this.distanceKm = Math.round(this.distance*1.609344)
  }

  calculateDistance( lat1, lng1, lat2, lng2) { // don't need pass by Google Map
    let dLat = this.toRadians(lat2 - lat1);
    let dLon = this.toRadians(lng2 - lng1);
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos(this.toRadians(lat1))
            * Math.cos(this.toRadians(lat2)) * Math.sin(dLon / 2)
            * Math.sin(dLon / 2);
    let c = 2 * Math.asin(Math.sqrt(a));
    let distanceInMeters = Math.round(6371000 * c);
    //console.log('distanceInMeters: '+distanceInMeters)
    return distanceInMeters;
  }
  toRadians (angle) {
    return angle * (Math.PI / 180);
  }
  
  // return name repere if has
  belongingRepere(c:Camion){
    this.reps.forEach(r=>{
      if(r.radius>=this.calculateDistance(c.latitude, c.longtitude, r.originLat, r.originLong))
        {
          //console.log(c.unite +" -appartient- "+ r.nom)
          c.localName=r.nom
          //return r.nom;
        }
    })
    //return c.location;
  }
  print(cmpId){
    let envoy = document.getElementById('toprint').innerHTML;
    //console.log('Toprint : ' + document.getElementById('toprint').innerHTML + ' endOfToprint')
    //console.log(envoy)
    const printContent = document.getElementById(cmpId);
     //console.log('printContent.innerHTML : '+printContent.innerHTML+' *** end.')
    //const WindowPrt = window.open('','','left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    const WindowPrt = window.open();
    WindowPrt.document.write('<link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">');
    WindowPrt.document.write(printContent.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }

}

export class CamionItinersList{
  camionId:number
  itiners:Array<Itineraire>
}