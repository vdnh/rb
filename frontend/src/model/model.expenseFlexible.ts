export class ExpenseFlexible{
    id:number;
    idOwner:number;
    name=''; // Name of expense
    dateDoneText=''; // date in text
    // @Temporal(TemporalType.DATE)
    dateDone:Date; // date in Date
    fee:number; // fee before tax
    odo:number; // fee before tax
    idWorkOrder:number; // id of workorder
    note=''; // note
} 