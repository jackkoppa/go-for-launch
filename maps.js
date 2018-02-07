function initMap() {
    var center = { lat: 0, lng: 0 };
    var infowindow = new google.maps.InfoWindow();
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 2,
        center: center
    });

    COORDINATES.forEach(coord => {
        marker = new google.maps.Marker({
            position: coord.location,
            map: map
        });

        var marker, i;

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infowindow.setContent(`
                    <div class="main-info">
                        <span>${coord.redditAddress}</span><br/>
                        <a href="${coord.link}" title="Visit /u/${coord.user}'s Comment" target="_blank">/u/${coord.user}</a>
                    </div>
                    <div class="secondary-info">
                        <span class="title">Returned From Google Geocoding:</span>
                        <p>${coord.formattedAddress}</p>
                        <p>Lat: ${coord.location.lat}, Long: ${coord.location.lng}</p>
                    </div>
                `);
                infowindow.open(map, marker);
            }
        })(marker, i))
    });
}