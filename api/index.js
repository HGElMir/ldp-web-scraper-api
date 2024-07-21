import getLink from "../functions/get.js";
import helloWorld from "../functions/pingHello.js";
import express from "express";
import { statusCheck } from "../functions/statusCheck.js";

const app = express ();
app.use(express.json());

const PORT = process?.env?.PORT || 3000;


/** Hello world */
 app.get("/", (request, response) => {

    response.send(helloWorld())

 })

 /** Get Download link */
 app.get("/getLink", async (request, response) => {

    response.send(await getLink())

 })

  /** Redirect to Download link */
  app.get("/getLink/redirect", async (request, response) => {

    const link = await getLink();

    if (link["status"] == 200){
        response.redirect(link["downloadLink"])
    }

    else{
        response.send(link)
    }

 })

/** Status Check */
  app.get("/status", (request, response) => {

    response.send(statusCheck())

 })

const server = app.listen(PORT, () => {
    console.warn("Server Listening on PORT:", PORT);
  });

server.timeout = 60 * 1000