import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config(); 
import { generateConfirmationToken, verifyConfirmationToken } from '../Middleware/authMiddleware.js';
import { sendConfirmationEmail, CreateNewsLetterService, confirmEmailNewsLetterService, SendEmailWelcome } from "../Service/EmailService.js";
import { enviarNoticiasParaEmails } from "../Service/EmailService.js";
export const CreateNewsLetter = async (req, res)=>{
  try{
    const {Email} = req.body

    if(!Email){
      res.status(400).json({message: "Email não fornecido"});
    }
  
    const token = generateConfirmationToken(Email);

    if(!token){return res.status(401).send({message:"Erro ao gerar token"});}
  
     const newsletter = await CreateNewsLetterService({Email})
  
     if(!newsletter.sucesso){
        return res.status(newsletter.status).send({
          message: newsletter.message,
        })
     }

     const response = sendConfirmationEmail(Email, token);
  
     if(!response){
        return res.status(response.status).send(
          {
            messageEmail:response.message,
            messageNewsLetter: newsletter.message,         
          });
     }

     return res.send({
      messageEmail:response.message,
      messageNewsLetter: newsletter.message, 
     })

  }catch(ex){
    return res.status(500).send({message: ex.message});
  }
 
};

export const confirmEmail = async (req, res) => {

  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ error: 'Token não fornecido!' });
  }

  try {
    const decoded = verifyConfirmationToken(token);
    const { email } = decoded;

    const response = await confirmEmailNewsLetterService({email})

    if(!response.sucesso){
      return res.status(response.status).send(response.message);
    }

    const responseEmail = await SendEmailWelcome(email)

    if(!responseEmail.sucesso){
      return res.send({
        messageConfim: response.message,
        EmailWelcome:{
          message: responseEmail.message,
          status:responseEmail.status
        }
      })
    }

    return res.send({
      messageConfim: response.message,
      EmailWelcome:{
        message: responseEmail.message,
      }
    })

  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

export const EnvitNewsLetter = async (req, res)=>{
    const resultado = await enviarNoticiasParaEmails();
    res.status(200).json(resultado);
};