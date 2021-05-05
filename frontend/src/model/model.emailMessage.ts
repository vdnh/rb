export class EmailMessage{
    titre:string;
    content:string;
    addressCondition:string; // pour limiter region - par example Quebec, Montreal, Toronto, ...
    emailDest:string;
    attachement:string; // to attach file (image and pdf)
    nameAttached:string; // file name attached
}