import {Key_C} from "../../types";
import {Display} from "../query/display/Display";
import {QueryAggregate} from "../query/QueryAggregate";
import {Group} from "../query/group/Group";
import {Apply} from "../query/apply/Apply";
import {ApplyRule} from "../query/apply/ApplyRule";
import {AbstractQueryParser} from "./AbstractQueryParser";

export class QueryAggregateParser extends AbstractQueryParser {
    /**
     * Handles QUERY production
     *
     * QUERY ::= QUERY_NORMAL || QUERY_AGGREGATE
     */
    protected handleQUERY() {
            return this.handleQUERYAGGRETATE();
    }

    /**
     * Handles QUERY_AGGREGATE production
     *
     * QUERY_AGGREGATE ::= DATASET_GROUPED + ', ' + FILTER + '; ' + DISPLAY_GROUPED(+ '; ' + ORDER_GROUPED)? + '.'
     */
    protected handleQUERYAGGRETATE() {
        const [kind, id, group] = this.handleDATASETGROUPED();
        const filter = this.handleFILTER();
        this.eat("; ");
        const [display, apply] = this.handleDISPLAYGROUPED();
        const order = this.handleOrderAsOption();
        this.eat(".");
        return new QueryAggregate({
            kind,
            id,
            group,
            filter,
            display,
            apply,
            order,
        });
    }

    /**
     * Handles DISPLAY_KEYS production
     *
     * DISPLAY_KEYS ::= KEY_C + ((', ' + KEY_C +)* ' and ' + KEY_C)?
     */
    protected handleDISPLAYKEYS(): Key_C[] {
        return this.handleONEORMOREPROD(this.handleKEYC.bind(this));
    }

    protected handleORDERKEYS() {
        return this.handleONEORMOREPROD(this.handleKEYC.bind(this));
    }

    protected handleKEYC(): Key_C {
        switch (this.lookahead.type) {
            case "M_KEY":
                return this.handleMKEY();
            case "S_KEY":
                return this.handleSKEY();
            case "INPUT":
                return this.handleINPUT();
            case "AGGREGATOR":
                return this.eat("AGGREGATOR").value;
        }
        throw new Error("Unexpected KEY_C production " + JSON.stringify(this.lookahead));
    }

    /**
     * Handles DATASET_GROUPED production
     *
     * DATASET_GROUPED ::= DATASET + ' grouped by ' + GROUP
     */
    protected handleDATASETGROUPED() {
        const [kind, id] = this.handleDATASET();
        this.eat(" grouped by ");
        const group = this.handleGROUP();
        return [kind, id, group];

    }

    /**
     * Handles GROUP production
     *
     * GROUP ::= KEY (+ MORE_KEYS)?
     */
    protected handleGROUP(): Group {
        const keys = [this.handleKEY()];
        if (this.lookahead.type === ", ") {
            this.eat(", ");
            if (this.lookahead.type === "find all entries" || this.lookahead.type === "find entries whose ") {
                return new Group(keys);
            } else {
                const moreKeys = this.handleONEORMOREPROD(this.handleKEY.bind(this));
                keys.push(...moreKeys);
                this.eat(", ");
                return new Group(keys);
            }
        }
        if (this.lookahead.type === " and ") {
            this.eat(" and ");
            keys.push(this.handleKEY());
            this.eat(", ");
            return new Group(keys);
        }
    }

    /**
     * Handles DISPLAY_GROUPED production
     *
     * DISPLAY_GROUPED ::= 'show ' + DISPLAY_KEYS + (', ' + AGGREGATION)?
     */
    protected handleDISPLAYGROUPED(): [Display, Apply] {
        this.eat("show ");
        const display = new Display(this.handleDISPLAYKEYS());
        let apply = new Apply();
        if (this.lookahead.type === ", ") {
            this.eat(", ");
            apply = this.handleAGGREGATION();
        }
        return [display, apply];
    }

    /**
     * Handles AGGREGATION production
     *
     * AGGREGATION ::= 'where ' + AGG_DEF (+ ((', ' + AGG_DEF +)* ' and ' + AGG_DEF))*
     */
    protected handleAGGREGATION(): Apply {
        this.eat("where ");
        const aggs = this.handleONEORMOREPROD(this.handleAGGDEF.bind(this));
        return new Apply(aggs);
    }

    /**
     * Handles AGG_DEF production
     *
     * AGG_DEF ::= INPUT + ' is the ' + AGGREGATOR + ' of ' + KEY
     */
    protected handleAGGDEF() {
        const applyKey = this.handleKEYC();
        this.eat(" is the ");
        const aggregator = this.eat("AGGREGATOR").value;
        this.eat(" of ");
        const key = this.handleKEY();
        return new ApplyRule(applyKey, aggregator, key);
    }
}
