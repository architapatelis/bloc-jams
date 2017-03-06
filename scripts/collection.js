// when naming action-oriented functions, it's a convention to start the function name with a verb.
var buildcollectionItemTemplate = function () { 
    var template = 
     '<div class="collection-album-container column fourth">'
    +'  <img src="assets/images/album_covers/01.png" alt="album cover">'
    +'  <div class="collection-album-info caption">'
    +'      <p>'
    +'          <a class="album-name" href="album.html">The Colors</a>'
    +'          <br/>'
    +'          <a href="album.html">Pablo Picasso</a>'
    +'          <br/>'
    +'          X songs'
    +'          <br/>'
    +'      </p>'
    +'  </div>'
    +'  </div>'
    ;
    // wrap template in a jQuery object, in case we want to use jQuery methods on it in the future. 
    return $(template);
};


$(window).load(function() {
    // The  collection of album is contained within the "album-covers" class element (<section>)
    var $collectionContainer = $('.album-covers');
    
    // Clear the contents(children) of collectionContainer section just in case something else has been dynamically inserted
    $collectionContainer.empty();
    
    // Insert N number of albums into the collectionContainer (<section>)
    for(var i = 0; i < 12; i++) {
        var $newThumbnail = buildcollectionItemTemplate();
        // With each loop, we append the template content to the collection container.
        $collectionContainer.append($newThumbnail);
    }
});