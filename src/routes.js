import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "../../01-fundamentos/src/utils/build-route-path.js";

const database = new Database();

export const routes = [
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: ((req, res) => {
            const { title, description } = req.body

            if (!title || !description) {
                return res.writeHead(400).end()
            }

            const newTask = {
                id: randomUUID(),
                title,
                description,
                created_at: new Date(),
                updated_at: new Date(),
                completed_at: false

            }
            database.insert('tasks', newTask)

            return res.writeHead(201).end()
        })
    },
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: ((req, res) => {
            const { title, description } = req.query
            const query = {
                title,
                description
            }

            const tasks = database.select('tasks', query)

            return res.end(JSON.stringify(tasks))
        })
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: ((req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            if (!title || !description) {
                return res.writeHead(400).end()
            }

            const data = {
                title,
                description
            }

            try {
                database.update('tasks', id, data)
            } catch (e) {
                console.log(e)
                return res.writeHead(404).end(JSON.stringify({
                    message: 'Task id not found'
                }))
            }

            return res.writeHead(204).end()
        })
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: ((req, res) => {
            const { id } = req.params

            try {
                database.delete('tasks', id)
            } catch (e) {
                console.log(e)
                return res.writeHead(404).end(JSON.stringify({
                    message: 'Task id not found'
                }))
            }

            return res.writeHead(204).end()
        })
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/completea'),
        handler: ((req, res) => {
            const { id } = req.params

            try {
                database.updateCompleted('tasks', id)
            } catch (e) {
                console.log(e)
                return res.writeHead(404).end(JSON.stringify({
                    message: 'Task id not found'
                }))
            }

            return res.writeHead(204).end()
        })
    },
]