require('dotenv').config();
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;

exports.Passport = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  passport.use(
    new GitHubStrategy(
      {
        clientID: 'Ov23liLB16rsl5rkOzda',
        clientSecret: 'ef3124604e6a2ae8473c6b4c0a971baa88daaef5B',
        callbackURL: 'https://p2-28051690.onrender.com/github/callback',
      },
      function (accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
      }
    )
  );
};

exports.protectRoute = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const tokenAuthorized = await promisify(jwt.verify)(
        token,
        "https://oauth2.googleapis.com/token"
      );
      if (tokenAuthorized) {
        req.user = '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';
        return next();
      }
    } catch (error) {
      console.log(error);
    }
  }

  res.redirect("/login");
};

exports.protectRouteLogOut = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const tokenAuthorized = await promisify(jwt.verify)(
        token,
        "https://oauth2.googleapis.com/token"
      );
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
  const email = req.body.email;
  const password = req.body.password;
  if (email == "ejemplo@ejemplo.com" && password == "123456789") {
    const id = process.env.SECRET;
    const token = jwt.sign({ id: id }, "https://oauth2.googleapis.com/token", {
      expiresIn: '1h'
    });
    res.cookie("jwt", token);
    res.redirect("/contactos");
  } else {
    res.send({
      request: 'No existen sus credenciales para ingresar a los contactos.'
    });
  }
};
