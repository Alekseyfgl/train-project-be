import express, { Request, Response } from 'express'


const app = express()
const port = process.env.PORT || 5000

const parserMiddleware = express.json()
app.use(parserMiddleware)


app.get('/', (req: Request, res: Response) => {
  console.log(req.body)
  res.send('Hello Samurai')
})


app.delete('/', (req: Request, res: Response) => {
  console.log(req.body)
  res.send('Remove!!!')
})


const startApp = async () => {
  app.listen(port, () => {

    console.log(`Example app listening on port ${port}`)
  })
}

startApp()


