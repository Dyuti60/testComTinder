- create a repository
- initialise the repository
- node_modules, package.json, package-lock.json definition
- Install express
- Create a server
- Listen to port 7777
- write request handler for /test, /hello
- install nodemon and update scripts inside package.json file
- what are dependencies
- What is the use of '-g' in npm install
- Difference between caret and tilde (^ and ~)
------
- initialise git
- .gitignore
- should we push both package.json and package-lock.json files in github
- create a remote repository in github
- push all code to remote origin
- Play with routes and route extensions hello, /, hello/2, /xyz
- Order of the routes matter a lot
- Install Postman app and make a worksace, collection
- create a test API call
- create a test post call
- Write logic to handle GET, POST, PATCH, DELETE API Calls and test them on Postman
- Explore routing and use of ?, *, (), + in the routes
- Use of regex in routes /a/, /.*fly$/
- Reading query params in routes
- Reading dynamic params in routes
-------
- Multiple Route Handlers - Play with code
- next()
- next functionand errors along with res.send()
- app.use('/route', rH, [rH2, rH3], rH4, rH5)
- What is a middleware? Why do we need it?
- How express JS basically handles requests behind the scenes
- app.use vs app.all
- Write a dummy auth middleware for admin
- Write a dummy auth middleware for all user route except /user/login
- Error handling using app.use('',(err,req,res,next)=>{})
- try catch block to handle errors
-------
- Create a free cluster in mongo db atlas
- Install Mongoose library
- Connect your application to database <connectionURL>/testTinder
- Call the connectDB function and connect to database before starting the application
- Create a user schema, create a user model
- Create POST /signup API to add data to database
- Push some documents using API calls from Postman
- Error Handling using try/catch 
-----
- JS Object vs JSON Object
- Add express.json middleware to app
- Make signup api dynamic to receive data from end user
