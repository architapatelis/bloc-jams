var collectionItemTemplate =    
    '<div class="collection-album-container column fourth">'
+'      <img src="assets/images/album_covers/01.png" alt="album cover">'
+'      <div class="collection-album-info caption">'
+'          <p>'
+'              <a class="album-name" href="album.html">The Colors</a>'
+'              <br/>'
+'              <a href="album.html">Pablo Picasso</a>'
+'              <br/>'
+'              X songs'
+'              <br/>'
+'          </p>'
+'      </div>'
+'</div>'
;

window.onload = function () {
    // The  collection of album is contained within the "album-covers" class element (<section>)
    var collectionContainer = document.getElementsByClassName('album-covers')[0];
    
    // Clear the contents of the HTML just in case something else has been dynamically inserted
    collectionContainer.innerHTML = '';
    
    // Insert N number of albums into the collectionContainer (<section>)
    for(var i = 0; i < 12; i++) {
        collectionContainer.innerHTML += collectionItemTemplate;
    }
}