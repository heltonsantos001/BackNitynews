import cron from 'node-cron';
import { getnewsApiCurrentsAPI, getnewsApiMediastack, getArticles} from '../Controller/ControllerApisNews.js';
import { EnvitNewsLetter } from '../Controller/ControllerEmail.js';
import prisma from '../DataBase/PrismaClient.js';

// Cron job para rodar a cada hora
cron.schedule('0 * * * *', async () => {
  try {
    // Obter todos os e-mails não confirmados com horarioDeRegistro superior a 1 hora
    const expiredEmails = await prisma.newsletter.findMany({
      where: {
        emailConfirmado: false,
        horarioDeRegistro: {
          lt: new Date(new Date().getTime() - 60 * 60 * 1000), // 1 hora atrás
        },
      },
    });

    // Excluir os e-mails expirados
    for (const email of expiredEmails) {
      await prisma.newsletter.delete({
        where: {
          id: email.id,
        },
      });
      
    }
  } catch (error) {
    console.error('Erro ao excluir e-mails não confirmados:', error);
  }
});

 cron.schedule('20 * * * *', async () => {
  console.log('⏰ Iniciando o processo de busca e salvamento de notícias...');

  try {
    console.log('🔹 Buscando notícias da API Mediastack...');
    await getnewsApiMediastack();
    console.log('✅ Notícias da API Mediastack processadas com sucesso.');

    console.log('🔹 Buscando notícias da API CurrentsAPI...');
    await getnewsApiCurrentsAPI();
    console.log('✅ Notícias da API CurrentsAPI processadas com sucesso.');

    console.log('🔹 Buscando notícias da API getArticle...');
    await getArticles();
    console.log('✅ Notícias da API CgetArticle processadas com sucesso.');

    console.log('🚀 Processo de busca e salvamento concluído com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao executar os cron jobs:', error.message);
  }
});


cron.schedule('20 * * * *', async () => {
  console.log('⏰ Iniciando o processo de busca e salvamento de notícias...');

  try {
    console.log('🔹 enviando emails');
    await EnvitNewsLetter();
    console.log('✅ emails enviado com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao executar os cron jobs:', error.message);
  }
});
