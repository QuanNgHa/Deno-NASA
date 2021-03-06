import { Router } from "./deps.ts";

import * as planets from "./models/planets.ts";
import * as launches from "./models/launches.ts";

//interface for registering middleware that will run when certain HTTP methods
//and paths are requested
const router = new Router();

router.get("/", (ctx) => {
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

router.get("/planets", (ctx) => {
  //throw new Error("Sample error");
  //ctx.throw(501, "Sorry planets are not available!");
  ctx.response.body = planets.getAllPlanets();
});

router.get("/launches", (ctx) => {
  ctx.response.body = launches.getAll();
});

//OAK knows the name after ":" will be a param in params
router.get("/launches/:id", (ctx) => {
  //params? return undefine if params field does NOT exist instead of error
  //(ctx.params?.id) equivalent to (ctx.params && ctx.params.id)
  if (ctx.params?.id) {
    //params.id will be string -> convert to number via Number()
    const launchesList = launches.getOne(Number(ctx.params.id));
    if (launchesList) {
      ctx.response.body = launchesList;
    } else {
      //Error 400 = Client Error
      ctx.throw(400, "Launch with that ID does not exist");
    }
  }
});

router.delete("/launches/:id", (ctx) => {
  if (ctx.params?.id) {
    const result = launches.removeOne(Number(ctx.params.id));
    ctx.response.body = { success: result };
  }
});

router.post("/launches", async (ctx) => {
  const body = await ctx.request.body();

  launches.addOne(body.value);

  ctx.response.body = { success: true };
  ctx.response.status = 201;
});

export default router;
