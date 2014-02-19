var DEFAULT_CONTINENT = 5;
var DEFAULT_CITY      = 25;

var TvShow = Class.create();

TvShow.prototype =
{
initialize: function(url, title, continent, city)
{
    this.quickInfoUrl = "http://services.tvrage.com/tools/quickinfo.php?show=" + encodeURIComponent(title) + '&exact=1';
    this.url                 = url;
    this.title               = title;
    this.front_id            = 'front-' + title; 
    this.back_id             = 'back-'  + title;
	this.special             = "";
    this.destructed          = false;
    this.ajax_request        = null;
    this.time_is_known       = false;
    this.continent           = DEFAULT_CONTINENT;
    this.city                = DEFAULT_CITY;
    this.adjust_for_timezone = true;

    if (continent != null)
    {
        this.continent = parseInt(continent);
    }
    
    if (city != null)
    {
        this.city = parseInt(city);
    }
    
    this.refreshTimezoneOffset();
    
    var back_ul = $('your-tv-shows-inner');

    var title = this.title;

    if (title.length > 25)
    {
        title = title.substr(0, 24).replace(/\s*$/, '') + '...';
    }
    
    // make the back list item
    var back_li = document.createElement("li");
    back_li.id = this.back_id;
    
    // add a timezone button to the back list item
    var back_li_tz_button = document.createElement("div");
    back_li_tz_button.id = this.back_id + '-tz-button';
    Element.addClassName(back_li_tz_button, 'timezone-button');
    back_li.appendChild(back_li_tz_button);
    
    // add the tv show title to the back list item
    var back_li_title = document.createElement("div");
    back_li_title.innerText = title;
    Element.addClassName(back_li_title, 'back-li-title');
    back_li.appendChild(back_li_title);
    back_ul.appendChild(back_li);
    
    Event.observe(this.back_id + '-tz-button', 'click', this.eventTzClicked.bind(this));
    Event.observe(this.back_id, 'click', this.eventClicked.bind(this));
    
    this.refreshTimezoneButton();
},

adjustForTimezone: function(state)
{
    this.adjust_for_timezone = state;
},

refresh: function()
{    
    this.ajax_request = 
        new AjaxRequest(this.quickInfoUrl, this.processQuickInfo.bind(this));
    
    schedulePending();
},

destruct: function()
{	
    var front = $(this.front_id);
    var back  = $(this.back_id);
    
    if (front)
    {
        Element.remove(front);
    }
    
    if (this.ajax_request)
    {
        this.ajax_request.abort();
        this.ajax_request = null;
        
        // signal that the TvShow has arrived - despite being aborted
        scheduleReady();
    }
    
    Element.remove(back);
    
    this.destructed = true;
},

getTitle: function()
{
    return this.title;
},

getUrl: function()
{
    return this.url;
},

timeIsKnown: function()
{
    return this.time_is_known;
},

getSelected: function()
{
    return Element.hasClassName(this.back_id, 'selected-tv-show');
},

setSelected: function(state)
{
    if (state)
    {
        Element.addClassName(this.back_id, 'selected-tv-show');
    }
    else if (this.getSelected())
    {
        Element.removeClassName(this.back_id, 'selected-tv-show');
        
        // close the timezone dialog if it is open
        if ($(this.back_id + '-timezone') != null)
        {
            this.refreshTimezoneButton();
            Element.remove(this.back_id + '-timezone');
        }
    }
},

refreshTimezoneButton: function()
{
    var disabled_class_name = 'timezone-button-disabled';
    var class_name          = 'timezone-button-set';
    var id                  = this.back_id + '-tz-button';
    
    if (this.adjust_for_timezone)
    {
        if (Element.hasClassName(id, disabled_class_name))
        { 
            Element.removeClassName(id, disabled_class_name);
        }
    }
    else
    {        
        if (!Element.hasClassName(id, disabled_class_name))
        {
            Element.addClassName(id, disabled_class_name);
            return;
        }
    }
    
    if (this.continent != DEFAULT_CONTINENT || this.city != DEFAULT_CITY)
    {
        if (!Element.hasClassName(id, class_name))
        {
            Element.addClassName(id, class_name);
        }
    }
    else if (Element.hasClassName(id, class_name))
    {
        Element.removeClassName(id, class_name);
    }
},

toXml: function()
{
    return '<subscription>' + 
	       '<title>' + encodeURIComponent(this.title) + '</title>' +
		   '<url>' + this.url + '</url>' +
		   '<continent>' + this.continent + '</continent>' +
		   '<city>' + this.city + '</city>' +
           '</subscription>';
},

eventTzClicked: function()
{
    var tz_id = this.back_id + '-timezone';
        
    if ($(tz_id) != null)
    {
        this.refreshTimezoneButton();
        Element.remove($(tz_id));
        return;
    }

    if (!this.adjust_for_timezone)
    {
        return;
    }
    
    var li = $(this.back_id);
    
    var timezone = document.createElement('div');
    timezone.id = tz_id;
    
    Element.addClassName(timezone, 'timezone-dialog');
    
    var continent_select = document.createElement('select');
    var city_select      = document.createElement('select');
    
    populateContinents(continent_select);
    populateCities(city_select, continents[this.continent].cities);
    
    continent_select.selectedIndex = this.continent;
    city_select.selectedIndex      = this.city;
    
    continent_select.id = this.back_id + '-continent-select';
    city_select.id      = this.back_id + '-city-select';
    
    Element.addClassName(continent_select, 'continent-dropdown');
    Element.addClassName(city_select,      'city-dropdown');
        
    timezone.appendChild(continent_select);
    timezone.appendChild(city_select);
    
    li.appendChild(timezone);
    
    Event.observe(continent_select, 'click', function()
    {
        if (this.continent != continent_select.selectedIndex)
        {
            populateCities(
                city_select,
                continents[continent_select.selectedIndex].cities);

            this.continent = continent_select.selectedIndex;
            this.city      = city_select.selectedIndex;
            
            this.refreshTimezoneOffset();
            this.refreshTimezoneButton();
        }
    }.bind(this));
    
    Event.observe(city_select, 'click', function()
    {
        this.city = city_select.selectedIndex;      
        
        this.refreshTimezoneOffset();
        this.refreshTimezoneButton();        
    }.bind(this));
},

eventClicked: function()
{
    if (this.getSelected())
    {
        return;
    }
    
    your_tv_shows.each(function(your_tv_show)
    {
        your_tv_show.setSelected(false);
    })
    
    this.setSelected(true);
    
	remove_button.setEnabled(true);
},

processQuickInfo: function(quickInfo)
{
    this.ajax_request = null;
    
    if (this.destructed)
    {
        // destruct will call scheduleReady - no need to do it here
        return;
    }
    
    if (quickInfo == "")
    {
        // no data
        scheduleReady();
        return;
    }

    var tv_show_summary = new TvShowParser(quickInfo);
        
    if (tv_show_summary.showAirsNext() == null)
    {
        if (tv_show_summary.showStatus() != TvShowStatus.Normal)
        {
            this.special = 
                tvShowStatusToString(tv_show_summary.showStatus());
        }
        else
        {
            this.special = "TBA";
        }
        
        this.episode       = "TBA";
				this.episode_id 	 = "TBA";
        this.episode_url   = "";
        this.date          = "";
        this.time_is_known = false;
    }
    else
    {
        this.special     = "";
        this.episode     = tv_show_summary.episodeTitle();
        this.season_number = tv_show_summary.seasonNumber();
        this.episode_number = tv_show_summary.episodeNumber();
        this.date        = tv_show_summary.showAirsNext().getTime();
        
        if (tv_show_summary.includesTimeOfDay())
        {
            this.time_is_known = true;
        }
        else
        {
            this.time_is_known = false;
        }
	}
    
    this.itunes_id = shows[tv_show_summary.showTitle()];
    	
	scheduleReady();
},

refreshTimezoneOffset: function()
{
    this.timezone_offset = timezoneDifference(
        '',
        continents[this.continent].cities[this.city].timezone);
},

renderFront: function(odd)
{    
	if (this.episode == null)
	{
		// no net connection
		return;
	}
	
    var front_ul = $('forecast-inner');

	var date = "";
	
	if (this.date)
	{
		date = formatDate(this);
	}
	else if ($('include-tba-cb').checked == false)
	{
	    return;
	}

    var title   = this.title.replace(/ \(\d\d\d\d\)$/, '');
    var episode = this.episode;

    var days = "";

    if (this.date != "")
    {
		days = this.getDays();
		
		if (days == -1)
		{
			days = "Yesterday";
		}
		else if (days == 0)
		{
			days = "Today";
		}
		else if (days == 1)
		{
			days = "Tomorrow";
		}
		else if (days < 0)
		{
			days = Math.abs(days) + " days ago";
		}
		else
		{
			days = days + " days";
		}
    }
    
    var inner_div = "";
    
    if (this.special == "")
    {
        inner_div = '<div class="air-date">' + date + '<br/>' + days + '</div>';
    }
    else
    {
        inner_div = '<div class="special">' + this.special + '</div>';
    }
    
    var tv_show_id = this.front_id + '-tv-show';
    var episode_id = this.front_id + '-episode-id';
    
    var li_tag = "";
    
    if (odd)
    {
        li_tag = '<li id="' + this.front_id + '" class="odd">';
    }
    else
    {
        li_tag = '<li id="' + this.front_id + '" class="even">';
    }

		var episodeText = null;
		
		if ($('episode-display-type').value == "ID")
		{		
			if (this.season_number && this.episode_number)
			{
				episodeText = 'Season ' + this.season_number + ', Episode ' + this.episode_number;
			}
			else
			{
				episodeText = 'TBA';
			}			
		}
		else
		{
			episodeText = this.episode;
		}

    new Insertion.Bottom(
        front_ul,
        li_tag +
			inner_div +
			'<h1 style="clear: left;"><span style="float:left;" id="' + tv_show_id + '">' + title + '</span></h1>' +
			'<h2 style="clear: left;"><span style="float:left;" id="' + episode_id + '">' + episodeText + '</span></h2>' +
            '<div style="clear:left;padding-bottom:6px;"></div>' +
        '</li>');
    
    if (this.title_url != "")
    {
        Event.observe(
            $(tv_show_id),
            'click',
            function() { widget.openURL(this.url); }.bind(this));
        
        Event.observe(
            $(tv_show_id),
            'mouseover',
            function() { Element.addClassName($(tv_show_id), 'link-hover'); });
            
        Event.observe(
            $(tv_show_id),
            'mouseout',
            function() { Element.removeClassName($(tv_show_id), 'link-hover'); });
    }    
},

getDate: function()
{
	if (this.date == null || this.date == "")
	{
        return this.date;
	}
    
    var date = new Date();
    
    if (this.adjust_for_timezone)
    {
        date.setTime(this.date + (this.timezone_offset * 60 * 1000));        
    }
    else
    {
        date.setTime(this.date);
    }
    
    return date;
},

getDays: function()
{    
	if (this.date == "")
	{
		return "Unknown";
	}
		
    return daysBetween(new Date(), this.getDate());
}
}