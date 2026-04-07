const passport = require("passport");
const users = require("../model/userauthmodel")
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const googleprovider = async () => {
    try {

        passport.use(new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:8080/api/v1/user/auth/google/callback"
        },
            async function (accessToken, refreshToken, profile, cb) {
                console.log("profile", profile)

                const userdata = await users.findOne({ email: profile.emails[0].value })

                if (!userdata) {
                    const user = await users.create({
                        name: profile.displayName,
                        email: profile?.emails[0]?.value,
                        profileid: profile.id,
                        isverify: profile._json.email_verified
                    })

                    return cb(null, user)
                }

                return cb(null, userdata)
            }
        ));

        passport.serializeUser(function (user, done) {
            done(null, user._id);
        });

        passport.deserializeUser(async function (_id, done) {
            try {
                const user = await users.findById(_id);

                if (user) {
                    done(null, user);
                } else {
                    done(new Error("User not found"), null);
                }
            } catch (err) {
                done(err, null);
            }
        });


    } catch (error) {
        console.log(error)
    }
}

module.exports = googleprovider;

// profile {
//   id: '106797025966165887777',
//   displayName: 'Chandani Kothiya',
//   name: { familyName: 'Kothiya', givenName: 'Chandani' },
//   emails: [ { value: 'kothiyachandani34@gmail.com', verified: true } ],
//   photos: [
//     {
//       value: 'https://lh3.googleusercontent.com/a/ACg8ocKm663sJLfo9yiUNT8zPmht6znStLWxJgrOEfrld4zHcjpTdQ=s96-c'
//     }
//   ],
//   provider: 'google',
//   _raw: '{\n' +
//     '  "sub": "106797025966165887777",\n' +
//     '  "name": "Chandani Kothiya",\n' +
//     '  "given_name": "Chandani",\n' +
//     '  "family_name": "Kothiya",\n' +
//     '  "picture": "https://lh3.googleusercontent.com/a/ACg8ocKm663sJLfo9yiUNT8zPmht6znStLWxJgrOEfrld4zHcjpTdQ\\u003ds96-c",\n' +
//     '  "email": "kothiyachandani34@gmail.com",\n' +
//     '  "email_verified": true\n' +
//     '}',
//   _json: {
//     sub: '106797025966165887777',
//     name: 'Chandani Kothiya',
//     given_name: 'Chandani',
//     family_name: 'Kothiya',
//     picture: 'https://lh3.googleusercontent.com/a/ACg8ocKm663sJLfo9yiUNT8zPmht6znStLWxJgrOEfrld4zHcjpTdQ=s96-c',
//     email: 'kothiyachandani34@gmail.com',
//     email_verified: true
//   }
// }