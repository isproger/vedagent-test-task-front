<template>
    <div class="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div class="mx-auto max-w-2xl text-center">
            <h4 class="text-1xl font-bold tracking-tight text-gray-900 sm:text-2xl">Калькулятор расчета стоимости
                доставки</h4>
        </div>
        <form @submit.prevent="submitForm" method="POST" class="relative mx-auto mt-16 max-w-xl sm:mt-20">
            <div v-if="message" class="success-message mb-10 text-green-500">{{ message }}</div>
            <div v-if="error" class="error-message mb-10 text-red-500">{{ error }}</div>

            <div class="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">

                <div class="mb-2">
                    <label for="transportCompany"
                        class="block text-sm font-semibold leading-6 text-gray-900">Транспортная компания</label>
                    <select id="transportCompany"
                        class="w-full rounded-md border-0 py-2 pl-4 pr-9 text-gray-400 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                        v-model="formData.transportCompany" @change="onChange">
                        <option value="">не выбрано</option>
                        <option v-for="company in transportCompanies" :key="company.value" :value="company.value">
                            {{ company.label }}
                        </option>
                    </select>
                    <div v-if="v$.formData.transportCompany.$error && !!isValidationEnabled" class="text-red-400">
                        Поле обязательно для заполнения.
                    </div>

                </div>
                <div class="mb-2">
                    <label for="productType" class="block text-sm font-semibold leading-6 text-gray-900">
                        Тип товара
                    </label>
                    <select v-model="formData.productType" id="productType"
                        class="w-full rounded-md border-0 py-2 pl-4 pr-9 text-gray-400 shadow-sm focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                        @change="onChange">
                        <option value="">не выбрано</option>
                        <option v-for="type in productTypes" :key="type.value" :value="type.value">
                            {{ type.label }}
                        </option>
                    </select>
                    <div v-if="v$.formData.productType.$error && !!isValidationEnabled" class="text-red-400">
                        Поле обязательно для заполнения.
                    </div>
                </div>

                <div class="mb-2">
                    <label for="weight" class="block text-sm font-semibold leading-6 text-gray-900">Вес в кг</label>
                    <div class="mt-2.5">
                        <input type="number" v-model.number="formData.weight" id="weight"
                            class="w-full block rounded-md border-2 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            @input="onChange">
                    </div>
                    <div v-if="!!isValidationEnabled" v-for="error of v$.formData.weight.$errors" :key="error.$uid" class="text-red-400">
                        <span v-if="error.$validator == 'required'">Поле обязательно для заполнения.</span>
                        <span v-if="error.$validator == 'minValue'">Минимальное значение {{ error.$params.min }}</span>
                        <span v-if="error.$validator == 'maxValue'">Максимальное значение {{ error.$params.max }}</span>
                    </div>


                </div>

                <div class="mb-2">
                    <label for="distance" class="block text-sm font-semibold leading-6 text-gray-900">Расcтояние в
                        км</label>
                    <div class="mt-2.5">
                        <input type="number" v-model.number="formData.distance" :change="{ onChange }" id="distance"
                            class="w-full block rounded-md border-2 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            @input="onChange">
                    </div>
                    <div v-if="!!isValidationEnabled" v-for="error of v$.formData.distance.$errors" :key="error.$uid" class="text-red-400">
                        <span v-if="error.$validator == 'required'">Поле обязательно для заполнения.</span>
                        <span v-if="error.$validator == 'minValue'">Минимальное значение {{ error.$params.min }}</span>
                    </div>
                </div>

                <div class="mt-2">
                    <button type="submit"
                        class="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Выбрать
                    </button>
                </div>
                <div v-if="!!result.print_value" class="mt-2">
                    <div class="font-semibold">Результат:</div>
                    {{ result.print_value }} руб.
                </div>
            </div>
            <div v-if="!!isLoading" class="absolute w-full h-full bg-[#fff]/80 top-0">
                <div role="status" class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                    <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                        viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor" />
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill" />
                    </svg>
                    <span class="sr-only">Loading...</span>
                </div>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import ApiService from "../services/ApiService"
import { IDataProps, IFormData, ISelectOption, IFormCalculateResult, IFetchActionProps } from "../types"
import { AxiosError, AxiosResponse } from 'axios'
import { useVuelidate } from '@vuelidate/core'
import { required, numeric, minValue, maxValue } from '@vuelidate/validators'
import { DebounceInstance, debounce } from 'vue-debounce'


const debounceTimeout = 800
const defFormData: IFormData = { transportCompany: null, productType: null, weight: 0, distance: 0 }
const defResult: IFormCalculateResult = { value: 0, print_value:''}
const defTransportCompanies: ISelectOption[] = []
const defProductTypes: ISelectOption[] = []

export default {
    name: 'Calculator',
    setup() {
        return { v$: useVuelidate() }
    },
    data(): IDataProps {
        return {
            isLoading: false,
            isValidationEnabled: true,
            result: defResult,
            transportCompanies: defTransportCompanies, 
            productTypes: defProductTypes,  
            formData: {...defFormData},
            error: null, 
            message: null, 
        }
    },
    validations() {
        return {
            formData:{
                transportCompany: { required },
                productType: { required },
                weight: { required, numeric, minValue: minValue(30), maxValue: maxValue(100000) },
                distance: { required, numeric, minValue: minValue(1) },
            }
        }
    },
    mounted() {
        this.fetchSelectOptions()
        // if defaultFormData is correct for calculate
        this.applyIfIsCorrectForm(() => this.getCalculate())
    },
    created() {
        this.getCalculate = debounce(async () => {
            this.fetchAction({
                success: async() => {
                    this.applyIfIsCorrectForm(async () => {
                        const response = await ApiService.getCalculateResult(this.formData)
                        this.setResult(response.data)
                    })
                }
            })
        }, debounceTimeout)
    },
    methods: {
        async applyIfIsCorrectForm(callBack: () => void): Promise<void> {
            let isFormCorrect = await this.v$.$validate()

            if (!!isFormCorrect && typeof callBack == 'function') {
                callBack()
            }
        },
        async onChange(): Promise<void> {
            this.repairForm()
            this.applyIfIsCorrectForm(() => this.getCalculate())
        },
        async fetchSelectOptions(): Promise<void> {
            this.fetchAction({
                success: async() => {
                    const [transportResponse, productTypesResponse] = await ApiService.fetchSelectOptions()
                    this.setTransportCompanies(transportResponse.data.data)
                    this.setProductTypes(productTypesResponse.data.data)
                }
            })
        },
        async submitForm(): Promise<void> {
            this.fetchAction({
                success: async() => {
                    this.applyIfIsCorrectForm(async() =>{
                        const response = await ApiService.saveCalculation(this.formData)
                        this.handleSuccess(response)
                    })
                }
            })
        },
        async fetchAction({success, error, finaly}: IFetchActionProps){
            this.setIsLoading(true)
            try {
                success()
            } catch (err) {
                this.handleFailure(err)
                if(typeof error == 'function'){
                    error()
                }
            } finally{
                this.setIsLoading(false)
                
                if(typeof finaly == 'function'){
                    finaly()
                }
            }
        },
        setIsLoading(flag: IDataProps['isLoading']): void {
            this.isLoading = flag
        },
        setTransportCompanies(list: ISelectOption[]): void {
            this.transportCompanies = list
        },
        setProductTypes(list: ISelectOption[]): void {
            this.productTypes = list
        },
        setFormData(data: IFormData): void {
            this.formData = {...this.formData, ...data}
        },
        setError(err: IDataProps['error']): void {
            this.error = err
        },
        setMessage(message: IDataProps['message']): void {
            this.message = message
        },
        setResult(result: IDataProps['result']): void {
            this.result = result
        },
        setIsValidationEnabled(flag: IDataProps['isValidationEnabled']): void {
            this.isValidationEnabled = flag
        },

        clearError(): void {
            this.setError(null)
        },
        clearMessage(): void {
            this.setMessage(null)
        },
        clearResult(): void {
            this.setResult(defResult)
        },
        clearForm(): void {
            this.setFormData(defFormData) 
            this.clearError()
        },
        repairForm(): void {
            if(!this.isValidationEnabled) this.setIsValidationEnabled(true)
            if(!!this.error) this.clearError()
            if(!!this.message) this.clearMessage()
            if(!!this.result.value) this.clearResult()
        },
        clearIsValidationEnabled(): void {
            this.setIsValidationEnabled(false) 
        },

        handleError(err: unknown): void {
            if (err instanceof AxiosError) {
                console.log('Is instanceof AxiosError');
                
                this.error = err?.response?.data?.message;
            } else {
                console.log('Not instanceof AxiosError');
                console.error(err);
            }
        },
        handleSuccess(response: AxiosResponse): void {
            this.setMessage(response?.data?.message)
            this.clearIsValidationEnabled()
            this.clearForm()
        },
        handleFailure(error: unknown): void {
            this.handleError(error);
            this.setIsValidationEnabled(true)
        },
        getCalculate: {} as DebounceInstance<[]>,
    }
};
</script>
