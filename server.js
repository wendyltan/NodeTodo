var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var logger = require('morgan');

mongoose.connect('mongodb://127.0.0.1/mytododb');


//setting up basic config...
app.use(express.static(__dirname+'/public'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());


// get the index.html
app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

//define Model
var Todo = mongoose.model('Todo',{
    text:String
});

//define routes using express

//get all todos
app.get('/api/todos',function (req,res) {
    Todo.find(function (err,todos) {
        if (err){
            res.send(err);
        }
        res.json(todos);
    });
});
//create todos and send back all todos after creation
app.post('/api/todos',function (req,res) {
    Todo.create({
        text : req.body.text,
        done : false
    },function (err,todo) {
        if (err){
            res.send(err);
        }

        //get and return all the todos after you create another
        Todo.find(function (err,todos) {
            if (err){
                res.send(err);
            }
            res.json(todos);
        });
    });
});

//delete a todo
app.delete('/api/todos/:todo_id',function (req,res) {
    Todo.remove({
        _id: req.params.todo_id
    },function (err,todo) {
        if (err){
            res.send(err);
        }
        Todo.find(function (err,todos) {
            if (err){
                res.send(err);
            }
            res.json(todos);
        });

    });
});



app.listen(8080);
console.log("App listening on port 8080");
