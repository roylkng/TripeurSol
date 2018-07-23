'use strict';
/*jslint node: true */

var sinon = require('sinon');

var app = require('./../lib/index');
var expect = require("chai").expect

var users = {
      '45875660609': 'Ranga',
      '49509330262': 'Cheten',
      '99994739873': 'Kumar',
      '77902601451': 'Gagan',
      '57145334512': 'Ram',
      '42704109745': 'Farhan',
      '27528742433': 'Megha',
      '90702746086': 'Arjun',
      '11051196800': 'Thia',
      '56285634277': 'Sangeetha',
      '99979840753': 'Mohan'
}

describe("parseData", function () {
      it("should return plans for users with period only", function () {
            var dummyData = [{
                  "number": "44358461745",
                  "date": "2015-11-21T20:24:24+00:00"
            },
            {
                  "number": "59651008134",
                  "date": "2015-03-22T16:10:01+00:00"
            },
            {
                  "period": 3,
                  "number": "42704109745",
                  "date": "2015-02-21T15:10:01+00:00"
            }]


            var output = []
            var expectedOutput = [
                  {
                        "number": "42704109745",
                        "name": "Farhan",
                        "date": "2015-02-21T15:10:01+00:00",
                        "type": "grant",
                        "provider": "airtel",
                        "period": 3
                  }
            ]
            var output = app.parseData(dummyData, "grant", "airtel", users, output);

            expect(JSON.stringify(output)).equal(JSON.stringify(expectedOutput));


      });

      it("should reject if date is not there with plan", function () {
            var dummyData = [{
                  "period": 3,
                  "number": "77902601451"
            },
            {
                  "period": 3,
                  "number": "42704109745",
                  "date": "2015-02-21T15:10:01+00:00"
            }]


            var output = []
            var expectedOutput = [
                  {
                        "number": "42704109745",
                        "name": "Farhan",
                        "date": "2015-02-21T15:10:01+00:00",
                        "type": "grant",
                        "provider": "airtel",
                        "period": 3
                  }
            ]
            var output = app.parseData(dummyData, "grant", "airtel", users, output);

            expect(JSON.stringify(output)).equal(JSON.stringify(expectedOutput));


      });

      it("should reject if number is not there with plan", function () {
            var dummyData = [{
                  "period": 3,
                  "date": "2015-02-21T15:10:01+00:00"
            },
            {
                  "period": 3,
                  "number": "42704109745",
                  "date": "2015-02-21T15:10:01+00:00"
            }]


            var output = []
            var expectedOutput = [
                  {
                        "number": "42704109745",
                        "name": "Farhan",
                        "date": "2015-02-21T15:10:01+00:00",
                        "type": "grant",
                        "provider": "airtel",
                        "period": 3
                  }
            ]
            var output = app.parseData(dummyData, "grant", "airtel", users, output);

            expect(JSON.stringify(output)).equal(JSON.stringify(expectedOutput));


      });

      it("should return plans for users which are present in our directory discard rest", function () {
            var dummyData = [
                  {
                        "period": 4,
                        "number": "44358461745",
                        "date": "2015-11-03T13:24:24+00:00"
                  },
                  {
                        "period": 3,
                        "number": "42704109745",
                        "date": "2015-02-21T15:10:01+00:00"
                  }]


            var output = []
            var expectedOutput = [
                  {
                        "number": "42704109745",
                        "name": "Farhan",
                        "date": "2015-02-21T15:10:01+00:00",
                        "type": "grant",
                        "provider": "airtel",
                        "period": 3
                  }
            ]
            var output = app.parseData(dummyData, "grant", "airtel", users, output);
            expect(JSON.stringify(output)).equal(JSON.stringify(expectedOutput));
      });

});

describe("sortData", function () {
      it("should return in order odrder of time (all timestamps are different)", function () {
            var dummyData = [{
                        "number": "45875660609",
                        "name": "Ranga",
                        "date": "2015-05-10T13:45:23+00:00",
                        "type": "grant",
                        "provider": "A",
                        "period": 3
                    },
                    {
                        "number": "45875660609",
                        "name": "Ranga",
                        "date": "2015-01-10T13:45:23+00:00",
                        "type": "grant",
                        "provider": "A",
                        "period": 3
                    },
                    {
                        "number": "45875660609",
                        "name": "Ranga",
                        "date": "2015-02-10T13:45:23+00:00",
                        "type": "grant",
                        "provider": "A",
                        "period": 3
                    }]


            var output = []
            var expectedOutput = [
                  {
                        "number": "45875660609",
                        "name": "Ranga",
                        "date": "2015-01-10T13:45:23+00:00",
                        "type": "grant",
                        "provider": "A",
                        "period": 3
                    },
                    {
                        "number": "45875660609",
                        "name": "Ranga",
                        "date": "2015-02-10T13:45:23+00:00",
                        "type": "grant",
                        "provider": "A",
                        "period": 3
                    },
                    {
                        "number": "45875660609",
                        "name": "Ranga",
                        "date": "2015-05-10T13:45:23+00:00",
                        "type": "grant",
                        "provider": "A",
                        "period": 3
                    },
            ]
            var output = app.sortData(dummyData);

            expect(JSON.stringify(output)).equal(JSON.stringify(expectedOutput));


      });


      it("should return in order of time , if timestamp is smae give prefernce to revoke", function () {
            var dummyData = [{
                        "number": "45875660609",
                        "name": "Ranga",
                        "date": "2015-05-10T13:45:23+00:00",
                        "type": "grant",
                        "provider": "A",
                        "period": 3
                    },
                    {
                        "number": "45875660609",
                        "name": "Ranga",
                        "date": "2015-02-10T13:45:23+00:00",
                        "type": "revocation",
                        "provider": "A",
                    },
                    {
                        "number": "45875660609",
                        "name": "Ranga",
                        "date": "2015-02-10T13:45:23+00:00",
                        "type": "grant",
                        "provider": "A",
                        "period": 3
                    }]


            var output = []
            var expectedOutput = [
                   {
                        "number": "45875660609",
                        "name": "Ranga",
                        "date": "2015-02-10T13:45:23+00:00",
                        "type": "revocation",
                        "provider": "A",
                    },
                    {
                        "number": "45875660609",
                        "name": "Ranga",
                        "date": "2015-02-10T13:45:23+00:00",
                        "type": "grant",
                        "provider": "A",
                        "period": 3
                    },
                    {
                        "number": "45875660609",
                        "name": "Ranga",
                        "date": "2015-05-10T13:45:23+00:00",
                        "type": "grant",
                        "provider": "A",
                        "period": 3
                    },
            ]
            var output = app.sortData(dummyData);

            expect(JSON.stringify(output)).equal(JSON.stringify(expectedOutput));


      });

   
     it("should return in order of time ,keep order unchanged if time stamp is same and revocation first", function () {
            var dummyData = [{
                        "number": "45875660609",
                        "name": "Ranga",
                        "date": "2015-02-10T13:45:23+00:00",
                        "type": "grant",
                        "provider": "A",
                        "period": 3
                    },
                    {
                        "number": "45875660609",
                        "name": "Ranga",
                        "date": "2015-02-10T13:45:23+00:00",
                        "type": "revocation",
                        "provider": "A",
                    },
                    {
                        "number": "45875660609",
                        "name": "Ranga",
                        "date": "2015-02-10T13:45:23+00:00",
                        "type": "grant",
                        "provider": "A",
                        "period": 3
                    }]


            var expectedOutput = [
                   {
                        "number": "45875660609",
                        "name": "Ranga",
                        "date": "2015-02-10T13:45:23+00:00",
                        "type": "revocation",
                        "provider": "A",
                    },
                    {
                        "number": "45875660609",
                        "name": "Ranga",
                        "date": "2015-02-10T13:45:23+00:00",
                        "type": "grant",
                        "provider": "A",
                        "period": 3
                    },
                    {
                        "number": "45875660609",
                        "name": "Ranga",
                        "date": "2015-02-10T13:45:23+00:00",
                        "type": "grant",
                        "provider": "A",
                        "period": 3
                    },
            ]
            var output = app.sortData(dummyData);

            expect(JSON.stringify(output)).equal(JSON.stringify(expectedOutput));


      });


});

describe("applySubscriptions", function () {
      it("If Provider A issues a grant to user for 3 months then another grans is invalid", function () {
            var dummyData = [{
                  "number": "45875660609",
                  "name": "Ranga",
                  "date": "2015-01-10T13:45:23+00:00",
                  "type": "grant",
                  "provider": "A",
                  "period": 3
            },
            {
                  "number": "45875660609",
                  "name": "Ranga",
                  "date": "2015-02-10T13:45:23+00:00",
                  "type": "grant",
                  "provider": "B",
                  "period": 6
            },
            {
                  "number": "45875660609",
                  "name": "Ranga",
                  "date": "2015-04-10T13:45:23+00:00",
                  "type": "grant",
                  "provider": "C",
                  "period": 8
            }]


            var output = []
            var expectedOutput = {
                  "45875660609": {
                        "provider": "A",
                        "subscriptions": {
                              "A": [
                                    {
                                          "startDate": "2015-01-10T13:45:23+00:00",
                                          "endDate": "2015-04-10T13:45:23.000Z"
                                    }
                              ]
                        }
                  },
            }
            var output = app.applySubscriptions(dummyData);

            expect(JSON.stringify(output)).equal(JSON.stringify(expectedOutput));


      });

      it("If Provider A issues a grant to user for 3 months then another grant from same provider is added to endDate", function () {
            var dummyData = [{
                  "number": "45875660609",
                  "name": "Ranga",
                  "date": "2015-01-10T13:45:23+00:00",
                  "type": "grant",
                  "provider": "A",
                  "period": 3
            },
            {
                  "number": "45875660609",
                  "name": "Ranga",
                  "date": "2015-02-10T13:45:23+00:00",
                  "type": "grant",
                  "provider": "A",
                  "period": 1
            },
            {
                  "number": "45875660609",
                  "name": "Ranga",
                  "date": "2015-04-10T13:45:23+00:00",
                  "type": "grant",
                  "provider": "C",
                  "period": 8
            }]


            var output = []
            var expectedOutput = {
                  "45875660609": {
                        "provider": "A",
                        "subscriptions": {
                              "A": [
                                    {
                                          "startDate": "2015-01-10T13:45:23+00:00",
                                          "endDate": "2015-05-10T13:45:23.000Z"
                                    }
                              ]
                        }
                  },
            }
            var output = app.applySubscriptions(dummyData);

            expect(JSON.stringify(output)).equal(JSON.stringify(expectedOutput));


      });

      it("If Provider A issues a grant to user for 3 months then revokes it after 2 months and then provider B's grant is accepeted if after revoke", function () {
            var dummyData = [{
                  "number": "45875660609",
                  "name": "Ranga",
                  "date": "2015-01-10T13:45:23+00:00",
                  "type": "grant",
                  "provider": "A",
                  "period": 3
            },
            {
                  "number": "45875660609",
                  "name": "Ranga",
                  "date": "2015-02-10T13:45:23+00:00",
                  "type": "revocation",
                  "provider": "A"
            },
            {
                  "number": "45875660609",
                  "name": "Ranga",
                  "date": "2015-02-11T13:45:23+00:00",
                  "type": "grant",
                  "provider": "B",
                  "period": 2
            }]


            var output = []
            var expectedOutput = {
                  "45875660609": {
                        "provider": "B",
                        "subscriptions": {
                              "A": [
                                    {
                                          "startDate": "2015-01-10T13:45:23+00:00",
                                          "endDate": "2015-02-10T13:45:23.000Z"
                                    }
                              ],
                              "B": [
                                    {
                                          "startDate": "2015-02-11T13:45:23+00:00",
                                          "endDate": "2015-04-11T13:45:23.000Z"
                                    }
                              ]
                        }
                  },
            }
            var output = app.applySubscriptions(dummyData);

            expect(JSON.stringify(output)).equal(JSON.stringify(expectedOutput));

      });

      it("If Provider A issues a grant to user for 3 months then revokes it after 2 months and then provider B's grant is rejected if it is before revoke", function () {
            var dummyData = [{
                  "number": "45875660609",
                  "name": "Ranga",
                  "date": "2015-01-10T13:45:23+00:00",
                  "type": "grant",
                  "provider": "A",
                  "period": 3
            },
            {
                  "number": "45875660609",
                  "name": "Ranga",
                  "date": "2015-02-9T13:45:23+00:00",
                  "type": "grant",
                  "provider": "B",
                  "period": 2
            },
            {
                  "number": "45875660609",
                  "name": "Ranga",
                  "date": "2015-02-10T13:45:23+00:00",
                  "type": "revocation",
                  "provider": "A"
            }]


            var output = []
            var expectedOutput = {
                  "45875660609": {
                        "provider": "",
                        "subscriptions": {
                              "A": [
                                    {
                                          "startDate": "2015-01-10T13:45:23+00:00",
                                          "endDate": "2015-02-10T13:45:23.000Z"
                                    }
                              ]
                        }
                  },
            }
            var output = app.applySubscriptions(dummyData);

            expect(JSON.stringify(output)).equal(JSON.stringify(expectedOutput));

      });
});

