import { Component, OnInit } from '@angular/core';
import { PageDemande } from 'src/model/model.pageDemande';
import { DemandesService } from 'src/services/demandes.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Demande } from 'src/model/model.demande';
import { VoyagesService } from 'src/services/voyages.service';
import { Voyage } from 'src/model/model.voyage';
import { Message } from 'src/model/model.message';
import { MessagesService } from 'src/services/messages.service';
import { async } from 'q';

@Component({
  selector: 'app-list-demande',
  templateUrl: './list-demande.component.html',
  styleUrls: ['./list-demande.component.css']
})
export class ListDemandeComponent implements OnInit {
  
  pageDemande:PageDemande = new  PageDemande();  // pour tenir des Demandes
  motCle:string="";
  currentPage:number=0;
  size:number=100;
  pages:Array<number>;  // pour tenir des numeros des pages
  demandes:Array<Demande>=[];
  demandesBlue:Array<Demande>=[];
  role:string="";
  flag:string="";
  voyage:Voyage = null; //=new Voyage();
  modeMatching=0;
  today=new Date();

  constructor(activatedRoute:ActivatedRoute, public voyagesService : VoyagesService, 
    public messagesService : MessagesService, public demandesService:DemandesService, public router:Router) { 
    
  }

  ngOnInit() {
    console.log('localStorage.getItem("idVoyage") : ' +  localStorage.getItem("idVoyage"));
    if(localStorage.getItem('idVoyage')!=null)
      this.voyagesService.getDetailVoyage(Number(localStorage.getItem('idVoyage').toString())).subscribe((data:Voyage)=>{
        this.voyage=data;
        console.log(this.voyage.id)
        console.log(this.voyage.originLat)
        console.log(this.voyage.originLong)
        console.log(this.voyage.origin)
        console.log(this.voyage.destination)
        this.modeMatching=2;
        this.doSearch();
        // this.demandes.forEach(d=>{this.setDistanceTravel(d)})
        // this.demandesBlue.forEach(d=>{this.setDistanceTravel(d)})
        this.modeMatching=1;
      }, err=>{
        console.log(err)
      })
    else 
      this.doSearch()
    //console.log("this.flag : "+this.flag)

  }
  doSearch(){
    /*if(this.flag.includes('transporter')){
      this.demandesService.demandesDeTransporter(Number(localStorage.getItem("userId")))
      .subscribe((data:Array<Demande>)=>{
        this.demandes=data
      }, err=>{
        console.log(err)
      })
    }
    else if(this.flag.includes('shipper')){
      this.demandesService.demandesDeShipper(Number(localStorage.getItem("userId")))
      .subscribe((data:Array<Demande>)=>{
        this.demandes=data
      }, err=>{
        console.log(err)
      })      
    }//*/
    //else{

      if(this.voyage!=null){ 
        //this.modeMatching=2  
        this.demandesService.getAllDemandes()
        .subscribe((data:Array<Demande>)=>{
          let matchDemandes:Array<Demande>=[]
          let matchDemandesBlue:Array<Demande>=[]
          //this.voyages=data
          //this.modeMatching=2  
          // we filter voyages here
          data.forEach(demande=>{            
            if(this.voyage.idsDemandeMatchings.includes(demande.id.toString())
              && !this.voyage.idsDemandePasBesoins.split(',').includes(demande.id.toString()))
            {
              this.setDistanceTravel(demande, matchDemandes)
              //matchDemandes.push(demande)
            }
            if(this.voyage.idsDemandeMatchings.includes(demande.id.toString())
              && this.voyage.idsDemandePasBesoins.includes(demande.id.toString()))
            {
              this.setDistanceTravel(demande, matchDemandesBlue)
              //matchDemandesBlue.push(demande)
            }
          })
          this.demandes=matchDemandes;
          this.demandesBlue=matchDemandesBlue;
          
          

          //this.demandes.forEach(d=>{this.setDistanceTravel(d)})
          //this.demandesBlue.forEach(d=>{this.setDistanceTravel(d)})
          //this.modeMatching=1
          //await this.demandes.forEach(d=>{this.setDistanceTravel(d)})
          //await this.demandesBlue.forEach(d=>{this.setDistanceTravel(d)})
          //alert('Wait for 2 secondes, we calculate th distances !!!')
        }, err=>{
          console.log(err);
        })
        //console.log('Before this.modeMatching set to 1')
        //this.modeMatching=1
        //console.log('After set this.demandes - this.modeMatching= '+this.modeMatching)
      }
      else
        this.demandesService.getDemandes(this.motCle, this.currentPage, this.size).subscribe((data:PageDemande)=>{
          this.pageDemande=data;
          this.pages=new Array(data.totalPages);
          // filter to take d demandes blue
          let matchDemandes:Array<Demande>=[]
          let matchDemandesBlue:Array<Demande>=[]
          this.pageDemande.content.forEach(demande=>{
            if(!demande.idsUsersPasBesoins.split(',').includes(localStorage.getItem('userId')))
            {
              matchDemandes.push(demande)
            }
            else
            {
              matchDemandesBlue.push(demande)
            }
          })
          this.pageDemande.content=matchDemandes;
          this.demandesBlue=matchDemandesBlue;
          //
        }, err=>{
          console.log(err);
        })
    //}
  }
  chercher(){
    this.modeMatching=0;
    this.voyage=null;
    this.doSearch();
    localStorage.removeItem('idVoyage')
  }
  refreshDistance(){
    this.router.navigateByUrl("/list-demande"); // call one more time to refresh
  }
  gotoPage(i:number){
    this.currentPage=i;
    this.doSearch();
  }

  dFOSort(){    // sort by DFO
    this.demandes.sort((a, b)=>{
      if(a.dfo>b.dfo)
        return 1;
      if(a.dfo<b.dfo)
        return -1
      return 0;
    })
    this.demandesBlue.sort((a, b)=>{
      if(a.dfo>b.dfo)
        return 1;
      if(a.dfo<b.dfo)
        return -1
      return 0;
    })
  }
  dFDSort(){  // sort by DFD
    this.demandes.sort((a, b)=>{
      if(a.dfd>b.dfd)
        return 1;
      if(a.dfd<b.dfd)
        return -1
      return 0;
    })
    this.demandesBlue.sort((a, b)=>{
      if(a.dfd>b.dfd)
        return 1;
      if(a.dfd<b.dfd)
        return -1
      return 0;
    })
  }
  lDSort(){   // sort by LD
    this.demandes.sort((a, b)=>{
      if(a.ld>b.ld)
        return 1;
      if(a.ld<b.ld)
        return -1
      return 0;
    })
    this.demandesBlue.sort((a, b)=>{
      if(a.ld>b.ld)
        return 1;
      if(a.ld<b.ld)
        return -1
      return 0;
    })
  }
  clientSort(){   // sort by name client
    this.pageDemande.content.sort((a, b)=>{
      return a.nomDemander.localeCompare(b.nomDemander)
    })
    this.demandes.sort((a, b)=>{
      return a.nomDemander.localeCompare(b.nomDemander)
    })
    this.demandesBlue.sort((a, b)=>{
      return a.nomDemander.localeCompare(b.nomDemander)
    })
  }
  originSort(){   // sort by origin
    this.pageDemande.content.sort((a, b)=>{
      return a.origin.localeCompare(b.origin)
    })
    this.demandes.sort((a, b)=>{
      return a.origin.localeCompare(b.origin)
    })
    this.demandesBlue.sort((a, b)=>{
      return a.origin.localeCompare(b.origin)
    })
  }
  destSort(){   // sort by destination
    this.pageDemande.content.sort((a, b)=>{
      return a.destination.localeCompare(b.destination)
    })
    this.demandes.sort((a, b)=>{
      return a.destination.localeCompare(b.destination)
    })
    this.demandesBlue.sort((a, b)=>{
      return a.destination.localeCompare(b.destination)
    })
  }
  gotoDetailDemande(d:Demande){
    this.router.navigate(['detail-demande',d.id]);
  }

  deleteDemande(id:number){
    this.demandesService.deleteDemande(id);
    this.doSearch();
  }

  
  disableContactDemande(d:Demande):boolean{
    let disableContact:boolean=false;  // by default, contact is actif
    if((d.idsVoyageContactes+',').includes(','+localStorage.getItem("userId")+','))
      disableContact=true;
    return disableContact;
  }
  contactDemande(d:Demande){
    let message= new Message()
    d.idsVoyageContactes=d.idsVoyageContactes+","+localStorage.getItem('userId')
    message.idSender=Number(localStorage.getItem('userId'));
    message.roleSender=localStorage.getItem('role');
    message.idReceiver=d.idDemander;
    message.roleReceiver="SHIPPER";
    message.idDemande=d.id;
    //message.idVoyage=
    /*
    message.message=localStorage.getItem('nom') +" - tel:  "+localStorage.getItem('tel')
    +" - email:  " + localStorage.getItem('email')
    +" -  On peut charger votre demande de  "+ d.origin +"  a  " + d.destination;
    //*/
    //*
    let temp1Tel:string= '<strong><a href="tel:'
    let temp1Mail:string='<strong><a href="mailto:'
    let temp2:string='">'
    let temp3:string='</a></strong>'
    //* contruire button
    let bTemp01:string = '<div><button routerLink="/detail-demande/'+d.id
    let bTemp02:string = '" class="btn btn-link">'+ " -  On peut charger votre Load de  "+ d.origin +"  a  " + d.destination
    let bTemp03:string = '</button></div>'
    //let button=bTemp01+bTemp02+bTemp03
    //*/
    
    message.message=localStorage.getItem('nom') +" - Tel:  "
    + temp1Tel+localStorage.getItem('tel')+temp2+localStorage.getItem('tel')+temp3
    + " - Email:  " 
    + temp1Mail+localStorage.getItem('email')+temp2+localStorage.getItem('email')+temp3
    //+ " -  On peut charger votre demande de  "+ d.origin +"  a  " + d.destination;
    +bTemp01+bTemp02+bTemp03;
    //*/

    this.messagesService.saveMessages(message).subscribe(data=>{
      this.demandesService.updateDemande(d.id, d).subscribe(data=>{},err=>{console.log(err)})
    }, err=>{console.log(err)})
    alert("Votre demande a ete envoye!")
  }
  removeDemande(demande:Demande){
    if(this.voyage!=null){
      //*
      this.voyage.idsDemandePasBesoins=this.voyage.idsDemandePasBesoins+','+demande.id;
      this.voyagesService.saveVoyages(this.voyage).subscribe((data:Voyage)=>{
        //this.voyage=data; // we don't do it
      }, err=>{
        console.log(err);
      })//*/
      this.demandesBlue.push(demande)// to keep the demande blue
      this.demandes.splice(this.demandes.indexOf(demande), 1)
    }
    if(this.pageDemande.totalPages!=null && this.pageDemande.totalPages>0){
      //*
      demande.idsUsersPasBesoins = demande.idsUsersPasBesoins+","+localStorage.getItem("userId");
      this.demandesService.saveDemandes(demande).subscribe(data=>{}, err=>{ console.log(err)})
      //*/
      this.demandesBlue.push(demande)
      this.pageDemande.content.splice(this.pageDemande.content.indexOf(demande),1); // remove this demande from the list
    }
  }
  unRemoveDemande(demande:Demande){
    if(this.voyage!=null){
      //*
      this.voyage.idsDemandePasBesoins=this.voyage.idsDemandePasBesoins+',';
      this.voyage.idsDemandePasBesoins=this.voyage.idsDemandePasBesoins.replace(','+demande.id.toString()+',', ',') //+','+demande.id;
      this.voyage.idsDemandePasBesoins=this.voyage.idsDemandePasBesoins.replace(',,', ',');
      this.voyagesService.saveVoyages(this.voyage).subscribe((data:Voyage)=>{
        //this.voyage=data; // we don't do it
      }, err=>{
        console.log(err);
      })//*/
      this.demandes.push(demande)// to keep the demande
      this.demandesBlue.splice(this.demandesBlue.indexOf(demande), 1)
    }
    if(this.pageDemande.totalPages!=null && this.pageDemande.totalPages>0){
      //*
      demande.idsUsersPasBesoins = demande.idsUsersPasBesoins+",";
      demande.idsUsersPasBesoins = demande.idsUsersPasBesoins.replace(","+localStorage.getItem("userId")+",", ',');
      demande.idsUsersPasBesoins = demande.idsUsersPasBesoins.replace(',,', ',');
      this.demandesService.saveDemandes(demande).subscribe(data=>{}, err=>{ console.log(err)})
      //*/
      this.pageDemande.content.push(demande)
      this.demandesBlue.splice(this.demandesBlue.indexOf(demande),1); // remove this demande from the list
    }
  }
  calculateDistance(lat1:number, long1:number, lat2:number, long2:number) { // en miles
    let point1 = new google.maps.LatLng(lat1, long1)
    let point2 = new google.maps.LatLng(lat2, long2)
    return Math.round(google.maps.geometry.spherical.computeDistanceBetween(point1, point2)/1000/1.609344) ;
  }

  //* Calculate and set distance travel in miles
  setDistanceTravel(d: Demande, demandes:Array<Demande>) {
    //*
    //this.modeMatching=2
    let service = new google.maps.DistanceMatrixService;// = new google.maps.DistanceMatrixService()
    // get back distances - ld - dfo - dfd
    if(localStorage.getItem(d.id+'-ld-'+this.voyage.id)!=null
        && localStorage.getItem(d.id+'-dfo-'+this.voyage.id)!=null
        && localStorage.getItem(d.id+'-dfd-'+this.voyage.id)!=null
      )
    {
      d.ld=Number(localStorage.getItem(d.id+'-ld-'+this.voyage.id))
      d.dfo=Number(localStorage.getItem(d.id+'-dfo-'+this.voyage.id))
      d.dfd=Number(localStorage.getItem(d.id+'-dfd-'+this.voyage.id))
    }
    else{
      // calculate load distance - ld
      service.getDistanceMatrix({
        'origins': [d.origin], 'destinations': [d.destination], travelMode:google.maps.TravelMode.DRIVING
      }, (results: any) => {    
        d.ld= Math.round((results.rows[0].elements[0].distance.value)/1000/1.609344)  
        localStorage.setItem(d.id+'-ld-'+this.voyage.id, Math.round((results.rows[0].elements[0].distance.value)/1000/1.609344).toString())
        //console.log( 'ld (miles -) -- ' + d.ld)
        //return;
      });
      
      // calculate distance from origin - dfo
      service.getDistanceMatrix({
        'origins': [d.origin], 'destinations': [this.voyage.origin], travelMode:google.maps.TravelMode.DRIVING
      }, (results: any) => {    
        d.dfo= Math.round((results.rows[0].elements[0].distance.value)/1000/1.609344)  
        localStorage.setItem(d.id+'-dfo-'+this.voyage.id, Math.round((results.rows[0].elements[0].distance.value)/1000/1.609344).toString())
        //console.log( 'dfo (miles -) -- ' + d.dfo)
        //return;
      });
      // calculate distance from destination - dfd
      service.getDistanceMatrix({
        'origins': [d.destination], 'destinations': [this.voyage.destination], travelMode:google.maps.TravelMode.DRIVING
      }, (results: any) => {    
        d.dfd= Math.round((results.rows[0].elements[0].distance.value)/1000/1.609344)  
        localStorage.setItem(d.id+'-dfd-'+this.voyage.id, Math.round((results.rows[0].elements[0].distance.value)/1000/1.609344).toString())
        //console.log( 'dfd (miles -) -- ' + d.dfd)
        //return;
      });
    }
    demandes.push(d);
  }
  /*
  cherDistanceTravel() :number {
    let distance= this.getDistanceTravel('Montreal', 'Toronto')
    console.log( 'resultat distance (miles -) -- ' + distance)
    return distance;
  }
  //*/
  
  /* test travel distance
  
  initMap() {
    var bounds = new google.maps.LatLngBounds;
    var markersArray = [];

    var origin1 = {lat: 55.93, lng: -3.118};
    var origin2 = 'Greenwich, England';
    var destinationA = 'Stockholm, Sweden';
    var destinationB = {lat: 50.087, lng: 14.421};

    var destinationIcon = 'https://chart.googleapis.com/chart?' +
        'chst=d_map_pin_letter&chld=D|FF0000|000000';
    var originIcon = 'https://chart.googleapis.com/chart?' +
        'chst=d_map_pin_letter&chld=O|FFFF00|000000';
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 55.53, lng: 9.4},
      zoom: 10
    });
    var geocoder = new google.maps.Geocoder;

    var service = new google.maps.DistanceMatrixService;
    service.getDistanceMatrix({
      origins: [origin1, origin2],
      destinations: [destinationA, destinationB],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, function(response, status) {
      if (status !== 'OK') {
        alert('Error was: ' + status);
      } else {
        var originList = response.originAddresses;
        var destinationList = response.destinationAddresses;
        var outputDiv = document.getElementById('output');
        outputDiv.innerHTML = '';
        deleteMarkers(markersArray);

        var showGeocodedAddressOnMap = function(asDestination) {
          var icon = asDestination ? destinationIcon : originIcon;
          return function(results, status) {
            if (status === 'OK') {
              map.fitBounds(bounds.extend(results[0].geometry.location));
              markersArray.push(new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                icon: icon
              }));
            } else {
              alert('Geocode was not successful due to: ' + status);
            }
          };
        };

        for (var i = 0; i < originList.length; i++) {
          var results = response.rows[i].elements;
          geocoder.geocode({'address': originList[i]},
              showGeocodedAddressOnMap(false));
          for (var j = 0; j < results.length; j++) {
            geocoder.geocode({'address': destinationList[j]},
                showGeocodedAddressOnMap(true));
            outputDiv.innerHTML += originList[i] + ' to ' + destinationList[j] +
                ': ' + results[j].distance.text + ' in ' +
                results[j].duration.text + '<br>';
          }
        }
      }
    });
  }
  //* */
}
