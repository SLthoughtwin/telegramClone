import express from 'express'
import {port} from './config/'
require('./config/db.connect')
import router from './route/index'
const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.use('/telegram',router)
app.get('/', (_, res) => {
    res.send('hello sourabh!...?')
})

app.listen(port, () => {
    console.log(`listening on port ${port}!`);
})