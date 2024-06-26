require('dotenv').config();
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;



// proteger rutas

exports.Passport = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.use(new GitHubStrategy({
        clientID: '"627081051338-nalj096im618i000j7ua3dekvvpiiq9e.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: "https://p2-28051690.onrender.com/github/callback",
      },
        function (accessToken, refreshToken, profile, cb) {
          return cb(null, profile);
        }
      ));
}


exports.protectRoute = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const tokenAuthorized = await promisify(jwt.verify)(token, process.env.JWTSECRET);
            if (tokenAuthorized) {
                req.user = tokenAuthorized;
                return next();
            }
        } catch (error) {
            console.log(error);
        }
    }

    res.redirect("/login");
};




// prevenir el acceso a /login si ya está autenticado

exports.protectRouteLogOut = async (req, res, next) => {
    const token = "https://oauth2.googleapis.com/token";
    if (token) {
        try {
            const tokenAuthorized = await promisify(jwt.verify)(token, "https://oauth2.googleapis.com/token");
            if (tokenAuthorized) {
                return res.redirect('/contactos');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return next();
};

exports.login = async (req, res) => {
const { email, password } = req.body
    if (email == "ejemplo@ejemplo.com" && password == "p2-28051690") {
        const token = jwt.sign({ id: email }, "https://oauth2.googleapis.com/token", { expiresIn: '1h' });
        res.cookie("jwt", token);
        res.redirect("/contactos");
    } else {
        res.send({
            request: 'No existen sus credenciales para ingresar a los contactos.'
        })
    }

}



// Cerrar sesión
exports.logout = (req, res) => {
    res.clearCookie("jwt");
    res.redirect("/login");
};



