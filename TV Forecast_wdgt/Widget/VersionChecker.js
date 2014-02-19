var VersionChecker = Class.create();

VersionChecker.prototype =
{
// Constructs a new VersionChecker
// url:      URL containing the list of applications
// name:     Name of the application
// version:  Current version of the application
// callback: Function called when a determination is made
initialize: function(url, name, version, callback)
{   
    this.name     = name;
    this.version  = version;
    this.callback = callback;

    new Ajax.Request(
        url + "?name=" + encodeURIComponent(name),
        {
            asynchronous: true,
            method: 'get',
            requestHeaders: ["Cache-Control", "no-cache"],
            onSuccess: function(transport)
            {
                this._checkVersion(transport.responseText.evalJSON());
            }.bind(this),
            onFailure: function()
            {
                callback(false);
            }
        });
},

// Checks the response for a newer version of the application
_checkVersion: function(version)
{   
    if (version.version != this.version)
    {
        this.callback(true, version.url);
    }
    else
    {
        this.callback(false);
    }
}
}