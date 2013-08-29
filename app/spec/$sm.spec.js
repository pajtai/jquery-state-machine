/*global describe:false, beforeEach:false*, chai:false, it:false, require:false*/

describe( "A Backbone-State-Machine,", function () {
    var $sm,
        rawObject,
        stateMachineConfigs,
        should = chai.should();

    chai.Assertion.includeStack = true;

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
                },
                forbidden: {}
            },
            initialState: "open"
        }
        $sm = new $SM(rawObject, stateMachineConfigs);
    })

    describe("The jQuery State Machine", function() {
        it("exists.", function() {
            should.exist($sm);
        });

        describe("state", function() {
            it("and all others can be listed with .getStates", function() {
                $sm.getStates().should.deep.equal(["open", "closed", "forbidden"]);
            });

            it("initial is undefined", function() {
                should.not.exist($sm.getCurrentState());
            });

            describe("transition", function() {
                var start;

                beforeEach(function() {
                   start = $sm.transition('open');
                });

                it("changes the current state to that provided", function() {
                    $sm.getCurrentState().should.equal("open");
                });

                it("returns a promise"
                ,function() {
                    should.exist(start.done);
                    should.exist(start.always);
                    should.exist(start.fail);
                    should.exist(start.progress);
                    should.exist(start.then);
                });

                it("the promise is resolved after the transition", function() {
                    var called = false;
                    start.done(function() {
                         called = true;
                    });
                    called.should.be.true;
                });

                it("will fail to a state that is not allowed", function() {
                    var failed = false;
                    $sm.transition("forbidden").fail(function() {
                        failed = true;
                    });
                    failed.should.be.true;
                });

                it("will succeed to a state that is allowed", function() {
                    var succeed = false;
                    $sm.transition("closed").done(function() {
                        succeed = true;
                    });
                    succeed.should.be.true;
                });

                it("can be chained with promises", function() {

                    var numCalls = 0;
                    start
                        .then(function() {
                            ++numCalls;
                            $sm.getCurrentState().should.equal("open");
                            return $sm.transition("forbidden");}
                        , function() {
                            numCalls = -999;
                        })
                        .then(function() {
                            numCalls = -999;}
                        , function() {
                            ++numCalls;
                            $sm.getCurrentState().should.equal("open");
                            return $sm.transition("closed");
                        })
                        .then(function() {
                            ++numCalls;
                            $sm.getCurrentState().should.equal("closed");}
                        , function() {
                            numCalls = -999;
                        });
                        numCalls.should.equal(3);
                });
            });
        });

    })


});
