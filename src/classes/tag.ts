export class Tag {
    public id: string;
    public name: LocaleString;
    public userDefined: boolean;

    constructor(props: {id: string; name: LocaleString}, userDefined: boolean) {
        this.id = props.id;
        this.name = props.name;
        this.userDefined = userDefined;
    }
    
    public getName(l: string) {
        return this.name[l] ?? this.name.en ?? Object.values(this.name)[0];
    }
}
