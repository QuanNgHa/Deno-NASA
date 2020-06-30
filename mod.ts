import { Application } from "https://deno.land/x/oak@v5.0.0/mod.ts";

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

app.use(async (ctx, next) => {
  ctx.response.body = `
  {___     {__      {_         {__ __        {_       
  {_ {__   {__     {_ __     {__    {__     {_ __     
  {__ {__  {__    {_  {__     {__          {_  {__    
  {__  {__ {__   {__   {__      {__       {__   {__   
  {__   {_ {__  {______ {__        {__   {______ {__  
  {__    {_ __ {__       {__ {__    {__ {__       {__ 
  {__      {__{__         {__  {__ __  {__         {__
                  Mission Control API`;
  await next();
});

if (import.meta.main) {
  //App will run at http://localhost:8000/
  app.listen({
    port: PORT,
  });
}
