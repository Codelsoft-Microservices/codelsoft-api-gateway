import catchAsync from '../utils/catchAsync.js';
import axios from 'axios';
//ESTE ARCHIVO UTILIZA HTTP PARA COMUNICARSE CON EL SERVICIO DE AUTH, NO GRPC

const authCheck = catchAsync(async (req, res) => {
    try {
        const response = await axios.get(`http://${process.env.AUTH_SERVICE_URL}/auth`);
        console.log('authCheck success status:', response.status);
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            console.error('authCheck error status:', error.response.status);
            res.status(error.response.status).json({ message: error.response.data?.message || 'Error from Auth Service' });
        } else {
            console.error('Error in authCheck:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});

const login = catchAsync(async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await axios.post(`http://${process.env.AUTH_SERVICE_URL}/auth/login`, { email, password });
        console.log('login success status:', response.status);
        res.status(response.status).json({ user: response.data.user, token: response.data.token });
    } catch (error) {
        if (error.response) {
            console.error('login error status:', error.response.status);
            res.status(error.response.status).json({ message: error.response.data?.message || 'Error from Auth Service' });
        } else {
            console.error('Error in login:', error);
            res.status(500).json({ message: 'Internal Server Error'});
        }
    }
});

const updatePassword = catchAsync(async (req, res) => {
    try {
        const { uuid } = req.params;
        const { current_password, new_password, password_confirmation } = req.body;
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ message: "No se ha proporcionado un token de autenticación." });
        }

        // Forward the request to the Auth Service
        const response = await axios.put(
            `http://${process.env.AUTH_SERVICE_URL}/auth/usuarios/${uuid}`,
            { current_password, new_password, password_confirmation },
            { headers: { Authorization: token } }
        );

        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({ message: error.response.data?.message || 'Error from Auth Service' });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
});

const syncUserCreation = async (user) => {
    try {
        const response = await axios.post(`http://${process.env.AUTH_SERVICE_URL}/auth/syncUserCreation`, {
            uuid: user.uuid,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            password: user.password,
            role: user.role
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.message || 'Error from Auth Service');
        } else {
            throw new Error('Internal Server Error');
        }
    }
};

const syncPasswordUpdate = async (user) => {
    try {
        const response = await axios.post(`http://${process.env.AUTH_SERVICE_URL}/auth/syncPasswordUpdate`, {
            uuid: user.uuid,
            new_password: user.new_password
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data?.message || 'Error from Auth Service');
        } else {
            throw new Error('Internal Server Error');
        }
    }
};

export { authCheck, login, updatePassword, syncUserCreation, syncPasswordUpdate };