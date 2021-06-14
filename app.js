var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer=require("express-sanitizer"),
mongoose       = require("mongoose"),
express        = require("express"),
app 	       = express();

mongoose.connect("mongodb://localhost/project1");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method")); //for using routes such as PUT and DELETE



var employeeSchema = new mongoose.Schema({
	title:String,
	lname:String,
	image:String,
	desingnation:String,
	body:String,
	dob:String,
	email:String,
	qualification:String,
	experience:String,
	interest:String,


})

var Employee = mongoose.model("Employee",employeeSchema);

// Employee.create({
// 	title:"Mr Ram",
// 	lname:"Kumar",
// 	desingnation:"Software Developer",
// 	image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0PGES8eCc07z9vQSWY_slW69pnZLl-kLV0A&usqp=CAU",
// 	body:"Hi i am  Ram  I currently work for ONGC as Software Developer!  ",
// 	dob:"09-10-1998",
// 	email:"Ram_kumar123@ongc.com",
//     qualification:"B.tech",
// 	experience:"1 Months",
// 	interest:"Machine learning",
	
// },function(err,employee){
// 	if(err)
// 	{
// 		console.log(err)
// 	}
// 	else{
// 		console.log("saved");
// 		console.log(employee);
// 	}
// });



function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};




app.get("/",function(req,res){
	res.redirect("/search");
});

app.get("/search",function(req,res){
	res.render("index");
});

app.get("/employee",function(req,res){
	var noMatch;
	
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		
		Employee.find({ title: regex },function(err,blogs){
		if(err)
			{
				console.log("OOps Error ocurred!");
			}
		else
			{
				if(blogs.length	< 1){
					noMatch="No Employees found Please Try again with a correct keyword !"
				}
				res.render("employee",{blogs:blogs ,noMatch:noMatch});
			}
	});
	}
	else{
		Employee.find({},function(err,blogs){
		if(err)
			{
				console.log("OOps Error ocurred!");
			}
		else
			{
				res.render("employee",{blogs:blogs,noMatch:noMatch});
			}
	});
	}
});

app.get("/blogs/:id",function(req,res){
	
	Employee.findById(req.params.id,function(err,foundBLog){
		if(err)
			{
				res.redirect("/blogs");
			}
		else
			{
				res.render("show",{blog:foundBLog});
			}
	});
	
});



app.listen(process.env.PORT||3000,process.env.IP,function(){
	console.log("Server has started!!");
});
	