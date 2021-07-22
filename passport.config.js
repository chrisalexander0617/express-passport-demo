const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt');

 function init(passport, getUserByEmail){
    const authenticateUser = async ( email, password, done ) => {
        //returns user by email
        const user = getUserByEmail(email)

        if(user == null){
            return done(null, false, {message:"no user found with that email"});
        }

        try {
            if( await bcrypt.compare(password, user.password)){
                return done(null,user)
            } else {
                return done(null, false, {message:"Password incorrect"})
            }
        } catch (error) {
            return done(error)
        }
    }
    passport.use(new LocalStrategy({usernameField: 'email', }, authenticateUser ))
    passport.serializeUser( (user, done) => { })
    passport.serializeUser( (id, done) => { })

}


module.exports = init;