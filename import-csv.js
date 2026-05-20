import { parse } from "csv-parse"
import fs from "node:fs"

const baseURL = new URL('./teste.csv', import.meta.url)

async function ImportCSV() {
    const parser = fs.createReadStream(baseURL).pipe(parse())

    let index = 0
    for await (const record of parser) {
        if (index > 0) {
            const body = {
                title: record[0],
                description: record[1],
            }
            await fetch('http://localhost:3333/tasks', {
                method: 'POST',
                headers: {
                    'User-Agent': 'undici-stream-example',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })
        }
        
        index++
    }
}

ImportCSV()