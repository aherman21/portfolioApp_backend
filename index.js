const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(express.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.body(req, res)
    ].join(' ')
}))

let feedbacks = [
    {
        "id": 1702040689696,
        "name": "moimoi",
        "message": "aaa",
        "date": "2023-12-08T13:04:49.696Z",
        "isPublic": true
      },
      {
        "id": 1702040698528,
        "name": "aasfasf",
        "message": "waw",
        "date": "2023-12-08T13:04:58.528Z",
        "isPublic": true
      },
      {
        "id": 1702040740128,
        "name": "hei",
        "message": "aa",
        "date": "2023-12-08T13:05:40.128Z",
        "isPublic": true
      }
  ]

  let highScores = [
    {
      "nickName": "asdads",
      "score": 1,
      "id": 1
    },
    {
      "nickName": "testi",
      "score": 3,
      "id": 2
    },
    {
      "nickName": "testi2",
      "score": 2,
      "id": 3
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/feedbacks', (req, res) => {
    res.json(feedbacks)
})

app.get('/api/feedbacks/:id', (req, res) => {
    const id = Number(req.params.id)
    const feedback = feedbacks.find(feedback => feedback.id === id)
    if (feedback) {
        res.json(feedback)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/feedback/:id', (req, res) => {
    const id = Number(req.params.id)
    feedbacks = feedbacks.filter(feedback => feedback.id !== id)
    res.status(204).end()
})

app.post('/api/feedbacks', (req, res) => {
    const feedback = req.body
    console.log(feedback)
    res.json(feedback)
})

app.get('/api/highScores', (req, res) => {
    res.json(highScores)
})

app.post('/api/highScores', (req, res) => {
    const highScore = req.body
    console.log(highScore)
    res.json(highScore)
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})