const express = require('express');
const path = require('path');
const termData = require('./db/db.json');
const PORT = process.env.PORT || 3001;
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
uuidv4();

const app = express();

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));


app.get('/api/notes', (req, res) => {
  fs.readFile('db/db.json', (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data))

  })
});


app.post('/api/notes', (req, res) => {
  fs.readFile('db/db.json', (err, data) => {
    if (err) throw err;
    
      let tempData = JSON.parse(data);
      let newNote = { 
        title: req.body.title,
        text: req.body.text,
        id: uuidv4()
      }
    
      tempData.push(newNote);

    fs.writeFile('db/db.json', JSON.stringify(tempData), err=> {
      if (err) throw err;
      res.redirect('/notes')
    })
  })
});

app.delete('/api/notes/:id', (req, res) => {
  fs.readFile('db/db.json', (err, data) => {
    if (err) throw err;
    
      let tempData = JSON.parse(data);
      let filteredData = tempData.filter(item => item.id !== req.params.id)


    fs.writeFile('db/db.json', JSON.stringify(filteredData), err=> {
      if (err) throw err;
      res.redirect('/notes')
    })
  })
});

//HTML ROUTES
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});







app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});


