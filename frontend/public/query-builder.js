/**
 * Builds a query object using the current document object model (DOM).
 * Must use the browser's global document object {@link https://developer.mozilla.org/en-US/docs/Web/API/Document}
 * to read DOM information.
 *
 * @returns query object adhering to the query EBNF
 */
CampusExplorer.buildQuery = () => {
    return getDataset() + getGroups() + ', ' +
        getConditions() + "; " +
        getColumns() + getTransformations() + getOrderAsOption() + ".";
};

/**
 * Returns the DATASET portion of the query
 *
 * @return {string}
 */
function getDataset() {
    const kind = getKindFromHTML();
    switch (kind) {
        case "courses":
            return "In courses dataset courses"
        case "rooms":
            return "In rooms dataset rooms";
    }
    throw new Error("Kind from HTML is neither courses nor rooms, but : " + kind);
}

/**
 * Returns the GROUP portion of the query
 *
 * @return {string}
 */
function getGroups() {
    const groupKeys = getCheckedGroupsFromHTML();
    if (groupKeys.length === 0) {
        return "";
    } else {
        return ` grouped by ${joinOneOrMore(groupKeys)}`;
    }
}

/**
 * Returns the FILTER portion of the query
 *
 * @return {string}
 */
function getConditions() {
    const conditions = getConditionsFromHTML();
    if (conditions.length === 0) {
        return "find all entries";
    } else {
        const conditionsAsStrings = getConditionsAsStrings(conditions);
        const logicConnector = getLogicConnector();
        return `find entries whose ${conditionsAsStrings.join(logicConnector)}`;
    }
}

/**
 * Returns the string representations of each condition in the given conditions
 *
 * @param conditions
 * @return {*}
 */
function getConditionsAsStrings(conditions) {
    const logicConnector = getLogicConnectorFromHTML();
    switch (logicConnector) {
        case "all":
            return conditions.map((condition) => buildCondition(condition));
        case "any":
            return conditions.map((condition) => buildCondition(condition));
        case "none":
            return conditions.map((condition) => buildCondition(invertCondition(condition)));
    }
    throw new Error("Unknown logic connector operation: " + logicConnector);
}

/**
 * Returns the logic connector
 * @return {string}
 */
function getLogicConnector() {
    const logicConnector = getLogicConnectorFromHTML();
    switch (logicConnector) {
        case "all":
            return " and ";
        case "any":
            return " or ";
        case "none":
            return " and ";
    }
    throw new Error("Unknown logic connector operation: " + logicConnector);
}

/**
 * Returns a given condition after inverting logic state of its property "not"
 *
 * @param condition
 * @return {*}
 */
function invertCondition(condition) {
    condition.not = !condition.not;
    return condition;
}

/**
 * Returns the string representation of a condition
 *
 * @param condition
 * @return {string}
 */
function buildCondition(condition) {
    return `${condition.key} ${translateOp(condition.not, condition.op, condition.value)}`;
}

/**
 * Returns the string representation of a given condition operation
 *
 * @param not
 * @param op
 * @param value
 * @return {string}
 */
function translateOp(not, op, value) {
    const MOp = {
        EQ: "is equal to",
        NOTEQ: "is not equal to",
        GT: "is greater than",
        NOTGT: "is not greater than",
        LT: "is less than",
        NOTLT: "is not less than",
    };
    const SOp = {
        IS: "is",
        NOTIS: "is not",
        INCLUDE: "includes",
        NOTINCLUDE: "does not include",
        BEGIN: "begins with",
        NOTBEGIN: "does not begin with",
        END: "ends with",
        NOTEND: "does not end",
    };
    if (op in MOp) {
        const opKey = (not) ? "NOT" + op : op;
        return MOp[opKey] + " " + value;
    }
    if (op in SOp) {
        return SOp[correctSOpKey(not, value)] + " \"" + correctValue(value) + "\"";
    }
}

/**
 * Returns the correct key string corresponding to given value and possible negation
 *
 * @param not
 * @param value
 * @return {string}
 */
function correctSOpKey(not, value) {
    if (value.startsWith("*") && value.endsWith("*")) {
        return (not) ? "NOTINCLUDE" : "INCLUDE";
    } else if (value.startsWith("*")) {
        return (not) ? "NOTEND" : "END";
    } else if (value.endsWith("*")) {
        return (not) ? "NOTBEGIN" : "BEGIN";
    } else {
        return (not) ? "NOTIS" : "IS";
    }
}

/**
 * Returns the given value stripped from any "*"
 *
 * @param value
 * @return {*}
 */
function correctValue(value) {
    if (value.startsWith("*") && value.endsWith("*")) {
        return value.slice(1, -1)
    } else if (value.startsWith("*")) {
        return value.slice(1);
    } else if (value.endsWith("*")) {
        return value.slice(0, -1);
    } else {
        return value;
    }
}

/**
 * Returns the DISPLAY (columns to be displayed) portion of the query
 *
 * @return {string}
 */
function getColumns() {
    const displayKeys = getCheckedColumnsFromHTML();
    return "show " + joinOneOrMore(displayKeys);
}

/**
 * Returns the ORDER portion of the query as option
 * @return {string}
 */
function getOrderAsOption() {
    const orderKeys = getSelectedOrdersFromHTML();
    if (orderKeys.length === 0) {
        return "";
    } else {
        const dir = (getDescendingOrderFromHTML()) ? "descending" : "ascending";
        return `; sort in ${dir} order by ${joinOneOrMore(orderKeys)}`;
    }
}

/**
 * Returns the APPLY transformations portion of the query
 *
 * @return {string}
 */
function getTransformations() {
    const rules = getRulesFromHTML();
    if (rules.length === 0) {
        return "";
    } else {
        const applyRules = Array.from(rules).map((rule) => buildRule(rule));
        return `, where ${joinOneOrMore(applyRules)}`
    }
}

/**
 * Returns the string representation of a given apply/transformation rule
 *
 * @param rule
 * @return {string}
 */
function buildRule(rule) {
    return `${rule.applyKey} is the ${rule.aggregator} of ${rule.key}`;
}

/**
 * Returns a string formed by joining given items with ", " except the last which is joined with " and "
 * @param items
 * @return {string|*}
 */
function joinOneOrMore(items) {
    if (items.length === 1) {
        return items[0];
    }
    const butLast = items.slice(0, -1);
    const last = items.slice(-1);
    return butLast.join(", ") + " and " + last;
}


/**
 * Helper functions getting corresponding data from HTML
 */

function getKindFromHTML() {
    return document.querySelector(".active").getAttribute("data-type");
}

function getLogicConnectorFromHTML() {
    return document.querySelector(".active .conditions input[type=radio]:checked").value;
}

function getConditionsFromHTML() {
    const conditions = document.querySelectorAll(".active .conditions-container .condition");
    return Array.from(conditions).map((condition) => {
        const not = condition.querySelector(".active .not input[type=checkbox]:checked")
        const key = condition.querySelector(".active .fields option[selected]").label;
        const op = condition.querySelector(".active .operators option[selected]").label;
        const value = condition.querySelector(".active .term input[type=text]").value;
        return {not, key, op, value};
    });
}

function getCheckedColumnsFromHTML() {
    const checked = document.querySelectorAll(".active .columns input[type=checkbox]:checked ~ label");
    return Array.from(checked).map((checkbox) => checkbox.innerText);
}

function getCheckedGroupsFromHTML() {
    const checked = document.querySelectorAll(".active .groups input[type=checkbox]:checked ~ label");
    return Array.from(checked).map((checkbox) => checkbox.innerText);
}

function getSelectedOrdersFromHTML() {
    const selected = document.querySelectorAll(".active .order option[selected]");
    return Array.from(selected).map((option) => option.innerText);
}

function getDescendingOrderFromHTML() {
    return document.querySelector(".active .order .descending input[type=checkbox]:checked");
}

function getRulesFromHTML() {
    const rules = document.querySelectorAll(".active .transformations-container .transformation");
    return Array.from(rules).map((rule) => {
            const applyKey = rule.querySelector(".active .term input[type=text]").value;
            const aggregator = rule.querySelector(".active .operators option[selected]").value;
            const key = rule.querySelector(".active .fields option[selected]").label;
            return {applyKey, aggregator, key};
        }
    );
}
