import express from 'express';
import routes from './routes';
import './database';

/**
 * Setup inicial para a criacao do servidor da api
 * @author Lucas Koch
 */
class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  /**
   * Seta na camada de middleware que a api utiliza o padrao JSON para
   * comunicacao
   */
  middlewares() {
    this.server.use(express.json());
  }

  /**
   * Inicializa as rotas da api
   */
  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
