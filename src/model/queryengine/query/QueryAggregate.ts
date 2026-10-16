import {Kind} from "../../types";
import {Filter} from "./filter/Filter";
import {Display} from "./display/Display";
import {Order} from "./order/Order";
import {Group} from "./group/Group";
import {Apply} from "./apply/Apply";
import {AbstractQuery} from "./AbstractQuery";

export interface IQueryAggregateArgs {
    kind: Kind;
    id: string;
    filter: Filter;
    group: Group;
    apply: Apply;
    display: Display;
    order: Order;
}

export class QueryAggregate extends AbstractQuery {
    constructor({kind, id, group, filter, display, apply, order}: IQueryAggregateArgs) {
        super({kind, id, filter, display, order});
        this.group = group;
        this.apply = apply;
    }

    public isValid() {
        return this.validFilterKeys() &&
            this.validGroupKeys() &&
            this.validApplyKeys() &&
            this.validDisplayKeys() &&
            this.validOrderKeys();
    }

    public process(data: any[]): any[] {
        const filteredData = this.filter.process(data);
        const groupedData = this.group.process(filteredData);
        const appliedData = this.apply.process(groupedData);
        const displayData = this.display.process(appliedData);
        return this.order.process(displayData);
    }

    protected validGroupKeys() {
        const validKeys = this.validKeys[this.getKind()];
        return this.group.isValid(validKeys);
    }

    protected validApplyKeys() {
        const validKeys = this.validKeys[this.getKind()];
        return this.apply.isValid(validKeys);
    }

    protected validDisplayKeys(): boolean {
        const groupKeys = this.group.getKeys();
        const applyKeys = this.apply.getApplyKeys();
        return this.display.isValid([...groupKeys, ...applyKeys]);
    }
}
