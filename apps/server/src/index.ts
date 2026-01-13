import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
// import "dotenv/config";
import passport from "passport";
import "./utils/passport";
import type { Express } from "express";
import morgan from "morgan";
import { v1Router } from "./routes/v1";

const app: Express = express();
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 200,
  message: "Too many requests from this IP, please try again after 10 minutes",
});
app.use(morgan("dev") as any);
//websecurity
app.use(helmet());
app.use("/api", limiter);
app.use(hpp() as any);
app.use(
  require("express-session")({
    secret: "TTL",
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // true if using HTTPS
      sameSite: "lax", // "none" if cross-origin over HTTPS
    },
  }),
);
app.use(passport.initialize() as any);
app.use(passport.session());

//express middlewares
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "device-remeber-token",
      "Origin",
      "Accept",
    ],
  }),
);

// Mount API v1 routes
app.use("/api/v1", v1Router);

//error handling

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Backend of the OSC Internal Tool API ",
    version: "1.0.0",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "developmet",
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  });
});
app.get("/health", async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy!",
    timestamp: new Date(),
    environment: process.env.NODE_ENV || "development",
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  });
});

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log({
    error: error,
    message: "Error: " + error.message,
    loggingLevel: "error",
  });
  console.log({
    error: error,
    message: "Stack: " + error.message,
    loggingLevel: "error",
  });

  if (error.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      message: "Validation Error",
      details: error.message,
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      status: "error",
      message: "Invalid ID format",
      user: "SYSTEM",
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      status: "error",
      message: "Duplicate key error",
      user: "SYSTEM",
    });
  }

  // Default error response
  res.status(error.status || 500).json({
    status: "error",
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log({
    message: "application started on port 8000",
    loggingLevel: "info",
    error: null,
  });
  console.log("application started on port 8000");
});

server.setTimeout(0);
export { app as default };
