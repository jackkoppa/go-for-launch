/*
*
* Instructions
*
*/
// 1. Go to the reddit thread w/ locations: https://www.reddit.com/r/spacex/comments/7vg63x/rspacex_falcon_heavy_test_flight_official_launch/dttm08w/
// 2. Copy this entire file (CTRL + A, CTRL + C)
// 3. Paste into dev tools console (https://developers.google.com/web/tools/chrome-devtools/console/), press "Enter" 
// 4. Wait for final message saying "Coordinates are ready!"
// 5. Paste into `../manually-retrieved-coordinates.js` file, replacing everything (CTRL + A, CTRL + V)

const GEOCODE_KEY = 'AIzaSyBffhukdBQU5DXDmp3cqyQJeqcVaZpAPZw' // Can use when running locally, as reddit.com/r/spacex is an allowed domain
const GEO_URL = 'https://maps.googleapis.com/maps/api/geocode/json?';
const COMMENT_REG_EXPS = [
    new RegExp(/([\w\u00C0-\u017E][\w\u00C0-\u017E\s\,]+)[iI][sS]\s[gG][oO].*/), // (City Name, State Name, Country Name, More Names) is Go {anything else}
    new RegExp(/([\w\u00C0-\u017E][\w\u00C0-\u017E\s\,]+)[wW][aA][sS]\s[gG][oO].*/), // (City Name, State Name, Country Name, More Names) was Go {anything else}
    new RegExp(/([\w\u00C0-\u017E][\w\u00C0-\u017E\s\,]+)[\s\.\,\-]+[gG][oO].*/), // (City Name, State Name, Country Name, More Names) - GO {anything else}
    new RegExp(/([\w\u00C0-\u017E]+,\s[\w\u00C0-\u017E]+)\s.*/) // (CityName, CountryName) {anything else}
]

var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}

let comments = [];
let coordinates = [];
let client = new HttpClient();

let findAncestor = (el, cls) => {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

let clickComments = (spans) => {
    let moreCommentsLinks = spans[spans.length - 1].getElementsByTagName('a');
    let link = moreCommentsLinks && moreCommentsLinks[0]
    if (link.innerText != 'loading...')
        link.click();
}

let waitForAllComments = new Promise(resolve => {
    console.group('Clicking "More Comments" until all comments are loaded')
    let copyFn = window.copy;
    let interval = setInterval(function() {
        console.count('wait interval');
        let moreCommentsSpans = document.getElementsByClassName('morecomments');
        if (!moreCommentsSpans || moreCommentsSpans.length === 0 ) {
            console.groupEnd();
            console.log('Finished getting all comments');
            clearInterval(interval);
            addComments();            
            resolve(copyFn);
        } else {
            clickComments(moreCommentsSpans);
        }
    }, 100)
});

let addComments = () => {
    let userElements = document.getElementsByClassName('usertext-body');
    
    Array.prototype.forEach.call(userElements, element => {
        let pTags = element.getElementsByTagName('p');
        let parentEntry = element.closest('div.entry');
        let tagline = parentEntry && parentEntry.getElementsByClassName('tagline');
        let authorTags = tagline && tagline[0] && tagline[0].getElementsByClassName('author');
        let flatList = parentEntry && parentEntry.getElementsByClassName('flat-list');
        let byLinkTags = flatList && flatList[0] && flatList[0].getElementsByClassName('bylink');
        
        if (pTags[0] && pTags[0].innerText) {
            let newComment = {
                text: pTags[0].innerText,
                user: authorTags && authorTags[0] && authorTags[0].innerText,
                link: byLinkTags && byLinkTags[0] && byLinkTags[0].href
            }
            comments.push(newComment)
        };
    });
}

let getCoordinates = (copyFn) => {
    console.log('Now determining correct comments to get coordinates for');

    let matchedComments = comments.map(comment => {
        let pattern = COMMENT_REG_EXPS.find(regExp => {
            let match = regExp.exec(comment.text);
            return match && match[1]
        });
        let confirmedMatch = pattern && pattern.exec(comment.text);
        let newComment = {};
        newComment.original = confirmedMatch && 
            confirmedMatch[1] &&
            confirmedMatch[1]
                .trim()
                .replace(/\,$/, '') || // remove trailing commas
            undefined;
        newComment.formatted = confirmedMatch && 
            confirmedMatch[1] && 
            confirmedMatch[1]
                .trim()
                .replace(/[\.\,\-\s]+/g, '+') || 
            undefined;
        newComment.user = comment.user;
        newComment.link = comment.link;
        return newComment;
    });

    let filteredComments = matchedComments.filter(comment => comment.formatted != null);

    console.log(filteredComments, matchedComments);
    filteredComments.forEach((comment, index) => {
        let requestURL = `${GEO_URL}address=${filteredComments[index].formatted}&key=${GEOCODE_KEY}`;
        console.log(filteredComments[index].formatted)
        client.get(requestURL, (response) => {
            if (response) {
                try {
                    let parsed = JSON.parse(response);
                    if (parsed.status == 'OK') {
                        let result = parsed.results[0];
                        let coords = {
                            redditAddress: filteredComments[index].original,
                            formattedAddress: result.formatted_address,
                            location: result.geometry.location,
                            user: filteredComments[index].user,
                            link: filteredComments[index].link
                        };
                        coords.redditAddress = filteredComments[index].original;
                        coords.formattedAddress = result.formatted_address;
                        coords.location = result.geometry.location;
                        coordinates.push(coords);                       
                    }  
                }
                catch (err) {
                    console.error(`Failed to push response coordinates with err: ${err}`);
                }
            }            
        });
    });

    console.log('Please wait, retrieving coordinates now...');

    let finalCopyFn = copyFn;
    setTimeout(() => {
        let copyString = `const COORDINATES = ${JSON.stringify(coordinates)}; 
        const UPDATED_DATE = "${new Date().toUTCString()}"`
        finalCopyFn(copyString);
        console.log('Coordinates are ready!')
        console.log('You can now Paste into the `../manually-retrieved-coordinates.js` file');
    }, 4000)
}

waitForAllComments.then((copyFn) => {
    getCoordinates(copyFn);
});