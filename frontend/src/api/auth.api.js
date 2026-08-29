import { post } from "./api";

const register = (data) => post("/auth/register", data);

const login = (data) => post("/auth/login", data);

export {
    register,
    login
};