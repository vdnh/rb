import { Component, OnInit } from '@angular/core';
import { Demande } from 'src/model/model.demande';
import { DemandesService } from 'src/services/demandes.service';
import { GeocodingService } from 'src/services/geocoding.service';

@Component({
  selector: 'app-calcule-prix',
  templateUrl: './calcule-prix.component.html',
  styleUrls: ['./calcule-prix.component.css']
})
export class CalculePrixComponent implements OnInit {

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

  demande:Demande=new Demande();

  constructor(public demandesService : DemandesService, public geocoding : GeocodingService) { }

  ngOnInit() {
    this.demande.roleDemander = localStorage.getItem("role");
    this.demande.idDemander = Number(localStorage.getItem("userId"));
    this.demande.nomDemander = localStorage.getItem("nom");
    //console.log('this.demande.roleDemander : '+this.demande.roleDemander)
    //console.log('this.demande.idDemander : '+this.demande.idDemander)
  }

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
    this.distance2Ads(this.demande.origin, this.demande.destination)
    this.totalPoints = this.longeurPointage(this.longeur, this.mode) + this.largeurPointage(this.largeur, this.mode) + this.hauteurPointage(this.hauteur, this.mode) 
      + this.poidsPointage(this.poids, this.mode); // + this.valeur + this.distance;
    
    this.prix = this.prixDepart(this.totalPoints) + this.prixDistance(this.totalPoints) + this.prixToile(this.totalPoints)
      + this.prixAttendre(this.totalPoints) + this.prixSuplement(this.totalPoints, this.heurs_supl);

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

  onSearchTruck(){
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
      this.demande=data;
    }
    , err=>{
      console.log(err)
    })
  }

}
