import { Router } from 'express';
import authMiddleware from './app/middlewares/auth';
import authAdmMiddleware from './app/middlewares/authAdm';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import ContractController from './app/controllers/ContractController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';

const routes = new Router();

/**
 * Rotas que nao precisam de autorizacao para serem usadas.
 */
routes.post('/students/:id/checkin', CheckinController.store);
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
routes.put('/registration/:id', RegistrationController.update);
routes.delete('/registration/:id', RegistrationController.delete);

/**
 * rotas de checkins de alunos
 */
routes.get('/students/:id/checkin', CheckinController.index);

export default routes;
