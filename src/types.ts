import { AxiosError } from "axios"

export interface IFetchActionProps{
    success: Function
    error?: Function
    finaly?: Function
}

export interface ISelectOption{
    value: number
    label: string
}

export interface IFormData{
    transportCompany: number | null
    productType: number | null
    weight: number | null
    distance: number | null
}

export interface IFormCalculateResult{
    value: number
    print_value?: string
}

export interface IFormSelectOptionResponse{
    data: ISelectOption[]
}

export interface IFormCalculateResponse extends IFormCalculateResult{
    errors?:{
        [k:string]: any
    }
    message?: string
}

export interface IFormSaveResponse{
    calculation?: {
        transport_company_id: number
        product_type_id: number
        weight_kg: number
        distance_km: number
        summ: number
        updated_at: Date
        created_at: Date
        id: number
    }
    message?: string
    error?: string
    [k: string]: any
}

export interface IDataProps{
    isLoading: boolean
    isValidationEnabled: boolean
    result: IFormCalculateResult,
    transportCompanies: ISelectOption[], 
    productTypes: ISelectOption[],  
    formData: IFormData,
    error: null | AxiosError 
    message: null | string
}