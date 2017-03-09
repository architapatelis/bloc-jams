// assign the current song
var setSong = function (songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber -1];
    
    // wrap an audio file in the buzz.sound constructor fuction.
    // using 'new' assign/create a new Buzz object
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        
        // array of strings with acceptable audio formats. 
        formats: [ 'mp3' ],
        //want mp#s loaded as soon as the page loads. 
        preload: true
    });
    
    setVolume(currentVolume);
};


// seek to parts of a song, clicking a new location should seek to th corresponding position on seek-bar
var seek = function(time) {
    // if song is playing
    if (currentSoundFile) {
        //uses the Buzz setTime() method to change the position in a song to a specified time.
        currentSoundFile.setTime(time);
    }
};
    

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
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
            currentSoundFile.play();
            // so seek bar moves as song plays
            updateSeekBarWhileSongPlays();
            updatePlayerBarSong();
            
            // update the fill and thumb of the volume seek bar
            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            eThumb.css({left: currentVolume + '%'});
            
        } else if (currentlyPlayingSongNumber === songNumber) {
            // when the user clicks the pause button for the same song that is playing.
            //if currently playing song is already paused, when we resume it do this.
            if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
                // so seek bar moves as song plays
                updateSeekBarWhileSongPlays();
            } // when we pause the currently playing song
            else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();
            }
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


// update time on seek bar
var updateSeekBarWhileSongPlays = function() {
    //if song is playing
    if (currentSoundFile) {
        // timeupdate is a custom Buzz event that fires repeatedly while time elapses during song playback
        currentSoundFile.bind('timeupdate', function(event) {
            // use Buzz's  getTime() method to get the current time (in seconds) of the song and the getDuration() method for getting the total length (in seconds) of the song.
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
    }
};


// to set width and left properties in CSS for the .fill and .thumb selectors
var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    // multiply by 100 to get percentage
    // setupSeekBars() will determine seekBarFillRatio
    var offsetXPercent = seekBarFillRatio * 100;
    
    //make sure percentage isn't less than 0%
    offsetXPercent = Math.max(0, offsetXPercent);
    
    //make sure it doesn't exceed 100%
    offsetXPercent = Math.min(100, offsetXPercent);
    
    //convert % to a string and add % character
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
};


//  match the currently playing song's object with its corresponding index in the songs array
var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};


// following code uses click event to determine the fill width and thumb location of the seek bar. It will determine the seekBarFillRatio for updateSeekPercentage()
var setupSeekBars = function() {
    // use jQuery to find all elements in the DOM with a class of  "seek-bar" that are contained within the element with a class of "player-bar". This will return a jQuery wrapped array containing both the song seek control and the volume control.
    var $seekBars = $('.player-bar .seek-bar');
    
    // add a click event to the seek-bar. depending on where user clicked, seekBar will either be for song or volume. 
    
    $seekBars.click(function(event) {
        //pageX is a jQuery-specific event value, which holds the X (or horizontal) coordinate at which the event occurred.
        // offset() of this seekBar is determine from left side of the page to the starting point of the seekbar
        var offsetX = event.pageX - $(this).offset().left;
        // store wdith of entire seek bar
        var barWidth = $(this).width();
        
        //find ratio to determine where the fill and thumb should end up
        var seekBarFillRatio = offsetX / barWidth;
        
        // conditions to check if its the song seek control of volume control
        if ($(this).parent().attr('class') === 'seek-control') { 
            // seek to the corresponding position in the song.this changes the position not the visible time stamp.
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);
        }
        //pass arguments to update CSS .fill/width and .thumb/left
        updateSeekPercentage($(this), seekBarFillRatio);
        
    });
    
    // call mousedown on a jQuery collection 
    // click event fires as soon as mouse is pressed down on the seekBar thumb. 
    $seekBars.find('.thumb').mousedown(function(event) {
        // 'this' is the thumb that was clicked
        // parent() tells us if it was the song seek control thumb or the volume control thumb
        var $seekBar = $(this).parent();
        

        //attach mousemove to $(document) to make sure that we can drag the thumb after mousing down, even when the mouse leaves the seek bar. Better user experience
        // event.nameSpace makes the event more specific by attaching a string to the event after a period
        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            
            if ($seekBar.parent().attr('class') === 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());
            } else {
                setVolume(seekBarFillRatio);
            }
            
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
        
        
        //we bind the mouseup event with a .thumb namespace.
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });   
    });
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
    setSong(currentSongIndex + 1);
    
    //to play a song when we click next
    currentSoundFile.play();
    // move seek bar as song plays
    updateSeekBarWhileSongPlays();
    
    // Update the Player Bar information
    //updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber); 
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
    setSong(currentSongIndex + 1);
    
    // play a song when we click previous
    currentSoundFile.play();
    //move seek bar as song plays
    updateSeekBarWhileSongPlays();
    
    // Update the Player Bar information
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
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

// store the sound object in a variable when we set a new current song. Initially set to null
var currentSoundFile = null;

//set song volume (Buzz sclae is 0-100)
var currentVolume = 80;

// jQuery selector for pervious Button
var $previousButton = $('.main-controls .previous');

// jQuery selector for next Button
var $nextButton = $('.main-controls .next');


$(document).ready(function () {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    
    // jQuery click event handlers for previous song and next song.
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
});