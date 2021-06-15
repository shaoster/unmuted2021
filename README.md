# Unmuted: 2021

The game is hosted at https://shaoster.github.io/unmuted2021/

The game editor is at https://shaoster.github.io/unmuted2021#/editor

To add new graphical or musical assets, send a PR.

## How to play

The mechanics of this game are heavily inspired by [Dominion](https://en.wikipedia.org/wiki/Dominion_(card_game)) and [Slay the Spire](https://en.wikipedia.org/wiki/Slay_the_Spire).

See https://www.youtube.com/watch?v=5jNGpgdMums if you are unfamiliar with this genre of games.

Objective:

    - Survive 48 turns.
    - Keep your Growth Mindset high.
    - Make sure you get enough study points to pass exams.

The resources are straight out of Dominion:

    - Energy is Actions
    - Money is Money
    - Attention is Buys

As with Dominion, the above resources reset at the beginning of the turn.
 
There's two additional persistent resources:

    - Growth Mindset: How many cards you draw at the beginning of the turn. Lowered by one each turn; acquired by playing special cards.
    - Study Points: Persistent resource required to advance through the game; acquired by playing special cards.

The card mechanics are straight out of Slay the Spire.

    - #YOLO is Ethereal.
    - Forget is Exhaust.
    - Gain adds cards to your discard pile. 

# Code

This game was built using [boardgame.io](https://boardgame.io/).

The core game logic is in src/Game.js

Card, Events, and Scheduling logic are in src/Actions.js, src/Events.js, and src/Schedule.js, respectively.

Presentation concerns are in src/components/.

There's basically no tests.

# Credit

This project was built for an [APEX HSMP](https://www.apexforyouth.org/tag/hsmp/) 2021 end-of-year project.

Significant contributions were made by 2 high-schoolers in the program.


# Generic React stuff below...

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
