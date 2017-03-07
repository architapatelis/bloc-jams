//Store each album as an object
var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        {title: 'Blue', duration: '4:26'},
        {title: 'Green', duration: '3:14'},
        {title: 'Red', duration: '5:01'},
        {title: 'Pink', duration: '3:21'},
        {title: 'Magenta', duration: '2:15'},
    ]
};

//Another Example Album
var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        {title: 'Hello, Operator', duration: '1:01'},
        {title: 'Ring, ring, ring', duration: '5:01'},
        {title: 'Fits in your pocket', duration: '3:21'},
        {title: 'Can you hear me now?', duration: '3:14'},
        {title: 'Wrong phone number', duration: '2:15'},
    ]
};


var createSongRow = function (songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
    + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
    +   '   <td class="song-item-title">' + songName + '</td>'
    +   '   <td class="song-item-duration">' + songLength + '</td>'
    +   '</tr>'
    ;
    
    var $row = $(template);
    
    var clickHandler = function () {
        // on the this row that fired the event, get attribute data-song-number
        var songNumber = $(this).attr('data-song-number');
        if (currentlyPlayingSong !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
            currentlyPlayingCell.html(currentlyPlayingSong);
        } 
        if (currentlyPlayingSong !== songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            $(this).html(pauseButtonTemplate);
            // currently playing song value changes from null to the song number we clicked on.
            currentlyPlayingSong = songNumber;
            
        } else if (currentlyPlayingSong === songNumber) {
            // Switch from Pause -> Play button to pause currently playing song.
            $(this).html(playButtonTemplate);
            currentlyPlayingSong = null;
        }
    };
    
    
    // when you mouse over a tr or it's td.
    var onHover = function(event) {
        // on the this row that fired the event, find() .song-item-number
        var songNumberCell = $(this).find('.song-item-number');
        
        // on that .song-item-number get the data-song-number attribute
        var songNumber = songNumberCell.attr('data-song-number');
        
        //change the html of the table cell when the element does not belong to the currently playing song.
        if (songNumber !== currentlyPlayingSong) {
            songNumberCell.html(playButtonTemplate);
        }
    };
    
    
    // when you mouse leaves a tr or it's td. 
    var offHover = function(event) {
        // on this row that fired the event, find() .song-item-numer
        var songNumberCell = $(this).find('.song-item-number');
        // on that .song-item-bymer get the data-song-number atribute
        var songNumber = songNumberCell.attr('data-song-number');
        //check that the item mouse is leaving is not the current song playing
        if (songNumber !== currentlyPlayingSong) {
            songNumberCell.html(songNumber);
        }
    };
    
    
    // find the element with the .song-item-number class that's contained in whichever row is clicked.
    // click event listener executes the callback we pass to it when the target element is clicked.
    // Notice that clickHandler() no longer takes any arguments
    $row.find('.song-item-number').click(clickHandler);
    
    // hover combines mouseover and mouseleave. onHover and offHover and callback functions.
    $row.hover(onHover, offHover);
    
    // return $row, which is created with the event listeners attached.
    return $row; 
};


// to create album page
var setCurrentAlbum = function(album) {
    //#1
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');


    //use jQuery text() method to replace content of the text nodes. get values from album object
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    
    //clear table
    $albumSongList.empty();
    
    //go through the list of songs in album array and generate new tr and td. 
    for(var i=0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};



// substitute the play button for the song number
var playButtonTemplate = '<a class="album-song-button"><span class = "ion-play"></span></a>';

// pause button
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// Store state of playing songs. Initially set to null, so that no song is identified as playing until we click one. 
var currentlyPlayingSong = null;

$(document).ready(function () {
    setCurrentAlbum(albumPicasso);
});