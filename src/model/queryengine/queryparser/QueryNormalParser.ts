import {QueryNormal} from "../query/QueryNormal";
import {Display} from "../query/display/Display";
import {AbstractQueryParser} from "./AbstractQueryParser";

export class QueryNormalParser extends AbstractQueryParser {
    /**
     * Handles QUERY production
     *
     * QUERY ::= QUERY_NORMAL || QUERY_AGGREGATE
     */
    protected handleQUERY() {
        return this.handleQUERYNORMAL();
    }

    /**
     * Handles QUERY_NORMAL production
     *
     * QUERY_NORMAL ::= DATASET + ', ' + FILTER + '; ' + DISPLAY(+ '; ' + ORDER)? + '.'
     */
    protected handleQUERYNORMAL() {
        const [kind, id] = this.handleDATASET();
        this.eat(", ");
        const filter = this.handleFILTER();
        this.eat("; ");
        const display = this.handleDISPLAY();
        const order = this.handleOrderAsOption();
        this.eat(".");
        return new QueryNormal({
            kind,
            id,
            filter,
            display,
            order,
        });
    }

    protected handleORDERKEYS() {
        return this.handleONEORMOREPROD(this.handleKEY.bind(this));
    }

    protected handleDISPLAYKEYS(): any[] {
        return this.handleONEORMOREPROD(this.handleKEY.bind(this));
    }

    /**
     * Handles DISPLAY production
     *
     * DISPLAY ::= 'show ' + KEY (+ MORE_KEYS)?
     */
    protected handleDISPLAY(): Display {
        this.eat("show ");
        return new Display(this.handleDISPLAYKEYS());
    }

}
