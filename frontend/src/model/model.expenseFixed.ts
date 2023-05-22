export class ExpenseFixed{
    id:number;
    idOwner:number;
    name=''; // Name of expense
    perMonth:number; //=false;
    perYear:number; //=false;
    fee:number; // fee before tax
    period=''; // Name of expense

    note=''; // note
    
    dateSinceText=''; // dateSince in text
    dateSince:Date; // dateSince in Date

    dateUntilText=''; // dateUntil in text
    dateUntil:Date; // dateUntil in Date
    archived=false; // use to archive the old expense fixed
}