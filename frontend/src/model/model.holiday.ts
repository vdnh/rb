export class Holiday{
    id:number;
    idOwner:number;
    dateHolidayText=''; // date in text
    dateHoliday:Date= null //new Date(); // date in Date
    rate:number; // rate for this dateHoliday, alsway >=1
    name=""; // Name of holiday
    closed=false; // use to show open or close
    note=""; // note for anything more
    lineMatch=""; // yyyy-mm-dayOfMonth (ex:2022-06-1)
}