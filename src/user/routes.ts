"use strict";

import * as express from "express";
import { onlyLoggedIn } from "../token/passport";
import * as token from "../token/service";
import * as user from "./service";
import { ISessionRequest } from "./service";

/**
 * Modulo de seguridad, login/logout, cambio de contraseñas, etc
 */
export function initModule(app: express.Express) {
  app.route("/v1/user/password").post(onlyLoggedIn, changePassword);

  app.route("/v1/user").post(signUp);
  app.route("/v1/user/signin").post(login);
  app.route("/v1/user/signout").get(onlyLoggedIn, logout);
  app.route("/v1/users/:userID/grant").post(onlyLoggedIn, grantPermissions);
  app.route("/v1/users/:userID/revoke").post(onlyLoggedIn, revokePermissions);
  app.route("/v1/users/:userID/enable").post(onlyLoggedIn, enableUser);
  app.route("/v1/users/:userID/disable").post(onlyLoggedIn, disableUser);
  app.route("/v1/users").get(onlyLoggedIn, getAll);

  app.route("/v1/users/current").get(onlyLoggedIn, current);
}

/**
 * @api {post} /v1/user/password Cambiar Password
 * @apiName Cambiar Password
 * @apiGroup Seguridad
 *
 * @apiDescription Cambia la contraseña del usuario actual.
 *
 * @apiExample {json} Body
 *    {
 *      "currentPassword" : "{Contraseña actual}",
 *      "newPassword" : "{Nueva Contraseña}",
 *    }
 *
 * @apiSuccessExample {json} Respuesta
 *     HTTP/1.1 200 OK
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
async function changePassword(req: ISessionRequest, res: express.Response) {
  await user.changePassword(req.user.user_id, req.body);
  res.send();
}

/**
 * @apiDefine TokenResponse
 *
 * @apiSuccessExample {json} Respuesta
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "{Token de autorización}"
 *     }
 */
/**
 * @api {post} /v1/users Registrar Usuario
 * @apiName Registrar Usuario
 * @apiGroup Seguridad
 *
 * @apiDescription Registra un nuevo usuario en el sistema.
 *
 * @apiExample {json} Body
 *    {
 *      "name": "{Nombre de Usuario}",
 *      "login": "{Login de usuario}",
 *      "password": "{Contraseña}"
 *    }
 *
 * @apiUse TokenResponse
 *
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
async function signUp(req: express.Request, res: express.Response) {
  const userId = await user.register(req.body);
  const tokenString = await token.create(userId);
  res.json({ token: tokenString });
}

/**
 * @api {post} /v1/users/signin Login
 * @apiName Log in
 * @apiGroup Seguridad
 *
 * @apiDescription Loguea un usuario en el sistema.
 *
 * @apiExample {json} Body
 *    {
 *      "login": "{Login de usuario}",
 *      "password": "{Contraseña}"
 *    }
 *
 * @apiUse TokenResponse
 *
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
async function login(req: express.Request, res: express.Response) {
  const userId = await user.login(req.body);
  const tokenString = await token.create(userId);
  res.json({ token: tokenString });
}

/**
 * @api {get} /v1/users/signout Logout
 * @apiName Logout
 * @apiGroup Seguridad
 *
 * @apiDescription Desloguea un usuario en el sistema, invalida el token.
 *
 * @apiSuccessExample {json} Respuesta
 *     HTTP/1.1 200 OK
 *
 * @apiUse AuthHeader
 * @apiUse OtherErrors
 */
async function logout(req: ISessionRequest, res: express.Response) {
  await token.invalidate(req.user);
  res.send();
}


/**
 * @api {post} /v1/users/:userId/grant Otorga Permisos
 * @apiName Otorga Permisos
 * @apiGroup Seguridad
 * 
 * @apiParam userId Id de Usuario
 *
 *  @apiDescription Otorga permisos al usuario indicado, el usuario logueado tiene que tener permiso "admin".
 *
 * @apiExample {json} Body
 *    {
 *      "permissions" : ["{permiso}", ...],
 *    }
 *
 * @apiSuccessExample {json} Respuesta
 *     HTTP/1.1 200 OK
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
async function grantPermissions(req: ISessionRequest, res: express.Response) {
  await user.hasPermission(req.user.user_id, "admin");
  await user.grant(req.params.userID, req.body.permissions);
  res.send();
}

/**
 * @api {post} /v1/users/:userId/revoke Revoca Permisos
 * @apiName Revoca Permisos
 * @apiGroup Seguridad
 * 
 * @apiParam userId Id de Usuario
 *
 * @apiDescription Quita permisos al usuario indicado, el usuario logueado tiene que tener permiso "admin".
 *
 * @apiExample {json} Body
 *    {
 *      "permissions" : ["{permiso}", ...],
 *    }
 *
 * @apiSuccessExample {json} Respuesta
 *     HTTP/1.1 200 OK
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
async function revokePermissions(req: ISessionRequest, res: express.Response) {
  await user.hasPermission(req.user.user_id, "admin");
  await user.revoke(req.params.userID, req.body.permissions);
  res.send();
}


/**
 * @api {post} /v1/users/:userId/enable Habilitar Usuario
 * @apiName Habilitar Usuario
 * @apiGroup Seguridad
 * 
 * @apiParam userId Id de Usuario
 *
 * @apiDescription Habilita un usuario en el sistema. El usuario logueado debe tener permisos "admin".
 *
 * @apiSuccessExample {json} Respuesta
 *     HTTP/1.1 200 OK
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
async function enableUser(req: ISessionRequest, res: express.Response) {
  await user.hasPermission(req.user.user_id, "admin");
  await user.enable(req.params.userID);
  res.send();
}

/**
 * @api {post} /v1/users/:userId/disable Deshabilitar Usuario
 * @apiName Deshabilitar Usuario
 * @apiGroup Seguridad
 * 
 * @apiParam userId Id de Usuario
 *
 * @apiDescription Deshabilita un usuario en el sistema.   El usuario logueado debe tener permisos "admin".
 *
 * @apiSuccessExample {json} Respuesta
 *     HTTP/1.1 200 OK
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
async function disableUser(req: ISessionRequest, res: express.Response) {
  await user.hasPermission(req.user.user_id, "admin");
  await user.disable(req.params.userID);
  res.send();
}

/**
 * @api {post} /v1/users Lista de Usuarios
 * @apiName Lista de Usuarios
 * @apiGroup Seguridad
 *
 * @apiDescription Devuelve una lista de usuarios. El usuario logueado debe tener permisos "admin".
 *
 * @apiSuccessExample {json} Respuesta
 *     HTTP/1.1 200 OK
 *     [{
 *        "id": "{Id usuario}",
 *        "name": "{Nombre del usuario}",
 *        "login": "{Login de usuario}",
 *        "permissions": [
 *            "{Permission}"
 *        ],
 *        "enabled": true|false
 *       }, ...
 *     ]
 *
 * @apiUse AuthHeader
 * @apiUse ParamValidationErrors
 * @apiUse OtherErrors
 */
async function getAll(req: ISessionRequest, res: express.Response) {
  await user.hasPermission(req.user.user_id, "admin");
  const users = await user.findAll();

  res.json(users.map(u => {
    return {
      id: u.id,
      name: u.name,
      login: u.login,
      permissions: u.permissions,
      enabled: u.enabled
    };
  }));
}


/**
 * @api {get} /v1/users/current Usuario Actual
 * @apiName Usuario Actual
 * @apiGroup Seguridad
 *
 * @apiDescription Obtiene información del usuario actual.
 *
 * @apiSuccessExample {json} Respuesta
 *     HTTP/1.1 200 OK
 *     {
 *        "id": "{Id usuario}",
 *        "name": "{Nombre del usuario}",
 *        "login": "{Login de usuario}",
 *        "permissions": [
 *            "{Permission}"
 *        ]
 *     }
 *
 * @apiUse AuthHeader
 * @apiUse OtherErrors
 */
async function current(req: ISessionRequest, res: express.Response) {
  const response = await user.findById(req.user.user_id);
  return res.json({
    id: response.id,
    name: response.name,
    login: response.login,
    permissions: response.permissions
  });
}
