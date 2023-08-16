// Define o caminho padrão do backend, evitando ter que passar o caminho todo em todas as requisições
import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:3333',
})
