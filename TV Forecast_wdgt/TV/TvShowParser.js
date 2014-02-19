var TvShowStatus = { Unknown: 0, SeriesEnded: 1, Normal: 2 };

// Returns a string representation of a TvShowStatus
function tvShowStatusToString(tv_show_status)
{
    switch (tv_show_status)
    {
        case TvShowStatus.Unknown:     return "Unknown";
        case TvShowStatus.SeriesEnded: return "Series Ended";
        case TvShowStatus.Normal:      return "Normal";
    }

    return null;
}

var TvShowParser = Class.create();

// Parses a TV.com TV show summary page
TvShowParser.prototype =
{
initialize: function(quickInfo)
{
    var lines = quickInfo.split('\n');

    this.quickInfo = [];

    lines.each(function(line)
    {
        var components = line.split('@');

        var key = components[0];
        var value = components[1];

        if (key == "Show Name")
        {
            this.quickInfo.showName = value;
        }
        else if (key == "Premiered")
        {
            this.quickInfo.premiered = value;
        }
        else if (key == "Country")
        {
            this.quickInfo.country = value;
        }
        else if (key == "Status")
        {
            this.quickInfo.status = value;
        }
        else if (key == "Classification")
        {
            this.quickInfo.classification = value;
        }
        else if (key == "Genres")
        {
            this.quickInfo.genres = value;
        }
        else if (key == "Network")
        {
            this.quickInfo.network = value;
        }
        else if (key == "Airtime")
        {
            this.quickInfo.airtime = value;
        }
        else if (key == "Latest Episode")
        {
            var episodeComponents = value.split('^');

            this.quickInfo.latestEpisode = [];
            this.quickInfo.latestEpisode.episode = episodeComponents[0];
            this.quickInfo.latestEpisode.title = episodeComponents[1];
            this.quickInfo.latestEpisode.airDate = episodeComponents[2];
        }
        else if (key == "Next Episode")
        {
            var episodeComponents = value.split('^');

            this.quickInfo.nextEpisode = [];
            this.quickInfo.nextEpisode.episode = episodeComponents[0];
            this.quickInfo.nextEpisode.title = episodeComponents[1];
            this.quickInfo.nextEpisode.airDate = episodeComponents[2];
        }
        else if (key == "Episode URL")
        {
            this.quickInfo.episodeUrl = value;
        }
    }.bind(this));
},

// The show title
showTitle: function()
{
    return this.quickInfo.showName;
},

// The show status
showStatus: function()
{
	if (this.quickInfo.status == "Canceled/Ended")
	{
	    return TvShowStatus.SeriesEnded;
	}

    return TvShowStatus.Normal;
},

// The next episode title
episodeTitle: function()
{
    if (this.quickInfo.nextEpisode)
    {
        return this.quickInfo.nextEpisode.title;
    }

    return null;
},

seasonNumber: function()
{
    if (this.quickInfo.nextEpisode)
    {
        var episodeId = this.quickInfo.nextEpisode.episode;

				var seasonInfo = episodeId.split('x');

				if (seasonInfo.length == 2)
				{
						return parseInt(seasonInfo[0], 10);
				}
    }

    return null;
},

episodeNumber: function()
{
    if (this.quickInfo.nextEpisode)
    {
        var episodeId = this.quickInfo.nextEpisode.episode;

				var seasonInfo = episodeId.split('x');

				if (seasonInfo.length == 2)
				{
						return parseInt(seasonInfo[1], 10);
				}
    }

    return null;
},


// When the show will air next
showAirsNext: function()
{
    this.quickInfo.includesTimeOfDay = false;

    var date = new Date();

    if (!this.quickInfo.nextEpisode)
    {
        return null;
    }

    var airDateMatch = /^(.*?)\/(\d*?)\/(\d*?)$/.exec(this.quickInfo.nextEpisode.airDate);

    if (airDateMatch)
    {
        var year = airDateMatch[3];
        var month = 0;
        var day = airDateMatch[2];

        if (airDateMatch[1] == "Jan")
            month = 0;
        else if (airDateMatch[1] == "Feb")
            month = 1;
        else if (airDateMatch[1] == "Mar")
            month = 2;
        else if (airDateMatch[1] == "Apr")
            month = 3;
        else if (airDateMatch[1] == "May")
            month = 4;
        else if (airDateMatch[1] == "Jun")
            month = 5;
        else if (airDateMatch[1] == "Jul")
            month = 6;
        else if (airDateMatch[1] == "Aug")
            month = 7;
        else if (airDateMatch[1] == "Sep")
            month = 8;
        else if (airDateMatch[1] == "Oct")
            month = 9;
        else if (airDateMatch[1] == "Nov")
            month = 10;
        else if (airDateMatch[1] == "Dec")
            month = 11;

        date.setFullYear(year, month, day);
    }
    else
    {
        return null;
    }

    if (this.quickInfo.airtime)
    {
       var airTimeComponents = this.quickInfo.airtime.split(' at ');

       var airTime = '';

       if (airTimeComponents.length == 1)
       {
           airTime = this.quickInfo.airTime;
       }
       else
       {
           airTime = airTimeComponents[1];
       }

       var airTimeMatch = /(\d*?):(\d*?) (am|pm)/.exec(airTime);

       if (airTimeMatch)
       {
           var hours = parseInt(airTimeMatch[1], 10);
           var minutes = parseInt(airTimeMatch[2], 10);

           if (airTimeMatch[3] == 'pm')
           {
               hours += 12;
           }

           date.setHours(hours);
           date.setMinutes(minutes);
           date.setSeconds(0);
           date.setMilliseconds(0);

           this.quickInfo.includesTimeOfDay = true;
       }
    }

    return date;
},

// True if the time of day when the show will air next is known
includesTimeOfDay: function()
{
    return this.quickInfo.includesTimeOfDay;
}
};