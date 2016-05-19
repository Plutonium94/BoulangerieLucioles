var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');

var monk = require('monk');
var db = monk('localhost:27017');

app.listen(1337, function() {
	console.log('listening on port 1337');
});

app.set('case sensitive routing', false);
app.set('views',__dirname);
app.set('view engine','jade');

//app.use('public', express.static(path.join(__dirname,'public')));
//app.use('admin', express.static(path.join(__dirname,'admin')));
app.use(express.static(path.join(__dirname,'public')));

app.use(bodyParser.json());

app.get('/carte', function(req,res) {
	var categories = ['Pains','Gateaux','Viennoiseries','Tartes','Boissons','Fruits à coque'];
	res.render('carte.jade',{'categories': categories});
});

app.get('/index.html', function(req,res) {
	return res.sendFile("/public/index.html");
})

app.get('/fruits_a_coque', function(req,res) {
	var nuts = ['noix','noisettes','cacahuètes','pistache','amandes','noix de cajou'];
	res.render('nuts.jade',{'nuts':nuts});
});

app.get('/ajax/tartes',function(req, res) {
	//var tartes = ['Tarte à Chocolate', 'Tarte aux Fraises', 'Tarte aux Pommes', 'Tarte Citronne', 'Tarte aux Poires'];
	db.get('tartesCollection').find({}, function(err, docs) {
		if(err) {
			res.json("probleme connection db");
		} else {
			var noms = [];
			for(var i = 0; i < docs.length; i++) {
				noms.push(docs[i].nom);
			}
			return res.json(noms);
		}
	});
	//res.json(tartes);
});



app.get('/ajax/gateaux', function(req,res) {
	db.get("gateauxTable").find({}, function(err, docs) {
		if(err) {
			return res.json(["probleme connection db"]);
		} else {
			var gateaux = [];
			for(var i = 0; i < docs.length; i++) {
				gateaux.push({"name": docs[i].name});
			}
			console.log(gateaux);
			return res.json(gateaux);
		}
	});
});

app.get('/admin/gateaux', function(req,res) {
	res.sendFile(path.join(__dirname , 'admin/cakes.html'));
});

app.get('/admin/tartes', function(req,res) {
	res.sendFile(path.join(__dirname, 'admin/tartes.html'));
})

app.get('/admin/boissons', function(req,res) {
	res.sendFile(path.join(__dirname, 'admin/boissons.html'));
});

app.get('/admin/nav.htm', function(req,res) {
	return res.sendFile(path.join(__dirname, 'admin/nav.htm'));
});



app.put('/admin/ajax/gateaux/nouveau',function(req,res) {
	var nom = req.body.nom;
	console.log("demande " + nom + "recu");
	db.get('gateauxTable').insert({'name': nom}).on('complete', function(err, doc) {
		if(err) {
			res.json("probleme connection db");
		} else {
			console.log(doc);
			delete doc._id;
			res.json(doc);
		}
	});
});

app.get('/admin/ajax/gateaux', function(req,res) {
	db.get('gateauxTable').find({}, function(err,docs) {
		if(err) {
			return res.json("probleme db");
		} else {
			var gateaux = [];
			for(var i = 0; i < docs.length; i++) {
				gateaux.push({"name": docs[i].name});
			}
			return res.json(gateaux);
		}
	});
});

app.put('/admin/ajax/boissons/nouveau', function(req, res) {
	var nom = req.body.nom;
	var prix = +req.body.prix;
	var categorie = req.body.categorie;
	db.get('boissonsCollection').insert({'nom':nom, 'prix': prix, 'categorie':categorie}).on('complete',function(err,doc) {
		console.log(doc);

		if(err) {
			return res.json("probleme connection db");
		} else {
			return res.json({"nom": doc.nom, "prix":doc.prix, "categorie": doc.categorie});
		}
	});
});

app.get('/admin/ajax/boissons', function(req,res) {
	db.get('boissonsCollection').find({}, function(err,docs) {
		if(err) {
			return res.json("probleme connection db");
		} else {
			//console.log(doc);
			var boissons = [];
			for(var i=0; i < docs.length; i++) {
				boissons.push({"nom": docs[i].nom, "prix": docs[i].prix, "categorie": docs[i].categorie});
			}
			res.json(boissons);
		}
	});
});

app.put('/admin/ajax/tartes/nouveau',function(req,res) {
	var nom = req.body.nom;
	var prix = +req.body.prix;
	db.get('tartesCollection').insert({'nom': nom, 'prix': prix}).on('complete', function(err,doc) {
		if(err) {
			res.json("probleme connection db");
		} else {
			delete doc._id;
			return res.json(doc);
		}
	});
});

app.get('/admin/ajax/tartes', function(req,res) {
	db.get('tartesCollection').find({}, function(err, docs) {
		if(err) {
			res.json("probleme connection db");
		} else {
			docs.forEach(function(item, index, array) {
				delete item._id;
			});
			return res.json(docs);
		}
	});
});
	
app.get('/admin/bootstrap.min.js', function(req,res) {
	res.sendFile(path.join(__dirname , 'admin/bootstrap.min.js'));
});

app.get('/admin/bootstrap.min.css', function(req,res) {
	res.sendFile(path.join(__dirname ,'admin/bootstrap.min.css'));
});

app.get('/admin/jquery.min.js', function(req,res) {
	res.sendFile(path.join(__dirname , 'admin/jquery.min.js'));
});

app.get('/admin/angular.min.js', function(req,res) {
	res.sendFile(path.join(__dirname, 'admin/angular.min.js'));
});

