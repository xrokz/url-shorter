
const express = require("express");
const mongoose = require("mongoose");

const uri = "mongodb+srv://rokz:rokz@url-shorter-ivg14.mongodb.net/url?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let con = mongoose.connection;

con.once("open", function() {
  console.log("Successfully connected to the database!");
});

con.on("error", console.error.bind(console, "Connection Error:"));

const URL = mongoose.model("URL", {url: String, title: String})

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get("/", async (req, res) => {
  let entries = await URL.find({});

  res.render("index", {entries, i: 0});
});

app.get("/api/create", async (req, res) => {

  let title = req.query.title;
  let url = req.query.url;

  if(!title || (await URL.find({title})).length > 0) {
    // console.log(code);
    title = generateCode();
    // console.log(title);
    
  }

  let entry = new URL({title: title, url: url});
  entry.save()
  let entries = await URL.find({});
  
  await res.send({entry, i: entries.length});
  
  
});

app.get("/api/delete", async (req, res) => {
  let entry = await URL.findOneAndDelete({_id: req.query.id});
  
  let entries = await URL.find({});
  res.json(entries);
  
});

app.get("/:code", async (req, res)=> {
  let entries = await URL.findOne({title: req.params.code});
  if (!entries ) {
    res.status(404)
  } else {
    res.redirect(entries.url)
  }
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Running in " + listener.address().port);
});


function generateCode(length = 6, title="") {
  let code = ``
  let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
  for (let i = 0; i<=length; i++) {
    code+=chars[Math.floor((Math.random()*chars.length))];
  }

  return code;
}