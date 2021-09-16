var express=require('express');
var app=express();
var port=process.env.PORT || 9800;
var parser=require('body-parser');
var mongo=require('mongodb');
var MongoClient=mongo.MongoClient;
var mongourl="mongodb+srv://sivakumarjayanthi:abcdsivjayanthi@cluster0.hwnz7.mongodb.net/auction?retryWrites=true&w=majority";
var cors=require('cors');
var db;
app.use(cors());
app.use(parser.urlencoded({extended:true}));
app.use(parser.json())
app.get('/',(req,res)=>
{
    res.send("Hello");
})
app.get('/players',(req,res)=>
{
    var condition={}
    if(req.query.category)
    {
        condition={'category':req.query.category}
    }
    else if(req.query.lcost && req.query.hcost)
    {
        condition={'Base Price':{$lt:Number(req.query.lcost),$gt:Number(req.query.hcost)}}
    }
    db.collection('players').find(condition).toArray((err,result)=>
    {
        res.send(result);
    })
})

app.get('/health',(req,res)=>
{
    res.send("Api is working");
})
app.get('/players/:idd',(req,res)=>
{

   var query={id:Number(req.params.idd)}
    db.collection('players').find(query).toArray((err,result)=>
    {
        if(err) throw err;
        res.send(result);
    })
})

app.post('/placeorder',(req,res)=>
{
   console.log(req.body);
   db.collection('orders').insert(req.body,(err,result)=>
   {
       if(err) throw err;
       res.send(req.body);
      var aaa=req.body['id']
      var bbb=req.body['value']
      db.collection('players').update({'id':Number(aaa)},{
          $set:{
              'Base Price':Number(bbb)
          }
      })
   })
})

app.get('/orders',(req,res)=>
{
    db.collection('orders').find({}).toArray((err,result)=>
    {
        if(err) throw err;
        res.send(result);
    })
})

app.get('/orders/:idd',(req,res)=>
{
    var condition={'id':Number(req.params.idd)};
    db.collection('orders').find(condition).toArray((err,resullt)=>
    {
        if(err)throw err;
        res.send(resullt);
    })
})
MongoClient.connect(mongourl,(err,connection)=>
{
    if(err) throw err;
    db=connection.db('auction');
    app.listen(port,(err)=>
{
    if(err) throw err;
    console.log(`Server is running in port ${port}`)
})

})


/*db.players.insertMany([


    {
        'id':1,
        'firstname':'Ms',
        'lastname':'Dhoni',
        'age':40,
        'matches':500,
        'category':'Batsman',
        'Economy':0.00,
        'Average':50.00,
        'No.of.matches.played':100,
        'Base Price':1200000
    },
    {
        'id':2,
        'firstname':'Virat',
        'lastname':'Kohli',
        'age':30,
        'matches':500,
        'category':'Batsman',
        'Economy':0.00,
        'Average':60.00,
        'No.of.matches.played':200,
        'Base Price':1000000
    },
    {
        'id':3,
        'firstname':'AB',
        'lastname':'Devilliers',
        'age':35,
        'matches':700,
        'category':'Batsman',
        'Economy':0.00,
        'Average':70.00,
        'No.of.matches.played':150,
        'Base Price':1700000
    },
    {
        'id':4,
        'firstname':'Rishabh',
        'lastname':'Pant',
        'age':25,
        'matches':100,
        'category':'Batsman',
        'Economy':0.00,
        'Average':80.00,
        'No.of.matches.played':70,
        'Base Price':1500000
    },
    {
        'id':5,
        'firstname':'Rohit',
        'lastname':'Sharma',
        'age':35,
        'matches':600,
        'category':'Batsman',
        'Economy':0.00,
        'Average':90.00,
        'No.of.matches.played':200,
        'Base Price':1900000
    },
    {
        'id':6,
        'firstname':'Kagiso',
        'lastname':'Rabada',
        'age':30,
        'matches':800,
        'category':'Bowler',
        'Economy':7.00,
        'Average':0.00,
        'No.of.matches.played':100,
        'Base Price':2000000
    },
    {
        'id':7,
        'firstname':'Trent',
        'lastname':'Boult',
        'age':35,
        'matches':500,
        'category':'Bowler',
        'Economy':6.00,
        'Average':0.00,
        'No.of.matches.played':100,
        'Base Price':2100000
    },
    {
        'id':8,
        'firstname':'Jasprit',
        'lastname':'Bumrah',
        'age':30,
        'matches':300,
        'category':'Bowler',
        'Economy':4.00,
        'Average':0.00,
        'No.of.matches.played':100,
        'Base Price':1500000
    },
    {
        'id':9,
        'firstname':'Mitchell',
        'lastname':'Stark',
        'age':35,
        'matches':500,
        'category':'Bowler',
        'Economy':6.00,
        'Average':0.00,
        'No.of.matches.played':100,
        'Base Price':2200000
    },
    {
        'id':10,
        'firstname':'T',
        'lastname':'Natrajan',
        'age':30,
        'matches':100,
        'category':'Bowler',
        'Economy':6.00,
        'Average':0.00,
        'No.of.matches.played':100,
        'Base Price':1500000
    },
    {
        'id':11,
        'firstname':'Mark',
        'lastname':'Wood',
        'age':40,
        'matches':500,
        'category':'Bowler',
        'Economy':7.00,
        'Average':0.00,
        'No.of.matches.played':100,
        'Base Price':1800000
    }])*/