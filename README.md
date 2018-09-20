# anybuddy-full-stack-capstone

Anybuddy lets you create events and helps you find like minded buddies.

## Screenshots

Welcome Page View
![Welcome Page View](https://github.com/nitishbagul/anybuddy-full-stack-capstone/blob/master/github-images/ab_welcome.png)
Home Page View
![Home Page View](https://github.com/nitishbagul/anybuddy-full-stack-capstone/blob/master/github-images/ab_home.png)
Own Events
![Own Events](https://github.com/nitishbagul/anybuddy-full-stack-capstone/blob/master/github-images/ab_own.png)
Joined Events
![Joined Events](https://github.com/nitishbagul/anybuddy-full-stack-capstone/blob/master/github-images/ab_joined.png)

## Use Cases
1. User should be able to create an event and request for partners.
2. User should be able to view events created by others.
3. User should be able to join/leave an event created by others.
4. User should be able to view its own events as well as the ones he has joined.
5. User should be able to edit its own event.
6. User should be able to delete its own events.
7. User should not be able to edit events created by others.

### UI Flow
![UI Flow handwritten draft](https://github.com/nitishbagul/anybuddy-full-stack-capstone/blob/master/github-images/ui-flow.jpg)

### Wireframe _main
![Wireframe _Main](https://github.com/nitishbagul/anybuddy-full-stack-capstone/blob/master/github-images/wireframes.jpg)

## Working Prototype
You can find a Node.js working prototype of the app here: https://anybuddy-full-stack-capstone.herokuapp.com/ and React prototype here:

## Functionality
The app's functionality includes:
* Every User has the ability to create an account that stores information unique to them
* User can add events and mention number of partners required
* Other users can view events near them and can also join them if the spot is available.

## Technology
* Front-End: HTML5 | CSS3 | JavaScript ES6 | jQuery
* Back-End: Node.js | Express.js | Mocha | Chai | RESTful API Endpoints | MongoDB | Mongoose


## Responsive
App is strongly built to be usuable on mobile devices, as well as responsive across mobile, tablet, laptop, and desktop screen resolutions.

## Development Roadmap
This is v1.0 of the app, but future enhancements are expected to include:
* Ability to accept/reject the join event request
* View past events log

#  The typical command lines for capstone projects

## Node command lines
* npm install ==> install all node modules
    * npm install --save bcrypt bcryptjs body-parser cors express mongodb mongoose passport passport-http unirest
    * npm install --save-dev chai chai-http mocha faker
* nodemon server.js ==> run node server
* npm test ==> run the tests

## React command lines
* npm install ==> install all node modules
    * npm install --save bcrypt bcryptjs body-parser cheerio chokidar-cli concurrently core-js cors cpr enzyme enzyme-react-16-adapter-setup express http-server jsonwebtoken moment mongodb mongoose morgan npm-run-all passport passport-http passport-jwt passport-jwt-strategy react react-addons-test-utils react-dom react-fontawesome react-redux redux redux-thunk rimraf unirest
    * npm install --save-dev acorn babel-cli babel-core babel-loader babel-plugin-transform-object-rest-spread babel-polyfill babel-preset-es2015 babel-preset-react chai chai-enzyme chai-http enzyme-adapter-react-15 enzyme-adapter-react-16 faker json-loader mkdirp mocha react-scripts react-test-renderer sinon sinon-chai webpack
* npm run build ==> build the react files in the "build" folder
* npm start ==> run react server on http://127.0.0.1:8080
* npm test ==> run the tests







