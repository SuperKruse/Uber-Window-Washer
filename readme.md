#Uber ultimate robot washing MANchine

##Project overview
The routes for the rest calls are defined in server.js and the functions are placed in routes > robotControl.js
Alle the functions are documented in the file


##Init

Install mongoDB

Install a suitable code editor (VS code - code.visualstudio.com)
 
In project folder open terminal and run

```javascript
npm install -g nodemon

npm install
```





##Start
Go to the mongoDB directory (C:\Program Files\MongoDB\Server\3.2)

Open terminal and run:
 
 ``` 
mongod --dbpath [path_to_project]\data
 ```
 
To start the web service open the terminal in the project directory and run:
```
nodemon server.js
```

##Edit
The server code is placed in server.js. To add a new route (rest call) add the route in server under routes and then create the function in the routes folder.


##Testing
The routes can be tested from the browser, just insert the url into the browser and see the magic happend.
It is also possible to use a rest client ([Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop))

```
http://localhost:8080/api/getBears
```
```
http://localhost:8080/api/insertBearTwo/"name of bear"
```