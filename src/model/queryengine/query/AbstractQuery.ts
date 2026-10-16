import {Filter} from "./filter/Filter";
import {Display} from "./display/Display";
import {Order} from "./order/Order";
import {Group} from "./group/Group";
import {Apply} from "./apply/Apply";
import {Kind} from "../../types";
import {IQueryNormalArgs} from "./QueryNormal";

export abstract class AbstractQuery {
    protected kind: Kind;
    protected id: string;
    protected filter: Filter;
    protected display: Display;
    protected order: Order;
    protected group: Group;
    protected apply: Apply;
    protected validKeys = {
        courses: ["Average", "Pass", "Fail", "Audit", "Year",
            "Department", "ID", "Instructor", "Title", "UUID"],
        rooms: ["Latitude", "Longitude", "Seats",
            "Full Name", "Short Name", "Number", "Name", "Address", "Type", "Furniture", "Link"],
    };

    protected constructor({kind, id, filter, display, order}: IQueryNormalArgs)  {
        this.kind = kind;
        this.id = id;
        this.filter = filter;
        this.display = display;
        this.order = order;
    }
    public getId(): string {
        return this.id;
    }

    public getKind() {
        return this.kind;
    }

    public abstract isValid(): boolean;
    public abstract process(data: any[]): any[];

    protected validFilterKeys() {
        const validKeys = this.validKeys[this.getKind()];
        return this.filter.isValid(validKeys);
    }

    protected validOrderKeys() {
        return this.order.isValid(this.display.getKeys());
    }

    protected abstract validDisplayKeys(): boolean;
}
