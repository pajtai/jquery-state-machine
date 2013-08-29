/*global describe:false, beforeEach:false*, chai:false, it:false, require:false*/

describe( "A Backbone-State-Machine,", function () {
    var $sm,
        rawObject,
        stateMachineConfigs,
        should = chai.should();

    chai.Assertion.includeStack = false;

    beforeEach(function() {
        rawObject = {
            lock: function() {
                console.log("locked");
            },
            unlock: function() {
                console.log("unlock");
            },
            walkThrough: function() {
                console.log("walkThrough");
            }
        }
        stateMachineConfigs = {
            states: {
                open: {
                    allowedMethods: ["walkThrough"],
                    allowedTransitions: ["closed"]
                },
                closed: {
                    allowedMethods: ["lock", "unlock"],
                    allowedTransitions: ["open"]
                }
            }
        }
        $sm = new $SM(rawObject, stateMachineConfigs);
    })

    describe("The jQuery State Machine", function() {
        it("exists.", function() {
            should.exist($sm);
        });

        describe("states", function() {
            it("can be listed with .getStates", function() {
                $sm.getStates().should.deep.equal(["open", "closed"]);
            });

            it("current one can be listed with .getCurrentState", function() {
                should.not.exist($sm.getCurrentState());
            });
        });

    })


});
