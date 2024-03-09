const express = require('express');
const url = require("url");
const bodyParser=require("body-parser")
const fs=require("fs");

const handlebars = require("express-handlebars").create({
  extname: ".hbs",
  partialsDir: "./partials",
  helpers: {
    discard: () => {
      return '<a href="/"">discard</a>';
    },
  },
});
let app = express();

app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');
app.use(bodyParser.urlencoded({extended: false}))
app.use("/public", express.static("public"));


const get = () => {
  let fileJson = fs.readFileSync("telephoneList.json");
  return JSON.parse(fileJson.toString());
};
app.get("/",(req,resp)=>{
  resp.render("main.hbs",{
    list: get(),
    access: true
  })
})



const post = (json) => {
  let data = fs.readFileSync("telephoneList.json");
  let myObject = JSON.parse(data);
  let existingObject = myObject.find(obj => obj.fio === json.fio);
  if (existingObject) {
    console.log('Объект уже существует');
    return;
  }
  let newData = { fio: json.fio, number: json.number };
  myObject.push(newData);
  let newData2 = JSON.stringify(myObject);
  fs.writeFileSync("telephoneList.json", newData2);
};
app.get("/add",(req,resp)=>{
  resp.render("post.hbs",{
    list: get(),
    access: false
  })
})

app.post("/add",(req,resp)=>{
  post(req.body)
  resp.redirect(303,"/")
})


const update = (json) => {
  let data = fs.readFileSync("telephoneList.json");
  let result = JSON.parse(data);
  for (var i = 0; i < result.length; i++) {
    if (result[i].fio === json.oldFio) {
      result[i].fio = json.fio;
      result[i].number = json.number;
    }
  }
  fs.writeFileSync("telephoneList.json", JSON.stringify(result));
};

app.get("/update",(req,resp)=>{
  let inf = get().find(item => item.fio === req.query.fio);
  resp.render("update.hbs",{
    list: get(),
    fio: inf["fio"],
    number: inf["number"],
    access: false
  });
});

app.post("/update",(req,resp)=>{
  update(req.body);
  resp.redirect(303,"/");
});

const deleteItem = (json) => {
  let data = fs.readFileSync("telephoneList.json");
  let myObject = JSON.parse(data);
  let fio = json.fio;
  let newObject = myObject.filter(obj => obj.fio !== fio);
  newObject = JSON.stringify(newObject);
  fs.writeFileSync("telephoneList.json", newObject);
};

app.get("/delete",(req,resp)=>{
  resp.render("update.hbs",{
    list: get()
  });
});
app.post("/delete",(req,resp)=>{
  deleteItem(req.body);
  resp.redirect(303,"/");
});

app.listen(3000)