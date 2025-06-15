//ESTA GATEWAY SE COMUNICA POR EL PUERTO 3000 CON EL SERVICIO USERS SERVICE POR MEDIO DE GRPC

import catchAsync from '../utils/catchAsync.js';
import { verifyTokenJWT } from '../utils/tokenGenerator.js';
import {v4 as uuidv4} from 'uuid';

const GetAllUsers = catchAsync(async (req, res, next) => {
    const usersClient = req.app.locals.usersClient;
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "No se ha proporcionado un token de autenticación." });
    }

    // Verificar el token JWT
    const decodedToken = verifyTokenJWT(token);
    if (!decodedToken) {
        return res.status(401).json({ message: "Token de autenticación inválido." });
    }
    if(decodedToken.user.role !== 'Administrador') {
        return res.status(403).json({ message: "No tienes permisos para acceder a esta ruta." });
    }
    usersClient.GetAllUsers({}, (err, response) => {
        if (err) return next(err);
        return res.status(200).json(response);
    });
});

const GetUserByUUID = catchAsync(async (req, res, next) => {
    const { uuid } = req.params;
    const usersClient = req.app.locals.usersClient;
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "No se ha proporcionado un token de autenticación." });
    }

    // Verificar el token JWT
    const decodedToken = verifyTokenJWT(token);
    if (!decodedToken) {
        return res.status(401).json({ message: "Token de autenticación inválido." });
    }
    // Verificar si el UUID del usuario en el token coincide con el UUID solicitado
    // o si el usuario es un administrador
    if(decodedToken.user.uuid !== uuid) {
        if(decodedToken.user.role !== 'Administrador') {
            return res.status(403).json({ message: "No tienes permisos para acceder a esta ruta." });
        }
    }

    usersClient.GetUserByUUID({ uuid }, (err, response) => {
        if (err) return next(err);
        return res.status(200).json(response);
    });
});

const CreateUser = catchAsync(async (req, res, next) => {
    const usersClient = req.app.locals.usersClient;
    const token = req.headers.authorization;
    const { name, lastname, email, password, passwordConfirm, role } = req.body;
    const uuid = uuidv4(); // Generar un UUID único para el nuevo usuario
    if (!token) {
        return res.status(401).json({ message: "No se ha proporcionado un token de autenticación." });
    }

    // Verificar el token JWT
    const decodedToken = verifyTokenJWT(token);
    if (!decodedToken) {
        return res.status(401).json({ message: "Token de autenticación inválido." });
    }

    const fakeBody = 
    {
        uuid,
        name,
        lastname,
        email,
        password,
        passwordConfirm,
        role
    };

    usersClient.CreateUser(fakeBody, async (err, response) => {
        if (err) return next(err);
        // Si la creación del usuario es exitosa, se llama a la función de sincronización
        await syncUserCreation(fakeBody)
        return res.status(201).json(response);
    });
});

const UpdateUser = catchAsync(async (req, res, next) => {
    const { uuid } = req.params;
    const usersClient = req.app.locals.usersClient;
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "No se ha proporcionado un token de autenticación." });
    }

    // Verificar el token JWT
    const decodedToken = verifyTokenJWT(token);
    if (!decodedToken) {
        return res.status(401).json({ message: "Token de autenticación inválido." });
    }
    // Verificar si el UUID del usuario en el token coincide con el UUID solicitado
    // o si el usuario es un administrador
    if(decodedToken.user.uuid !== uuid) {
        if(decodedToken.user.role !== 'Administrador') {
            return res.status(403).json({ message: "No tienes permisos para acceder a esta ruta." });
        }
    }

    usersClient.UpdateUser({ uuid, ...req.body }, (err, response) => {
        if (err) return next(err);
        return res.status(200).json(response);
    });
});

const DeleteUser = catchAsync(async (req, res, next) => {
    const { uuid } = req.params;
    const usersClient = req.app.locals.usersClient;
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "No se ha proporcionado un token de autenticación." });
    }

    // Verificar el token JWT
    const decodedToken = verifyTokenJWT(token);
    if (!decodedToken) {
        return res.status(401).json({ message: "Token de autenticación inválido." });
    }
    // Verificar si el UUID del usuario en el token coincide con el UUID solicitado
    // o si el usuario es un administrador
    if(decodedToken.user.uuid !== uuid) {
        if(decodedToken.user.role !== 'Administrador') {
            return res.status(403).json({ message: "No tienes permisos para acceder a esta ruta." });
        }
    }

    usersClient.DeleteUser({ uuid }, (err, response) => {
        if (err) return next(err);
        return res.status(200).json(response);
    });
});

export default {
    GetAllUsers,
    GetUserByUUID,
    CreateUser,
    UpdateUser,
    DeleteUser
};