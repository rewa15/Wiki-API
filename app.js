// RESTful API from scratch

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {   // create a new schema called itemsSchema
	title: String,
	content: String
};

const Article = mongoose.model("Article", articleSchema);

/////////////////////////////////////// All Articles //////////////////////////////////////////////////////

app.get("/articles", function(req,res)  // GET means Read
{

   Article.find(function(err, foundArticles) {
   	     if(!err)
   	     {
   	        res.send(foundArticles);
   	     }
   	     else
   	     {
   	     	res.send(err);
   	     }
   })

})

app.post("/articles",function(req,res)  // POST means to send and save data
{

	let newArticle= new Article({
		title: req.body.title,
		content: req.body.content
	})

	newArticle.save(function(err)
		{
            if(!err)
            {
            	res.send("Sucess!!")
            }
            else
            {
            	res.send(err);
            }
		});
})

app.delete("/articles", function(req,res){

	Article.deleteMany(function(err){
		if(!err)
		{
			res.send("Succesfully deleted!!");
		}
		else
		{
			res.send(err);
		}
	})

})

/////////////////////////////////////// Specific Article //////////////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){

    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
    	if(foundArticle)
    	{
    		res.send(foundArticle);
    	}
    	else
    	{
    		res.send("No Article matching that title was found");
    	}
    }) 

})

.put(function(req,res){

    Article.updateOne(

    	{title: req.params.articleTitle},

    	{title: req.body.title, content: req.body.content},
    	{
            overwrite: true
    	},

        function(err){
    	if(!err)
    	{
    		res.send("Succesfully updated Article!");
    	}
    	else
    	{
    		res.send(err);
    	}
    })

})

.patch(function(req,res){

    Article.updateOne(

    	{title: req.params.articleTitle},

    	{$set: req.body},

        function(err){
    	if(!err)
    	{
    		res.send("Succesfully updated Article!");
    	}
    	else
    	{
    		res.send(err);
    	}
    });

})

.delete(function(req,res){

    Article.deleteOne(

    	{title: req.params.articleTitle},

        function(err){
    	if(!err)
    	{
    		res.send("Succesfully deleted corresponding Article!");
    	}
    	else
    	{
    		res.send(err);
    	}
    });

});

app.listen(3000, function() {

  console.log("Server started on port 3000");

});