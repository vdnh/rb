export class ConfirmTransport{
    id : number;
    // infos of transporter
    selfName="";
    selfnid="9299-9101 Quebec Inc";
    selfnir="NIR  R-1091728";
    selfAddress="";
    selfVille="";
    selfCodePostal="";
    selfTel="450-974-9111";
    // selfContact='' // if there are many names, separate with /
    idTransporter : number;
    // carrier Infos
    comName='';
    comContact='';
    comAddress='';
    comVille='';
    comTel='';

    // pick inos
    datePick:Date=new Date();
    pickFrom='';
    pickName='';
    pickAddress='';
    pickVille='';
    pickCodePostal='';
    
    // drop infos
    dateDrop:Date=new Date();
    shipTo='';
    shipName='';
    shipAddress='';
    shipVille='';
    shipCodePostal='';

    // self infos of form
    formNumero='';  // this is the last number + 1 , in the table Transporter
    formDescription='';
    formMontant='';
    formPickUp='';
    formDrop='';
    formNotes='';
    formContact='Marc-André / Steven'; // if there are many names, separate with /, express-contact of transporter
    formTel='';
    formEmail='';
}