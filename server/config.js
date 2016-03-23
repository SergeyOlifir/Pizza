/*Accounts.loginServiceConfiguration.insert({
    service: "google",
    clientId: "230946388558-sg7u2d1avr28pcqr9s84g6c8am9ucd0n.apps.googleusercontent.com",
    secret: "-g1qe4PD1SeYl_rh2Qt07ACt"
});*/

Meteor.startup( function() {
    process.env.MAIL_URL = "smtp://postmaster%40sandbox53a2df30e4ef479d8e277f154319a9c7.mailgun.org:27792e8ef609112a5171c66a62ebda86@smtp.mailgun.org:587";
});
