import { Application } from "https://deno.land/x/oak@v5.0.0/mod.ts";

//Application has two method: .listen() & .use() to register middlewares with OAK
const app = new Application();
const PORT = 8000;

//ctx = context: object which contains current state of the application
//like (req, res, state, cookies)
app.use((ctx) => {
  ctx.response.body = `
  {___     {__      {_         {__ __        {_       
  {_ {__   {__     {_ __     {__    {__     {_ __     
  {__ {__  {__    {_  {__     {__          {_  {__    
  {__  {__ {__   {__   {__      {__       {__   {__   
  {__   {_ {__  {______ {__        {__   {______ {__  
  {__    {_ __ {__       {__ {__    {__ {__       {__ 
  {__      {__{__         {__  {__ __  {__         {__
                  Mission Control API`;
});

if (import.meta.main) {
  //App will run at http://localhost:8000/
  app.listen({
    port: PORT,
  });
}
