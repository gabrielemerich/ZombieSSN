export class People{
    location?: string;
    name?: string;
    age?: number;
    gender?: Gender;
    lonlat?: string;
    infected?: boolean

    constructor(name: string, age:number, gender: Gender){
        this.name = name;
        this.age = age;
        this.gender = gender;
    }
    
}


export type Gender = "M" | "F";