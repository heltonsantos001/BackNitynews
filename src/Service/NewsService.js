import prisma from "../DataBase/PrismaClient.js";

export const createNoticia = async(newsArray)=> {
    try {
        const newsPromises = newsArray.map((news) => {
          return prisma.news.create({
            data: {
              titulo: news.title,
              descricao: news.description,
              url: news.url,
              imagem: news.image,
              dataPublicacao: new Date(news.published),
              language: news.language,
            },
          });
        });
    
        
        await Promise.all(newsPromises);
      } catch (error) {
        console.log(error);
      }
}

export const getAllNews = async () => {
    try {
      // Busca todas as notícias no banco de dados
      const noticias = await prisma.news.findMany();
  
      return noticias; // Retorna as notícias encontradas
    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
      throw error; // Lança o erro para tratamento no nível superior
    }
  };
