export interface IKeyTranslatorArg {
    to: { [key: string]: string; };
    from: { [key: string]: string; };
}

export class KeyTranslator {
    private readonly arg: IKeyTranslatorArg;

    constructor(arg: IKeyTranslatorArg) {
        this.arg = arg;
    }
    public toQuery(key: string): string {
        return (this.arg.to)[key];
    }

    public fromQuery(id: string, key: string): string {
        if (this.arg.from[key] === undefined) {
            return key;
        }
        return id + "_" + (this.arg.from)[key];
    }
}
