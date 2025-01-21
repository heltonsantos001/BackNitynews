import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config(); 
import prisma from "../DataBase/PrismaClient.js";

export const sendConfirmationEmail = async (email, token) => {
  try
  {
    const url = `${process.env.BASE_URL}/confirm-email/${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // Use true se estiver usando SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirme seu email',
      html: `<p>Por favor, clique no link abaixo para confirmar seu email:</p><a href="${url}">${url}</a>`,
    };
  
    const info = await transporter.sendMail(mailOptions);
    return {
      message: info.response,
      sucesso: true,
    };
  } catch (error) {
    return {
      message: error.message,
      sucesso: false,
      status: 500,
    };
  }
};

export const CreateNewsLetterService = async ({ Email }) => {
    try {
     
      const existingNewsletter = await prisma.newsletter.findUnique({
        where: { email: Email },
      });
  
      if (existingNewsletter) {
        return {
          message: "E-mail já cadastrado.",
          sucesso: false,
          status: 400,
        };
      }
  
      const newsletter = await prisma.newsletter.create({
        data: {
          email: Email,
        },
      });
  
      return {
        message: "Newsletter criada com sucesso.",
        sucesso: true,
        data: newsletter
      };
    } catch (error) {
      return {
        message: error.message,
        sucesso: false,
        status: 500,
      };
    }
};

export const confirmEmailNewsLetterService = async ({email})=>{
   
    try {

        const confirmEmail = await prisma.newsletter.update({
            where:{email:email},
            data:{
                emailConfirmado: true,
                ativo: true
            }
        })

        return {
          message: "Email confirmado com sucesso.",
          sucesso: true,
          data: confirmEmail
        };
      } catch (error) {
        return {
          message: error.message,
          sucesso: false,
          status: 500,
        };
      }
}

export const SendEmailWelcome = async (email) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, 
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"NityNews Tech" <${process.env.EMAIL_USER}`,
      to: email, 
      subject: "Bem-vindo(a) ao NityNews Tech!", 
      text: "Obrigado pela inscrição!", 
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #007bff;">Bem-vindo(a) ao NityNews Tech! 🚀</h2>
          <p>Olá,</p>
          <p>Estamos muito felizes por você fazer parte do <b>NityNews Tech</b>! 🎉</p>
          <p>A partir de agora, você receberá as melhores notícias e atualizações sobre o mundo da tecnologia diretamente no seu e-mail. Nossa missão é mantê-lo(a) sempre informado(a) sobre as últimas tendências, inovações e insights do universo tecnológico.</p>
          <h3>O que você pode esperar:</h3>
          <ul>
            <li>🌟 <b>Notícias exclusivas</b> e análises detalhadas.</li>
            <li>🚀 Dicas e novidades sobre startups e grandes players.</li>
            <li>📅 Resumo semanal para que você não perca nada!</li>
          </ul>
          <p>Fique atento(a) ao seu e-mail, e não hesite em nos contatar caso tenha dúvidas ou sugestões. Estamos aqui para garantir que sua experiência seja incrível!</p>
          <p>Obrigado por confiar no NityNews Tech. Vamos explorar o futuro juntos!</p>
          <p>Atenciosamente,</p>
          <p><b>Equipe NityNews Tech</b></p>
          <p><a href="https://nitynews.vercel.app" style="color: #007bff; text-decoration: none;">nitynews.tech</a> | contato@nitynews.tech</p>
        </div>
      `, 
    });

    return { 
      message: "E-mail enviado com sucesso!" + info.response,
      sucesso: true
    }; 
  } catch (error) {
    return { 
      message: "Erro ao enviar email" + error.message,
      sucesso: false,
      status:500
    }; 
  }
};



export const enviarNoticiasParaEmails = async () => {
  try {
    // Configurar o transportador do Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // Se 'true', usa SSL/TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Buscar todos os e-mails ativos no banco de dados
    const emailsAtivos = await prisma.newsletter.findMany({
      where: { ativo: true }, // Supondo que você tenha um campo 'ativo'
      select: { email: true }, // Retorna apenas os e-mails
    });

    if (emailsAtivos.length === 0) {
      console.log("Nenhum e-mail ativo encontrado.");
      return { message: "Nenhum e-mail ativo para enviar notícias.", sucesso: false };
    }

    // Buscar todas as notícias no banco de dados
    const noticias = await prisma.news.findMany({
      orderBy: { dataPublicacao: "desc" }, // Ordenar por data mais recente
    });

    if (noticias.length === 0) {
      console.log("Nenhuma notícia encontrada.");
      return { message: "Nenhuma notícia para enviar.", sucesso: false };
    }

    // Criar o conteúdo HTML com as notícias
    const noticiasHtml = noticias
    .map((noticia) => {
      // Verificações para evitar valores nulos ou vazios
      const imagemHtml = noticia.imagem
        ? `<img src="${noticia.imagem}" alt="Imagem da notícia" style="width: 100%; max-height: 300px; object-fit: cover; margin-bottom: 10px;" />`
        : "";
  
      const fonteHtml = noticia.fonte
        ? `<p style="font-size: 12px; color: #666; margin: 5px 0;">Fonte: ${noticia.fonte}</p>`
        : "";
  
      const dataPublicacaoHtml = noticia.dataPublicacao
        ? `<p style="font-size: 12px; color: #666; margin: 5px 0;">Publicado em: ${new Date(noticia.dataPublicacao).toLocaleDateString()}</p>`
        : "";
  
      return `
        <div style="margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 20px;">
          ${imagemHtml}
          <h3 style="color: #007bff; margin: 10px 0;">${noticia.titulo}</h3>
          ${dataPublicacaoHtml}
          <p>${noticia.descricao}</p>
          ${fonteHtml}
          <a href="${noticia.url}" style="color: #007bff; text-decoration: none;">Leia mais</a>
        </div>
      `;
    })
    .join("");
  

    // Enviar e-mails para todos os usuários ativos
    for (const { email } of emailsAtivos) {
      const info = await transporter.sendMail({
        from: `"NityNews Tech" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "As últimas notícias do NityNews Tech! 🚀",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #007bff;">Últimas notícias do NityNews Tech! 🚀</h2>
            <p>Olá,</p>
            <p>Aqui estão as notícias mais recentes que selecionamos para você:</p>
            ${noticiasHtml}
            <p>Obrigado por fazer parte do <b>NityNews Tech</b>! Estamos sempre aqui para mantê-lo(a) atualizado(a).</p>
            <p>Atenciosamente,</p>
            <p><b>Equipe NityNews Tech</b></p>
            <p><a href="https://nitynews.vercel.app" style="color: #007bff; text-decoration: none;">nitynews.tech</a> | contato@nitynews.tech</p>
          </div>
        `,
      });

      console.log(`E-mail enviado para ${email}: ${info.response}`);
    }

    return { message: "E-mails enviados com sucesso!", sucesso: true };
  } catch (error) {
    console.error("Erro ao enviar e-mails:", error);
    return { message: "Erro ao enviar e-mails: " + error.message, sucesso: false, status: 500 };
  }
};
  