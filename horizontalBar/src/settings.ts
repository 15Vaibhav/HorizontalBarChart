

module powerbi.extensibility.visual {
  "use strict";
  import DataViewObjectsParser = powerbi.extensibility.utils.dataview.DataViewObjectsParser;
  export class CircleSettings {
    public first_bar: string = "green";
    public seconed_bar:string ='red';
    public Heading:number =18;
    public Values:number =18;

 
   }
    export class VisualSettings extends DataViewObjectsParser {
      public Arc: CircleSettings = new CircleSettings();
        }
   
   

}
