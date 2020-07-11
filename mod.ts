import * as log from "https://deno.land/std/log/mod.ts";
import { Application, send } from "https://deno.land/x/oak@v5.0.0/mod.ts";

import api from "./api.ts";

//Application has two method: .listen() & .use() to register middlewares with OAK
const app = new Application();
const PORT = 8000;

//Setup a logger

await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("INFO"),
  },
  loggers: {
    default: {
      level: "INFO",
      handlers: ["console"],
    },
  },
});

//ctx = context: object which contains current state of the application
//such as (req, res, state, cookies)

//Adding Middleware; usually middleware is async

app.addEventListener("error", (event) => {
  //Final Error Handling
  log.error(event.error); //Make sure error as higher severity than info
});
//Error Handling Middleware
app.use(async (ctx, next) => {
  try {
    //Try all below Middlewares
    await next();
  } catch (err) {
    //Catching if any below middlewares encountering Errors

    ctx.response.body = "Internal Server Error"; //Some wrong in Server Side causing API Request failed

    throw err; //throw error for OAK to catch => app.addEventListener
  }
});

app.use(async (ctx, next) => {
  await next();
  const time = ctx.response.headers.get("X-Response-Time");
  log.info(
    `Method: ${ctx.request.method} with URL ${ctx.request.url}: ${time}`,
  );
});
app.use(async (ctx, next) => {
  const start = Date.now();
  //Calling the downsteam middleware (NASA printing) after start the timer
  await next();
  //Once the downstrame mddleware completed, we stop the timer
  const delta = Date.now() - start;
  //header with "X-" is non-standard header;
  //header usually is meta data of the response
  ctx.response.headers.set("X-Response-Time", `${delta} ms`);
});

//api.routes() = router.routes()
//router.routes(): return middleware that will do all the route processing
//that the router has been configured to handle.
//Will know which endpoint, say "/", "/planets", we should handle the request
app.use(api.routes());
//Will block other methods which dont specify in api.ts
app.use(api.allowedMethods());

//Back-End connection with Front-End Static File
//[Send] function from OAK to connect with Front-End
app.use(async (ctx) => {
  const filePath = ctx.request.url.pathname;
  //White-listing: ensure Deno serving the files which we are expected.
  const fileWhiteList = [
    "/index.html",
    "/javascripts/script.js",
    "/stylesheets/style.css",
    "/images/favicon.png",
  ];

  if (fileWhiteList.includes(filePath)) {
    await send(ctx, filePath, {
      //Deno.cwd = current working directory path where we run "deno run" command
      root: `${Deno.cwd()}/public`,
    });
  }
});

if (import.meta.main) {
  log.info(`Starting server on port ${PORT}....`);
  //App will run at http://localhost:8000/
  //To listen to API requests
  await app.listen({
    port: PORT,
  });
}
