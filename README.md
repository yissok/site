# scout

app that watches your pace and tells you if you need to hurry or relax

# Installation

one time setup

```bash
npm install --save-dev prettier prettier-plugin-svelte

# On Linux
rm -rf .vscode
ln -s .vscode-linux .vscode

# On mac
rm -rf .vscode
ln -s .vscode-mac .vscode
```

## TODO

```

TODO (unsorted):
-
-
-
-
-

TODO (time consuming and essential):
- implement reset of all the speeds in the timewindow to 4kmh when doing big jumps that are unreasonably fast
- get html geolocation pulsars back
- fix mobile app crash
- integrate upload flow into new overlay to have it work end to end
- core logic
    - allow user to push arrival time back or forwards
    - when they press START JOURNEY then provide a traffic light style banner that says
        - go faster
        - go slower
        - keep this pace
- draw mode
    - allow user to move around polyline
    - allow user to draw polyline
- gomitolo di arianna mode
    - let user know he is in a "recording mode", trailing the path
    - ask user to name the path that will be saved now and will receive new points soon
    - record every 5 seconds the location if >10m from last point
    - every 5 dots persist the trailed path
    - if app is closed or user terminates then stop recording mode
- edit path btn
- duplicate path btn

TODO (easy and essential):
- have logic to say "go faster" / "go slower" or some colour coding on the speedometer

TODO (easy not essential):
- add a follow my location blue arrow toggle
- grey dot when no gps available
- load reverse path from save list button



CELL TODOS:
- ad default path with bot for local dev
- decreasing image size/definition seems to help?????
- do one round of goodFeaturesToTrack, get clusters, then do 2nd round in the 10px radius and if there is no blob that is brighter than the surroundings then it's false positive (dot threshold 163, cluster distance 7px, minimum size 0.04), if there is a white blob then it's like putting a golf ball into it, then you create a 10px radius black hole around the blob where future goodFeaturesToTrack pins will be ignored
- new tab with cell mixture volume for 10 mls in "cells 10ml="
-current tab called splitting guide, new tab called cell count, so elean can copy just part of the things and not have to delete
- make results bold/ make it a table



DONE:
- hide dev buttons
- have a "start journey" button, with modal with selection of target arrival time
- wizard to start navigation
    - add new button START JOURNEY
    - allow to pick from
        - saved
        - draw new
            - load draw mode
            - allow user to select which end is destination
            - make user save
    - preview mode will appear
    - GO! button
    x hide all buttons, make them visible if you tap 5 times the top div within 3 seconds
- in ios app inject js to set a flag basically telling the web app "yo we live in ios", so that when that is not present then you can request location via the browser
- show timer to end of path based on the window of the last x (start with 1) measuerements
- when zooming, hide both gps dots and draw dot on map instead
- fix manual selection of location no work
- fix askign location randomly
- as of now you are tying the current speed to the movement between now and x minutes ago, whereas it should be more of a smooth thing, instead of window of locations, it should be window of speeds, speed now is the average from the last x min speed at every point in time for the last x minutes, that way when you stop it
- change speedwindow svelte to calculate speed every 5 seconds, adn that is what gets stored in all buffers, that way it's like having the speed at every instant, allowing you to make more accurate predictions right?, then you can calculate the etas based on the average speed of the last 1,5,10 minutes
- draw gifs using leaflet instead of complicating things
- in the biningi screen if user doesnt allow gps then allows then user is still in the middle of the ocean, have the tick trigger a mapview update
- dont make default path appear
- initial location gps not updated
- track user real time every 5 seconds
- organised menu bar for all the options/action buttons
- blue radar gif for gps dot
- make bot more like user, extrapolate broadcasting of positions, use same svelte for representing bot and user positions
- disable select by keeping pressed
- reposition bot sometimes not moving
- also store start location and move origin point and camera when loading
- localstorage page where u store all users polylines
- to enhance smoothness, input polyline should be normalised i.e. there are some parts of the polyline which will be long lines, we want to break up these small lines to give more granular measurememnts
- identify start and target on line
    - get red pin location
    - get closest point in polyline to red pin
    - that point will allow you to label both ends
- create walking bot
    - slider for bot speed
    - bot should broadcast its lat lng every second
    - path will be predetermined and will be basically the polyline +- random error introduced
    - bot will walk from one of these random points to the next one in polyline
    - bot will respawn from start once he reached end
    - progress on line will be dictated by closest point on polyline
        - polyline progress should not always look for closest point, we know the current point of the bot and we know what the next one will be, so just measure when the bot passes from closest to current to closest to next one, time taken since this previous tick and the distance between the midpoints will give speed
- integrate screenshots and polyline placement
- test with start position being top right, top left and bottom left too
- create url paths for maps tabs
- while placing polyline first time, resize it to be in the middle and not go off screen
- positioning not consistent when resizing (e.g. youre zoom level 10 and you placed the polyline, now you go to level 1 and resize, go back to level 10 and see that it moved)
- prevent line flattening
- make resize overlay have symbol up down so user knows
- have a scale button with up down arrows centered on the start location and allow just those 2 btns to do the scaling
- manual placing of polyline on map
- fix polyline ordering bugs
- bring html leaflet into page svelte
- draw pins


NICE TO HAVE TODOS (not easy not essential):
- slider in overlay where you can drag it up to "time when journey started" seconds ago, so you can choose the granularity of the average
- enhance bot slider so it displays the target bot speed
- allow scaling through direct tapping/dragging to the target destination, tap location will map to closest point in diagonal formed by start point and end point, all other points will adjust
- normalise dots again by taking average distance and making that the actual distance between each dot by creating new dots

```
