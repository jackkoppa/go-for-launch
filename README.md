# Falcon Heavy - Go For Launch
Map visualization of the maiden Falcon Heavy launch, pulled from https://www.reddit.com/r/spacex/

Specifically, [this thread](https://www.reddit.com/r/spacex/comments/7vg63x/rspacex_falcon_heavy_test_flight_official_launch/dttm08w/).

## Notes
* In the next day or two, will be adding the scripts used to "manually" get the names & coordinates of cities.
* Currently DOM crawling the reddit thread for relevant comments, parsing, and then sending a Geocode request for each comment that matches a pattern, in order to get the `manually-retrieved-coordinates.js`