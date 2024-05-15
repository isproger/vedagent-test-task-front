import axios, { AxiosResponse } from "axios"
import { IFormData, IFormCalculateResponse, IFormSaveResponse, IFormSelectOptionResponse } from "../types"

const API_URL = import.meta.env.VITE_API_URL+'/api/v1'

const ApiService = {
    async fetchSelectOptions(): Promise<AxiosResponse<IFormSelectOptionResponse>[]>{
        return await Promise.all([
            axios.get(`${API_URL}/get-transport-companies`),
            axios.get(`${API_URL}/get-product-types`)
        ]);
    },
    async getCalculateResult(data: IFormData): Promise<AxiosResponse<IFormCalculateResponse>>{
        return await axios.post(`${API_URL}/get-calculate-result`, data)
    },
    async saveCalculation(data: IFormData): Promise<AxiosResponse<IFormSaveResponse>>{
        return await axios.post(`${API_URL}/save-calculation`, data)
    },
}

export default ApiService