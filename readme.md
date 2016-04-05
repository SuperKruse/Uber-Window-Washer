#Uber ultimate robot washing MANchine

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
The server code is placed in server.js. To add a new route (rest call) add the route in server under routes and then create the function in the routes folder