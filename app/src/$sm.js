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
        _attachMethodsAndFields.call(this);
        _detachMethods.call(this);
    }

    $.extend($SM.prototype, {
        getStates: getStates,
        getCurrentState: getCurrentState,
        transition: transition,
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
            || _isIn(state,
                this.stateMachineConfigs.states[currentState].allowedTransitions)) {
            _setCurrentState.call(this, state);
            _detachMethods.call(this);
            _attachMethodsForState.call(this, state);
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

    function _attachMethodsAndFields() {
        var item,
            allowedMethods = _getAllAllowedMethods.call(this);

        for (item in this.rawObject) {
            if (this.rawObject.hasOwnProperty(item) && ! _isIn(item, allowedMethods)) {
                this[item] = this.rawObject[item];
            }
        }
        return this;
    }

    function _attachMethodsForState(state) {
        var allowedMethods,
            i;
        allowedMethods = this.stateMachineConfigs.states[state].allowedMethods;
        if (!allowedMethods) {
            return this;
        }
        for(i=0; i<allowedMethods.length; ++i) {
            this[allowedMethods[i]] = this.rawObject[allowedMethods[i]];
        }
        return this;
    }

    function _detachMethods() {
        _runOnAllAllowedMethodStrings.call(this, function(oneMethod) {
            this[oneMethod] = function() {
                var $deferred = new $.Deferred();
                $deferred.reject();
                return $deferred.promise();
            }
        });
    }

    /**
     * Pass in a $SM method, and it will be called with all methods as strings
     * from the state machine config object.
     * @param method
     * @private
     */
    function _runOnAllAllowedMethodStrings(method) {
        var oneState,
            allStates = this.stateMachineConfigs.states,
            i,
            oneMethod;
        for (oneState in allStates) {
            if (allStates.hasOwnProperty(oneState)) {
                if (allStates[oneState].allowedMethods) {
                    for (i=0; i<allStates[oneState].allowedMethods.length; ++i) {
                        oneMethod = allStates[oneState].allowedMethods[i];
                        method.call(this, oneMethod);
                    }
                }
            }
        }
    }

    function _getAllAllowedMethods() {
        var oneState,
            allStates = this.stateMachineConfigs.states,
            i,
            allMethods = [];
        _runOnAllAllowedMethodStrings.call(this, function(oneMethod) {
            allMethods.push(oneMethod);
        });
        return allMethods;
    }

    function _isIn(needle, haystack) {
        if (Array === haystack.constructor) {
            return _isInArray(needle, haystack);
        }
    }

    function _isInArray(needle, haystack) {
        var i;
        for (i=0; i<haystack.length; ++i) {
            if (needle === haystack[i]) {
                return true;
            }
        }
        return false;
    }

    if ( FUNCTION === typeof define && define.amd ) {

        define( "$sm", ['jquery'], function () { return $SM; } );
    } else {
        window.$SM = $SM;
    }
}());
