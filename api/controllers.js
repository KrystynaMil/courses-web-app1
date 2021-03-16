'use strict'

const fs = require('fs');
const path = require('path');
const tv4 = require('tv4');


const DATA_DIR = path.join(__dirname, '..', 'data', 'courses.json');

const schema = require('../data/schema.json');


const controllers = {
  hello: (req, res) => {
    res.json({ api: 'courses!' });
  },

  getListOfCourses: (req, res, next) => {
    fs.readFile(DATA_DIR, 'utf8', (err, data) => {
      if (err) {
          throw err;
      }
  
      res.send(JSON.parse(data));
    });
  },

  saveCourse: (req, res)=>{
    fs.readFile(DATA_DIR, 'utf-8', (err, data) => {
      if (err)  return res.status(500).send(err.message);
      let courses = JSON.parse(data);

      const newCourse = req.body;
      newCourse.id = courses.nextId;
      courses.nextId++;

      const isValid = tv4.validate(newCourse, schema)
      console.log(isValid);

      if (!isValid) {
        const error = tv4.error
        console.error(error)

        res.status(400).json({
          error: {
            message: error.message,
            dataPath: error.dataPath
          }
        })
        return
      }

      courses.courses.push(newCourse);
      res.send(newCourse);
      let newData = JSON.stringify(courses, null, 2);
      
      fs.writeFile(DATA_DIR, newData, (err) => {
          if (err) return res.status(500).send(err.message);
          console.log('Data written to file');
      });

  });
  },

  //PUT METHOD
editFile: (req, res, next) => {
  console.log('edit files')
    fs.readFile(DATA_DIR, 'utf-8', (err, data) => {
        if (err) return res.status(500).send(err.message);
        
        let courses = JSON.parse(data);
        const course =courses.courses.find(c => c.id === parseInt(req.params.id));
        if(!course) res.status(404).send('The course with the given ID was not found!');
        course.name=req.body.name;
        
        course.place= req.body.place,
        course.details=req.body.details

        const isValid = tv4.validate(course, schema)
        console.log(isValid);
  
        if (!isValid) {
          const error = tv4.error
          console.error(error)
  
          res.status(400).json({
            error: {
              message: error.message,
              dataPath: error.dataPath
            }
          })
          return
        }
  
        res.send(course);
        
        let updatedData = JSON.stringify(courses, null, 2);
        
        fs.writeFile(DATA_DIR, updatedData, (err) => {
          if (err) {
            next(err);
            return;
          }
            console.log('File is updated');
        });
    })
},
//GET course by ID Method 

getCourseById:(req,res, next) =>{
  fs.readFile(DATA_DIR, 'utf8', (err, data) =>{
    let courses = JSON.parse(data);
  const course = courses.courses.find(c => c.id === parseInt(req.params.id));
  if (!course) res.status (404).send('The course with the given ID was not found.')
  res.send(course);
    if(err)
    next(err);
    return;
  });
 },

 //GET Method 

listFiles:(req,res , next) =>{
  console.log('get files')
  fs.readFile(DATA_DIR, 'utf8', (err, data) =>{
    console.log('list files')
    if(err)
    next(err);
    return;
  });

  res.send(JSON.parse(data));
},
//Delete Course Method 

deleteCourse: (req, res, next) => {

  fs.readFile(DATA_DIR, "UTF-8", (err, data) => {
    if (err) {
      console.error("Error: ", err);
      return;
    }
    let parsedData = JSON.parse(data);
    console.log("read from file: ", parsedData);
    
    let course = parsedData.courses.find(function (c) {
      console.log(`c.id is: ${c.id}, req.params.id is: ${req.params.id}`);
      return c.id === parseInt(req.params.id);
    });

    if (!course) {
      console.log("incorrect id ");
      return res.status(404).send("The course with the given ID was not found!");
    }

    const index = parsedData.courses.indexOf(course);

    parsedData.courses.splice(index, 1);
    let toWrite = JSON.stringify(parsedData, null, " ");

    fs.writeFile(DATA_DIR, toWrite, "UTF-8", (err) => {
      if (err) {
        console.log("changes not saved");
        process.exit();
      }

      console.log("changes saved");
    });
    res.send(course);
  });
},
};


module.exports = controllers;
