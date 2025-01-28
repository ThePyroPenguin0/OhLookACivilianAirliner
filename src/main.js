/*
 * Name: Gabriel Lipow (gabylipow@gmail.com, glipow@ucsc.edu, gabriel.lipow@nps.edu)
 * Title: Oh Look, a Civilian Airliner: A Surface-to-Air Simulation
 * Hours of work: 11-12
 * Mods chosen:
 * Create(d) a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (5)
 * Implement(ed) an alternating two-player mode (5)
 * Implement(ed) a new timing/scoring mechanism that adds time to the clock for successful hits and subtracts time for misses (5)
 * Implement(ed) mouse control for player movement and left mouse click to fire (5)
 * Credits:
 *      Plane sprites: Gabriel Lipow (from the game AEGIS)
 *      Sounds: Launch sounds spliced by Joe Hargon, originally from the DotMod (2024) for the game "Cold Waters" (2017), explosion from freesound_community via pixabay
 *      Background sprite: Reddit, attributed to user u/vSv_Entertainment
 *      Explosion spritesheet: PNGEgg.com
 */
let config =
{
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [Menu, Play],
    render: {
        pixelArt: true
    },

    fps: // This is intentional - I wanted to have a little bit of that retro refresh rate effect :)
    {
        target: 24,
        forceSetTimeOut: true,
    },
};

let game = new Phaser.Game(config);

let borderUISize = game.config.height / 25;
let borderPadding = 10;

let keyFIRE, keyRESET, keyLEFT, keyRIGHT;