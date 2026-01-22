const express = require("express")
const path = require("path")
const cors = require("cors")

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body || {}
  if (!name || !email || !message) return res.status(400).json({ ok: false })
  console.log("contact", { name, email, message })
  return res.json({ ok: true })
})

app.use(express.static(path.join(__dirname)))

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

app.listen(port, () => {
  console.log(`server running on http://localhost:${port}/`)
})
