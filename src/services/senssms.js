const accountSid = process.env.TWILIIO_SID;
const authToken = process.env.TWILIIO_TOKEN;
const client = require('twilio')(accountSid, authToken);

const sendSMS = (phone_no, otp) => {
    try {
        client.messages
            .create({
                body: 'Your Otp is' + otp,
                messagingServiceSid: 'MGa9d957693885510934d03c3330fdd5c0',
                to:'+91' + phone_no, // From a valid Twilio number
            })
            .then((message) => console.log(message));
    } catch (error) {
        console.log("error at smssend"+error)
    }
}

module.exports = sendSMS