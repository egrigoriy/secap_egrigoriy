import {Display} from "./display/Display";
import {Order} from "./order/Order";
import {Filter} from "./filter/Filter";
import {Kind} from "../../types";
import {AbstractQuery} from "./AbstractQuery";

export interface IQueryNormalArgs {
    kind: Kind;
    id: string;
    filter: Filter;
    display: Display;
    order: Order;
}

export class QueryNormal extends AbstractQuery {
    constructor({kind, id, filter, display, order}: IQueryNormalArgs)  {
        super({kind, id, filter, display, order});
    }

    public isValid() {
        return this.validFilterKeys() &&
            this.validDisplayKeys() &&
            this.validOrderKeys();
    }

    public process(data: any[]): any[] {
        const filteredData = this.filter.process(data);
        const displayData = this.display.process(filteredData);
        return this.order.process(displayData);
    }

    protected validDisplayKeys(): boolean {
        const validKeys = this.validKeys[this.getKind()];
        return this.display.isValid(validKeys);
    }

}
