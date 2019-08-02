import { BrowserModule} from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { TasksComponent } from './tasks/tasks.component';
import { NewTaskComponent } from './new-task/new-task.component';
import { RegistrationComponent } from './registration/registration.component';
import {Routes, RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { AuthenticationService } from 'src/services/authentication.service';
import { CalculePrixComponent } from './calcule-prix/calcule-prix.component';
import { ContactsService } from 'src/services/contacts.service';
import { TransportersService } from 'src/services/transporters.service';
import { ShippersService } from 'src/services/shippers.service';
import { AdressesService } from 'src/services/adresses.service';
import { BonDeTravailsService } from 'src/services/bonDeTravail.service'
import { ReparationsService } from 'src/services/reparation.service'
import { ShippersComponent } from './shippers/shippers.component';
import { TransportersComponent } from './transporters/transporters.component';
import { NewTransporterComponent } from './new-transporter/new-transporter.component';
import { DetailTransporterComponent } from './detail-transporter/detail-transporter.component';
import { DetailShipperComponent } from './detail-shipper/detail-shipper.component';
import { NewShipperComponent } from './new-shipper/new-shipper.component';
import { TestComponent } from './shippers/test/test.component';
import { MapComponent } from './map/map.component';
import { FichTechniqueComponent } from './fich-technique/fich-technique.component';
import { CamionComponent } from './camion/camion.component';
import { CamionsService } from 'src/services/camions.service';
import { FichePhysiquesService } from 'src/services/fichePhysiques.service';
import { FichePhysiqueContsService } from 'src/services/fichePhysiqueConts.service';
import { AutreEntretiensService } from 'src/services/autreEntretiens.service';
import { MapFlotteComponent } from './map-flotte/map-flotte.component';
import { DemandesService }  from 'src/services/demandes.service';
import { VoyagesService }  from 'src/services/voyages.service';
import { GeocodingService } from 'src/services/geocoding.service';
import { ListDemandeComponent } from './list-demande/list-demande.component';
import { DetailDemandeComponent } from './detail-demande/detail-demande.component';
import { ListVoyageComponent } from './list-voyage/list-voyage.component';
import { DetailVoyageComponent } from './detail-voyage/detail-voyage.component';
import { CreerVoyageComponent } from './creer-voyage/creer-voyage.component';
import { ListDemandeDeChaqueComponent } from './list-demande-de-chaque/list-demande-de-chaque.component'
import { AgmCoreModule } from '@agm/core';
//import { from } from 'rxjs';
import { BankClientsService } from 'src/services/bankClients.service';
import { BankClientComponent } from './bank-client/bank-client.component';
import { GeolocationService } from 'src/services/geolocation.service';
import { MessagesService } from 'src/services/messages.service';
import { BusinessMessagesComponent } from './business-messages/business-messages.component';
import { VarsGlobal } from 'src/services/VarsGlobal';
import { RemorquageComponent } from './remorquage/remorquage.component';
import { RemorquagesService } from 'src/services/remorquages.service';
import { GarantiesService } from 'src/services/garantie.service';
import { RemorquageClientComponent } from './remorquage-client/remorquage-client.component';
import { DetailRemorquageComponent } from './detail-remorquage/detail-remorquage.component';
import {DatePipe} from '@angular/common';
import { RemorquageProComponent } from './remorquage-pro/remorquage-pro.component';
import { DetailRemorquageProComponent } from './detail-remorquage-pro/detail-remorquage-pro.component';
//import { InnerComponent } from './business-messages/InnerComponent';
//import { Reparation } from 'src/model/model.reparation';
//import { ReparationsService } from 'src/services/reparation.service';
//import { MapComponent } from './map/map.component';
//import { LogoutComponent } from './logout/logout.component';

const appRoutes:Routes=[
  {path:"login", component:LoginComponent},
  {path:"propos", component:TasksComponent},
  {path:"new-task", component:NewTaskComponent},
  {path:"register", component:RegistrationComponent},
  {path:"calcule-prix", component:CalculePrixComponent},
  {path: 'transporters', component: TransportersComponent},
  {path: 'new-transporter', component:  NewTransporterComponent},
  {path: 'detail-transporter/:id', component:  DetailTransporterComponent},
  {path: 'shippers', component: ShippersComponent},
  {path: 'new-shipper', component:  NewShipperComponent},
  {path: 'detail-shipper/:id', component:  DetailShipperComponent},
  {path: 'shippers/testlink', component:  TestComponent},
  {path: 'map/:id', component: MapComponent},
  {path: 'map-flotte/:id', component: MapFlotteComponent},
  {path: "fiche-technique", component: FichTechniqueComponent},
  {path: 'camion/:id', component:  CamionComponent},
  {path:"list-demande", component:ListDemandeComponent},
  {path:'list-demande-de-chaque/:flag', component:ListDemandeDeChaqueComponent},
  {path: 'detail-demande/:id', component:  DetailDemandeComponent},
  {path:"creer-voyage", component:CreerVoyageComponent},
  {path:"list-voyage", component:ListVoyageComponent},
  {path:"business-messages", component:BusinessMessagesComponent},
  {path: 'detail-voyage/:id', component:  DetailVoyageComponent},
  {path: 'bank-client', component:  BankClientComponent},
  {path: 'remorquage', component:  RemorquageComponent},
  {path: 'remorquage-client/:id', component:  RemorquageClientComponent},
  {path: 'detail-remorquage/:id', component:  DetailRemorquageComponent},
  {path: 'remorquage-pro', component:  RemorquageProComponent},
  {path: 'detail-remorquage-pro/:id', component:  DetailRemorquageProComponent},
  {path:"", redirectTo:"", pathMatch:"full"}
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TasksComponent,
    NewTaskComponent,
    RegistrationComponent,
    CalculePrixComponent,
    ShippersComponent,
    TransportersComponent,
    NewTransporterComponent,
    DetailTransporterComponent,
    DetailShipperComponent,
    NewShipperComponent,
    TestComponent,
    MapComponent,
    FichTechniqueComponent,
    CamionComponent,
    MapFlotteComponent,
    ListDemandeComponent,
    DetailDemandeComponent,
    ListVoyageComponent,
    DetailVoyageComponent,
    CreerVoyageComponent,
    ListDemandeDeChaqueComponent,
    BankClientComponent,
    BusinessMessagesComponent,
    RemorquageComponent,
    RemorquageClientComponent,
    DetailRemorquageComponent,
    RemorquageProComponent,
    DetailRemorquageProComponent,
    //MapComponent,
  ],
  imports: [
    BrowserModule, RouterModule.forRoot(appRoutes), FormsModule, HttpClientModule, BrowserModule, ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC9PnuRk42kbCPMOvsfHpn40r5SoyN38zI',
      libraries: ['places', 'drawing', 'geometry','fr', 'QC'],
    }),
  ],
  providers: [DatePipe, AuthenticationService, ContactsService, TransportersService, 
    ShippersService, AdressesService, CamionsService, FichePhysiquesService, FichePhysiqueContsService,
    AutreEntretiensService, DemandesService, VoyagesService, GeocodingService, GeolocationService, BonDeTravailsService, 
    ReparationsService, BankClientsService, MessagesService, VarsGlobal, RemorquagesService, GarantiesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
