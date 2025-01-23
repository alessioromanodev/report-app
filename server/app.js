// IMPORT
const express = require("express") 
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
const cors = require("cors")
const mongoose = require("mongoose")
// IMPORT APIs
const ReportApi = require("./api/v1/reportApi")


// CONFIG
dotenv.config()
const app = express()
app.use(bodyParser.json())
app.use(cors())

mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    console.log("[SERVER] connected to database")
    app.listen(process.env.PORT, () => {
      console.log(`[SERVER] listening on port: ${process.env.PORT}`)
    })
  }).catch((error) => {
    console.error(`[SERVER] connection failed: ${error}`)
  })

app.post("/api/v1/report", ReportApi.saveReport)
app.get("/api/v1/report", ReportApi.getAllReports)
