const express = require('express')
const fs = require('fs')
const app = express()
const port = 3000

app.use(express.static('.'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))