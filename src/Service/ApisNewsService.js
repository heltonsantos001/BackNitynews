import axios from 'axios';
import moment from 'moment';
import dotenv from 'dotenv';
dotenv.config(); 

export const fetchTechnologyNews = async () => {
  try {
    const query = 'software OR hardware OR cloud OR programming';
    const response = await axios.get(`${process.env.URLBASE_NEWSAPI}/top-headlines`, {
      params: {
        category: query,
        language: 'en', // Buscando notícias em inglês
        apiKey: process.env.APIKEY_NEWSAPI,
      },
    });

    // Retorna as notícias diretamente sem tradução ou ordenação
    return response.data.articles;
  } catch (error) {
    console.error('Erro ao buscar notícias de tecnologia:', error.message);
    return [];
  }
};

  export const Mediastack = async () => {
    const apiKey = '2c7f5e45fad3a9f3ba2555cd6b42baf4'; // Substitua pela sua chave de API
    const url = `http://api.mediastack.com/v1/news?access_key=${apiKey}&categories=technology&languages=pt&sort=published_desc`;

  
    try {
      // Fazendo a requisição GET
      const response = await axios.get(url);
  
      // Retorna todos os dados recebidos da API
      if (response.data && response.data.data) {
        return {
          success: true,
          total: response.data.pagination.total, 
          noticias: response.data.data,        
        };
      } else {
        return { success: false, message: 'Nenhuma notícia encontrada.' };
      }
    } catch (error) {    
      return { success: false, message: error.message };
    }
  };


  export const CurrentsAPI = async () => {
    const apiKey = 'oQ6PCGcwBZPxrpt1-El9xoXcUSV_QovBeIwPE1jKIhrDZ6te'; // Substitua pela sua chave de API
    const url = `https://api.currentsapi.services/v1/search?keywords=tecnologia&language=pt&apiKey=${apiKey}`;
  
    try {
      // Fazendo a requisição GET
      const response = await axios.get(url);
  
      // Retorna todos os dados recebidos da API
      if (response.data && response.data.news) {
        return {
          success: true,
          totalNoticias: response.data.news.length,
          noticias: response.data.news,       
        };
      } else {
        return { success: false, message: 'Nenhuma notícia encontrada.' };
      }
    } catch (error) {    
      return { success: false, message: error.message };
    }
  };

export const fetchDevToArticles = async (page = 1, perPage = 15) =>{
    try {
        const response = await axios.get('https://dev.to/api/articles', {
            params: {
                per_page: perPage, // Número de artigos por página
                page: page         // Página dos resultados
            }
        });
        return response.data; // Retorna os artigos
    } catch (error) {
        throw new Error('Erro ao buscar artigos: ' + error.message);
    }
}

export const traduzirParaPortugues = async  (texto) => {
  try {
    const response = await axios.get('https://api.mymemory.translated.net/get', {
      params: {
        q: texto,          // Texto a ser traduzido
        langpair: "en|pt", // Detecta automaticamente e traduz para português
      },
    });

    return response.data.responseData.translatedText; // Texto traduzido
  } catch (error) {
    console.error('Erro ao traduzir:', error.message);
    throw new Error('Erro ao tentar traduzir o texto.');
  }
}

export const ProcessingNews = (news) => {
  try {

    const articles = news;

    // Filtrar notícias até 2 dias atrás
    const filteredArticles = articles.filter((article) => {
      const publishedDate = moment(article.published, "YYYY-MM-DD HH:mm:ss Z"); // Convertendo a data do artigo
      return publishedDate.isAfter(moment().subtract(2, 'days')); // Filtra notícias publicadas nos últimos 2 dias
    });

    // Organizar notícias: priorizar as mais completas
    const prioritizedArticles = filteredArticles.sort((a, b) => {
      const completenessA = [a.title, a.description, a.image, a.url].filter(Boolean).length;
      const completenessB = [b.title, b.description, b.image, b.url].filter(Boolean).length;
      return completenessB - completenessA; // Prioriza as mais completas, mas mantém todas as notícias
    });

    // Remover duplicatas (notícias sobre o mesmo assunto)
    const uniqueArticles = [];
    for (let i = 0; i < prioritizedArticles.length; i++) {
      const currentArticle = prioritizedArticles[i];
      let isDuplicate = false;

      for (let j = 0; j < uniqueArticles.length; j++) {
        const existingArticle = uniqueArticles[j];

        // Verificar se os títulos são semelhantes, você pode adicionar uma comparação mais avançada aqui
        if (currentArticle.title === existingArticle.title) {
          isDuplicate = true;
          break;
        }
      }

      if (!isDuplicate) {
        uniqueArticles.push(currentArticle);
      }
    }

    // Retorna as notícias organizadas e sem duplicatas
    return uniqueArticles;

  } catch (error) {
    console.error('Erro ao buscar ou processar notícias:', error.message);
    return [];
  }
};
