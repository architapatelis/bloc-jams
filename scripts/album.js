var setSong = function (songNumber) {
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber -1];
};

var getSongNumberCell = function (number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
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
        // wrap in parseInt, because attr will return a string that should be converted to number. 
        var songNumber = parseInt($(this).attr('data-song-number'));
        
        if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        } 
        if (currentlyPlayingSongNumber !== songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            $(this).html(pauseButtonTemplate);
            // currently playing song value changes from null to the song number we clicked on.
            // set index value of current song from album
            setSong(songNumber);
            updatePlayerBarSong();
            
        } else if (currentlyPlayingSongNumber === songNumber) {
            // Switch from Pause -> Play button to pause currently playing song.
            $(this).html(playButtonTemplate);
            // revert the HTML of the element to the  playerBarPlayButton template when the song is paused:
            $('.main-controls .play-pause').html(playerBarPlayButton);
            // set values to null since no song is currently playing.
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
        }
    };
    
    
    // when you mouse over a tr or it's td.
    var onHover = function(event) {
        // on the this row that fired the event, find() .song-item-number
        var songNumberCell = $(this).find('.song-item-number');
        
        // on that .song-item-number get the data-song-number attribute
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        //change the html of the table cell when the element does not belong to the currently playing song.
        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };
    
    
    // when you mouse leaves a tr or it's td. 
    var offHover = function(event) {
        // on this row that fired the event, find() .song-item-numer
        var songNumberCell = $(this).find('.song-item-number');
        // on that .song-item-bymer get the data-song-number atribute
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        //check that the item mouse is leaving is not the current song playing
        if (songNumber !== currentlyPlayingSongNumber) {
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
    currentAlbum = album;
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


//  match the currently playing song's object with its corresponding index in the songs array
var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};


// using the stored album info and the songs array update the player bar

var updatePlayerBarSong = function () {
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    
    // updates the HTML of the player bar play/pause button to the content of playerBarPauseButton
    $('.main-controls .play-pause').html(playerBarPauseButton);
    
};

var nextSong = function () {
    //get previous song
    var getLastSongNumber = function (index) {
        return index === 0 ? currentAlbum.songs.length : index;
    };
    
    // track index of current song from current album 
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // increment the song index
    currentSongIndex++;
    
    // situation in which the next song is the first song, following the final song in the album (that is, it should "wrap" around).
    if(currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    // Set a new current song
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    
    // Update the Player Bar information
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber) 
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

var previousSong = function() {
    // get previous song
    var getLastSongNumber = function(index) {
        return index === (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    
    // track index of current song from current album 
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // decrement index 
    currentSongIndex--;
    
    // set index to last song
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    // Set a new current song
    currentlyPlayingSongNumber = currentSongIndex + 1;
    currentSongFromAlbum = currentAlbum.songs[currentSongIndex];
    
    // Update the Player Bar information
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber)
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};


// play button for the song number
var playButtonTemplate = '<a class="album-song-button"><span class = "ion-play"></span></a>';

// pause button for the song number
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var playerBarPlayButton = '<span class="ion-play"></span>';

var playerBarPauseButton = '<span class="ion-pause"></span>';



// album info: when no album is playing the value is set to null
var currentAlbum = null;

// album info: Store state of playing songs. Initially set to null, so that no song is identified as playing until we click one. 
var currentlyPlayingSongNumber = null;

// album info: store the currently playing song object from the songs array (from album object)
var currentSongFromAlbum = null;

// jQuery selector for pervious Button
var $previousButton = $('.main-controls .previous');

// jQuery selector for next Button
var $nextButton = $('.main-controls .next');


$(document).ready(function () {
    setCurrentAlbum(albumPicasso);
    
    // jQuery click event handlers for previous song and next song.
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});