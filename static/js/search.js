var fuse; // holds our search engine
var list = document.getElementById('searchResults'); // targets the <ul>
var first = list.firstChild; // first child of search list
var last = list.lastChild; // last child of search list
var maininput = document.getElementById('searchInput'); // input box for search
var resultsAvailable = false; // Did we get any search results?

// ==========================================
// The main keyboard event listener running the show
//


window.onload = loadSearch;
//loadSearch(); // loads our json data and builds fuse.js search index


// ==========================================
// execute search as each character is typed
//
document.getElementById("searchInput").onkeyup = function(e) { 
  executeSearch(this.value);
}


// ==========================================
// fetch some json without jquery
//
function fetchJSONFile(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(httpRequest.responseText);
          if (callback) callback(data);
      }
    }
  };
  httpRequest.open('GET', path);
  httpRequest.send(); 
}


// ==========================================
// load our search index, only executed once
// on first call of search box (CMD-/)
//
function loadSearch() { 
  fetchJSONFile('/index.json', function(data){

    var options = { // fuse.js options; check fuse.js website for details
      shouldSort: true,
      location: 0,
      distance: 100,
      threshold: 0.4,
      minMatchCharLength: 2,
      keys: [
        'database_title',
        'description',
        'unit_of_observation',
	'time_series',
	'publication_year',
	'version',
	'date_added',
	'tags'
        ]
    };
    fuse = new Fuse(data, options); // build the index from the json file
  });
}


// ==========================================
// using the index we loaded on CMD-/, run 
// a search query (for "term") every time a letter is typed
// in the search box
//
function executeSearch(term) {
  let results = fuse.search(term); // the actual query being run using fuse.js
  console.log(results)

  let searchitems = ''; // our results bucket

  if (results.length === 0) { // no results based on what was typed into the input box
    resultsAvailable = false;
    searchitems = '';
  } else { // build our html 
    for (let item in results.slice(0,5)) { // only show first 5 results

    let tags = '';

    if (!(results[item].item.tags.length === 0)) {
	tags = 'tags: ';
	    for (let tag in results[item].item.tags) {
		    tags += '<li>' + results[item].item.tags[tag] + '</li>';
	    }
    }
	    console.log(tags)

    searchitems = searchitems + '<a href=' + results[item].item.url + '><span class="title">' + results[item].item.database_title + '</a></span><br/><br/>'+ results[item].item.description + '<br/><br/><ul class="tags">' + tags + '</ul><hr>';
    }
  resultsAvailable = true;
  }
  document.getElementById("searchResults").innerHTML = searchitems;
}
