export class EmailMessage{
    titre:string;
    content:string;
    addressCondition:string; // pour limiter region - par example Quebec, Montreal, Toronto, ...
    emailDest:string;
}