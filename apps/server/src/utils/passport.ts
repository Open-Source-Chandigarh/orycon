import prisma from "@osc/prisma";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import userController from "../controller/user.controller";

passport.serializeUser(function (user: any, done) {
  done(null, user.id); // store only user id in session
});

// user.id type is set to string
passport.deserializeUser(async function (id: string, done: any) {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user); // fetch full user from db
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_OAUTH_CLIENTID! || "your_client_id",
      clientSecret: process.env.GITHUB_OAUTH_SECRET! || "your_client_secret",
      callbackURL:
        process.env.GITHUB_CALLBACK_URL! ||
        "http://localhost:8000/api/v1/users/oauth/redirect/github",
      passReqToCallback: true,
      scope: ["user", "repo"],
    },
    async function (
      req: any,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any,
    ) {
      //TODO: just complete the user authentication with the controller
      const username = profile.username || profile._json.login;
      const email = profile.emails?.[0]?.value;
      let name = profile._json.name;

      const dbUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      let user;
      if (dbUser) {
        await userController.handleOAuthLogin({
          id: dbUser.id,
          email: dbUser.email,
          rollNumber: dbUser.rollnumber || "",
        });
        user = dbUser;
      } else {
        if (!name) {
          name = username;
        }
        const newUser = await userController.handleOAuthSignup(name, email);
        console.log("user created");
        user = newUser;
      }

      return done(null, user);
    },
  ),
);
