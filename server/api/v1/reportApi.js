const Report = require("./../../models/reportSchema")

async function saveReport(req, res){
  try {
    const {
      userName,
      type, 
      title,
      description,
    } = req.body;
  
  const newReport = new Report({
    userName,
    type,
    title,
    description,
  })

  const savedReport = await newReport.save()
  res.status(201).json(savedReport)

  } catch (error){
    console.error(`[SERVER] error saving report schema: ${error}`)
    res.stasus(500).json({error: "error saving report schema"})
  }
}

async function getAllReports(req,res){
  try {
    const reports = await Report.find({})
    res.status(200).json(reports)
  } catch (error){
    console.error(`Error fetching reports: ${error}`)
    res.status(500).json({error: "failed to fetch reports"})
  }
}

module.exports = {
  saveReport,
  getAllReports
}
