export class Tag {
    public id: string;
    public name: string;
    public userDefined: boolean;

    constructor(props: {id: string; name: string}, userDefined: boolean) {
        this.id = props.id;
        this.name = props.name;
        this.userDefined = userDefined;
    }
    
    public getName() {
        return this.name;
    }
}
