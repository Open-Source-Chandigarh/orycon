import { Router } from "express";
import passport from "passport";
import userController from "../../controller/user.controller";
import verifyJWT from "../../middleware/auth.middleware";

export const userRouter = Router();

userRouter.get(
  "/oauth/github",
  passport.authenticate("github", { scope: ["user", "repo"] }),
);

userRouter.get(
  "/oauth/redirect/github",
  passport.authenticate("github", {
    failureRedirect:
      process.env.FRONTEND_URL_FAIL || "http://localhost:3000/auth/error",
    successRedirect:
      process.env.FRONTEND_URL_SUCCESS || "http://localhost:3000",
  }),
);
userRouter.get("/is-authenticated", verifyJWT, (req, res) => {
  const isAuthenticated = req.isAuthenticated();
  if (isAuthenticated) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});

userRouter.post("/signup", userController.handleEmailSignup);
userRouter.post("/login", userController.handleEmailLogin);
userRouter.post("/update", verifyJWT, userController.updateUserDetails); //incomplete in user.controller

export default userRouter;
