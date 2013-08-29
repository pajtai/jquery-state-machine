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
        // TODO: should rawObject be deep cloned?
        this.rawObject = rawObject;
    }

    $.extend($SM.prototype, {
        getStates: getStates,
        getCurrentState: getCurrentState,
        transition: transition
    });

    function getStates() {
        // TODO: check ecmascript .keys support
        return Object.keys(this.stateMachineConfigs.states);
    }

    function getCurrentState() {
        // Dynamically set
    }

    function transition(state) {
        var $deferred = $.Deferred(),
            currentState = this.getCurrentState();
        if (! currentState
            || $.contains(this.stateMachineConfigs.states[currentState]
                .allowedTransitions, state)) {
            _setCurrentState.call(this, state);
            $deferred.resolve();
        } else {
            $deferred.reject();
        }
        return $deferred.promise();
    }

    // Private methods hidden in closure: must be called or applied to bind context
    function _setCurrentState(state) {

        this.getCurrentState = function() {
            return state;
        }
    }

    if ( FUNCTION === typeof define && define.amd ) {

        define( "$sm", ['jquery'], function () { return $SM; } );
    } else {
        window.$SM = $SM;
    }
}());
