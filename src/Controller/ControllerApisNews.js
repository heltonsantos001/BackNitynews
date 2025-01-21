import { Mediastack, CurrentsAPI, ProcessingNews, fetchDevToArticles, traduzirParaPortugues} from "../Service/ApisNewsService.js"
import { createNoticia } from "../Service/NewsService.js";

const processNewsData = (newsData) => {
    // Verifica se as notícias são um array válido
    if (newsData.success && Array.isArray(newsData.noticias)) {
      return newsData.noticias.map((article) => {
        return {
          id: article.id || article._id, // Garantir um ID único
          title: article.title || 'Sem título', // Garantir título
          description: article.description || 'Sem descrição', // Garantir descrição
          url: article.url || article.link || 'Sem URL', // Garantir URL
          image: article.image || article.image_url || 'Sem imagem', // Garantir imagem
          language: article.language || 'pt',
          published: article.published || article.published_at || 'Sem data', // Garantir data de publicação
        };
      });
    }
    return []; // Retorna um array vazio se não for um array válido
  };
  
  export const getnewsApiMediastack = async () => {
    try {
      const newsData = await Mediastack();
      const newsFilter = processNewsData(newsData);
  
      if (newsFilter.length > 0) {
        const novanews = ProcessingNews(newsFilter);
        await createNoticia(novanews)
        return;
      } else {
        return{
          success: false,
          message: 'Nenhuma notícia encontrada.',
        };
      }
    } catch (error) {
      return{
        success: false,
        message: 'Erro no servidor ao buscar notícias.',
        error: error.message,
      };
    }
  };
  
  export const getnewsApiCurrentsAPI = async () => {
    try {
      const newsData = await CurrentsAPI();
      const newsFilter = processNewsData(newsData);
  
      if (newsFilter.length > 0) {
        const novanews = ProcessingNews(newsFilter);
        await createNoticia(novanews);
        return;
      } else {
        return{
          success: false,
          message: 'Nenhuma notícia encontrada.',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erro no servidor ao buscar notícias.',
        error: error.message,
      };
    }
  };

  export const getArticles = async () => {
    try {
      // Busca os artigos da API Dev.to
      const artigos = await fetchDevToArticles();
  
      // Processa os artigos diretamente
      const artigosFormatados = await Promise.all(artigos.map(async (artigo) => {
        const tituloTraduzido = await traduzirParaPortugues(artigo.title || 'Sem título');
        const descricaoTraduzida = await traduzirParaPortugues(artigo.description || 'Sem descrição');
  
        return {
          id: artigo.id || artigo._id || 'Sem ID',
          title: tituloTraduzido,
          description: descricaoTraduzida,
          url: artigo.url || artigo.link || 'Sem URL',
          image: artigo.cover_image || artigo.social_image || 'Sem imagem',
          language: 'pt', // Define o idioma como português
          published: artigo.published_at || 'Sem data',
        };
      }));
  
      // Verifica se há artigos formatados
      if (artigosFormatados.length > 0) {
        // Processa e cria as notícias no banco
        const novanews = ProcessingNews(artigosFormatados);
        await createNoticia(novanews);
        return {
          success: true,
          message: 'Notícias processadas e salvas com sucesso.',
        };
      } else {
        return {
          success: false,
          message: 'Nenhuma notícia encontrada.',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Erro no servidor ao buscar artigos.',
        error: error.message,
      };
    }
  };
  
