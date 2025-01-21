import express from "express";
import { CreateNewsLetter } from "../Controller/ControllerEmail.js";
import { confirmEmail } from "../Controller/ControllerEmail.js";
import { getnewsApiMediastack, getnewsApiCurrentsAPI, getArticles } from "../Controller/ControllerApisNews.js";
const Router = express.Router();

Router.get("/CurrentsAPI", getnewsApiCurrentsAPI)
 
Router.get("/confirm-email/:token", confirmEmail)
Router.post("/create-newsletter", CreateNewsLetter);
Router.get("/Mediastack", getnewsApiMediastack)
Router.get("/Articles", getArticles)

export default Router