var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
 // default route
app.get('/', function (req, res) {
     return res.send({ error: true, message: 'hello' })
});
// set port
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
module.exports = app;

// connection configurations
 var dbConn = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: '1234567890',
     database: 'get_in_touch'
 });
 // connect to database
 dbConn.connect(); 

 // Retrieve all users 
 app.get('/users', function (req, res) {
     dbConn.query('SELECT * FROM user;', function (error, results, fields) {
         if (error) throw error;
         return res.send({ error: false, data: results, message: 'users list' });
     });
 });

 // Retrieve user with id 
app.get('/user/id=:id', function (req, res) {
  
    let user_id = req.params.id;
  
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
  
    dbConn.query('SELECT * FROM user WHERE user_id=?', user_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'user by id' });
    });
  
});

 // Retrieve user with email 
app.get('/user/email=:email', function (req, res) {
  
    let email = req.params.email;
  
    if (!email) {
        return res.status(400).send({ error: true, message: 'Please provide email' });
    }
  
    dbConn.query('SELECT * FROM user WHERE email=?', email, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'user by email' });
    });
  
});

 // Retrieve user by gender 
app.get('/user/gender=:gender', function (req, res) {
  
    let gender = req.params.gender;
  
    if (!gender) {
        return res.status(400).send({ error: true, message: 'Please provide gender' });
    }
  
    dbConn.query('SELECT * FROM user WHERE gender=?', gender, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'users by gender' });
    });
  
});

// Add a new user  
app.post('/user', function (req, res) {
  
    let user = req.body.user;
  
    if (!user) {
        return res.status(400).send({ error:true, message: 'Please provide user' });
    }
  
    dbConn.query("INSERT INTO user SET ? ", { user: user }, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'New user has been created successfully.' });
    });
});

//  Delete user
app.delete('/user', function (req, res) {
  
    let user_id = req.body.user_id;
  
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
    dbConn.query('DELETE FROM user WHERE id = ?', [user_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'User has been updated successfully.' });
    });
}); 

//  Update user with id
app.put('/user', function (req, res) {
  
    let user_id = req.body.user_id;
    let user = req.body.user;
  
    if (!user_id || !user) {
        return res.status(400).send({ error: user, message: 'Please provide user and user_id' });
    }
  
    dbConn.query("UPDATE user SET user = ? WHERE id = ?", [user, user_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'user has been updated successfully.' });
    });
});
 

  // Retrieve all locations 
 app.get('/locations', function (req, res) {
     dbConn.query('SELECT * FROM location;', function (error, results, fields) {
         if (error) throw error;
         return res.send({ error: false, data: results, message: 'location list' });
     });
 });

 //  Update location with user id
app.put('/locations', function (req, res) {
  
    let user_id = req.body.user_id;
    let location = req.body.location;
  
    if (!user_id || !location.user_id) {
        return res.status(400).send({ error: user, message: 'Please provide location and user_id' });
    }
  
    dbConn.query("UPDATE location SET location = ? WHERE user_id = ?", [location, user_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'location has been updated successfully.' });
    });
});


  // Retrieve all user in some distance 
 app.get('/locations/lat=:lat&long=:long&radius=:radius', function (req, res) {

 	let latitude = req.params.lat;
 	let longitude = req.params.long;
 	let radius = req.params.radius;

     dbConn.query('SELECT U.first_name, U.last_name, ( 6371 * acos (cos ( radians(?) ) * cos( radians( L.latitude ) ) * cos( radians(L.longitude ) - radians(?) ) + sin ( radians(?) ) * sin( radians( L.latitude ) ) ) ) AS distance FROM location L , user U WHERE  L.user_reference= U.user_id HAVING distance < ? ORDER BY distance LIMIT 0 , 20;', [latitude,longitude,latitude, radius],function (error, results, fields) {
         if (error) throw error;
         return res.send({ error: false, data: results, message: "users in radius" });
     });
 });

 // localhost:3000/locations/lat=-33.454706&long=-70.577006&radius=20

// To search by kilometers instead of miles, replace 3959 with 6371.

//  SELECT
//   L.latitude,L.longitude, U.first_name, U.last_name, (
//     6371 * acos (
//       cos ( radians(-33.454706) )
//       * cos( radians( latitude ) )
//       * cos( radians( longitude ) - radians(-70.577006) )
//       + sin ( radians(-33.454706) )
//       * sin( radians( latitude ) )
//     )
//   ) AS distance
// FROM location L , user U
// WHERE 
// L.user_reference= U.user_id
// HAVING distance < 10
// ORDER BY distance
// LIMIT 0 , 20;




