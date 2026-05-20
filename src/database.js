import { error } from 'node:console'
import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
    #database = {}

    constructor() {
        fs.readFile(databasePath, 'utf8').then(data => {
            this.#database = JSON.parse(data)
        }).catch(() => {
            this.#persist()
        })
    }

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database))
    }

    insert(table, data) {
        if (Array.isArray(this.#database[table])) {
            this.#database[table].push(data)
        } else {
            this.#database[table] = [data]
        }

        this.#persist()
        return data
    }

    select(table, query) {
        let data = this.#database[table] ?? []

        if(!!query.title || !!query.description) {
            data = data.filter(row => {
                return Object.entries(query).some(([key, value]) => {
                    if (value) {
                        return row[key].toLowerCase().includes(value.toLowerCase())
                    }
                    
                })
            })
        }

        return data
    }

    #searchId(table, id) {
        return this.#database[table].findIndex(row => row.id === id)
    }

    update(table, id, data) {
        const rowIndex = this.#searchId(table, id)

        if (rowIndex > -1) {
            const oldTask = this.#database[table][rowIndex]
            const updatedTask = {
                id,
                ...data,
                created_at: oldTask.created_at,
                updated_at: new Date(),
                completed_at: oldTask.completed_at,
            }
            this.#database[table][rowIndex] = updatedTask
            this.#persist()
        }else {
            throw new Error('Task id not found')
        }
    }

    delete(table, id) {
        const rowIndex = this.#searchId(table, id)

        if (rowIndex > -1) {
            this.#database[table].splice(rowIndex, 1)
            this.#persist()
        }else {
            throw new Error('Task id not found')
        }
    }

    updateCompleted(table, id) {
        const rowIndex = this.#searchId(table, id)

        if (rowIndex > -1){
            const oldTask = this.#database[table][rowIndex]
            this.#database[table][rowIndex] = {...oldTask, completed_at: true}
            this.#persist()
        }else {
            throw new Error('Task id not found')
        }
    }
}