import { Application, send } from "https://deno.land/x/oak@v5.0.0/mod.ts";

import api from "./api.ts";

//Application has two method: .listen() & .use() to register middlewares with OAK
const app = new Application();
const PORT = 8000;

//ctx = context: object which contains current state of the application
//like (req, res, state, cookies)

//Adding Middleware; usually middleware is async
app.use(async (ctx, next) => {
  await next();
  const time = ctx.response.headers.get("X-Response-Time");
  console.log(
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
  //App will run at http://localhost:8000/
  app.listen({
    port: PORT,
  });
}
