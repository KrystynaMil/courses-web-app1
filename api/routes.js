const controllers = require('./controllers.js');
const express = require('express');

const router = express.Router();

router.get('/', controllers.hello);
router.use((req, res, next) => {
    console.log('routes!');
    next();
  }); 



// write your routes
router.get('/courses/:id', controllers.getCourseById);
router.get('/courses', controllers.getListOfCourses);
router.post('/courses', controllers.saveCourse);
router.put('/courses/:id', controllers.editFile);
router.delete("/courses/:id", controllers.deleteCourse);


module.exports = router;
