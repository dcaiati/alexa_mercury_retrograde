/**
 * Mercury Retrograde Alexa Skill
 * modified by David Caiati from the Alexa Skills Kit color example. 
 * 4 Feb 2016
 * ------------------------------------------------------------------------------
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.f70fde39-f92e-4a6e-976a-b0dae14932fb") {
             context.fail("Invalid Application ID");
        }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    //getWelcomeResponse(callback);
    //getStatusToday(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {

    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    // There are no intents implimented yet - tbd

    if ("GetMercury" === intentName) {
        console.log('getMercury');
        getStatusToday(callback);
    } else if ("AMAZON.StartOverIntent" === intentName) {
        getStatusToday(callback);
    } else if ("AMAZON.RepeatIntent" === intentName) {
        handleRepeatRequest(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        handleGetHelpRequest(intent, session, callback);
    } else if ("AMAZON.StopIntent" === intentName) {
        handleFinishSessionRequest(intent, session, callback);
    } else if ("AMAZON.CancelIntent" === intentName) {
        handleFinishSessionRequest(intent, session, callback);
    } else {
        getStatusToday(callback);
        //throw "Invalid intent";
    }

}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

//function getWelcomeResponse(callback) {
function getStatusToday(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Mercury Retrograde?";
   
    var speechOutput = doWheresMercury(); 
    
    var repromptText = "";
    var shouldEndSession = true;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Sets the color in the session and prepares the speech to reply to the user.
 */


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}

/** Mercury Retrograde custom code **/
function getRetrogradeStatus(now) {

    // static values for now. Eventually, this should impliment something like the swiss ephemeris
    var mDates = [
        {dateIn:"20160428", dateOut:"20160522",start:"Taurus"},
        {dateIn:"20160830", dateOut:"20160922",start:"Virgo"},
        {dateIn:"20161219", dateOut:"20170108",start:"Capricorn"},
        {dateIn:"20170409", dateOut:"20170503",start:"Taurus"},
        {dateIn:"20170812", dateOut:"20170905",start:"Leo"},
        {dateIn:"20171203", dateOut:"20171222",start:"Sagittarius"},
        {dateIn:"20180322", dateOut:"20180415",start:"Aries"},
        {dateIn:"20180726", dateOut:"20180818",start:"Leo"},
        {dateIn:"20181116", dateOut:"20181206",start:"Sagittarius"},
        {dateIn:"20190305", dateOut:"20190328",start:"Pisces"},
        {dateIn:"20190707", dateOut:"20190731",start:"Leo"},
        {dateIn:"20191031", dateOut:"20191120",start:"Scorpio"},
        {dateIn:"20200218", dateOut:"20200309",start:"Pisces"},
        {dateIn:"20200617", dateOut:"20200712",start:"Cancer"},
        {dateIn:"20201013", dateOut:"20201103",start:"Scorpio"},
    ];

    var check = getCheckDate(now);

    var status = 0;
    var detail = null;

    for (var i=0; i<mDates.length; i++) {
        if ((check >= mDates[i].dateIn) && (check <=mDates[i].dateOut)) {
            status = 1;
            detail = mDates[i];
            break;
        } else {
            if (check < mDates[i].dateIn) { 
                detail = mDates[i];
                break;
            }
        }
    }

    var ret = {status:status,detail:detail}; 
    return ret;

}

function getCheckDate(check,pretty) {

    if (typeof check == 'undefined') {
        var today = new Date();
    } else {
        var d = check;
        if (!isNaN(check)) {
            d = check.substr(0,4)+"/"+check.substr(4,2)+"/"+check.substr(6);
        }

        today = new Date(d);
    }
console.log(today);
    var dd = today.getDate();
    var mm = today.getMonth()+1; // january = 0
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd;
    } 

    if(mm<10) {
        mm='0'+mm;
    } 

    var ret;
    if (pretty) {
        ret = yyyy+"-"+mm+"-"+dd; 
    } else {
        ret = yyyy+mm+dd; 
    }
    return ret;
}

function doWheresMercury() {

    //var test = "2016/05/01";
    //response = getRetrogradeStatus(test);
    response = getRetrogradeStatus();
    console.log(response);
    var nextDate;
    var ret = "";
    if (response.status == 1) {
        nextDate = getCheckDate(response.detail.dateOut,true);
        nd = new Date(nextDate);
        ret = "Mercury is Retrograde until "+ nd.toDateString() +".\n It entered in the sign of "+response.detail.start + ".";
    } else {
        nextDate = getCheckDate(response.detail.dateIn,true);
        nd = new Date(nextDate);
        ret = "Mercury is not Retrograde.\n It will go Retrograde on " + nd.toDateString() + " in the sign of "+response.detail.start + ".";
    }

    console.log(ret);
    return ret;
}
