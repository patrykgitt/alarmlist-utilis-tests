export class Alarm {
  constructor(
    descriptionVal: string,
    dateVal: Date,
    approvedVal: boolean = false,
    goingVal: boolean = true,
    archivedVal: boolean = false
  ) {
    this.description = descriptionVal;
    this.approved = approvedVal;
    this.going = goingVal;
    this.archived = archivedVal;
    this.date = dateVal;
  }

  description: string;
  approved: boolean;
  going: boolean;
  archived: boolean;
  date: Date;
}
