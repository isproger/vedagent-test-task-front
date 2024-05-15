<template>
    <div class="mx-auto max-w-2xl mb-10 text-center">
        <h3 class="text-1xl font-bold tracking-tight text-gray-900 sm:text-2xl">
            Поиск пользователей с сервиса [jsonplaceholder.typicode.com]
        </h3>
    </div>
    <div class="min-h-10">
        <div v-if="error" class="mx-auto max-w-2xl text-center error-message mb-10 text-red-500">
        {{ error }}
    </div>
    <div v-if="message" class="mx-auto max-w-2xl text-center mb-10 success-message mb-10 text-green-500">
        {{ message }}
    </div>
    </div>
    
    <div class="mx-auto max-w-2xl">
        <a-auto-complete 
            :value="searchQuery" 
            :dropdown-match-select-width="252" 
            style="width: 100%"
            :options="options" 
            @select="onSelect"
            @input="onInput" 
        >
            <template #option="item">
                <div v-html="highlightMatches(item.label, searchQuery)"></div>
            </template>
        </a-auto-complete>

        <a-modal 
            v-model:open="open" 
            @ok="closeModal" 
        >
            Вы выбрали опцию: {{ value }}
        </a-modal>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ApiService from '../services/ApiService'
import { IUser, IOption } from '../types'
import { AxiosError } from 'axios'
import { debounce } from 'vue-debounce'

const debounceTimeout = 800
const open = ref<boolean>(false)
const value = ref<string>('')
const searchQuery = ref<string>('') 
const options = ref<Array<IOption>>([])
const message = ref<string>('')
const error = ref<string>('')

const setSearchQuery = (val: string): void => {
    searchQuery.value = val
}
const setValue = (val: string): void => {
    value.value = val
}

const setError = (err: string): void => {
    error.value = err
}

const setMessage = (mes: string): void => {
    message.value = mes
}

const clearError = (): void => {
    setError('')
}

const clearMessage = (): void => {
    setMessage('')
}

const handleError = (err: unknown): void => {
    if (err instanceof AxiosError) {
        setError(err?.response?.data?.message)
    } else if(typeof err == 'string'){
        setError(err)
    }else{
        console.error(err);
    }
}

const highlightMatches = (label: string, query: string): string => {
  if (query) {
    const regex = new RegExp(query, 'gi');
    return label.replace(regex, (match) => `<span class="text-red-500 font-bold">${match}</span>`);
  }
  return label;
}

const showModal = () =>{
    open.value = true
}
const closeModal = () =>{
    open.value = false
}

const setOptions = (value: Array<IOption>) =>{
    options.value = value
}

const fetchUsers = async (query: string) => {
    try {
        const response = await ApiService.fetUsers(query)
        setOptions(
            response.data.map((user: IUser) => ({
                value: user.name,
                label: user.name
            })) as IOption[]
        )
        
        if(!response.data.length){
            setError('Пользователи не найдены')
        }else{
            setMessage(`Найдено пользователей ${response.data.length}`)
        }
        
    } catch (error: unknown) {
        handleError(error)
    }
}

const onSelect = (_: string, option: IOption) => {
    setValue(option.label)
    showModal()
    setOptions([])
}

const onInput = (event: InputEvent) => {
    const input = event.target as HTMLInputElement | null;

    if(input && input.value !== undefined) {
        clearError()
        clearMessage()

        setSearchQuery(input.value)
        debouncefetchUsers(input.value);
    }
}

const debouncefetchUsers = debounce(fetchUsers, debounceTimeout)

</script>