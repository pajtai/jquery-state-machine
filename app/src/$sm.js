/*global require:false */
(function() {
    "use strict";
        // Set common strings as variables for IDE code completion
    var STATES = "states",
        ALLOWED_TRANSITIONS = "allowedTransitions",
        CURRENT_STATE = "currentState",
        FUNCTION = "function",
        ON_BEGIN = "onBegin",
        ON_ENTER = "onEnter",
        ON_EXIT = "onExit",
        ON_FINISH = "onFinish",
        ON_METHOD_NOT_HANDLED = "onMethodNotHandled",
        ON_TRANSITION_NOT_HANDLED = "onTransitionNotHandled",
        TRANSITIONING = "transitioning",
        TRANSITION = "transition",
        $SM,
        $;
        // RequireJS support
        if ( FUNCTION === typeof define && define.amd && FUNCTION === typeof require) {
            $ = require("jquery");
        } else {
            // or grab from the global scope
            $ = window.$;
        }

    $SM = function(rawObject, stateMachineConfigs) {
        this.stateMachineConfigs = stateMachineConfigs;
        this.rawObject = rawObject;
    }

    $.extend($SM.prototype, {
        getStates: getStates,
        getCurrentState: getCurrentState
    });

    function getStates() {
        // TODO: check ecmascript .keys support
        return Object.keys(this.stateMachineConfigs.states);
    }

    function getCurrentState() {

    }

    if ( FUNCTION === typeof define && define.amd ) {

        define( "$sm", ['jquery'], function () { return $SM; } );
    } else {
        window.$SM = $SM;
    }
}());
