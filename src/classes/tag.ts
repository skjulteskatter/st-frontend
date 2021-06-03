export class Tag {
    public id: string;
    public name: string | LocaleString;
    public userDefined: boolean;

    constructor(props: {id: string; name: LocaleString | string}, userDefined: boolean) {
        this.id = props.id;
        this.name = props.name;
        this.userDefined = userDefined;
    }
    
    public getName(l: string) {
        if (typeof(this.name) == "string") {
            return this.name;
        }
        return this.name[l] ?? this.name.en ?? Object.values(this.name)[0];
    }
}
