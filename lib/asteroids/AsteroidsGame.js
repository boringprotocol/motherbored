import React, { Component } from 'react';
import Ship from './Ship';
import Asteroid from './Asteroid';
import { randomNumBetweenExcluding } from './helpers';
import styles from './style.module.css';
import { Howl } from 'howler'
import * as Tone from 'tone';

const thrustSound = new Howl({ src: ['./sounds/thrust.mp4'] });
const explosionSound = new Howl({ src: ['./sounds/explosion.mp4'], volume: 0.7 });
const hitSound = new Howl({ src: ['./sounds/hit.mp4'], volume: 0.8 });
const fireSound = new Howl({ src: ['/sounds/pew.mp4'], volume: 0.4 });

// import nostrFeed from '../../nostrFeed';

const KEY = {
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  A: 65,
  D: 68,
  W: 87,
  SPACE: 32,
  ENTER: 13
};

export default class AsteroidsGame extends Component {
  constructor(props) {
    super(props);
    this.startAudioContext = this.startAudioContext.bind(this)
    this.audioContext = Tone.context;
    this.points = 0;
    this.state = {
      currentScore: props.currentScore,
      topScore: props.topScore,
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      },
      context: null,
      keys: {
        left: 0,
        right: 0,
        up: 0,
        down: 0
      },
      asteroidCount: 3,
      currentScore: props.currentScore || 0,
      topScore: props.topScore || localStorage['topscore'] || 0,
      inGame: false
    }
    this.ship = [];
    this.asteroids = [];
    this.bullets = [];
    this.particles = [];

  }


  startAudioContext() {
    Tone.start()
  }

  handleTryAgainClick() {
    // resume the audio context
    this.audioContext.resume().then(() => {
      // your code to play the sound here
    });
  }

  handleResize(value, e) {
    this.setState({
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      }
    });
  }

  handleKeys(value, e) {
    let keys = this.state.keys;
    if (e.keyCode === KEY.LEFT || e.keyCode === KEY.A) keys.left = value;
    if (e.keyCode === KEY.RIGHT || e.keyCode === KEY.D) keys.right = value;
    if (e.keyCode === KEY.UP || e.keyCode === KEY.W) keys.up = value;
    if (e.keyCode === KEY.DOWN) keys.down = value;
    if (e.keyCode === KEY.SPACE) keys.space = value;
    if (e.keyCode === KEY.ENTER) keys.enter = value;
    this.setState({
      keys: keys
    });
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeys.bind(this, false));
    window.addEventListener('keydown', this.handleKeys.bind(this, true));
    window.addEventListener('resize', this.handleResize.bind(this, false));

    document.getElementById("radButtonId").addEventListener("click", async () => {
      await Tone.start();
      console.log("context started");
    });


    const context = this.refs.canvas.getContext('2d');
    this.setState({ context: context });
    this.startGame();
    requestAnimationFrame(() => { this.update() });
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.handleKeys);
    window.removeEventListener('keydown', this.handleKeys);
    window.removeEventListener('resize', this.handleResize);
  }

  update() {
    const context = this.state.context;
    const keys = this.state.keys;
    const ship = this.ship[0];

    let points = 0;
    this.asteroids.forEach((asteroid, i) => {
      // Check if asteroid is destroyed
      if (asteroid.destroyed) {
        explosionSound.play();
        points++;
      }
    });
    this.addScore(this.points);

    // update score
    let score = this.props.currentScore + points;
    let topScore = Math.max(score, this.props.topScore);
    this.props.setCurrentScore(score);
    this.props.setTopScore(topScore);

    this.checkCollisionsWith(this.bullets, this.asteroids, (bullet, asteroid) => {
      //increment points
      this.points++;
      //destroy asteroid
      this.destroyObject(asteroid, 'asteroids');
      this.destroyObject(bullet, 'bullets');
      //create particles
      this.createParticles(asteroid.position);
    });
    this.addScore(this.points);

    // 
    context.save();
    context.scale(this.state.screen.ratio, this.state.screen.ratio);

    // Motion trail
    context.fillStyle = '#1A1B1E';
    context.globalAlpha = 0.4;
    context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
    context.globalAlpha = 1;

    // Next set of asteroids
    if (!this.asteroids.length) {
      let count = this.state.asteroidCount + 1;
      this.setState({ asteroidCount: count });
      this.generateAsteroids(count)
    }

    // Check for colisions
    this.checkCollisionsWith(this.bullets, this.asteroids);
    this.checkCollisionsWith(this.ship, this.asteroids);

    // Remove or render
    this.updateObjects(this.particles, 'particles')
    this.updateObjects(this.asteroids, 'asteroids')
    this.updateObjects(this.bullets, 'bullets')
    this.updateObjects(this.ship, 'ship')

    context.restore();

    // Next frame
    requestAnimationFrame(() => { this.update() });
  }

  addScore(points) {
    if (this.state.inGame) {
      this.props.setCurrentScore(this.props.currentScore + points)
    }
  }

  destroyAsteroid(index) {
    if (this.asteroids[index].destroyed) {
      this.points++;
      this.addScore(this.points);
    }
  }

  startGame() {
    this.setState({
      inGame: true,
      currentScore: 0,
    });

    // Make ship
    let ship = new Ship({
      position: {
        x: this.state.screen.width / 2,
        y: this.state.screen.height / 2
      },
      create: this.createObject.bind(this),
      onDie: this.gameOver.bind(this)
    });
    this.createObject(ship, 'ship');

    // Make asteroids
    this.asteroids = [];
    this.generateAsteroids(this.state.asteroidCount)
  }

  gameOver() {
    this.setState({
      inGame: false,
    });

    // Replace top score
    if (this.state.currentScore > this.state.topScore) {
      this.setState({
        topScore: this.state.currentScore,
      });
      localStorage['topscore'] = this.state.currentScore;
    }
  }

  generateAsteroids(howMany) {
    let asteroids = [];
    let ship = this.ship[0];
    for (let i = 0; i < howMany; i++) {
      let asteroid = new Asteroid({
        size: 60,
        position: {
          x: randomNumBetweenExcluding(0, this.state.screen.width, ship.position.x - 60, ship.position.x + 60),
          y: randomNumBetweenExcluding(0, this.state.screen.height, ship.position.y - 60, ship.position.y + 60)
        },
        create: this.createObject.bind(this),
        addScore: this.addScore.bind(this)
      });
      this.createObject(asteroid, 'asteroids');
    }
  }

  createObject(item, group) {
    this[group].push(item);
  }

  updateObjects(items, group) {
    let index = 0;
    for (let item of items) {
      if (item.delete) {
        this[group].splice(index, 1);
      } else {
        items[index].render(this.state);
      }
      index++;
    }
  }

  checkCollisionsWith(items1, items2) {
    var a = items1.length - 1;
    var b;
    for (a; a > -1; --a) {
      b = items2.length - 1;
      for (b; b > -1; --b) {
        var item1 = items1[a];
        var item2 = items2[b];
        if (this.checkCollision(item1, item2)) {
          item1.destroy();
          item2.destroy();
        }
      }
    }
  }

  checkCollision(obj1, obj2) {
    var vx = obj1.position.x - obj2.position.x;
    var vy = obj1.position.y - obj2.position.y;
    var length = Math.sqrt(vx * vx + vy * vy);
    if (length < obj1.radius + obj2.radius) {
      return true;
    }
    return false;
  }

  render() {
    let endgame;
    let message;

    if (this.props.currentScore <= 0) {
      message = '0 points... So sad.';
    } else if (this.props.currentScore >= this.props.topScore) {
      message = 'Top score with ' + this.props.currentScore + ' points. Woo!';
    } else {
      message = this.props.currentScore + ' Points though :)'
    }

    if (!this.state.inGame) {
      endgame = (
        <div className="endgame px-12 pt-12">
          <p className="text-lg">Game over, eatsthit.sol!</p>
          <p className="text-xs" >{message}</p>

          <button
            id='radButtonId'
            className="cursor-pointer mt-12 inline-flex items-center rounded-sm border border-gray dark:border-black text-sm  bg-white dark:bg-black px-4 py-3 text-gray-dark dark:text-gray-light hover:bg-boring-white hover:shadow-lg active:opacity-90 shadow-md active:shadow-md"


            onClick={() => {
              this.startAudioContext(); // function that starts the context
              this.startGame();
            }}>
            Play Again
          </button>
        </div>
      )
    }

    return (
      <div className="">
          <div className='fixed right-0 pt-12 z-10 text-xs'>
            <div className="p-12">
            <h2 className='mb-2 mt-4'>leaderbored</h2>
            <ol className="text-gray-light">
              <li>1. heavymagma.sol: 1340973</li>
              <li>2. fran@getalby.com: 440973</li>
              <li>3. jack@walletofsatoshi.com: 65934</li>
              <li>4. narf.sol: 23487</li>
              <li>5. eatshit.sol: {this.props.topScore}</li>
            </ol>
            </div>

            {/* <nostrFeed /> */}

          </div>
        <div className="border-b border-gray-dark px-12 py-2 text-xs">
        <span className="score current-score float-left pr-6" >boring-asteroids: </span>


          <span className="score current-score float-left pl-4" >Score: {this.props.currentScore}</span>
          <span className="score top-score float-right pl-4" >Your Top Score: {this.props.topScore}</span>
          <span className="controls pl-4" >
            Use [A][S][W][D] or [←][↑][↓][→] to MOVE<br />
            Use [SPACE] to SHOOT</span>
            
        </div>
        <canvas ref="canvas"
          className={styles['AsteroidsCanvas']}
          width={this.state.screen.width * this.state.screen.ratio}
          height={this.state.screen.height * this.state.screen.ratio}
        />

        {endgame}

      </div>
    );

  }
}
