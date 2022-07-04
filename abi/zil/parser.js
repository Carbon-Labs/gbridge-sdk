const GBridgeABI = require("./Gbridge");

const funValues = GBridgeABI.transitions.reduce((acc, transition) => {
    acc[transition.vname] = async function () {
        if(arguments.length < transition.params.length)
            throw new Error("required " + transition.params.length + " arguments " + " but got only " + arguments.length + " arguments!");
        return transition.params.map((param, index) => ({...param, value: arguments[index]}));
    };
    return acc;
}, {});

const events = GBridgeABI.events.reduce((acc, event) => {
    acc[event.vname] = event.params;
    return acc;
}, {});

module.exports = {funValues, events};
