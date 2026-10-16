import {Tokenizer} from "./Tokenizer";
import {Criteria, isKind, isMKey, isMop, isReserved, isSKey, isSop, Key, Kind, MKey, MOp, SKey, SOp} from "../../types";
import {Order} from "../query/order/Order";
import {Filter} from "../query/filter/Filter";
import {MCriteria} from "../query/filter/MCriteria";
import {SCriteria} from "../query/filter/SCriteria";
import {Or} from "../query/filter/Or";
import {And} from "../query/filter/And";
import {AbstractQuery} from "../query/AbstractQuery";

export abstract class AbstractQueryParser {

    protected query: string;
    protected tokenizer = new Tokenizer();
    protected lookahead: any;

    /**
     * Parses a given string to a Query
     * @param queryString
     * @returns ast representation of the query
     */
    public parse(queryString: string) {
        this.query = queryString;
        this.tokenizer.init(queryString);
        this.lookahead = this.tokenizer.getNextToken();
        return this.handleQUERY();
    }

    protected abstract handleQUERY(): AbstractQuery;
    protected abstract handleORDERKEYS(): any[];
    protected abstract handleDISPLAYKEYS(): any[];

    /**
     * Eats next token from Tokenizer
     *
     * @param expectedTokenType
     */
    protected eat(expectedTokenType: any) {
        const actualToken = this.lookahead;
        if (actualToken === null) {
            throw new Error(`Unexpected end of query. Expected token: ${expectedTokenType}`);
        }

        if (actualToken.type !== expectedTokenType) {
            throw new Error(`Unexpected token: ${JSON.stringify(actualToken)},
            but expected token: ${JSON.stringify(expectedTokenType)}`);
        }
        this.lookahead = this.tokenizer.getNextToken();
        return actualToken;
    }

    /**
     * Handles DATASET production
     *
     * DATASET ::= IN_KIND + ' dataset ' + INPUT
     */
    protected handleDATASET(): any[] {
        const kind = this.handleINKIND();
        this.eat("dataset ");
        const id = this.handleINPUT();
        return [kind, id];
    }

    /**
     * Handles Order if present
     * (+ '; ' + ORDER)?
     * @private
     */
    protected handleOrderAsOption(): Order {
        let order = new Order();
        if (this.lookahead.type === "; ") {
            this.eat("; ");
            order = this.handleORDER();
        }
        return order;
    }

    /**
     * Handles KIND production
     *
     * KIND ::= 'courses' || 'rooms'
     */
    protected handleINKIND(): Kind {
        const token = this.eat("In KIND ");
        const kind = token.value.trim().split(" ").pop();
        if (isKind(kind)) {
            return kind;
        }
        throw new Error("Unexpected KIND value");
    }

    /**
     * Handles INPUT production
     *
     * INPUT ::= string of one or more characters. Cannot contain spaces, underscores or equal to RESERVED strings
     *
     * RESERVED ::= KEYWORD || M_OP || S_OP
     * KEYWORD  ::= 'In' || 'dataset' || 'find' || 'all' || 'show' || 'and' || 'or' ||
     *              'sort' || 'by' || 'entries' || 'is' || 'the' || 'of' || 'whose'
     */
    protected handleINPUT(): string {
        const token = this.eat("INPUT");
        if (!isReserved(token.value)) {
            return token.value;
        }
        throw new Error("Unexpected INPUT value");
    }

    /**
     * Handles FILTER production
     *
     * FILTER ::= 'find all entries' ||
     *            'find entries whose ' + (CRITERIA || CRITERIA_LOGIC)
     */
    protected handleFILTER(): Filter {
        switch (this.lookahead.type) {
            case "find all entries":
                this.eat("find all entries");
                return new Filter();
            case "find entries whose ":
                this.eat("find entries whose ");
                const firstCriteria = this.handleCRITERIA();
                if (this.lookahead.type === "; ") {
                    return new Filter(firstCriteria);
                } else {
                    return new Filter(this.handleCriteriaLogic(firstCriteria));
                }
        }
        throw new Error("Unknown token for FILTER production" + JSON.stringify(this.lookahead));
    }

    protected handleCRITERIA(): MCriteria | SCriteria {
        switch (this.lookahead.type) {
            case "M_KEY":
                return this.handleMCRITERIA();
            case "S_KEY":
                return this.handleSCRITERIA();
        }
        throw new Error("Unknown token for CRITERIA production");
    }

    /**
     * Handles CRITERIA_LOGIC production
     *
     * CRITERIA_LOGIC ::= CRITERIA + ((' and ' || ' or ') + CRITERIA)*
     */
    protected handleCriteriaLogic(lhs: Criteria): Criteria {
        switch (this.lookahead.type) {
            case " and ":
                return this.handleANDCriteria(lhs);
            case " or ":
                return this.handleORCriteria(lhs);
            case "; ":
                return lhs;
        }
        throw new Error("Unknown token for CRITERIA LOGIC production");
    }

    protected handleORCriteria(lhs: Criteria): Criteria {
        this.eat(" or ");
        const rhs = this.handleCRITERIA();
        return this.handleCriteriaLogic(new Or(lhs, rhs));
    }

    protected handleANDCriteria(lhs: Criteria): Criteria {
        this.eat(" and ");
        const rhs = this.handleCRITERIA();
        return this.handleCriteriaLogic(new And(lhs, rhs));
    }

    /**
     * Handles KEY production
     *
     * KEY ::= M_KEY || S_KEY
     */
    protected handleKEY(): Key {
        switch (this.lookahead.type) {
            case "M_KEY":
                return this.handleMKEY();
            case "S_KEY":
                return this.handleSKEY();
        }
        throw new Error("Unexpected KEY production " + JSON.stringify(this.lookahead));
    }

    /**
     * Handles M_KEY production
     *
     * M_KEY ::= 'Average' || 'Pass' || 'Fail' || 'Audit'
     */
    protected handleMKEY(): MKey {
        const mkey = this.eat("M_KEY").value;
        if (isMKey(mkey)) {
            return mkey;
        }
        throw new Error("Unexpected MKEY value");
    }

    /**
     * Handles S_KEY production
     *
     * S_KEY ::= 'Department' || 'ID' || 'Instructor' || 'Title' || 'UUID'
     */
    protected handleSKEY(): SKey {
        const skey = this.eat("S_KEY").value;
        if (isSKey(skey)) {
            return skey;
        }
        throw new Error("Unexpected SKEY value");
    }

    /**
     * M_CRITERIA ::= M_KEY + " " + M_OP + NUMBER
     * REMARK: SPACE TOKEN WAS NOT IN THE SPEC
     * @private
     */
    protected handleMCRITERIA(): MCriteria {
        const key = this.handleMKEY();
        this.eat(" ");
        const op = this.handleMOP();
        const aNumber = this.handleNUMBER();
        return new MCriteria(key, op, aNumber);
    }

    /**
     * S_CRITERIA ::= S_KEY + " " + S_OP + STRING
     * REMARK: SPACE TOKEN WAS NOT IN THE SPEC
     */
    protected handleSCRITERIA(): SCriteria {
        const key = this.handleSKEY();
        this.eat(" ");
        const op = this.handleSOP();
        const aString = this.handleSTRING();
        return new SCriteria(key, op, aString);
    }

    /**
     * Handles M_OP production
     *
     * M_OP ::= 'is ' + ('not ' +)? ('greater than '
     *                               || 'less than '
     *                               || 'equal to ')*
     */
    protected handleMOP(): MOp {
        const op = this.eat("M_OP").value;
        if (isMop(op)) {
            return op;
        }
        throw new Error("Unexpected MOp value");
    }

    /**
     * Handles S_OP production
     *
     * S_OP ::= ('is ' (+ 'not ')?)
     *              || 'includes '
     *              || 'does not include '
     *              || (('begins'
     *                  || 'does not begin'
     *                  || 'ends'
     *                  || 'does not end') + ' with ')
     *
     */
    protected handleSOP(): SOp {
        const op = this.eat("S_OP").value;
        if (isSop(op)) {
            return op;
        }
        throw new Error("Unexpected MOp value");
    }

    /**
     *  Handles NUMBER production
     *
     * NUMBER   ::= ('-')? + [0-9] (+ [0-9])* + ('.' + [0-9] (+ [0-9])*)?
     */
    protected handleNUMBER(): number {
        const aNumber = this.eat("NUMBER");
        return parseFloat(aNumber.value);
    }

    /**
     *  Handles STRING production
     *
     *  STRING   ::= '"' + [^*"]* + '"' // any string without * or " in it, enclosed by double quotation marks
     */
    protected handleSTRING() {
        const aString = this.eat("STRING");
        return aString.value.slice(1, -1);
    }

    /**
     * Handles ONE OR MORE PRODUCTIONS, separated by comma and joint with last one with ' and '
     *
     * ONEORMOREPROD ::= PROD + ((', ' + PROD +)* ' and ' + PROD)
     */

    protected handleONEORMOREPROD(handlePROD: () => any): any[] {
        const one = handlePROD();
        const more = this.handleMOREPROD(handlePROD);
        return [one, ...more];
    }

    /**
     * Handles MORE PRODUCTIONS
     *
     * MOREPROD ::= ((', ' + PROD +)* ' and ' + PROD)
     */

    protected handleMOREPROD(handlePROD: () => any): any[] {
        if (this.lookahead.type === " and ") {
            this.eat(" and ");
            return [handlePROD()];
        }
        if (this.lookahead.type === ", ") {
            this.eat(", ");
            return [handlePROD(), ...this.handleMOREPROD(handlePROD)];
        }
        return [];
    }

    /**
     * Handles ORDER production
     * ORDER ::= 'sort in ' + ('ascending ' || 'descending ')? + 'order by ' + KEY (+ MORE_KEYS)?*
     */
    protected handleORDER(): Order {
        this.eat("sort in ");
        const dir = this.eat("DIRECTION").value;
        const direction = (dir.includes("ascending")) ? "UP" : "DOWN";
        this.eat("order by ");
        const keys = this.handleORDERKEYS();
        return new Order(direction, keys);
    }

}
