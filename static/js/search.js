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
document.getElementById("searchInputSmall").onkeyup = function(e) { 
  executeSearch(this.value, 1, 1, 5);
}
document.getElementById("searchInputLarge").onkeyup = function(e) { 
  executeSearch(this.value, 1, 1, 8);
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
    executeSearch('', 1); // execute search with empty term and page 
  });
}

// ============================================
// Make the div containing the links at the
// bottom of the page to different pages
//

function buildPageLinks(page, firstPage, lastPage, totalPages, term) {

    if (firstPage < 1) {
	    let overshoot = 1 - firstPage;
	    firstPage = 1;
	    lastPage = lastPage + overshoot;
	}

    if (lastPage > totalPages) {
	    let overshoot = (lastPage - totalPages);

	    lastPage = totalPages;

	    if ((firstPage - overshoot) >= 1) {
		    firstPage = firstPage - overshoot;
	    } else {
		    firstPage = 1;
	    }
    }

    let pagination = '';
    let pagination_width = lastPage - firstPage;

    if (totalPages > 1) {
        pagination += '<ul class="pagination">';

      if (page > 1) {
        pagination += '<li><a href="#" class="page" onclick="executeSearch(\'' + term + '\', ' + (page - 1) + ', ' + firstPage + ', ' + lastPage + ')">&laquo;</a></li>';
      } else {
        pagination += '<li class="disabled">&laquo;</li>';
      }

      if (firstPage > 1) {
	      pagination += '<li><a href="#/" class="page" onclick="buildPageLinks(' + page + ', ' + (firstPage - 3) + ', ' + (lastPage - 3) + ', ' + totalPages + ', \'' + term + '\')">&#8230;</a></li>';
	      pagination_width -= 1;
}
      if (lastPage < totalPages) {
	       pagination_width -= 1;
      }
      for (let i = firstPage; (i <= (firstPage + pagination_width)) && (i <= lastPage); i++) {
		      if (i === page) {	
			      pagination += '<li class="active">' + i + '</li>';
		      } else {
			      pagination += '<li><a href="#" class="page" onclick="executeSearch(\'' + term + '\', ' + i + ', ' + firstPage + ', ' + lastPage + ')">' + i + '</a></li>';
		      }
      }

      if (lastPage < totalPages) {
	      pagination += '<li><a href="#/" class="page" onclick="buildPageLinks(' + page + ', ' + (firstPage + 3) + ', ' + (lastPage + 3) + ', ' + totalPages + ', \'' + term + '\')">&#8230;</a></li>';

      }
      if (page < totalPages) {
        pagination += '<li><a href="#" class="page" onclick="executeSearch(\'' + term + '\', ' + (page + 1) + ', ' + firstPage + ', ' + lastPage + ')">&raquo;</a></li>';
      } else {
        pagination += '<li class="disabled">&raquo;</li>';
      }

      pagination += '</ul>';
      }
    document.getElementById("pagination").innerHTML = pagination;
};

// ==========================================
// using the index we loaded on page load, run 
// a search query (for "term") every time a letter is typed
// in the search box
//
function executeSearch(term, page, firstPage, lastPage) {

  let results = fuse.search(term); // the actual query being run using fuse.js
  let searchitems = ''; // our results bucket
  const itemsPerPage = 5;

  if (results.length === 0) { // no results based on what was typed into the input box
    searchitems = '';
  } else { // build our html
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const slicedResults = results.slice(start, end);

    for (let item in slicedResults) { // only show first 5 results

    let tags = '';

    if (!(slicedResults[item].item.tags.length === 0)) {
	tags = 'tags: ';
	    for (let tag in slicedResults[item].item.tags) {
		    tags += '<li>' + slicedResults[item].item.tags[tag] + '</li>';
	    }
    }
    if (slicedResults[item].item.description === null) {
	    slicedResults[item].item.description = "<em>Description not available.</em>"
    }

    searchitems = searchitems + '<div id="result">' + '<a href=' + slicedResults[item].item.url + '><span class="title">' + slicedResults[item].item.database_title + '</a></span><br/><br/>'+ slicedResults[item].item.description + '<br/><br/><ul class="tags">' + tags + '</ul><hr></div>';
    }
  resultsAvailable = true;
  }
  document.getElementById("searchResults").innerHTML = searchitems;
    // build pagination links
    const totalPages = Math.ceil(results.length / itemsPerPage);
    buildPageLinks(page, firstPage, lastPage, totalPages, term);
}
