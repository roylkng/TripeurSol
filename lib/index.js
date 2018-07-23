const fs = require("fs")
const util = require('util')
const users = require("./../data/accounts.json").users
const airtelPlans = require("./../data/airtel.json")
const jioPlans = require("./../data/jio.json")


var getOfferUsageForUsers = () => {
    console.log("Starting processing for User at ", new Date())
    console.log(users)
    console.log("For the follwing offers")
    
    try {
        //getting all users and storing by their mobile number as key
        //for scale up all numbers can be loaded in redis
        var userByNumber = {}
        for (let user of users) {
            userByNumber[user.number] = user.name
        }


        //load all offers applied by providers
        //supposing in case of production we get this from api request and cannot apply for backdated
        //data validation also in parseData

        var offers = []
        offers = parseData(airtelPlans.revocations, "revocation", "airtel", userByNumber, offers)
        offers = parseData(airtelPlans.grants, "grant", "airtel", userByNumber, offers)
        offers = parseData(jioPlans.revocations, "revocation", "jio", userByNumber, offers)
        offers = parseData(jioPlans.grants, "grant", "jio", userByNumber, offers)
        console.log(offers)
        //if api are realtime, time is actual time of arrival of offer then sortData is not reqiured
        offers = sortData(offers)


        // apply offers based on the rules of grant and revoke
        //main apply logic
        const userOffers = applySubscriptions(offers)


        var retval = getTotalSubscriptionDays(userOffers, userByNumber)
        console.log("Successfully ran, upadted result.json with output at ", new Date())
    } catch (err) {
        console.log("Well, theres no good way to say it but theres a bug in the code. Check the log below")
        console.log(err)
    }



}


var parseData = exports.parseData = (data, type, provider, userByNumber, collection) => {
    for (let plan of data) {
        //validations for the offers data
        if (plan && plan.number && plan.date && userByNumber[plan.number] && ((type == "grant" && plan.period) || type == "revocation")) {
            var temp = {
                number: plan.number,
                name: userByNumber[plan.number],
                date: plan.date,
                type: type,
                provider: provider,
                period: plan.period
            }
            collection.push(temp);
        }

    }

    return collection
}

var sortData = collection => {
    collection.sort((b, a) => {
        if (parseInt(new Date(a.date).getTime()) < parseInt(new Date(b.date).getTime())) {
            return 1
        } else if (new Date(a.date).getTime() == new Date(b.date).getTime()) {
            if (a.type == "revocation" && b.type == "revocation") {
                return 0
            } else if (b.type == "revocation") {
                return -1
            } else if (a.type == "revocation") {
                return 1
            }
            return 0
        } else {
            return -1;
        }
    })
    return collection
}




var applySubscriptions = (offers, userByNumber) => {
    var usersWithOffers = {}
    for (let offer of offers) {
        // handle revocations by the providers
        if (offer.type == "revocation") {
            //revocation only valid if user alreay subscribed to the same provider
            if (usersWithOffers[offer.number] && usersWithOffers[offer.number].provider == offer.provider) {
                // free the user
                usersWithOffers[offer.number].provider = "";
                //change the end date for the offer to revocation date if offer s still going on
                if (new Date(usersWithOffers[offer.number].subscriptions[offer.provider][usersWithOffers[offer.number].subscriptions[offer.provider].length - 1].endDate).getTime() > new Date(offer.date).getTime()) {
                    usersWithOffers[offer.number].subscriptions[offer.provider][usersWithOffers[offer.number].subscriptions[offer.provider].length - 1].endDate = new Date(offer.date)
                }
            }
        }
        //handle grants by the providers
        if (offer.type == "grant") {
            // if user is already subscribed 
            if (usersWithOffers[offer.number] && usersWithOffers[offer.number].provider == offer.provider) {
                //if prevoius offer is still on then add the offer period else add anther offer with the time and period for it
                if (new Date(usersWithOffers[offer.number].subscriptions[offer.provider][usersWithOffers[offer.number].subscriptions[offer.provider].length - 1].endDate).getTime() > new Date(offer.date).getTime()) {
                    usersWithOffers[offer.number].subscriptions[offer.provider][usersWithOffers[offer.number].subscriptions[offer.provider].length - 1].endDate = new Date(new Date(usersWithOffers[offer.number].subscriptions[offer.provider][usersWithOffers[offer.number].subscriptions[offer.provider].length - 1].endDate).setMonth(new Date(usersWithOffers[offer.number].subscriptions[offer.provider][usersWithOffers[offer.number].subscriptions[offer.provider].length - 1].endDate).getMonth() + offer.period))
                } else {
                    usersWithOffers[offer.number].subscriptions[offer.provider].push({
                        startDate: offer.date,
                        endDate: new Date(new Date(offer.date).setMonth(new Date(offer.date).getMonth() + offer.period))
                    })
                }
            } else if (usersWithOffers[offer.number] && usersWithOffers[offer.number].provider == "") {
                //if the user is free then allocate the offer, if there push to offer transaction or create new one
                if (usersWithOffers[offer.number].subscriptions[offer.provider]) {
                    usersWithOffers[offer.number].subscriptions[offer.provider].push({
                        startDate: offer.date,
                        endDate: new Date(new Date(offer.date).setMonth(new Date(offer.date).getMonth() + offer.period))
                    })
                } else {
                    usersWithOffers[offer.number].subscriptions[offer.provider] = [{
                        startDate: offer.date,
                        endDate: new Date(new Date(offer.date).setMonth(new Date(offer.date).getMonth() + offer.period))
                    }]
                }
                usersWithOffers[offer.number].provider = offer.provider

            } else if (usersWithOffers[offer.number] && usersWithOffers[offer.number].provider != "" && usersWithOffers[offer.number].provider != offer.provider) {
                // do nothing if user has been allocated offer from another provider
            } else {
                //if none of the case allocate the offer to user
                usersWithOffers[offer.number] = {
                    provider: offer.provider,
                    subscriptions: {
                        [offer.provider]: [{
                            startDate: offer.date,
                            endDate: new Date(new Date(offer.date).setMonth(new Date(offer.date).getMonth() + offer.period))
                        }]
                    }
                }
            }
        }
    }
    return usersWithOffers
}

var getTotalSubscriptionDays = (userOffers, userByNumber) => {
    var output = {}
    for (let user of users) {
        output[user.name] = {}
        if (userOffers[user.number] && userOffers[user.number].subscriptions) {
            //get date for each providers
            for (let i in userOffers[user.number].subscriptions) {
                for (var dates of userOffers[user.number].subscriptions[i]) {
                    let time = new Date(dates.endDate).getTime() - new Date(dates.startDate).getTime()
                    //convert milliseconds to days
                    var days = Math.round(time / (24 * 60 * 60 * 1000))
                    if (output[user.name]) {
                        if (output[user.name][i]) {
                            output[user.name][i] += days
                        } else {
                            output[user.name][i] = days
                        }
                    } else {
                        output[user.name] = {
                            [i]: days
                        }
                    }
                }
                // let time = new Date(userOffers[user.number].subscriptions[i].endDate).getTime() - new Date(userOffers[user.number].subscriptions[i].startDate).getTime()
            }
        }
    }
    output = JSON.stringify(output)
    fs.writeFile('output/result.json', output, 'utf8', (err) => {
        return err ? err : true;
    })
}

//exporting for testing
module.exports = {
    applySubscriptions: applySubscriptions,
    parseData: parseData,
    sortData: sortData
}

getOfferUsageForUsers()
