require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Feedback = require('./models/feedback')
const HighScore = require('./models/highScore')
const { nextTick } = require('process')
const feedback = require('./models/feedback')

//define middlewares
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message })
    }
    next(error)
}



morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

//morgan logs custom formated request data to console
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

app.use(errorHandler)

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

// getting all feedbacks
app.get('/api/feedbacks', (req, res) => {
    Feedback.find({}).then(feedbacks => {
        res.json(feedbacks)
    })
})

// delete feedback
app.delete('/api/feedbacks/:id', (req, res, next) => {
    Feedback.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))


})
// posting a feedback
app.post('/api/feedbacks', (req, res) => {
    const body = req.body

    if (body.message === undefined) {
        return res.status(400).json({ error: 'name missing' })
    }

    const feedback = new Feedback({
        name: body.name,
        message: body.message,
        date: new Date(),
        isPublic: body.isPublic || false
    })

    feedback.save().then(savedFeedback => {
        res.json(savedFeedback)
    })
})
// get all highscores
app.get('/api/highScores', (req, res) => {
    HighScore.find({}).then(highScores => {
        res.json(highScores)
    })
})
// post a highscore - this happens when the game is over
app.post('/api/highScores', (req, res) => {
    const body = req.body

    if (body.score === undefined) {
        return res.status(400).json({ error: 'score missing' })
    }

    const highScore = new HighScore({
        nickName: body.nickName,
        score: body.score,
    })

    highScore.save().then(savedHighScore => {
        res.json(savedHighScore)
    })
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})