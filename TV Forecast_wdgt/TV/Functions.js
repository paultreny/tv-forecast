// Returns the search URL for the specified search text
function tvShowSearchUrl(text)
{
    return "http://services.tvrage.com/feeds/search.php?show=" + escape(text);
}

// Parses TV show search results
function parseTvShowSearchResults(xml)
{
    var results = new Array();

    var child_nodes = xml.documentElement.childNodes;

    for (var i = 0; i < child_nodes.length; ++i)
	{
	    if (child_nodes[i].tagName == 'show')
	    {
	        var name = findChild(child_nodes[i], 'name').firstChild.data;
	        var url = findChild(child_nodes[i], 'link').firstChild.data;

            var yearEndedChild = findChild(child_nodes[i], 'ended');
            var status = findChild(child_nodes[i], 'status').firstChild.data;

            if (yearEndedChild != null && status != "Canceled/Ended")
            {
                results.push({
                    url:   url,
                    title: unescape(name)
                });
            }
        }
    }

    var too_many_results = false;

    return { results: results, too_many_results: too_many_results };
}