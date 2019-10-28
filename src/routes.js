import { Router } from 'express';
import authMiddleware from './app/middlewares/auth';
import authAdmMiddleware from './app/middlewares/authAdm';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import ContractController from './app/controllers/ContractController';
import RegistrationController from './app/controllers/RegistrationController';

const routes = new Router();

/**
 * Rotas que nao precisam de autorizacao para serem usadas.
 */
routes.post('/login', SessionController.store);

/**
 * A partir daqui, todas as rotas precisam estar autenticadas.
 */
routes.use(authMiddleware);

/**
 * Rotas de estudantes
 */

/**
 * A partir daqui, todas as rotas precisam estar autenticadas como administrador
 */
routes.use(authAdmMiddleware);

/**
 * Rotas de estudantes
 */
routes.post('/student', StudentController.store);
routes.put('/student/:id', StudentController.update);

/**
 * Rotas de usuarios administradotes
 */
routes.post('/user', UserController.store);
routes.put('/user', UserController.update);

/**
 * Rotas de planos da academia
 */
routes.get('/contract', ContractController.index);
routes.post('/contract', ContractController.store);
routes.put('/contract/:id', ContractController.update);
routes.delete('/contract/:id', ContractController.delete);

/**
 * Rotas de matriculas da academia
 */
routes.get('/registration', RegistrationController.index);
routes.post('/registration', RegistrationController.store);
routes.put('/registration', RegistrationController.update);
routes.delete('/registration', RegistrationController.delete);

export default routes;
