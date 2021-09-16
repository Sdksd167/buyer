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


