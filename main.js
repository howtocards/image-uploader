const path = require("path")
const util = require("util")
const express = require("express")
const fileUpload = require("express-fileupload")
const mkdirp = util.promisify(require("mkdirp"))
const nanoid = require("nanoid")
const debug = require("debug")("image-uploader")

const VOLUME = path.resolve("./files")
const ID_LENGTH = 30
const LISTEN_PORT = 4000

const NO_UPLOADS = () => ({ error: "no_uploads" })
const UPLOAD_OK = ({ path, name }) => ({ ok: true, path, name })
const UPLOAD_FAILED = ({ error, name }) => ({ ok: false, error, name })
const RESULT = ({ status, files }) => ({ status, files })

const app = express()
app.use(fileUpload())
app.post("/upload", handler)
app.listen(LISTEN_PORT, () => {
  console.log("Start listening", LISTEN_PORT)
})
async function handler(req, res) {
  const fileNames = Object.keys(req.files)
  debug("request to upload ", fileNames)

  if (!req.files || fileNames.length === 0) {
    return res.status(400).json(NO_UPLOADS())
  }

  const results = await Promise.all(
    fileNames.map((name) => save(name, req.files[name])),
  )

  const allUploaded = results.every(({ ok }) => ok)
  const allFailed = results.every(({ ok }) => !ok)

  const status = allUploaded ? "ok" : allFailed ? "failed" : "partial"

  res.status(200).json(RESULT({ status, files: results }))
}

async function save(name, file) {
  const id = nanoid(ID_LENGTH)
  debug("saving file ", file.name, id)

  try {
    const ext = getExtension(file.name)

    const dir = await createDirectory()
    debug("created dir", dir)

    const path = `${dir}/${id}.${ext}`

    await move(file, `${VOLUME}${path}`)
    debug("saved file to", path)

    return UPLOAD_OK({ path, name })
  } catch (error) {
    debug("failed to move", error)
    return UPLOAD_FAILED({ name, error: String(error) })
    // return save(file)
  }
}

async function createDirectory() {
  const first = nanoid(4)
  const second = nanoid(4)

  const path = `/${first}/${second}`

  try {
    await mkdirp(`${VOLUME}${path}`)
    return path
  } catch (error) {
    debug("failed to create directory", error)
    return createDirectory()
  }
}

function move(file, to) {
  debug("moving file", file, to)
  return new Promise((resolve, reject) => {
    file.mv(to, (err) => {
      if (err) {
        debug("failed to move file", err)
        return reject(err)
      }
      return resolve(file)
    })
  })
}

function getExtension(fileName) {
  return fileName.split(".").pop() || "jpg"
}
