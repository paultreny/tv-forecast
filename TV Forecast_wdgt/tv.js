widget.onshow = onShow;

var AjaxRequest = Class.create();

var MAX_DATE = 32503651200736; // Midnight of Jan 1, 3000

var checked_for_new_version = false;

var search_field_text = '';

var preferencesVersion = null;

AjaxRequest.prototype =
{
    initialize: function(url, callback, isXml)
    {
        this.isXml = isXml;

        this.ajax_request = new Ajax.Request(
		url,
		{
			asynchronous: true,
			onSuccess: function(e) {
			    this.ajaxCallback(e, callback);
			}.bind(this),
			onFailure: function(e) {
			    callback("");
			}
		});
    },

    ajaxCallback: function(xml_http_request, callback)
    {
        var response = this.isXml ? xml_http_request.responseXML : xml_http_request.responseText;

		if (response == null)
		{
			callback(null);
		}
		else
		{
			callback(response);
		}
    },

    abort: function()
    {
        this.ajax_request.transport.abort();
    }
}

function resizeWidget()
{
    var height = 60;

    your_tv_shows.each(function(tv_show)
    {
        if (tv_show.episode != "")
        {
            height += 40;
        }
        else
        {
            height += 28;
        }
    });

    height += 33;

    if (height > 367)
    {
        window.resizeTo(322, height);
    }
}

function tvShowSort(lhs, rhs)
{
    var lhs_time;
    var rhs_time;

    lhs_time = lhs.getDate();
    rhs_time = rhs.getDate();

	if (lhs_time == "" || lhs_time == null)
	{
        lhs_time = MAX_DATE;
	}
	else if (lhs_time == "")
	{
        lhs_time = MAX_DATE - 1;
	}
	else
	{
	    lhs_time = lhs_time.getTime();
	}

	if (rhs_time == "" || rhs_time == null)
	{
        rhs_time = MAX_DATE;
	}
	else if (rhs_time == "")
	{
        rhs_time = MAX_DATE - 1;
	}
	else
	{
	    rhs_time = rhs_time.getTime();
	}

	if (lhs_time.valueOf() == rhs_time.valueOf())
	{
		if (lhs.special == "TBA" && rhs.special != "TBA")
		{
			return lhs;
		}
		else if (lhs.special != "TBA" && rhs.special == "TBA")
		{
			return rhs;
		}
		else
		{
			if (lhs.special == rhs.special)
			{
	        return ((lhs.getTitle() < rhs.getTitle()) ? -1 : ((lhs.getTitle() > rhs.getTitle()) ? 1 : 0));
			}
			else
			{
	        return ((lhs.special < rhs.special) ? -1 : ((lhs.special > rhs.special) ? 1 : 0));
			}
		}
	}

	return lhs_time < rhs_time ? -1 : ((lhs_time > rhs_time ? 1 : 0));
}

var your_tv_shows = new Array();
var previous_date = null;

var pending = 0;

function schedulePending()
{
    if (pending == 0)
    {
        Element.hide($('refresh-button'));
        Element.show($('loading-mini'));
    }

    pending += 1;
}

function scheduleReady()
{
    pending -= 1;

    if (pending == 0)
    {
        if (Element.visible($('front')))
        {
            renderWidgetFront();
        }

        Element.show($('refresh-button'));
        Element.hide($('loading-mini'));
    }
}

function showNotice(text)
{
    $('notice').innerHTML = text;
    Element.show($('notice'));
}

function hideNotice()
{
    Element.hide($('notice'));
}

function renderWidgetFront()
{
    if (!preferences_loaded)
    {
        showNotice('Reading preferences...');
        return;
    }

    if (your_tv_shows.length == 0)
    {
        showNotice('Add your TV shows using the reverse side');
        return;
    }

    if ($('forecast-inner').innerHTML == "" && pending > 0)
    {
        showNotice('Retrieving forecast...');
        return;
    }

    if (!Element.visible($('front')))
    {
        return;
    }

    hideNotice();

    sorted_forecasts = new Array();

    your_tv_shows.each(function(your_tv_show)
    {
        sorted_forecasts.push(your_tv_show);
    });

    sorted_forecasts.sort(tvShowSort);

    $('forecast-inner').innerHTML = "";

    var max = sorted_forecasts.length;

    var limit = $('forecast-limit').value;

    if (limit != "All")
    {
        max = Math.min(max, parseInt(limit, 10));
    }

    var odd = false;

    var i = 0;

    while (i < max)
    {
        sorted_forecasts[i].renderFront(odd);
        odd = !odd;
        ++i;
    }

    resizeWidget();

    if ($('forecast-inner').innerHTML == "")
    {
        showNotice('Nothing to display');
        return;
    }
}

function formatDate(tv_show)
{
    var date;
    var days;

    date = tv_show.getDate();
    days = tv_show.getDays();

    var formatted_date = "";

    var today = new Date();

    if ((days == -1 || days == 0 || days == 1) && tv_show.timeIsKnown())
    {
        var hours   = date.getHours();
        var minutes = date.getMinutes();
        var am_pm   = "AM";

        if (hours >= 12)
        {
            hours -= 12;
            am_pm = "PM";
        }

        if (hours == 0)
        {
            hours = 12;
        }

        if (minutes < 10)
        {
            minutes = "0" + minutes;
        }

        formatted_date = hours + ":" + minutes + " " + am_pm;

        return formatted_date;
    }

    formatted_date =
        dayToShortString(date.getDay()) + ", " +
        monthToShortString(date.getMonth()) + " " + date.getDate();

    if (date.getFullYear() != new Date().getFullYear())
    {
        formatted_date += ", " + date.getFullYear();
    }

	return formatted_date;
}

// Populates the continent list box
function populateContinents(select_id)
{
    var select = $(select_id);

    continents.each(function(continent)
    {
        var option = document.createElement("option");
        option.innerText = continent.continent;
        select.appendChild(option);
    });
}

function populateCities(cities_id, cities)
{
    var select = $(cities_id);

    // remove all options
    while (select.hasChildNodes())
    {
        select.removeChild(select.firstChild);
    }

    cities.each(function(city)
    {
        var option = document.createElement("option");
        option.innerText = city.city;
        select.appendChild(option);
    });
}

var preferences_loaded = false;

var remove_button = null;

function load()
{
	var search_button = new AppleGlassButton($('search-button'), 'Search', performSearch);
	search_button.textElement.style.textAlign = "center";
	search_button.textElement.style.width     = "47px";

    var done_button = new AppleGlassButton($('done-button'), 'Done', doneClicked);
	done_button.textElement.style.textAlign = "center";
	done_button.textElement.style.width     = "47px";

	remove_button = new AppleGlassButton($('remove-button'), 'Remove', removeItem);
	remove_button.textElement.style.textAlign = "center";
	remove_button.textElement.style.width     = "47px";

	remove_button.setEnabled(false);

    if (!preferences_loaded)
    {
    	xml = widget.preferenceForKey('options');

    	new Ajax.Request(
    	    "data:text/xml;charset=utf-8," + encodeURIComponent(xml),
    	    {
    	        asynchronous: false,
    	        onSuccess: parseOptions,
    	        onFailure: parseOptions
    	    });

        xml = widget.preferenceForKey('your_tv_shows');

        if (xml == null || xml.indexOf("tv.com") != -1)
        {
            xml = "<?xml version=\"1.0\"?><subscriptions><subscription><title>Lost</title><url>http://www.tvrage.com/Lost</url></subscription><subscription><title>Modern Family</title><url>http://www.tvrage.com/Modern_Family</url></subscription><subscription><title>Mad Men</title><url>http://www.tvrage.com/Mad_Men</url></subscription></subscriptions>";
        }

        // sanitize the XML problems in 2.4.1
        if (xml != null && preferencesVersion == "2.4.1")
        {
            var sanitizedXml = xml;

            // correct the '&' problem
            var regexp = /<title>.*?<\/title>/g;

            var matches = xml.match(regexp);

            matches.each(function(match)
            {
                var titleMatch = /<title>(.*?)<\/title>/.exec(match);

                sanitizedXml = sanitizedXml.replace(titleMatch[0], "<title>" + encodeURIComponent(titleMatch[1]) + "</title>");
            });

            xml = sanitizedXml;
        }

        if (xml != null)
        {
            new Ajax.Request(
        		"data:text/xml;charset=utf-8," + encodeURIComponent(xml),
        		{
        			asynchronous: true,
        			onSuccess: parsePreferences
        		});
    	}
    	else
    	{
    	    preferences_loaded = true;
    	    renderWidgetFront();
    	}

    	Event.observe($('title'),      'click', function() { widget.openURL('http://www.bigbucketblog.com/?widget=tv')});
    	Event.observe($('back-title'), 'click', function() { widget.openURL('http://www.bigbucketblog.com/?widget=tv')});
    	Event.observe($('app-store'),     'click', function() { widget.openURL('https://itunes.apple.com/app/tv-forecast-your-personal/id290859724?mt=8')});

    	Event.observe($('info-button'), 'click', showBack);

    	Event.observe($('refresh-button'), 'click', refreshForecast);

    	Event.observe($('include-tba'), 'click', function(e)
    	    {
        	    if (e.srcElement != $('include-tba-cb'))
        	    {
        	        $('include-tba-cb').checked = !$('include-tba-cb').checked;
    	        }
    	    });

		Event.observe($('auto-refresh'), 'click', function(e)
    	    {
        	    if (e.srcElement != $('auto-refresh-cb'))
        	    {
        	        $('auto-refresh-cb').checked = !$('auto-refresh-cb').checked;
    	        }
    	    });

    	Event.observe($('perform-tz-correction'), 'click', function(e)
    	    {
    	        if (e.srcElement != $('perform-tz-correction-cb'))
    	        {
    	            $('perform-tz-correction-cb').checked = !$('perform-tz-correction-cb').checked;
    	        }

    	        your_tv_shows.each(function(tv_show)
    	        {
    	            tv_show.adjustForTimezone($('perform-tz-correction-cb').checked);
    	            tv_show.refreshTimezoneButton();
    	            tv_show.renderFront();
    	        });
    	    });
    }

    Element.hide($('loading-mini'));

    window.resizeTo(322, 367);

    $('search-field').setAttribute('placeholder', 'Add TV Show');

    showFront();
}

function onShow()
{
    if (!checked_for_new_version)
    {
        checked_for_new_version = true;

        new VersionChecker(
            "http://www.bigbucketblog.com/versionagent.php5",
            "TV Forecast",
            "2.4.6",
            function(update_available, url)
            {
                if (update_available)
                {
                    Element.remove('footer');

                    new Insertion.After(
                        $('forecast'),
                        '<div id="footer-new-version"></div>');

    		        Event.observe(
    		            $('footer-new-version'),
    		            'click',
    		            function()
    		            {
    		                widget.openURL(url)
    		            });
    	        }
    	    });

    	refreshForecast();
    }
    else
    {
        if ($('auto-refresh-cb').checked)
        {
            refreshForecast();
        }
        else
        {
            renderWidgetFront();
        }
    }
}

function refreshForecast()
{
	if (pending > 0)
	{
		return;
	}

    your_tv_shows.each(function(your_tv_show)
    {
        your_tv_show.refresh();
    });

    renderWidgetFront();
}

function saveYourTvShows()
{
    var xml = '<?xml version="1.0"?>';

    xml += '<subscriptions>';

	your_tv_shows.each(function(your_tv_show) {
		xml += your_tv_show.toXml();
	});

	xml += '</subscriptions>';

	widget.setPreferenceForKey(xml, 'your_tv_shows');

    var options_xml = '<?xml version="1.0"?>';

	options_xml += '<options>';
	options_xml += '<limit>';

    var limit = $('forecast-limit').value;

    if (limit)
    {
        options_xml += limit;
    }

    options_xml += '</limit>';

		options_xml += '<episode-display-type>';

	    var episode_display_type = $('episode-display-type').value;

	    if (episode_display_type)
	    {
	        options_xml += episode_display_type;
	    }

	    options_xml += '</episode-display-type>';

    options_xml += '<include-tba>';
	options_xml += $('include-tba-cb').checked;
	options_xml += '</include-tba>';

    options_xml += '<perform-tz-correction>'
	options_xml += $('perform-tz-correction-cb').checked;
	options_xml += '</perform-tz-correction>'

    options_xml += '<auto-refresh>';
	options_xml += $('auto-refresh-cb').checked;
	options_xml += '</auto-refresh>';

    options_xml += '<version>';
    options_xml += '2.4.6';
    options_xml += '</version>';

	options_xml += '</options>';

	widget.setPreferenceForKey(options_xml, 'options');
}

function doneClicked()
{
    if (search_request)
    {
        search_request.abort();
        $('search-field').setAttribute('placeholder', 'Add TV Show')
    }

	search_request = null;

    saveYourTvShows();
    showFront();
}

function showFront()
{
	var front = $('front');
	var back  = $('back');

	if (window.widget)
	{
		widget.prepareForTransition("ToFront");
	}

	front.style.display = "block";
	back.style.display  = "none";

	renderWidgetFront();

	if (window.widget)
	{
		setTimeout('widget.performTransition();', 0);
	}
}

function showBack()
{
    var front = $('front');
	var back  = $('back');

	if (window.innerHeight < 367)
	{
		window.resizeTo(302, 367);
	}

	if (window.widget)
	{
		widget.prepareForTransition("ToBack");
	}

	front.style.display = "none";
	back.style.display  = "block";

	if (window.widget)
	{
		setTimeout('widget.performTransition();', 0);
	}
}

function removeItem()
{
    var index            = 0;
    var selected_tv_show = null;

    while (selected_tv_show == null && index < your_tv_shows.length)
    {
        if (your_tv_shows[index].getSelected())
        {
            selected_tv_show = your_tv_shows[index];
        }
        else
        {
            ++index;
        }
    }

    if (selected_tv_show == null)
    {
        return;
    }

    your_tv_shows = your_tv_shows.without(selected_tv_show);

    selected_tv_show.destruct();

    if (your_tv_shows.length == 0)
	{
		remove_button.setEnabled(false);
    }
    else
    {
        // only decrement if it was the last item that was selected
        if (index == your_tv_shows.length)
        {
            --index;
        }

        your_tv_shows[index].setSelected(true);
    }
}

function searchKeyPress(event)
{
    // return or enter
    if (event.keyCode == 13 || event.keyCode == 3)
    {
        performSearch();
    }
}

var search_request = null;

function performSearch()
{
    var text = $F('search-field');

    if (text == '')
    {
        return;
    }

    search_field_text = $F('search-field');
    $('search-field').value = "";
    $('search-field').setAttribute('placeholder', 'Searching...');

	$('search-field').blur();

    if (search_request)
    {
        search_request.abort();
    }

    search_request = new AjaxRequest(tvShowSearchUrl(text), searchCallback, true);
}

function searchCallback(xml)
{
    var results = parseTvShowSearchResults(xml);
    var menu    = widget.createMenu();

    if (results.results.length == 0)
    {
        menu.addMenuItem("No results");
        menu.setMenuItemEnabledAtIndex(0, false);
        menu.popup(32, 170);

        $('search-field').setAttribute('placeholder', 'Add TV Show');
    }
    else
    {
        $('search-field').value = search_field_text;
        $('search-field').setAttribute('placeholder', 'Add TV Show');

        var i = 0;

        results.results.each(function(result)
        {
            menu.addMenuItem(result.title);

            var tv_show = your_tv_shows.find(function(tv_show)
            {
                return tv_show.getTitle() == result.title;
            });

            if (tv_show)
            {
                menu.setMenuItemEnabledAtIndex(i, false);
            }

            ++i;
        });

        var selected = menu.popup(32, 170);

        if (selected >= 0)
        {
            $('search-field').value = '';

            var result = results.results[selected];

            var tv_show = new TvShow(result.url, result.title, null, null);
            tv_show.adjustForTimezone($('perform-tz-correction-cb').checked);
            tv_show.refreshTimezoneButton();
            tv_show.refresh();

            your_tv_shows.push(tv_show);
        }
    }
}

function parsePreferences(xml_http_request)
{
    preferences_loaded = true;

    var dom = xml_http_request.responseXML;

    var child_nodes = dom.documentElement.childNodes;

    for (var i = 0; i < child_nodes.length; ++i)
	{
		url       = findChild(child_nodes[i], "url").firstChild.data;
		title     = findChild(child_nodes[i], "title").firstChild.data;
		continent = findChild(child_nodes[i], "continent");
		city      = findChild(child_nodes[i], "city");

		if (continent != null)
		{
		    continent = continent.firstChild.data;
		}

		if (city != null)
		{
		    city = city.firstChild.data;
		}

		if (!preferencesVersion)
		{
           title = unescape(title);
		}

	    var tv_show = new TvShow(url, decodeURIComponent(title), continent, city);

		tv_show.adjustForTimezone($('perform-tz-correction-cb').checked);
		tv_show.refreshTimezoneButton();
		your_tv_shows.push(tv_show);
	}

    saveYourTvShows();
}

function parseOptions(xml_http_request)
{
    var limit;
		var episode_display_type;
    var include_tba;
    var perform_tz_correction;
    var auto_refresh;

    var dom = xml_http_request.responseXML;

    if (dom)
    {
        var child_nodes = dom.documentElement.childNodes;

        for (var i = 0; i < child_nodes.length; ++i)
    		{
    	    	if (child_nodes[i].tagName == 'limit')
    	    	{
    	        limit = child_nodes[i].firstChild.data;
    	    	}
						else if (child_nodes[i].tagName == 'episode-display-type')
						{
							episode_display_type = child_nodes[i].firstChild.data;
						}
            else if (child_nodes[i].tagName == 'include-tba')
            {
                include_tba = child_nodes[i].firstChild.data;
            }
            else if (child_nodes[i].tagName == 'perform-tz-correction')
            {
                perform_tz_correction = child_nodes[i].firstChild.data;
            }
            else if (child_nodes[i].tagName == 'auto-refresh')
            {
                auto_refresh = child_nodes[i].firstChild.data;
            }
            else if (child_nodes[i].tagName == 'version')
            {
                preferencesVersion = child_nodes[i].firstChild.data;
            }
    	}
    }

	if (limit)
	{
	    $('forecast-limit').value = limit;
	}
	else
	{
	    $('forecast-limit').value = 'All';
	}

	if (episode_display_type)
	{
		$('episode-display-type').value = episode_display_type;
	}
	else
	{
		$('episode-display-type').value = 'Name';
	}

	if (include_tba == 'false')
	{
	    $('include-tba-cb').checked = false;
    }
    else
    {
        $('include-tba-cb').checked = true;
    }

    if (perform_tz_correction == 'true')
    {
        $('perform-tz-correction-cb').checked = true;
    }
    else
    {
        $('perform-tz-correction-cb').checked = false;
    }

    if (auto_refresh == 'false')
    {
        $('auto-refresh-cb').checked = false;
    }
    else
    {
        $('auto-refresh-cb').checked = true;
    }

    your_tv_shows.each(function(tv_show)
    {
        tv_show.adjustForTimezone($('perform-tz-correction-cb').checked);
        tv_show.refreshTimezoneButton();
    });
}