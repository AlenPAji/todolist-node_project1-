const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js");

const app = express();
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("Public"));
mongoose.connect('mongodb://localhost:27017/todolistDb');

const itemsSchema = new Schema({
  name: String
});
const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
  name: "buy-food"
});

const item2 = new Item({
  name: "cycling"
});

const listSchema = new Schema({
  name: String,
  items:[itemsSchema]
});

const List = mongoose.model('List', listSchema);

const arr = [item1, item2];
//Item.insertMany(arr);




//const items=["buy-food","cycling"];
const workItems = ["None"];




var day;
app.get("/", function (req, res) {

  day = date.getDate();
  async function fnd() {
    const filter = {};
    const all = await Item.find(filter);

    if (all.length===0) {
      Item.insertMany(arr);
      res.redirect("/");
    }
    else{
      res.render("list", { ListDay: day, ListItem: all });
    }
    //console.log(all);
    

  }

  fnd();
  
})
var listName1;
app.get("/:customListName", function (req, res) {
  listName1 = req.params.customListName;
  console.log(listName1);

  async function fnd1() {
    const filter = {name : listName1};
    const full = await List.findOne(filter);

    console.log(full);
    //console.log(full[0].name);
   

    if (!full) {
      console.log("new");
     
      const list = new List({
        name: listName1,
        items:arr
      });
      list.save();
      res.redirect("/"+listName1);
    }
    else{
      console.log("already exist");
      res.render("list", { ListDay: full.name, ListItem: full.items });
    }
    
    

  }
  fnd1();
  
 
})

app.get("/about", function (req, res) {
  res.render("about");
})

app.post("/", function (req, res) {

  const itemName = req.body.newitem;
  const listName = req.body.list;
  const itemx = new Item({
    name: itemName
  });
  if(listName === day) {
    
    // itemNamex = req.body.newitem;

    // const itemInserted = new Item({
    //   name: itemName
    // });

    itemx.save();


    // items.push(item);
    res.redirect("/");

  }
   
  else if (listName===listName1) {
    console.log(listName);
   
async function fnd2(){
  const filter = {name : listName};
    const full = await List.findOne(filter);
    full.items.push(itemx);
    full.save();

}
fnd2();


    

    


   
res.redirect("/"+listName);

  }
  

});

app.post("/delte",function(req,res){
  
  const i=req.body.todelete;
  const lName = req.body.listName;
  console.log(lName);
  if(lName === day){
  async function de(){
    
    await Item.deleteOne({ _id: i });

  }

  de();
}else{
  async function de2(){
    await List.findOneAndUpdate({name : lName}, {$pull: {items: {_id: i}}});
    
  }
  de2();
  res.redirect("/"+lName);
}

  
  

  res.redirect("/");

});

// app.post("/work",function(req,res){
//  item=req.body.newitem;
//  workItems.push(item);
//   res.redirect("/work");
//
//
// });

app.listen(3000, function () {

  console.log("server is running on port 3000");

});
