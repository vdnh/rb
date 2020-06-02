export class AppUser{
    id:number;
    username='';
    password='';
    idUser='';
    idSecond=''; // to second role
    roleSimple=''; // add for adapte with angular
    entrepriseNom=''; // name of principal entreprise
    fullName=''; // full name of user
    idTransporter:number;  // id de Transporter - besoins dans le cas de dispatch de transporter
}