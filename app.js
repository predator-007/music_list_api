const express = require("express");
const bodyparser = require('body-parser');
const mongoose = require("mongoose");
const app = express();
require('dotenv/config');
mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (req, res) => { console.log("connected") });

mongoose.connection.on('error', console.error.bind(console, "error "));
mongoose.connection.once('open', () => {
  console.log("connected to database");
});
const songschema = mongoose.Schema({
  title: {
    type: String,
    required: true
  }
  ,
});
const model = mongoose.model("MusicList", songschema);


app.use(bodyparser.json());

app.get('/', async (req, res) => {
  try {
    const data = await model.find();
    res.json(data);
  }
  catch (err) {
    res.json({ message: err })
  }
});


app.post('/', async (req, res) => {
  const song = new model({
    title: req.body.title
  });
  try {
    const varia = await song.save();
    res.json(varia);
  }
  catch (err) {
    res.json({ message: err })
  }

});

app.delete('/:name', async (req, res) => {
  try{
  const removed= await model.remove({ 'title': req.params.name });
 res.json(removed);
  }
  catch(err){
    res.json({message: err});
  }
});


app.listen(process.env.PORT || 5000);