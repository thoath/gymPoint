import { Router } from 'express';
import authMiddleware from './app/middlewares/auth';
import authAdmMiddleware from './app/middlewares/authAdm';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import ContractController from './app/controllers/ContractController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpController from './app/controllers/HelpController';

const routes = new Router();

/**
 * Rotas que nao precisam de autorizacao para serem usadas.
 */
routes.post('/students/:id/checkin', CheckinController.store);
routes.post('/login', SessionController.store);

/**
 * Rotas para serem usadas por aluno
 */

routes.post('/students/:id/help', HelpController.store);

/**
 * A partir daqui, todas as rotas precisam estar autenticadas.
 */
routes.use(authMiddleware);

/**
 * Rota de ajuda aos alunos
 */
routes.put('/students/help/:id', HelpController.update);

/**
 * A partir daqui, todas as rotas precisam estar autenticadas como administrador
 */
routes.use(authAdmMiddleware);

/**
 * Rotas de manutencao de estudantes
 */
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

/**
 * Rotas de usuarios administradotes
 */
routes
  .route('/user')
  .post(UserController.store)
  .put(UserController.update);

/**
 * Rotas de planos da academia
 */
routes
  .route('/contract')
  .get(ContractController.index)
  .post(ContractController.store);
routes
  .route('/contract/:id')
  .put(ContractController.update)
  .delete(ContractController.delete);

/**
 * Rotas de matriculas da academia
 */
routes
  .route('/registration')
  .get(RegistrationController.index)
  .post(RegistrationController.store);
routes
  .route('/registration/:id')
  .put(RegistrationController.update)
  .delete(RegistrationController.delete);

/**
 * rotas de checkins de alunos
 */
routes.get('/students/:id/checkin', CheckinController.index);

export default routes;
