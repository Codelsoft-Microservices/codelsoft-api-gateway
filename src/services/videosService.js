import catchAsync from '../utils/catchAsync.js';
import { verifyTokenJWT } from '../utils/tokenGenerator.js';

const UploadVideo = catchAsync(async (req, res, next) => {
  // Verificar autenticación
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Se requiere autenticación para subir videos." });
  }

  // Verificar validez del token
  const decodedToken = verifyTokenJWT(token);
  if (!decodedToken) {
    return res.status(401).json({ message: "Token de autenticación inválido o expirado." });
  }

  // Verificar que sea administrador
  if (decodedToken.user.role !== 'Administrador') {
    return res.status(403).json({ message: "Solo los administradores pueden subir videos." });
  }

  // Validar campos requeridos
  const { title, description, genre } = req.body;
  if (!title || !description || !genre) {
    return res.status(400).json({ message: "Se requieren título, descripción y género." });
  }

  const videoClient = req.app.locals.videoClient;

  videoClient.UploadVideo(req.body, (err, response) => {
    if (err) return next(err);
    return res.status(201).json(response);
  });
});

const GetVideoByID = catchAsync(async (req, res, next) => {
  // Verificar autenticación
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Se requiere autenticación para ver videos." });
  }

  // Verificar validez del token
  const decodedToken = verifyTokenJWT(token);
  if (!decodedToken) {
    return res.status(401).json({ message: "Token de autenticación inválido o expirado." });
  }

  const { uuid } = req.params;
  if (!uuid) {
    return res.status(400).json({ message: "Se requiere el ID del video." });
  }

  const videoClient = req.app.locals.videoClient;

  videoClient.GetVideoByID({ uuid }, (err, response) => {
    if (err) return next(err);
    return res.status(200).json(response);
  });
});

const UpdateVideo = catchAsync(async (req, res, next) => {
  // Verificar autenticación
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Se requiere autenticación para actualizar videos." });
  }

  // Verificar validez del token
  const decodedToken = verifyTokenJWT(token);
  if (!decodedToken) {
    return res.status(401).json({ message: "Token de autenticación inválido o expirado." });
  }

  // Verificar que sea administrador
  if (decodedToken.user.role !== 'Administrador') {
    return res.status(403).json({ message: "Solo los administradores pueden actualizar videos." });
  }

  const { uuid } = req.params;
  if (!uuid) {
    return res.status(400).json({ message: "Se requiere el ID del video." });
  }

  const { title, description, genre } = req.body;
  // Validar que al menos un campo a actualizar esté presente
  if (!title && !description && !genre) {
    return res.status(400).json({ message: "Se debe proporcionar al menos un campo para actualizar." });
  }

  const videoClient = req.app.locals.videoClient;

  videoClient.UpdateVideo({ 
    uuid, 
    title, 
    description, 
    genre 
    // No permitimos actualizar likes
  }, (err, response) => {
    if (err) return next(err);
    return res.status(200).json(response);
  });
});

const DeleteVideo = catchAsync(async (req, res, next) => {
  // Verificar autenticación
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Se requiere autenticación para eliminar videos." });
  }

  // Verificar validez del token
  const decodedToken = verifyTokenJWT(token);
  if (!decodedToken) {
    return res.status(401).json({ message: "Token de autenticación inválido o expirado." });
  }

  // Verificar que sea administrador
  if (decodedToken.user.role !== 'Administrador') {
    return res.status(403).json({ message: "Solo los administradores pueden eliminar videos." });
  }

  const { uuid } = req.params;
  if (!uuid) {
    return res.status(400).json({ message: "Se requiere el ID del video." });
  }

  const videoClient = req.app.locals.videoClient;

  // Usamos soft delete (implementado en el microservicio)
  videoClient.DeleteVideo({ uuid }, (err, response) => {
    if (err) return next(err);
    // Respuesta vacía según requerimiento
    return res.status(204).send();
  });
});

const ListVideos = catchAsync(async (req, res, next) => {
  const videoClient = req.app.locals.videoClient;
  const { userUuid } = req.params;
  const { title, genre } = req.query;

  videoClient.ListVideos({ 
    userUuid,
    title: title || "",
    genre: genre || "",
    deleted: false // No incluir videos eliminados (soft delete)
  }, (err, response) => {
    if (err) {
      if (err.code === 5) { 
        return res.status(200).json({ videos: [] });
      }
      return next(err);
    }
    return res.status(200).json(response);
  });
});

export default {
    UploadVideo,
    GetVideoByID,
    UpdateVideo,
    DeleteVideo,
    ListVideos,
};
