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


@Component({
  selector: 'app-camions-list',
  templateUrl: './camions-list.component.html',
  styleUrls: ['./camions-list.component.css']
})
export class CamionsListComponent implements OnInit {

  itineraire:boolean=false;
  camionsList:boolean=true

  itiner:Itineraire=new Itineraire();
  itiners:Array<Itineraire>=[];

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

  constructor(public activatedRoute:ActivatedRoute, public transportersService:TransportersService, public contactsService:ContactsService,
    public adressesService:AdressesService, public camionsService:CamionsService,  public fichePhysiquesService:FichePhysiquesService,
    public fichePhysiqueContsService:FichePhysiqueContsService, public autreEntretiensService:AutreEntretiensService, private router:Router,
    public chauffeursService:ChauffeursService, private sanitizer:DomSanitizer){    
    //this.id=activatedRoute.snapshot.params['id'];
    //this.avltrackLinkTrust=sanitizer.bypassSecurityTrustResourceUrl(this.avltrackLink)
  }

  ngOnInit() {
    this.camionsSurMap=[];
    this.transportersService.getDetailTransporter(Number(localStorage.getItem('idTransporter'))).subscribe((data:Transporter)=>{
      this.transporter=data;
      //
      // this.camionsService.camionsDeTransporter(this.transporter.id).subscribe((data:Array<Camion>)=>{
      //   data.forEach(camion=>{
      //     if(camion.status && (camion.uniteMonitor!=null && camion.monitor!=null) && (camion.uniteMonitor.length!=0 && 
      //       camion.monitor.length!=0) && (!camion.uniteMonitor.includes('no-gps'))) // !camion.uniteMonitor.includes('no-gps') - means : there isn't GPS
      //       this.camionsSurMap.push(camion)
      //   })
      //
      alert("Attendre 2 secondes, on loade la carte, SVP!")
      this.onPress(); // show carte right now
      // this.camionsService.camionsDeTransporter(this.transporter.id).subscribe(async (data:Array<Camion>)=>{
      //   data.sort((a,b)=>{
      //     if(a.id>b.id)
      //       return 1;
      //     if(a.id<b.id)
      //       return -1;
      //     return 0;
      //   });
      //   // data.forEach(camion=>{
      //   //   if(camion.status && (camion.uniteMonitor!=null && camion.monitor!=null) && (camion.uniteMonitor.length!=0 && 
      //   //     camion.monitor.length!=0) && (!camion.uniteMonitor.includes('no-gps'))) // !camion.uniteMonitor.includes('no-gps') - means : there isn't GPS
      //   //     this.camionsSurMap.push(camion)
      //   // })
      //   this.camions= data
      //   this.camionsInOperation = await this.camions.filter(camion=>camion.status==true) //this.filterCamionInOperation()
      //   this.camionsOutOperation = await this.camions.filter(camion=>camion.status==false) //this.filterCamionOutOperation()
      //   alert("Attendre 2 secondes, on loade la carte, SVP!")
      //   this.onPress(); // show carte right now
      // }, err=>{
      //   console.log();
      // });
    }, err=>{
      console.log(err);
    });
  }

  myWindow: any;

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
              this.camionsSurMap.push(camion)
          })
          let mapProp = {
            center: new google.maps.LatLng(45.568806, -73.918333),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };
          this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
          this.camionsSurMap.forEach(camion=>{
            //console.log("camion.id : "+ camion.id)
            if(camion.uniteMonitor!=null && camion.monitor!=null){
              //this.marker.setMap(null);
              let location1 = new google.maps.LatLng(camion.latitude, camion.longtitude);          
              let marker = new google.maps.Marker({
                position: location1,
                map: this.map,
                icon: {
                  //url:"http://maps.google.com/mapfiles/kml/shapes/truck.png",
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  scale:4,
                  rotation:camion.direction,
                  fillOpacity: 1,
                  fillColor: "#FFFFFF",
                  strokeWeight: 2,
                  strokeColor: "red",
                },
                title: camion.unite
              });
              this.infoWindow = new google.maps.InfoWindow;
              marker.addListener('click', (event)=>{
                //var contentString:string='unite : '+ camion.unite + '  -  Vitesse : ' + camion.speed;
                var contentString:string='Montreal, Quebec - Alma, Quebec. Disponible : 25"';//'unite : '+ camion.unite + '  -  Vitesse : ' + camion.speed;
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
        }, err=>{
          console.log();
        })
      })      
    }
    //this.router.navigate(["/map-flotte", this.id]);
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
  prepareText(obj){
    let textHtnl = ''
    //obj=this.camionsSurMap;
    //obj.for
    obj.forEach(camion=>{
      textHtnl=textHtnl+'<tr *ngFor="let c of camionsSurMap">'+
      '<td>Montreal, Quebec - Alma, Quebec</td> <td>17-06-2020</td> <td>18-06-2020</td> '+
      '<td>50"</td> <td style="color: black; background-color:greenyellow;">25"</td>'+
      '</tr>'
    })
    return textHtnl;
  }
  onChange(){
    this.map.setCenter(new google.maps.LatLng(this.camionMap.latitude, this.camionMap.longtitude));
    var c= this.camionMap;
    this.infoWindow.close();
    this.map.setCenter(new google.maps.LatLng(c.latitude, c.longtitude));
    this.infoWindow = new google.maps.InfoWindow;
    var contentString:string='<div><p> '+ 'Unite '+c.unite+" <br>" +
    // ' - '+'Montreal, Quebec - Alma, Quebec. Occupe : 25"' + " <br>" +
    // ' - '+'Montreal, Quebec - Alma, Quebec. Occupe : 50"' + " <br>" +
    '<table border="1">' +
    //'<tr *ngFor="let c of camionsSurMap">'+
    // '<td>Montreal, Quebec - Alma, Quebec</td> <td>17-06-2020</td> <td>18-06-2020</td> '+
    // '<td>50"</td> <td style="color: black; background-color:greenyellow;">25"</td>'+
    // '</tr>'+
    this.prepareText(this.camionsSurMap)
    '</table>'+'<br>'
    ' </p></div>'
    this.infoWindow.setContent(contentString);
    this.infoWindow.setPosition(new google.maps.LatLng(c.latitude, c.longtitude));
    this.infoWindow.open(this.map);//*/      
  }
  onAjouter(){
    console.log('this.itiner.camionAttribue: '+this.itiner.camionAttribue)
    let it=this.itiner
    this.itiners.push(it)
    this.itiner=new Itineraire()
    console.log('it.camionAttribue: '+it.camionAttribue)
  }
  onClickCamion(c:Camion){
    this.infoWindow.close();
    this.map.setCenter(new google.maps.LatLng(c.latitude, c.longtitude));
    this.infoWindow = new google.maps.InfoWindow;
    var contentString:string='Unite '+c.unite+' - '+'Montreal, Quebec - Alma, Quebec. Disponible : 25"';//'unite : '+ camion.unite + '  -  Vitesse : ' + camion.speed;
    this.infoWindow.setContent(contentString);
    this.infoWindow.setPosition(new google.maps.LatLng(c.latitude, c.longtitude));
    this.infoWindow.open(this.map);//*/      
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
        //console.log("camion.id : "+ camion.id)
        if(camion.uniteMonitor!=null && camion.monitor!=null){
          let location1 = new google.maps.LatLng(camion.latitude, camion.longtitude);          
          let marker = new google.maps.Marker({
            position: location1,
            map: this.map,
            icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              //url:"http://maps.google.com/mapfiles/kml/shapes/truck.png",
              scale:4,
              rotation:camion.direction,
              fillOpacity: 1,
              fillColor: "#FFFFFF",
              strokeWeight: 2,
              strokeColor: "red",
            },
            title: camion.unite
          });
          this.infoWindow = new google.maps.InfoWindow;
          marker.addListener('click', (event)=>{
            var contentString:string='Montreal, Quebec - Alma, Quebec. Disponible : 25"';//'unite : '+ camion.unite + '  -  Vitesse : ' + camion.speed;
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
