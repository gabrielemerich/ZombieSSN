export class Item{
    
    id: number;
    description: string;
    icon: string;
    value: string;
   
    constructor(id: number, description: string, icon:string, value:string){
        this.id = id;
        this.description = description;
        this.icon = icon;
        this.value = value;
    }
}
