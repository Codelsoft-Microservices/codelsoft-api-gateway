import catchAsync from '../utils/catchAsync.js';
import { verifyTokenJWT } from '../utils/tokenGenerator.js';

const CreateBill = catchAsync(async (req, res, next) => {
  // Verificar autenticación
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Se requiere autenticación para crear facturas." });
  }

  // Verificar validez del token
  const decodedToken = verifyTokenJWT(token);
  if (!decodedToken) {
    return res.status(401).json({ message: "Token de autenticación inválido o expirado." });
  }

  // Verificar que sea administrador
  if (decodedToken.user.role !== 'Administrador') {
    return res.status(403).json({ message: "Solo los administradores pueden crear facturas." });
  }

  const { userUuid, billStatus, amount } = req.body;
  
  // Validación de datos
  if (!userUuid || !billStatus || amount === undefined) {
    return res.status(400).json({ message: "Se requiere ID de usuario, estado de factura y monto." });
  }
  
  // Validar que el monto sea un entero positivo
  if (!Number.isInteger(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({ message: "El monto debe ser un número entero positivo." });
  }
  
  // Validar estado de factura
  const validStatuses = ["Pending", "Paid", "Overdue"];
  if (!validStatuses.includes(billStatus)) {
    return res.status(400).json({ 
      message: "Estado de factura inválido. Debe ser 'Pending', 'Paid', o 'Overdue'" 
    });
  }
  
  const billingClient = req.app.locals.billingClient;

  billingClient.CreateBill(req.body, (err, response) => {
    if (err) return next(err);
    return res.status(201).json(response);
  });
});

const GetBillById = catchAsync(async (req, res, next) => {
  // Verificar autenticación
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Se requiere autenticación para consultar facturas." });
  }

  // Verificar validez del token
  const decodedToken = verifyTokenJWT(token);
  if (!decodedToken) {
    return res.status(401).json({ message: "Token de autenticación inválido o expirado." });
  }

  const { uuid } = req.params;
  if (!uuid) {
    return res.status(400).json({ message: "Se requiere el ID de la factura." });
  }
  
  const billingClient = req.app.locals.billingClient;

  billingClient.GetBillById({ uuid }, (err, response) => {
    if (err) return next(err);
    
    // Verificar que el usuario es admin o dueño de la factura
    if (decodedToken.user.role !== 'Administrador' && response.userUuid !== decodedToken.user.uuid) {
      return res.status(403).json({ 
        message: "Acceso denegado. Solo puede consultar sus propias facturas." 
      });
    }
    
    return res.status(200).json(response);
  });
});

const UpdateBillStatus = catchAsync(async (req, res, next) => {
  // Verificar autenticación
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Se requiere autenticación para actualizar facturas." });
  }

  // Verificar validez del token
  const decodedToken = verifyTokenJWT(token);
  if (!decodedToken) {
    return res.status(401).json({ message: "Token de autenticación inválido o expirado." });
  }
  
  // Verificar que sea administrador
  if (decodedToken.user.role !== 'Administrador') {
    return res.status(403).json({ message: "Solo los administradores pueden actualizar facturas." });
  }
  
  const { uuid } = req.params;
  if (!uuid) {
    return res.status(400).json({ message: "Se requiere el ID de la factura." });
  }
  
  const { billStatus } = req.body;
  if (!billStatus) {
    return res.status(400).json({ message: "Se requiere el estado de la factura." });
  }
  
  // Validar estado de factura
  const validStatuses = ["Pendiente", "Pagado", "Vencido"];
  if (!validStatuses.includes(billStatus)) {
    return res.status(400).json({ 
      message: "Estado de factura inválido. Debe ser 'Pendiente', 'Pagado', o 'Vencido'" 
    });
  }
  
  const billingClient = req.app.locals.billingClient;
  
  // Preparar datos para actualización
  const updateData = { uuid, billStatus };
  
  // Si el estado es pagado, incluir fecha de pago actual
  if (billStatus === "Pagado") {
    updateData.paymentDate = new Date().toISOString();
  }

  billingClient.UpdateBillStatus(updateData, (err, response) => {
    if (err) return next(err);
    return res.status(200).json(response);
  });
});

const DeleteBill = catchAsync(async (req, res, next) => {
  // Verificar autenticación
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Se requiere autenticación para eliminar facturas." });
  }

  // Verificar validez del token
  const decodedToken = verifyTokenJWT(token);
  if (!decodedToken) {
    return res.status(401).json({ message: "Token de autenticación inválido o expirado." });
  }
  
  // Verificar que sea administrador
  if (decodedToken.user.role !== 'Administrador') {
    return res.status(403).json({ message: "Solo los administradores pueden eliminar facturas." });
  }
  
  const { uuid } = req.params;
  if (!uuid) {
    return res.status(400).json({ message: "Se requiere el ID de la factura." });
  }
  
  const billingClient = req.app.locals.billingClient;

  // Primero obtenemos la factura para verificar su estado
  billingClient.GetBillById({ uuid }, (err, bill) => {
    if (err) return next(err);
    
    // Verificar que la factura no esté en estado pagado
    if (bill.billStatus === "Pagado") {
      return res.status(400).json({ 
        message: "No se puede eliminar una factura con estado 'Pagado'." 
      });
    }
    
    // Proceder con el borrado (soft delete)
    billingClient.DeleteBill({ uuid }, (err, response) => {
      if (err) return next(err);
      // Respuesta vacía según requerimiento
      return res.status(204).send();
    });
  });
});

const ListBillsByUser = catchAsync(async (req, res, next) => {
  // Verificar autenticación
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Se requiere autenticación para listar facturas." });
  }

  // Verificar validez del token
  const decodedToken = verifyTokenJWT(token);
  if (!decodedToken) {
    return res.status(401).json({ message: "Token de autenticación inválido o expirado." });
  }
  
  const billingClient = req.app.locals.billingClient;
  const { userUuid } = req.params;
  const { billStatus } = req.query;
  const isAdmin = decodedToken.user.role === 'Administrador';
  
  // Determinar la operación a realizar basada en parámetros y rol
  if (!userUuid) {
    // Sin userUuid específico: listar todas las facturas o las del usuario actual
    if (isAdmin) {
      // Administrador puede ver todas las facturas
      billingClient.ListAllBills({ 
        billStatus: billStatus || "" 
      }, (err, response) => {
        if (err) {
          if (err.code === 5) { // NOT_FOUND
            return res.status(200).json({ bills: [] });
          }
          return next(err);
        }
        return res.status(200).json(response);
      });
    } else {
      // Cliente solo puede ver sus facturas
      billingClient.ListBillsByUser({ 
        userUuid: decodedToken.user.uuid, 
        billStatus: billStatus || "" 
      }, (err, response) => {
        if (err) {
          if (err.code === 5) { // NOT_FOUND
            return res.status(200).json({ bills: [] });
          }
          return next(err);
        }
        return res.status(200).json(response);
      });
    }
  } else {
    // Con userUuid específico: verificar permisos
    if (!isAdmin && userUuid !== decodedToken.user.uuid) {
      return res.status(403).json({ 
        message: "Acceso denegado. Solo puede ver sus propias facturas." 
      });
    }
    
    // Listar facturas del usuario especificado
    billingClient.ListBillsByUser({ 
      userUuid,
      billStatus: billStatus || "" 
    }, (err, response) => {
      if (err) {
        if (err.code === 5) { // NOT_FOUND
          return res.status(200).json({ bills: [] });
        }
        return next(err);
      }
      return res.status(200).json(response);
    });
  }
});

export default {
    CreateBill,
    GetBillById,
    UpdateBillStatus,
    DeleteBill,
    ListBillsByUser,
};
