import axios, { AxiosResponse } from "axios"
import { IUser } from "../types"

const API_URL = import.meta.env.VITE_API_URL+'/api/v1'

const ApiService = {
    async fetUsers(query: string): Promise<AxiosResponse<IUser[]>>{
        return await axios.get(`${API_URL}/users?name_like=${query}`);
    },
}

export default ApiService