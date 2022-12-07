
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const request=require("request");
const https=require("https");
const _=require("lodash");
const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://admin:admin@cluster0.wu6ayr7.mongodb.net/blogDB")
// mongoose.connect("mongodb://localhost:27017/blogDB")
const ContentSchema={
  title:{
    type:String,
    required:true
  },
  Post:String
}
const Content=mongoose.model("Content",ContentSchema);




const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const ListDay=[];
const app = express();
let search="";

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  Content.find({},function(err,foundArray){
    if(err)
    console.log(err);
    else{
      res.render("home",{HomeContent:homeStartingContent,newpost:foundArray})
    }
  })
  
})
app.get("/about",function(req,res){
 
  res.render("about",{AboutContent:aboutContent})
})
app.get("/contact",function(req,res){
  res.render("contact",{Contactcontent:contactContent})
})
app.get("/compose",function(req,res){
  res.render("compose");
})
app.post("/compose",function(req,res){
  let title=req.body.title;
   let body=req.body.post;
   let content=new Content({
    title:title,
   Post:body
   })
   content.save(function(err){
    if(err)
    console.log(err);
    else{
      res.redirect("/");
    }
   });
  
   
  }


)
app.get("/posts/search/:Post_p1",function(req,res){

  let k=0;
  let i=0;
  console.log(_.lowerCase(req.params.Post_p1));
  Content.find({},function(err,foundArray){
    if(err)
    console.log(err);
    else{
      for ( i = 0;i<foundArray.length; i++)   {
      
        if((_.lowerCase(req.params.Post_p1))===(_.lowerCase(foundArray[i].title))){
        k=1;
        break;
    }}
    if(k===1){
      res.render("post",{post_title:foundArray[i].title,post_post:foundArray[i].Post});}
      else{
        res.render("post",{post_title:"Error : Sorry Page Not Found  !",post_post:""});}
    }
  })
 

 
}
)
app.post("/posts",function(req,res){
  search=req.body.search;
  res.redirect("/posts/search/"+search)
})


// MAILCHIP CODE
app.get("/signup",function (req,res) {
  res.sendFile(__dirname+"/signup.html" )
})
app.post("/signup",function(req,res){
  const Fname=(req.body.Fname);
  const Lname=(req.body.Lname);
  const email=(req.body.Email);
 const data={
  members:[{
      email_address:email,
      status:"subscribed",
      merge_fields:{
          FNAME:Fname,
          LNAME:Lname

      }

  }]};
  const JsonData=JSON.stringify(data) 
  const url ="https://us18.api.mailchimp.com/3.0/lists/9029975fc2";
  const options={
   method:"POST",
   auth:"theM&M:f0886ead312f0c87a72c168df9cfe10a-us18"
  }
  const reqst=https.request(url,options,function(response){
   response.on("data",function(data){
       const a=JSON.parse(data);
       const b=a.errors;
       
       if(b.length>0)
       {
          const c=a.errors[0].error_code;
        res.render("failure",{error:c});
          
       }
      
       if(b.length===0)
       
       res.sendFile(__dirname+"/success.html");
   })
 })
 reqst.write(JsonData);
 reqst.end();
});



app.post("/failure",function(req,res){
  res.redirect("/signup");
})
app.post("/success",function(req,res){
  res.redirect("/");
})



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
