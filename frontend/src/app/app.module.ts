import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { TasksComponent } from './tasks/tasks.component';
import { NewTaskComponent } from './new-task/new-task.component';
import { RegistrationComponent } from './registration/registration.component';
import {Routes, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { AuthenticationService } from 'src/services/authentication.service';
import { CalculePrixComponent } from './calcule-prix/calcule-prix.component';
import { ContactsService } from 'src/services/contacts.service';
import { TransportersService } from 'src/services/transporters.service';
import { ShippersService } from 'src/services/shippers.service';
import { AdressesService } from 'src/services/adresses.service';
import { ShippersComponent } from './shippers/shippers.component';
import { TransportersComponent } from './transporters/transporters.component';
import { NewTransporterComponent } from './new-transporter/new-transporter.component';
import { DetailTransporterComponent } from './detail-transporter/detail-transporter.component';
import { DetailShipperComponent } from './detail-shipper/detail-shipper.component';
import { NewShipperComponent } from './new-shipper/new-shipper.component';
import { TestComponent } from './shippers/test/test.component';
import { MapComponent } from './map/map.component';
import { FichTechniqueComponent } from './fich-technique/fich-technique.component';
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
  {path: 'map', component: MapComponent},
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
    //MapComponent,
  ],
  imports: [
    BrowserModule, RouterModule.forRoot(appRoutes), FormsModule, HttpClientModule
  ],
  providers: [AuthenticationService, ContactsService, TransportersService, 
    ShippersService, AdressesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
