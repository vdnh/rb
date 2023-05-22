export class UserLogs{
    id:number;
    usernameLogin="";
    role="";
    entreprise="";
    entrepriseId=""; // userId in browser
    token="";  // LongText in mySQL
    
    loginTime:Date;
    logoutTime:Date;

    duration:number; // minutes
    longtitude:number;
    latitude:number;
    ipLocal="";
    ipPublic="";
    place=""; // where user login
    internetProvider="";
}