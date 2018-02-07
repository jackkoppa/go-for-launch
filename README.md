# Falcon Heavy - Go For Launch
Map visualization of the maiden Falcon Heavy launch, pulled from https://www.reddit.com/r/spacex/

Specifically, [this thread](https://www.reddit.com/r/spacex/comments/7vg63x/rspacex_falcon_heavy_test_flight_official_launch/dttm08w/).

## Running:
* Requires simple http server, & a Google Maps Javascript API key
```shell
git clone https://github.com/jackkoppa/go-for-launch.git
cd go-for-launch
```
* In `maps.js`, replace `MAPS_JS_KEY` with your own key (since the default is domain-controlled); can be generated [here](https://developers.google.com/maps/documentation/javascript/) with any Google Account
* If you don't have a simple http server already in mind, you can use one from npm:
```shell
npm install -g http-server
```
* Finally, run the server. Assuming the npm package was installed:
```shell
http-server -p 8080
```
* Project is now available at [http://localhost:8080/](http://localhost:8080/)

## Notes
* The site does not auto-update, and requires a fresh crawl of the reddit thread in order to retrieve the newest comments & coordinates, then a fresh push to the repo for GitHub pages to update.
* This functionality could certainly be moved to a server, that relies on the reddit API (as well as the Geocoding API, which is already the case)
* However, the marginal benefits did not seem to justify the additional setup effort (especially since GitHub pages is for static sites only), given that the comments should no longer update if we wish to maintain fidelity to the original content
* As a fun project, though, creating a simple API for this UI to call could be fun, and I would be happy to work with someone on that effort (likely an Express backend) 