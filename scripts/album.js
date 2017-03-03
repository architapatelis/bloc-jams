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
    
    return template;
};


// to create album page
var setCurrentAlbum = function(album) {
    //#1
    var albumTitle = document.getElementsByClassName('album-view-title')[0];
    var albumArtist = document.getElementsByClassName('album-view-artist')[0];
    var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
    var albumImage = document.getElementsByClassName('album-cover-art')[0];
    var albumSongList = document.getElementsByClassName('album-view-song-list')[0];


    //get values from album object
    albumTitle.firstChild.nodeValue = album.title;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);
    
    //clear table
    albumSongList.innerHTML = '';
    
    //#4
    for(var i=0; i < album.songs.length; i++) {
        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    }
};

//traverse the DOM upwards until we find specified class name parent of the element that fired an event.
var findParentByClassName = function(element, targetClass) {
    if(element) {
        var currentParent = element.parentElement;
        if(currentParent === null) {
            return console.log('No parent found');
        }
        while (currentParent.className !== targetClass && currentParent.className !== null) {
            currentParent = currentParent.parentElement;
            if(currentParent === null) {
            return console.log('No parent found with that class name');
        }
        }
    }
        return currentParent;
};

// getSongItem() method, will always return the element with the .song-item-number class.
// switch evaluates event element's className, then matches it to 'case' and executes code when match found.  
var getSongItem = function(element) {
    switch (element.className) {
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        case 'song-item-title':
        case 'song-item-duration':
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;
    }
};

var clickHandler = function(targetElement) {
    // Store the .song-item-number element
    var songItem = getSongItem(targetElement);
    
    // if there is currently no song playing (null).
    if (currentlyPlayingSong === null) {
        // when we click a song to paly it the song number turns into pause icon.
        songItem.innerHTML = pauseButtonTemplate;
        // currently playing song value changes from null to the song number we clicked on.
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    // if we click pause on currently playing song
    } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
        // change icon from pause to play
        songItem.innerHTML = playButtonTemplate;
        // since no song is playing we set it back to null
        currentlyPlayingSong = null;
    // if we switch to a new song. (active song !== clicked new song)
    } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
            var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
            currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
            songItem.innerHTML = pauseButtonTemplate;
            currentlyPlayingSong = songItem.getAttribute('data-song-number');
            
        }  
    };

//Elements we'll be adding Listners to 

// #1 table element 
var songListContainer = document.getElementsByClassName('album-view-song-list')[0]; 

// #2 <tr> element
var songRows = document.getElementsByClassName('album-view-song-item');

// substitute the play button for the song number
var playButtonTemplate = '<a class="album-song-button"><span class = "ion-play"></span></a>';

// pause button
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// Store state of playing songs. Initially set to null, so that no song is identified as playing until we click one. 
var currentlyPlayingSong = null;

window.onload = function () {
    setCurrentAlbum(albumPicasso);
    
    // use event delegation to track the mouse's position. moused-over elements will fire an event that eventually registers with the table's (parent element) event listener.
    songListContainer.addEventListener('mouseover', function (event) {
        //The target property on the event object stores the DOM element <td> where the event occurred. console.log(event.target);
        
        // only target individual song rows <tr> during event delegation
        if (event.target.parentElement.className === 'album-view-song-item') {
            // Change the content from the number to the play button's HTML
            //event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
            
            // use getSongItem to get song-item-number the mouse is over
            var songItem = getSongItem(event.target);
            
            //change the innerHTML of the table cell when the element does not belong to the currently playing song.
            if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
                songItem.innerHTML = playButtonTemplate;
            }
        }  
    });
    
    // To revert the button back to the number
    // select an array of every table row <tr> and loop over each to add its event listener:
    for (var i = 0; i < songRows.length; i++) {
        songRows[i].addEventListener('mouseleave', function (event) {
            
            //Selects first child element, which is the song-item-number element
            //this.children[0].innerHTML = this.children[0].getAttribute('data-song-number');

            // use getSongItem instead of 'this' to get song-item-number the mouse is leaving
            // store the number of song our mouse is leaving
            var songItem = getSongItem(event.target);
            var songItemNumber = songItem.getAttribute('data-song-number'); 
            
            // check that the item mouse is leaving is not the current song playing
            if (songItemNumber !== currentlyPlayingSong) {
                songItem.innerHTML = songItemNumber;
            }
        });
        
        //to register the click that will eventually change the value of currentlyPlayingSong, add an event listener for the click event, on table row parent.
         songRows[i].addEventListener('click', function(event) {
             // Event handler call
             clickHandler(event.target);
         });
    }
};