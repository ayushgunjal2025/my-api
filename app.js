const express= require('express');
const {connectToDb,getDb}=require('./db');
const app=express();
app.use(express.json());
let db;

connectToDb((err)=>{
    if(!err){
        app.listen(3001,()=>{
            console.log("connected to database");
        })
        db=getDb();
    }
})



// //app.get request
app.get('/api/students',(req,res)=>{
    const page = req.query.p ||0;
    const studentsPerPage=10;
    let students=[];

    db.collection('students')
    .find()
    .sort({id:1})
    .skip(page*studentsPerPage)
    .limit(studentsPerPage)
    .forEach((student)=>students.push(student))
    .then(()=>{
        res.status(200).json(students);
    })
    .catch(()=>{
        res.status(500).json({msg:'error'});
    })
})


app.get('/api/students/:id',(req,res)=>{
    const studentID = parseInt(req.params.id);
    if(!isNaN(studentID))
    {
        db.collection('students')
        .findOne({id:studentID})
        .then((student)=>{
            if(student){
                res.status(200).json(student);
            }
            else{
                res.status(404).json({msg:'error student not found'});
            }
        })
        .catch(()=>{
            res.status(500).json({msg:'error in server'});
        })
    }
    else{
        res.status(400).json({msg:'id is not a number'});
    }
})


//post method
app.post('/api/students',(req,res)=>{
    const student = req.body;
    db.collection('students')
    .insertOne(student)
    .then((result)=>{
        res.status(200).json({result});
    })
    .catch(()=>{
        res.status(500).json({msg:'error in something'});
    })
})


//update method
app.patch('/api/students/:id',(req,res)=>{
    let update = req.body;
    const studentID = parseInt(req.params.id);
    if(!isNaN(studentID)){
        db.collection('students')
        .updateOne({id:studentID},{$set:update})
        .then((result)=>{
            res.status(200).json({result});
        })
        .catch(()=>{
            res.status(500).json({msg:'error'});
        })
    }
    else{
        res.status(400).json({msg:'not a number'});
    }
})


app.delete('/api/students/:id',(req,res)=>{
    const studentID = parseInt(req.params.id);
    if(!isNaN(studentID)){
        db.collection('students')
        .deleteOne({id:studentID})
        .then((result)=>{
            res.status(200).json({result});
        })
        .catch(()=>{
            res.status(500).json({msg:'error in the code'});
        })
    }
    else{
        res.status(500).json({msg:'not a number'});
    }
})