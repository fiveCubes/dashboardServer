const express = require('express');
const cors = require('cors')

const app = express();
const knex = require('knex');
const { now } = require('tarn/dist/utils');
app.use(express.urlencoded({extended: false}));
app.use(express.json());
const postgres = knex ({
    client: 'postgres',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'test',
      database : 'dashboard'
    }
  });

app.use(cors())


app.get('/',(req,res)=>{
    
    postgres.select().table('carddata').then((data)=>
{
    res.send(data)
})

}
)

app.get('/livedata',(req,res)=>{
    
    postgres.select().table('livedata').then((data)=>
{
    res.send(data)
})
})

app.get('/:name',(req,res)=>{
    
    let value = (req.params.name)
    value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    console.log(value)
    postgres.select().table('carddata').where('process',value).then((data)=>
{
    res.send(data)
})
})


app.put('/carddata/:process',(req,res)=>{
    
    // postgres('carddata').update({name:'bottom'}).then(d=>console.log(d))
    // console.log('post')
    console.log('put')
    data = req.body
    p = req.params.process
    p = p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
    // // postgres('carddata').where({"value":"FIM"}).update({'name':'top'}).then(d => console.log(d))
    if (p == 'Application')
    {
        postgres('carddata').where({value:data['value']}).update({name:data['name'],lastupdated:'now()'},['name','value']).then(data => res.send(data))
    }
    else
    {
        console.log(p)
        postgres('carddata').where({name:data['name'],process:p}).update({value:data['value'],lastupdated:'now()'},['name','value']).then(data => res.send(data))
    }


})



// app.put('/livedata/:process',(req,res)=>{
    
//     // postgres('carddata').update({name:'bottom'}).then(d=>console.log(d))
//     // console.log('post')
//     console.log('put')
//     data = req.body
//     p = req.params.process
//     p = p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
//     // // postgres('carddata').where({"value":"FIM"}).update({'name':'top'}).then(d => console.log(d))
//     if (p == 'Application')
//     {
//         console.log(now())
//         postgres('carddata').where({value:data['value']}).update({name:data['name'],lastupdated:now()},['name','value']).then(data => res.send(data))
//     }


// })
app.listen(process.env.PORT || 3000,()=> {
    console.log(`app is running on port ${process.env.PORT}`)
});