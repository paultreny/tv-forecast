var manualSignIn = {};
var iPad = navigator.userAgent.match(/iPad/i) != null;

function setService (service,from,no) {

	if (!service) service = { from:from, no:no, extra:'' }
	service.fromClass = 'Other';
	service.domain = service.from;
	service.url = '';
	service.encoding = null;
	service.extraRequired = false;
	service.passRequired = false;
	service.cookiesRequired = false;
	service.noCache = false;
	service.mobileUserAgent = false;
	service.oneByOne = false;
	service.ignoreText = false;
	service.countToShip = false;

	switch (service.from) {
		case 'www.adobe.com':
			service.fromClass = 'Adobe';
			service.url = 'https://store1.adobe.com/cfusion/store/html/index.cfm';
			service.extraRequired = true;
			service.passRequired = true;
			service.cookiesRequired = true;
			service.countToShip = true;
			break;
		case 'www.apple.com':
		case 'www.apple.com/zip':
		case 'www.apple.com/japan':
		case 'www.apple.com/japanzip':
		case 'www.apple.com/hk':
			service.fromClass = 'Apple';
			switch (service.from) {
				case 'www.apple.com':
				case 'www.apple.com/zip':
					service.from = 'www.apple.com';
					service.url = 'https://store.apple.com/us/order/list';
					break;
				case 'www.apple.com/japan':
				case 'www.apple.com/japanzip':
					service.from = 'www.apple.com/japan';
					service.url = 'https://store.apple.com/jp/order/list';
					break;
				case 'www.apple.com/hk':
					service.url = 'https://store.apple.com/hk-zh/order/list';
					break;
			}
			service.extraRequired = true;
			service.countToShip = true;
			break;
		case 'www.aramex.com':
			service.fromClass = 'Aramex';
			service.url = 'http://www.aramex.com/express/track.aspx';
			service.cookiesRequired = true;
			break;
		case 'auspost.com.au':
			service.fromClass = 'AusPost';
			service.url = 'http://auspost.com.au/track/track.html';
			break;
		case 'em.canadapost.ca':
			service.fromClass = 'CanadaPost';
			service.url = 'http://www.canadapost.ca/cpotools/apps/track/personal/findByTrackNumber';
			// service.noCache = true; // for iOS 6.0, 6.0.1, and early 10.8.x
			break;
		case 'www.chronopost.fr':
			service.fromClass = 'Chronopost';
			service.url = 'http://www.chronopost.fr/transport-express/livraison-colis';
			break;
		case 'www.city-link.co.uk':
			service.fromClass = 'CityLink';
			service.url = 'http://www.city-link.co.uk/';
			service.oneByOne = true;
			break;
		case 'www.dhl.com':
		case 'track.dhl-usa.com':
			service.from = 'www.dhl.com';
			service.fromClass = 'DHL';
			service.url = 'http://www.dhl.com/en/express/tracking.html';
			break;
		case 'www.dhlglobalmail.com':
			service.fromClass = 'DHL';
			service.url = 'http://webtrack.dhlglobalmail.com/';
			break;
		case 'nolp.dhl.de':
		case 'nolp.dhl.de/int':
			service.from = 'nolp.dhl.de';
			service.fromClass = 'DHL';
			service.url = 'http://www.dhl.de/';
			break;
		case 'www.dhl.co.uk':
			service.fromClass = 'DHL';
			service.url = 'http://sos.dhl.co.uk/cgi-bin/common/login/sos.cgi';
			break;
		case 'www.dpd.com':
			service.fromClass = 'DPD';
			service.url = 'http://www.dpd.net/index.php?id=43727&language_id=1';
			break;
		case 'www.dpd.co.uk':
			service.fromClass = 'DPD';
			service.url = 'http://www.dpd.co.uk/forms/track-my-parcel.jsp';
			break;
		case 'www.fedex.com':
		case 'spportal.fedex.com':
			service.from = 'www.fedex.com';
			service.fromClass = 'FedEx';
			service.url = 'https://www.fedex.com/fedextrack/';
			// service.noCache = true; // for iOS 6.0, 6.0.1, and early 10.8.x
			break;
		case 'www.gls-germany.com':
			service.fromClass = 'GLS';
			service.url = 'http://www.gls-group.eu/';
			break;
		case 'checkout.google.com':
			service.fromClass = 'Google';
			service.url = 'https://checkout.google.com/';
			service.extraRequired = true;
			service.passRequired = true;
			service.cookiesRequired = true;
			service.mobileUserAgent = true;
			service.countToShip = true;
			break;
		case 'www.hlg.de':
			service.fromClass = 'HLG';
			service.url = 'https://www.myhermes.de/wps/portal/paket/Home/privatkunden/sendungsverfolgung';
			break;
		case 'www.hongkongpost.com':
			service.fromClass = 'HongkongPost';
			service.url = 'http://app3.hongkongpost.com/CGI/mt/enquiry.jsp';
			break;
		case 'www.japanpost.jp/ems':
		case 'www.japanpost.jp/m10':
		case 'www.japanpost.jp/reg':
		case 'www.japanpost.jp/yupack':
			service.fromClass = 'JapanPost';
			var lang = (translate('xx') == 'ja') ? 'jp' : 'en';
			service.url = 'https://trackings.post.japanpost.jp/services/srv/search/input?locale='+lang;
			break;
		case 'www.laposte.fr':
			service.fromClass = 'LaPoste';
			service.url = 'http://www.colissimo.fr/portail_colissimo/suivre.do';
			break;
		case 'www.lasership.com':
			service.fromClass = 'LaserShip';
			service.url = 'http://www.lasership.com/';
			break;
		case 'www.ontrac.com':
			service.fromClass = 'OnTrac';
			service.url = 'https://www.ontrac.com/tracking.asp';
			break;
		case 'www.parcelforce.com':
			service.fromClass = 'Parcelforce';
			service.url = 'http://www2.parcelforce.com/track-trace';
			break;
		case 'www.post.at':
			service.fromClass = 'Post-at';
			service.url = 'http://www.post.at/sendungsverfolgung.php?language='+translate('xx');
			break;
		case 'www.postdanmark.dk':
			service.fromClass = 'PostDanmark';
			service.url = 'http://www.postdanmark.dk/';
			break;
		case 'www.poste.it':
		case 'www.poste.it/posta1':
		case 'www.poste.it/pacco1':
		case 'www.poste.it/maxi':
		case 'www.poste.it/pacco':
		case 'www.poste.it/ems':
			service.fromClass = 'Poste-it';
			service.url = 'http://www.poste.it/online/dovequando/';
			break;
		case 'www.posten.no':
			service.fromClass = 'Posten-no';
			service.url = 'http://sporing.posten.no/';
			break;
		case 'www.posten.se':
			service.fromClass = 'Posten-se';
			service.url = 'http://www.posten.se/';
			service.cookiesRequired = true;
			break;
		case 'www.postnl.nl':
		case 'www.tntpost.nl':
			service.fromClass = 'PostNL';
			service.url = 'http://www.postnlpakketten.nl/klantenservice/tracktrace/';
			service.cookiesRequired = true;
			service.oneByOne = true;
			break;
		case 'www.purolator.com':
			service.fromClass = 'Purolator';
			service.url = 'http://www.purolator.com/track.html';
			break;
		case 'www.royalmail.com':
			service.fromClass = 'RoyalMail';
			service.url = 'http://www.royalmail.com/track-trace';
			break;
		case 'www.sagawa-exp.co.jp':
			service.fromClass = 'Sagawa';
			service.url = 'http://k2k.sagawa-exp.co.jp/';
			break;
		case 'www.post.ch':
			service.fromClass = 'SwissPost';
			service.url = 'http://www.post.ch/';
			break;
		case 'www.tnt.com':
		case 'www.tnt.com/ref':
			service.fromClass = 'TNT';
			service.url = 'http://www.tnt.com/webtracker/tracker.do?navigation=1&respLang=en&respCountry=US';
			break;
		case 'www.tntexpress.com.au':
			service.fromClass = 'TNT';
			service.url = 'http://www.tntexpress.com.au/interaction/asps/trackdtl_tntau.asp';
			break;
		case 'www.ups.com':
		case 'wwwapps.ups.com':
			service.from = 'www.ups.com';
			service.fromClass = 'UPS';
			service.url = 'http://wwwapps.ups.com/WebTracking/processInputRequest?loc=en_US';
			break;
		case 'www.ups-mi.net':
			service.fromClass = 'UPS';
			service.url = 'http://www.ups-mi.net/packageID/';
			break;
		case 'www.usps.com':
			service.fromClass = 'USPS';
			service.url = 'https://tools.usps.com/go/TrackConfirmAction';
			service.oneByOne = true;
			break;
		case 'www.kuronekoyamato.co.jp':
			service.fromClass = 'Yamato';
			service.url = 'http://toi.kuronekoyamato.co.jp/cgi-bin/tneko';
			break;
		case 'www.yodel.co.uk':
			service.fromClass = 'Yodel';
			service.url = 'http://www.yodel.co.uk/';
			break;
		case 'www.amazon.com':
		case 'www.amazon.ca':
		case 'www.amazon.co.uk':
		case 'www.amazon.co.jp':
		case 'www.amazon.de':
		case 'www.amazon.at':
		case 'www.amazon.es':
		case 'www.amazon.fr':
		case 'www.amazon.it':
			if (service.domain == 'www.amazon.at') service.domain = 'www.amazon.de';
			service.fromClass = 'Amazon';
			service.url = 'https://'+service.domain+'/gp/css/homepage.html';
			service.extraRequired = true;
			service.passRequired = true;
			service.cookiesRequired = true;
			service.countToShip = true;
			break;
		case 'other':
			service.url = service.extra;
			break;
		default:
			service = false;
			break;
	}
	return service;

}

function setServiceByNumber (no,allowed) {
	var result = false;
	var guessArray = guessFrom(no,false);
	if (guessArray) {
		var from = guessArray[0];
		if (allowed.indexOf(from) != -1) result = setService(false,from,no);
	}
	return result;
}

function serviceFromString (string,substring) {
	var from = false;
	if (string) string = string.toLowerCase();
	// if (substring) substring = substring.toLowerCase();
	switch (string) {
		case 'dhl paket':	from = 'nolp.dhl.de';		break;
		case 'fedex':		from = 'www.fedex.com';		break;
		case 'lasership':	from = 'www.lasership.com';	break;
		case 'ontrac':		from = 'www.ontrac.com';	break;
		case 'ups':			from = 'www.ups.com';		break;
		case 'usps':		from = 'www.usps.com';
			if (substring && substring.toLowerCase() == 'usps_sp_nat_std') from = 'www.fedex.com';
			break;
	}
	return from;	
}

function setServiceByString (string,substring,no) {
	var result = false;
	var from = serviceFromString(string,substring);
	if (from) result = setService(false,from,no);
	return result;	
}

function updateStatus () {
	if (!iPhone) this.startLoad();
	this.resetRequests(true);
	this.success = 2;
	this.showMessage(translateFormat('Contacting %@…',this.fromTrans));
	if (this.items.length > 0) this.previousItems = this.items;
	this.startUpdate(this,false);
}

function missingPassword (delivery) {
	return (delivery.passRequired && (!delivery.password || delivery.password == ' ')) ? true : false;
}

function startUpdate (service,childNo) {
	switch(service.from) {

		case 'www.adobe.com':

			if (missingPassword(this)) {
				this.count = 0;
				this.notFound();
				this.updateItems();
			} else {
				service.url = 'https://store1.adobe.com/cfusion/store/html/index.cfm?store=OLS-US&event=displayOrderDetail&ordernumber='+
					encodeURIComponent(service.no);	
				var postData = 'event=login&up_login=yes&has_pwd=true&rememberMe=true&up_username='+encodeURIComponent(service.extra)+'&up_password='+encodeURIComponent(service.password)+'&submit_button=Continue&returnURL=%2Fcfusion%2Fstore%2Fhtml%2Findex.cfm%3Fstore%3DOLS-US%26event%3DdisplayOrderDetail%26ordernumber%3D'+encodeURIComponent(service.no)+'%26nr%3D0';
	
				this.loadCookiePage(service.url,getAdobe,postData,false);
			}
			break;
	
		case 'www.apple.com':
		case 'www.apple.com/zip':
	
			service.url = 'https://store.apple.com/us/order/guest/'+encodeURIComponent(service.no)+'/'+doublePlusEncode(service.extra);
			this.loadPage(service.url,getApple,false,false);
			break;
	
		case 'www.apple.com/japan':
		case 'www.apple.com/japanzip':
	
			service.url = 'https://store.apple.com/jp/order/guest/'+encodeURIComponent(service.no)+'/'+doublePlusEncode(service.extra);
			this.loadPage(service.url,getApple,false,false);
			break;
	
		case 'www.apple.com/hk':
			service.url = 'https://store.apple.com/hk-zh/order/guest/'+encodeURIComponent(service.no)+'/'+doublePlusEncode(service.extra);
			this.loadPage(service.url,getApple,false,false);
			break;
	
		case 'www.aramex.com':
	
			service.url = 'http://www.aramex.com/track_results_multiple.aspx?ShipmentNumber='+encodeURIComponent(service.no);
			var url = 'http://www.shopandship.com/usercontrols/toolboxhandler.aspx?ServiceType=track&Param1='+encodeURIComponent(service.no)+'&Param2=3&Param3=middle';
			var args = setArgs('Aramex',childNo);
			this.loadPage(url,getTracker,false,args);
			break;
	
		case 'auspost.com.au':
	
			service.url = 'http://auspost.com.au/track/track.html?id='+encodeURIComponent(service.no);
			var url = service.url+'&desktop=yes';
			var args = setArgs('AusPost',childNo);
			this.loadPage(url,getTracker,false,args);
			break;
	
		case 'em.canadapost.ca':
	
			var args = setArgs('CanadaPost',childNo);
			args.lang = (translate('xx') == 'fr') ? 'fr' : 'en';
			service.url = 'http://www.canadapost.ca/cpotools/apps/track/personal/findByTrackNumber?trackingNumber='+
				encodeURIComponent(service.no)+'&LOCALE='+args.lang+'&mobile=false';
			this.loadPage(service.url,getTracker,false,args);
			break;

		case 'www.chronopost.fr':
	
			var args = setArgs('Chronopost',childNo);
			var no = service.no.replace(/ /g,'');
			args.lang = (translate('xx') == 'fr') ? 'fr_FR' : 'en_GB';
			// http://www.fr.chronopost.com/fr/tracking/result?listeNumeros=
			service.url = 'http://www.chronopost.fr/expedier/inputLTNumbersNoJahia.do?listeNumeros='+encodeURIComponent(no)+'&lang='+args.lang;
			var url = 'http://www.chronopost.fr/transport-express/livraison-colis/accueil/suivi?appid=9680_718&appparams=http%3A%2F%2Fwww.chronopost.fr%3A54711%2Fwebclipping%2Fservlet%2Fwebclip%3Fjahia_url_web_clipping%3Dhttp%3A%2F%2Flocalhost%3A54702%2Fexpedier%2FinputLTNumbers.do&resetAppSession=true#field_9680';
			var postData = 'chronoNumbers='+service.no+'&lang='+args.lang;
			this.loadPage(url,getTracker,postData,args);
			break;

		case 'www.city-link.co.uk':
	
			service.url = 'http://www.city-link.co.uk/dynamic/track.php?parcel_ref_num='+encodeURIComponent(service.no)+'&postcode='+encodeURIComponent(service.extra);
			var args = setArgs('CityLink',childNo);
			this.loadPage(service.url,getTracker,false,args);
			break;
	
		case 'www.dhl.com':
		case 'track.dhl-usa.com':
	
			var args = setArgs('DHL',childNo);
			service.url = 'http://www.dhl.com/content/g0/en/express/tracking.shtml?brand=DHL&AWB='+
				encodeURIComponent(service.no.replace(/ /g,''));
			if (childNo !== false) {
				args.service = service;
				this.loadPage(service.url,getTracker,false,args);
			} else this.loadPage(service.url,getMultiple,false,args);
			break;
	
		case 'www.dhlglobalmail.com':

			var args = setArgs('DHL GlobalMail',childNo);
			service.url = 'http://webtrack.dhlglobalmail.com/?mobile=false&trackingnumber='+
				encodeURIComponent(service.no)+'&locale='+translate('xx');
			this.loadPage(service.url,getTracker,false,args);
			break;
	
		case 'nolp.dhl.de':
		case 'nolp.dhl.de/int':

			var args = setArgs('DHL (Germany)',childNo);
			args.lang = (translate('xx') == 'de') ? 'de' : 'en';
			args.extra = (service.skipExtra) ? '' : service.extra;
			service.url = (iPhone && !iPad) ? 
				'https://mobil.dhl.de/;fitScript=0/sendung?query=sv_paket&sv-method=query&packet_id='+encodeURIComponent(service.no)+'&zip='+encodeURIComponent(args.extra) :
				'http://nolp.dhl.de/nextt-online-public/set_identcodes.do?lang='+args.lang+'&idc='+encodeURIComponent(service.no)+'&zip='+encodeURIComponent(args.extra);
			if (childNo !== false) {
				args.service = service;
				this.loadPage(service.url,getTracker,false,args);
			} else this.loadPage(service.url,getMultiple,false,args);
			break;
	
		case 'www.dhl.co.uk':
	
			var args = setArgs('DHL UK',childNo);
			url = service.url = 'http://sos.dhl.co.uk/cgi-bin/common/login/sos.cgi?Container=sosmain.txt&Template=tracking.txt&Command=Tracking&Stage=1&ToStage=2&Next=&ENQ_DHL_NO='+encodeURIComponent(service.no);
			this.loadPage(url,getTracker,false,args);
			break;
	
		case 'www.dpd.com':
	
			var args = setArgs('DPD',childNo);
			args.lang = (translate('Germany') == 'Deutschland') ? 'de' : 'uk';
			service.url = 'https://extranet.dpd.de/cgi-bin/delistrack?typ=1&lang='+args.lang+
				'&pknr='+encodeURIComponent(service.no)+'&submit=Search';
			this.loadPage(service.url,getTracker,false,args);
			break;

		case 'www.dpd.co.uk':
	
			var args = setArgs('DPD UK',childNo);
			service.url = 'http://www.dpd.co.uk/service/tracking?parcel='+encodeURIComponent(service.no);
			if (iPhone) {
				this.loadPage('http://www.dpd.co.uk/?desktop',retryTracker,false,args);
			} else this.loadPage(service.url,getMultiple,false,args);
			break;

		case 'www.fedex.com':

			var no = service.no.replace(/^([0-9]+)E$/,'$1');
			service.url = (iPhone && !iPad) ? 'https://m.fedex.com/mt/www.fedex.com/fedextrack/?tracknumbers='+encodeURIComponent(no) : 
				'https://www.fedex.com/fedextrack/?tracknumbers='+encodeURIComponent(no);
			var args = setArgs('FedEx',childNo);
			args.service = service;
			this.loadPage(service.url,getFedEx,false,args);
			break;

		case 'www.gls-germany.com':

			var args = setArgs('GLS',childNo);
			switch(translate('xx')) {
				case 'de':
					args.lang = 'de';
					service.url = 'https://gls-group.eu/DE/de/paketverfolgung?txtAction=71000&match='+encodeURIComponent(service.no);
					break;
				case 'da':
					args.lang = 'da';
					service.url = 'http://www.gls-group.eu/276-I-PORTAL-WEB/content/GLS/DK01/DA/5004.htm?txtAction=71000&txtRefNo='+encodeURIComponent(service.no);
					break;
				case 'fr':
					args.lang = 'fr';
					service.url = 'http://www.gls-group.eu/276-I-PORTAL-WEB/content/GLS/FR01/FR/5004.htm?txtAction=71000&txtRefNo='+encodeURIComponent(service.no);
					break;
				default:
					args.lang = 'en';
					service.url = 'https://gls-group.eu/EU/en/parcel-tracking?txtAction=71000&match='+encodeURIComponent(service.no);
					break;
			}
			var url = 'https://gls-group.eu/app/service/open/rest/EU/'+args.lang+'/rstt001?match='+encodeURIComponent(service.no);
			this.loadPage(url,getJSON,false,args);
			break;
	
		case 'checkout.google.com':

			var url = 'https://checkout.google.com/m/view/receipt?t='+encodeURIComponent(service.no);
			service.url = (iPhone) ? url : 'https://wallet.google.com/view/receipt?t='+encodeURIComponent(service.no);
			this.loadCookiePage(url,getGoogle,false,false);
			break;

		case 'www.hlg.de':

			var args = setArgs('HLG',childNo);
			service.url = 'https://www.myhermes.de/wps/portal/paket/SISYR?auftragsNummer='+encodeURIComponent(service.no.replace(/[^0-9]/g,''));
			// &plz=00000
			this.loadPage(service.url,getMultiple,false,args);
			break;
	
		case 'www.hongkongpost.com':
	
			var args = setArgs('HongkongPost',childNo);
			service.url = 'http://app3.hongkongpost.com/CGI/mt/mtresult.jsp?tracknbr='+
				encodeURIComponent(service.no.replace(/ /g,''));
			// Chinese: http://app3.hongkongpost.com/CGI/mt/c_mtresult.jsp?tracknbr=
			this.loadPage(service.url,getHongkong,false,args);
			break;
	
		case 'www.japanpost.jp/ems':
		case 'www.japanpost.jp/m10':
		case 'www.japanpost.jp/reg':
		case 'www.japanpost.jp/yupack':
	
			var args = setArgs('JapanPost',childNo);
			args.lang = (translate('xx') == 'ja') ? 'jp' : 'en';
			service.url = 'https://trackings.post.japanpost.jp/services/srv/search/direct?locale='+args.lang+
				'&reqCodeNo1='+encodeURIComponent(service.no);
			this.loadPage(service.url,getTracker,false,args);
			break;
	
		case 'www.laposte.fr':

			var args = setArgs('LaPoste',childNo);
			var no = service.no.replace(/ /g,'');
			service.url = 'http://www.colissimo.fr/portail_colissimo/suivre.do?parcelnumber='+encodeURIComponent(no);
			var url = 'http://www.laposte.fr/widgetcourrier/php/suiviCourrierJSONproxy.php?code='+encodeURIComponent(no);
			this.loadPage(url,getJSON,false,args);
			break;

		case 'www.lasership.com':
	
			var args = setArgs('LaserShip',childNo);
			service.url = 'http://www.lasership.com/track/'+encodeURIComponent(service.no);
			var url = 'http://www.lasership.com/track/'+encodeURIComponent(service.no)+'/json';
			this.loadPage(url,getJSON,false,args);
			break;
	
		case 'www.ontrac.com':
	
			var args = setArgs('OnTrac',childNo);
			service.url = 'https://www.ontrac.com/trackingres.asp?tracking_number='+encodeURIComponent(service.no);
			this.loadPage(service.url,getDetailPage,false,args);
			break;
	
		case 'www.parcelforce.com':

			var args = setArgs('Parcelforce',childNo);
			service.url = 'http://www2.parcelforce.com/track-trace?trackNumber='+encodeURIComponent(service.no);
			this.loadPage(service.url,getMultiple,false,args);
			break;
	
		case 'www.post.at':
	
			var args = setArgs('Post.at',childNo);
			service.url = (iPhone && !iPad) ? 
				'http://mobil.post.at/sendungsverfolgung.php?language='+translate('xx')+'&pnum1='+encodeURIComponent(service.no) :
				'http://www.post.at/sendungsverfolgung.php?language='+translate('xx')+'&pnum1='+encodeURIComponent(service.no);
			this.loadPage(service.url,getTracker,false,args);
			break;
	
		case 'www.postdanmark.dk':
	
			var args = setArgs('PostDanmark',childNo);
			if (translate('xx') == 'da') {
				service.url = 'http://www.postdanmark.dk/da/Sider/TrackTrace.aspx?search='+encodeURIComponent(service.no);
			} else service.url = 'http://www.postdanmark.dk/en/tracktrace/Pages/home.aspx?search='+encodeURIComponent(service.no);
			this.loadPage(service.url,getTracker,false,args);
			break;

		case 'www.poste.it':
		case 'www.poste.it/posta1':
		case 'www.poste.it/pacco1':
		case 'www.poste.it/maxi':
		case 'www.poste.it/pacco':
		case 'www.poste.it/ems':

			var args = setArgs('Poste-it',childNo);
			var url = 'http://poste.it/online/dovequando/ricerca.do';
			var no = service.no.replace(/-/g,'');
			var postData = 'mpdate=0&mpcode='+encodeURIComponent(no);
			this.loadPage(url,getDetailPage,postData,args);
			break;

		case 'www.posten.no':
	
			var args = setArgs('Posten-no',childNo);
			args.lang =  (translate('xx') == 'no') ? 'no' : 'en';
			service.url = 'http://sporing.posten.no/sporing.html?layout=normal&lang='+args.lang+'&q='+encodeURIComponent(service.no);
			this.loadPage(service.url,getTracker,false,args);
			break;
	
		case 'www.posten.se':
	
			var args = setArgs('Posten-se',childNo);
			if (translate('xx') == 'sv') {
				service.url = 'http://www.posten.se/sv/Kundservice/Sidor/Sok-brev-paket.aspx?search='+encodeURIComponent(service.no);
			} else service.url = 'http://www.posten.se/en/Pages/Track-and-trace.aspx?search='+encodeURIComponent(service.no);
			this.loadCookiePage(service.url,getTracker,false,args);
			break;
	
		case 'www.postnl.nl':
		case 'www.tntpost.nl':
	
			var args = setArgs('PostNL',childNo);
			service.url = 'https://mijnpakket.postnl.nl/Claim?Barcode='+encodeURIComponent(service.no);
			service.url += (service.extra) ? '&Postalcode='+encodeURIComponent(service.extra) : '&Foreign=True';
			this.loadCookiePage(service.url,getTracker,false,args);
			break;
	
		case 'www.purolator.com':
	
			var args = setArgs('Purolator',childNo);
			args.lang = (translate('xx') == 'fr') ? 'fr' : 'en';
			service.url = 'https://www.purolator.com/'+args.lang+'/ship-track/tracking-details.page?pin='+encodeURIComponent(service.no);
			this.loadPage(service.url,getTracker,false,args);
			break;

		case 'www.royalmail.com':

			service.url = 'http://www.royalmail.com/track-trace?trackNumber='+encodeURIComponent(service.no);
			var url = 'http://www.royalmail.com/trackdetails';
			var postData = 'tracking_number='+encodeURIComponent(service.no);
			var args = setArgs('RoyalMail',childNo);
			this.loadCookiePage(url,getTracker,postData,args);
			break;

		case 'www.sagawa-exp.co.jp':
	
			service.url = 'http://k2k.sagawa-exp.co.jp/p/web/okurijosearch.do?okurijoNo='+encodeURIComponent(service.no);
			var args = setArgs('Sagawa',childNo);
			this.loadPage(service.url,getTracker,false,args);
			break;
	
		case 'www.post.ch':
	
			service.url = 'https://www.post.ch/EasyTrack/submitParcelData.do?formattedParcelCodes='+encodeURIComponent(service.no)+';&p_language='+translate('xx');
			var args = setArgs('SwissPost',childNo);
			this.loadPage(service.url,getTracker,false,args);
			break;
	
		case 'www.tnt.com':
		case 'www.tnt.com/ref':
	
			var mode = (service.from == 'www.tnt.com/ref') ? 'REF' : 'CON';
			service.url = 'http://www.tnt.com/webtracker/tracking.do?respLang=en&respCountry=US&searchType='+
				encodeURIComponent(mode)+'&cons='+encodeURIComponent(service.no);
			var args = setArgs('TNT',childNo);
			if (childNo === false) {
				this.loadPage(service.url,getMultiple,false,args);
			} else this.loadPage(service.url,getTracker,false,args);
			break;

		case 'www.tntexpress.com.au':

			service.url = 'http://www.tntexpress.com.au/InterAction/ASPs/CnmHxAS.asp?'+encodeURIComponent(service.no);
			var url = 'http://www.tntexpress.com.au/interaction/asps/Trackcon_tntau.asp?id=trackcon.asp';
			var postData = 'trackType=con&TextArea='+encodeURIComponent(service.no)+'&track=';
			var args = setArgs('TNT Express',childNo);
			if (childNo !== false) args.service = service;
			this.loadPage(url,getTracker,postData,args);
			break;

		case 'www.ups.com':
	
			service.url = 'http://wwwapps.ups.com/WebTracking/processInputRequest?sort_by=status&tracknums_displayed=1&TypeOfInquiryNumber=T&loc=en_US&track.x=0&track.y=0&InquiryNumber1='+encodeURIComponent(service.no);	
			var args = setArgs('UPS',childNo);
			if (childNo !== false) {
				args.service = service;
				this.loadPage(service.url,getTracker,false,args);
			} else this.loadPage(service.url,getMultiple,false,args);
			break;

		case 'www.ups-mi.net':
	
			service.url = 'http://www.ups-mi.net/packageID/packageid.aspx?pid='+encodeURIComponent(service.no);
			var args = setArgs('UPS Mail Innovations',childNo);
			this.loadPage(service.url,getTracker,false,args);
			break;
	
		case 'www.usps.com':
	
			service.url = 'https://tools.usps.com/go/TrackConfirmAction.action?tLabels='+encodeURIComponent(service.no);	
			var args = setArgs('USPS',childNo);
			this.loadPage(service.url,getTracker,false,args);
			break;
	
		case 'www.kuronekoyamato.co.jp':
	
			url = 'http://toi.kuronekoyamato.co.jp/cgi-bin/tneko';
			postData = 'number00=1&number01='+encodeURIComponent(service.no);
			service.url = 'http://otodoke.kuronekoyamato.co.jp/otodoke/servlet/jp.co.kuronekoyamato.otodoke.jikan.browser.S_CRTMENQ0000?id='+
				encodeURIComponent(service.no.replace(/-/g,''));
			var args = setArgs('Yamato',childNo);
			this.loadPage(url,getTracker,postData,args);
			break;

		case 'www.yodel.co.uk':

			var args = setArgs('Yodel',childNo);
			args.extra = (service.skipExtra) ? '' : service.extra;
			var no = (service.no.toUpperCase()).replace(/ /g,'');
			var extra = (args.extra.toUpperCase()).replace(/ /g,'');
			service.url = 'http://www.myyodel.co.uk/tracking/'+no+'/'+extra;
			this.loadPage(service.url,getTracker,false,args);
			break;

		case 'www.amazon.com':
		case 'www.amazon.ca':
		case 'www.amazon.co.uk':
		case 'www.amazon.co.jp':
		case 'www.amazon.de':
		case 'www.amazon.at':
		case 'www.amazon.es':
		case 'www.amazon.fr':
		case 'www.amazon.it':

			var no = service.no.replace(/[^0-9]/g,'').replace(/([0-9]{3})([0-9]{7})([0-9]{7})/,'$1-$2-$3');
			service.url = 'https://'+service.domain+'/gp/css/summary/edit.html?ie=UTF8&orderID='+encodeURIComponent(no);
			this.loadCookiePage(service.url,getAmazon,false,false);
			break;
	
		case 'other':
	
			service.url = service.extra;
			if (service.url) {
				if (!service.url.match(/^https?:\/\//i)) service.url = 'http://'+service.url;
				this.loadPage(service.url,getOther,false,false);
			} else {
				if (typeof updateOther == 'function') updateOther(this);
				this.updateItems();
			}
			break;
	
		default:
	
			if (this == service) {
				this.count = 0;
				this.items = [];
				this.displayed = 0;
			}
			this.updateItems();
			break;
	
	}
}

function getAdobe () {

	var delivery = this.delivery;
	var sections = false;
	var items = false;
	var result = false;
	var thisResult = false;
	var status = false;
	var trackingUrl = false;
	var x = 0;
	var y = 0;
	var z = 0;

	if (this.responseText) {

		var output = stripWhiteSpace(this.responseText);
		if (iPhone) delivery.html = output;

		// Get each section of the order
		sections = output.match(/<td colspan="5"> ?<strong>(.*?)(<thead ?class="?pckg-ovw"?>|<\/table>)/gi);

		for (y in sections) {

			var item = resetItem();

			// Get the name and status of this section
			result = sections[y].match(/<td colspan="5"> ?<strong>[^<]*<\/strong> ?(<span[^>]*>)?([^\*<]*)/i);

			if (result) {

				if (result[2]) status = result[2];
				if (status.match(/^shipped/i)) {
	
					// Get the ship date for shipped items
					result = status.match(/shipped on (.*)/i);
					if (result && result[1]) item.shipSaved = cleanUpDate(result[1],false,delivery.from);
					status = 'Shipped';

				} else if (status.match(/^pre-?order/i)) {

					// Get the ship date for pre-orders
					result = status.match(/pre-?order estimated availability date (.*)/i);
					if (result && result[1]) item.shipSaved = cleanUpDate(result[1],false,delivery.from);

				} else if (status.match(/^expected arrival/i)) {

					// Get the ship date for pre-orders
					result = status.match(/expected arrival date (.*)/i);
					if (result && result[1]) item.deliverSaved = cleanUpDate(result[1],false,delivery.from);

				}
				item.status = status;

				// Get the tracking number for shipped items
				result = sections[y].match(/Tracking Number:<\/strong> ?(<a href="?https?:\/\/([^\/]*)[^>]*>)? ?([^<]*)/i);

				if (result && result[3]) {
					var trackingFrom = (result[2]) ? trim(result[2]) : false;
					var trackingNo = trim(result[3]);
					var service = setService(false,trackingFrom,trackingNo);
					if (!service) service = setServiceByNumber(trackingNo,
						['www.dhl.com','www.dhlglobalmail.com','www.fedex.com','www.ups.com','www.usps.com']);
					if (service) delivery.startUpdate(service,y);
				}

				// Get each item in the section
				items = sections[y].match(/<tr[^>]*> ?<td[^>]*> ?<strong>(<span[^>]*>[^<]*<\/span>)?([^<]*)/gi);
				var firstItem = true;
				for (z in items) {

					// Get the name of the item
					result = items[z].match(/<strong>(<span[^>]*>[^<]*<\/span>)?([^<]*)/i);
					if (result && result[2]) {
						if (firstItem) {
							firstItem = false;
							result[2] = trim(result[2]);
							item.title = (delivery.name) ? htmlEntities(delivery.name)+": "+result[2] : result[2];
						} else item.title += ", "+result[2];
					}
		
				}

				if (x == 0) delivery.items = [];
				delivery.items[x] = item;
				x++;

			}

		}

		delivery.count = delivery.items.length;
		if (!delivery.items[0]) delivery.count = 0;

	} else delivery.count = -1;

	if (delivery.count <= 0) {

		logRequest(1,this);
		// Check for an error message. Doesn't seem to work, but it should...?
		result = output.match(/<span class="required">([^<]*)/i);
		if (result && result[1]) {
			delivery.notFound(result[1]);
		} else delivery.notFound();

	}
	delivery.reqComplete++;
	delivery.updateItems();

	return;

}

function sessionAmazon () {

	var delivery = this.delivery;
	if (this.responseText && !manualSignIn[delivery.from+'-'+delivery.extra]) {

		delivery.showMessage(translate('Getting delivery status…'));
		var output = stripWhiteSpace(this.responseText);
		if (iPhone) delivery.html = output;

		var result = (output) ? output.match(/<form[^>]*name=.?signIn.?[^>]*action="([^"]*)[^>]*>(.*?)<\/form>/i) : false;
		var captcha = (output) ? output.match(/<div id="ap_captcha_img"[^>]*>/i) : false;
		if (result && !captcha) {

			if (missingPassword(delivery)) {
				delivery.count = 0;
				delivery.notFound();
			} else {

				var url = result[1];
				if (url.charAt(0) == '/') url = 'https://'+delivery.domain+url;

				var postData = 'openid.return_to=https%3A%2F%2F'+delivery.domain+'%2Fgp%2Fcss%2Fsummary%2Fedit.html%3Fie%3DUTF8%26orderID%3D'+encodeURIComponent(delivery.no)+'&openid.pape.max_auth_age=ape%3AOTAw&create=0&email='+encodeURIComponent(delivery.extra)+'&password='+encodeURIComponent(delivery.password);
				var inputs = result[2].match(/<input.*?>/gi);
				for (y in inputs) {
					if (result = inputs[y].match(/name="(.*?)".*?value="(.*?)"/i)) {
						var name = result[1];
						if (name != 'create' && name != 'openid.return_to' && name != 'openid.pape.max_auth_age' && 
							name != 'email' && name != 'password') postData += '&'+name+'='+encodeURIComponent(result[2]);
					}
				}
				delivery.loadCookiePage(url,getAmazon,postData,false);

			}

		} else if (captcha || (output && output.match(/<form name="ap_dcq_form"[^>]*>/i))) {

			manualSignIn[delivery.from+'-'+delivery.extra] = true;
			delivery.count = 0;
			delivery.notFound();

		} else delivery.loadCookiePage(delivery.url,getAmazon,false,false);

	} else {
		if (manualSignIn[delivery.from+'-'+delivery.extra]) {
			delivery.count = 0;
		} else if (!delivery.count) {
			logRequest(1,this);
			delivery.count = -1;
		}
		delivery.notFound();
	}

	delivery.reqComplete++;
	delivery.updateItems();
	return;

}

function getAmazon () {

	var delivery = this.delivery;
	var sections = false;
	var items = false;
	var result = false;
	var thisResult = false;
	var status = '';
	var trackingUrl = false;
	var x = 0;
	var y = 0;
	var yy = 0;
	var z = 0;

	if (this.responseText) {

		var output = stripWhiteSpace(this.responseText);
		if (iPhone) delivery.html = output;

		// Get each section of the order
		sections = output.match(/<a name="?(un)?shipped-items(-[0-9]*)?"?>(.*?)<\/table> ?<br \/>/gi);
		if (!sections) sections = output.match(/<a name="?(un)?shipped-items(-[0-9]*)?"?>(.*)/gi);

		for (y in sections) {

			var item = resetItem();

			// Get the name and status of this section
			result = sections[y].match(/<b class="?sans"?>([^<]*)/i);
			if (result && result[1]) {

				item.title = '';
				status = result[1].replace(/^([^:]*): ?/i,'');
				if (status.match(/(Not Yet Shipped|Not Yet Dispatched|Noch nicht versandt|À expédier|Non ancora spedito)/i)) status = '';
				if (status.match(/^shipped/i)) {
	
					// Get the ship date for shipped items
					result = status.match(/shipped on (.*)/i);
					if (result && result[1]) item.shipSaved = cleanUpDate(result[1],false,delivery.from);
					status = 'Shipped';
	
				} else {

					// Get ship date for the japanese store, possibly others
					result = status.match(/([0-9]{4}\/[0-9]{1,2}\/[0-9]{1,2})/i);
					if (result && result[1]) item.shipSaved = cleanUpDate(result[1],false,delivery.from);

					// Get ship date for the german store, possibly others
					result = status.match(/([0-9]{1,2}[^a-z]{1,2}[a-z]*.?[0-9]{4})/i);
					if (result && result[1]) item.shipSaved = cleanUpDate(result[1],false,delivery.from);

				}
				item.status = status;

				// Get the tracking number for shipped items
				result = sections[y].match(/<a href="(https:\/\/[^\/]*)?(\/gp\/css\/shiptrack\/[^"]*)">/i);
				if (result && result[2]) {
					if (result[1]) {
						trackingUrl = result[1]+result[2];
					} else trackingUrl = 'https://'+delivery.domain+result[2];

					var data = getData(trackingUrl);
					var service = false;
					if (data['carrierId'] && data['trackingNumber']) service = 
						setServiceByString(data['carrierId'],data['shipMethod'],data['trackingNumber']);
					if (service) {
						delivery.startUpdate(service,x);
					} else {
						var args = setArgs('AmazonTracker',x);
						delivery.loadCookiePage(trackingUrl,getTracker,false,args);
					}
				}

				// Check if this shipment is split up
				subSections = sections[y].match(/(.*?)(<hr size="-1" noshade="noshade" color="#CCCC99" \/>|$)/gi);

				for (yy in subSections) {
					if (subSections[yy]) {

						if (yy > 0) var item = resetItem();

						// Get the shipping and delivery estimate for this section
						// First check for it with the sub arrow, then without
						var result = subSections[yy].match(/<td(?: valign="top")?>.?(?:<font[^>]*><b>)?.?<b>([^<]*)<\/b>([^<]+)<br \/>[^<]*<img src="?[^"]*arrow_subordinate(?:\.[^\.]*)?\.gif"?[^>]*\/>.?<b>[^<]*<\/b>([^<]*)(?!<\/td>)/i);						
						if (result && result[2]) {
							item.shipSaved = cleanUpDate(splitDate(result[2]),false,delivery.from);
							if (result[3]) item.deliverSaved = cleanUpDate(splitDate(result[3]),false,delivery.from);
						} else {

							result = subSections[yy].match(/<td(?: valign="top")?>.?(?:<font[^>]*><b>)?.?<b>([^<]*)<\/b>([^<]*)(?:<br \/>.?<b>[^<]*<\/b>([^<]*))?(?!<\/td>)/i);

							// When two pre-order shipments are grouped into one, the date gets lost for the first. This should catch it.
							subResult = subSections[yy].match(/<tr valign="top"> .?<td valign="top"> .?<b>([^<]*)<\/b>([^<]*)/i);
							if (subResult && trim(subResult[2])) result = subResult;

							if (result && result[2]) {
								if (result[1].match(/(Shipping estimate|Dispatch estimate|発送予定日|Voraussichtliches Versanddatum|Date d'envoi estimée|Date d&#39;envoi estim&eacute;e|Previsione di spedizione)/i)) {
									item.shipSaved = cleanUpDate(splitDate(result[2]),false,delivery.from);
									if (result[3]) item.deliverSaved = cleanUpDate(splitDate(result[3]),false,delivery.from);
								} else item.deliverSaved = cleanUpDate(splitDate(result[2]),false,delivery.from);
							}
						}
			
						// Get each item in the section
						items = subSections[yy].match(/<td colspan="1" valign="top">(.*?)<br \/>/gi);
						var firstItem = true;
						for (z in items) {
							// Get the name of the item
							result = items[z].match(/<[^>]*>([^<]*)(<\/a>|<br \/>)/i);
							if (result && result[1]) {
								if (firstItem) {
									firstItem = false;
									item.title = (delivery.name) ? htmlEntities(delivery.name)+": "+result[1] : result[1];
								} else item.title += ", "+result[1];
							}
						}

						if (x == 0) delivery.items = [];
						delivery.items[x] = item;
						x++;

					}
				}

			}

		}

		delivery.count = x;
		if (!delivery.items[0] || delivery.items[0].title == translate('Unknown Item')) delivery.count = 0;

	}

	if (delivery.count == 0) {
		if (delivery.tries < 2) {
			delivery.tries++;
		} else {
			delivery.tries = 0;
			logRequest(1,this);
			// Check for an error message. message_error only needed for new login method?
			result = output.match(/(?:<div id="message_error"[^>]*>|<div class="message error"[^>]*>).*?<h6>[^<]*<\/h6> ?<p>(.*?)<\/p> ?<\/div>/i);
			if (!result) result = output.match(/<br \/><font color="#(?:990000|000099)">([^<]*)/i); // Used for old login, canceled payments
			if (result && result[1]) {
				// Strip extra text from old login errors
				result = (result[0].match(/<font color="#990000">/)) ? result[1].replace(/(\. |。).*/i,'$1') : result[1];
				delivery.notFound(result);
			} else {
				if (output.match(/(<title>500 Service Unavailable Error|<body> ?<div style="width: 90%; margin-left: 5%"> ?<h2>)/)) delivery.count = -1;
				delivery.notFound();
			}
		}
	} else delivery.tries = 0;

	if (delivery.tries == 0) {
		delivery.reqComplete++;
		delivery.updateItems();
	} else if (output && (result = output.match(/<form[^>]*name=.?signIn.?[^>]*action="([^"]*)[^>]*>(.*?)<\/form>/i))) {
		this.sessionAmazon = sessionAmazon;
		this.sessionAmazon();	
	} else {
		var url = 'http://'+delivery.domain+'/gp/flex/sign-out.html/ref=ya__lo?ie=UTF8&path=%2Fgp%2Fcss%2Fhomepage.html&useRedirectOnSuccess=1&action=sign-out';
		delivery.loadCookiePage(url,sessionAmazon,false,false);
		delivery.reqComplete++;
		delivery.updateItems();
	}

	return;

}

function getApple () {

	var delivery = this.delivery;
	var result = false;
	var thisResult = false;
	var cancelledItems = false;
	var x = 0;

	if (this.status == 200 && this.responseText) {

		if (iPhone) delivery.html = this.responseText;

		var output = stripWhiteSpace(this.responseText);
		output = output.replace(/[\u2028]+/g,' '); // For iOS 4, in 4.7 and earlier

		// Get each section of the order
		var sections = output.match(/<div class="shaded-box">(.*?)<\/div> ?<\/li> ?(?:<!-- \/\.product -->)? ?<\/ul> ?<\/div> ?<\/div> ?<\/div>/gi);

		for (var y in sections) {

			var sectionInfo = false;
			var sectionShipped = false;
			var sectionDelivered = false;
			var status = false;
			var trackingUrl = false;
			var item = resetItem();

			// Get the status of this section, otherwise assume it's the same as the previous item
			result = sections[y].match(/<h4[^>]*> ?<span[^>]*>([^<]*)/i);
			if (result && result[1]) status = trim(result[1]);

			// Skip replaced or cancelled items
			// Not sure if "Replaced with New Product" or "Returns Completed" are still used
			if (!status.match(/^(Cancelled|Replaced with New Product|Returns Completed)$/i)) {

				result = sections[y].match(/<h4[^>]*>(.*?)<\/h4>/i);
				if (result && result[1]) {
					sectionInfo = trim(result[1]);
					result = getAppleDates(sectionInfo);
					sectionShipped = result[0];
					sectionDelivered = result[1];
				}

				if (status.match(/^(Shipped|出荷完了|已出貨)$/i)) {

					// Get the ship date for shipped items
					result = sections[y].match(/<span class="h5"> ?(?:日付：|日期為：)?([^<|]*)/i);
					if (result && result[1]) {
						sectionShipped = reorderInternationalDate(result[1]);
						trackingUrl = false;
					}

					// Get the tracking number for shipped items
					result = sections[y].match(/<a target="_blank" href="([^"]*)" class="(link|button account)">/i);
					if (!result) result = sections[y].match(/<li><a target="_blank" href="([^"]*)">/i);
					if (result && result[1]) {
						trackingUrl = result[1].replace(/&amp;/g,'&');
						if (trackingUrl.charAt(0) == '/') trackingUrl = 'https://store.apple.com'+trackingUrl;
					}
	
				}

				// Get each item in the section
				var items = sections[y].match(/(<li class="delivery-group">|<div class="media-block product-item">)(.*?)<\/div> ?<\/li>/gi);
				for (var z in items) {

					item.status = status;
					item.details = {};
					item.details.status = status;
					item.detailsurl = trackingUrl;

					// Get the name of the item
					result = items[z].match(/<h4 class="strong name">([^<]*)/i);
					if (result && result[1]) item.title = result[1];

					result = getAppleDates(cleanSpaces(items[z]));
					item.shipSaved = (result[0]) ? cleanUpDate(result[0],false,delivery.from) : sectionShipped;
					item.deliverSaved = (result[1]) ? cleanUpDate(result[1],false,delivery.from) : sectionDelivered;

					if (z == 0) {
						if (!sectionShipped) sectionShipped = item.shipSaved;
						if (!sectionDelivered) sectionDelivered = item.deliverSaved;
					}

					var lastItem = false;
					if (x == 0) {
						delivery.items = [];
					} else lastItem = delivery.items[x-1];

					if (lastItem && 
						item.status == lastItem.status && 
						item.shipSaved == lastItem.shipSaved && 
						item.deliverSaved == lastItem.deliverSaved &&
						item.detailsurl == lastItem.detailsurl) {

						lastItem.title += ', '+item.title;

					} else {

						delivery.items[x] = item;	
						if (trackingUrl) {
	
							var args = setArgs(false,x);
							result = trackingUrl.match(/carrierURL=https?%3A%2F%2F([^%]*)/i);
							if (!result) result = trackingUrl.match(/https?:\/\/([^\/]*)/i);
	
							if (result && result[1]) {
								// Not supported: servicos.rapidaocometa.com.br
								if (result[1] == 'www.fedex.com') {
									var data = getData(trackingUrl);
									var service = false;
									if (data['tracknumbers']) service = setService(service,'www.fedex.com',data['tracknumbers']);
									if (service) delivery.startUpdate(service,x);
								} else if (result[1] == 'www.ups.com' || result[1] == 'wwwapps.ups.com') {
									var data = getData(trackingUrl);
									var service = false;
									var no = data['InquiryNumber1'];
									if (!no) no = data['tracknum'];
									if (!no) no = data['trackNums'];
									if (!no) no = data['inquiry1'];
									if (!no) no = data['trackingNumber'];
									if (!no) no = data['InquiryNumber'];
									if (no) service = setService(service,'www.ups.com',no);
									if (service) delivery.startUpdate(service,x);
								} else if (result[1] == 'applestore.bridge-point.com') {
									args.site = 'BridgePoint';
									args.matchDate = dateFromString(item.shipSaved);
									delivery.loadPage(trackingUrl,getTracker,false,args);
								} else if (result[1] == 'apple.mytracking.net') {
									args.site = 'MyTracking';
									delivery.loadPage(trackingUrl,getTracker,false,args);
								} else if (result[1] == 'www.tnt.com') {
									args.site = 'TNT';
									delivery.loadPage(trackingUrl,getTracker,false,args);
								} else if (result[1] == 'www.purolator.com') {
									args.site = 'Purolator';
									delivery.loadPage(trackingUrl,getTracker,false,args);
								} else if (result[1] == 'toidirect.kuronekoyamato.co.jp') {
									args.site = 'Yamato';
									delivery.loadPage(trackingUrl,getTracker,false,args);
								} else if (result[1] == 'www.tntexpress.com.au') {
									var data = getData(trackingUrl);
									var service = false;
									if (matches = trackingUrl.match(/\?([A-Z0-9]+)$/)) service = setService(service,'www.tntexpress.com.au',matches[1]);
									if (service) delivery.startUpdate(service,x);
								} else if (result[1] == 'mrt2.ap.dhl.com') {
									var data = getData(trackingUrl);
									var service = false;
									if (data['AWB']) service = setService(service,'www.dhl.com',data['AWB']);
									if (service) delivery.startUpdate(service,x);
								}
							}
	
						}
	
						item = resetItem();
						x++;

					}

				}

			} else cancelledItems = true;

		}

		delivery.count = delivery.items.length;
		if (!delivery.items[0] || delivery.items[0].title == translate('Unknown Item')) delivery.count = 0;
		if (delivery.name) {
			var entityName = htmlEntities(delivery.name);
			for (var y in delivery.items) delivery.items[y].title = 
				entityName+": "+delivery.items[y].title;
		}

		if (x == 0) {
			if (cancelledItems) {
				delivery.count = 1;
				delivery.items[0] = resetItem();
				delivery.items[0].title = translate('No Items Found');
				delivery.items[0].shipText = translate('Your order contains only items that');
				delivery.items[0].deliverText = translate('have been cancelled or replaced.');
			} else {
				logRequest(1,this);
				delivery.count = (this.responseText && (output = stripWhiteSpace(this.responseText)) && output.match(/(We'll be back soon|Apple's Online and phone Order Status services are temporarily unavailable due to a scheduled upgrade to our systems|We are currently updating our systems)/i)) ? -1 : 0;
				delivery.notFound();
			}
		}

	} else {
		logRequest(1,this);
		delivery.count = (this.responseText && (output = stripWhiteSpace(this.responseText)) && output.match(/(We'll be back soon|Apple's Online and phone Order Status services are temporarily unavailable due to a scheduled upgrade to our systems|We are currently updating our systems)/i)) ? -1 : 0;
		delivery.notFound();
	}

	delivery.reqComplete++;
	delivery.updateItems();
	return;

}

function getAppleDates ( html ) {

	var shipDate = false;
	var deliverDate = false;

	var result = html.match(/(?:Estimated Delivery|Delivers on|Delivers by|Delivers between|Delivers|お届け予定日：|運送日期):? ?([^<]*)/);
	if (result && result[1]) {
		deliverDate = result[1].replace(/(via|by) [A-Z.\s]+$/i,'');
		deliverDate = reorderInternationalDate(splitDate(deliverDate));
	}

	result = html.match(/(?:Available to ship|Estimated Shipping|Ships by|Estimated Ship|Ships|出荷日：|已上市):? ?([^<]*)/);
	if (result && result[1]) {
		// Fix ugly stuff like Ships: Ships by October 12th
		shipDate = splitDate(result[1].replace(/(?:Estimated Shipping|Ships by|Estimated Ship|Ships|出荷日：|已上市):?/,''));
		result = shipDate.match(/(?:Estimated Delivery|Delivers on|Delivers by|Delivers between|Delivers|お届け予定日：|運送日期):? ?([^<]*)/);
		if (result && result[1]) {
			if (!deliverDate) deliverDate = result[1];
			shipDate = shipDate.replace(result[0],'');
		}
		shipDate = (trim(shipDate)) ? reorderInternationalDate(shipDate) : false;
	}

	return [shipDate,deliverDate];

}

function getFedEx () {

	var delivery = this.delivery;
	var service = this.args.service;

	if (this.status == 200 && this.responseText && service && service.no) {

		var no = service.no.replace(/^([0-9]+)E$/,'$1');
		var url = 'https://www.fedex.com/trackingCal/track';
		var jsonData = JSON.stringify({
			"TrackPackagesRequest":{
				"appType":"wtrk",
				"uniqueKey":"",
				"processingParameters":{"anonymousTransaction":true,"clientId":"WTRK","returnDetailedErrors":true,"returnLocalizedDateTime":false},
				"trackingInfoList":[{
					"trackNumberInfo":{"trackingNumber":no,"trackingQualifier":"","trackingCarrier":""}
				}]
			}
		});

		var postData = 'data='+jsonData+'&action=trackpackages&locale=en_US&format=json&version=99';
		delivery.loadPage(url,getJSON,postData,this.args);

	} else {
		logRequest(1,this);
		if (!delivery.count) delivery.count = -1;
		delivery.notFound();
	}

	delivery.reqComplete++;
	delivery.updateItems();
	return;

}

function getFedExMultiple () {

	var delivery = this.delivery;
	var result = false;

	var output = trim(this.responseText);
	if ((this.status == 200 || this.status == 0) && output) {

		try {
			output = output.replace(/\\x/g,'%');
			object = JSON.parse(output);
		} catch(err) {
			logMessage(1,err);
			logRequest(1,this);
			object = {};
			success = false;
		}

		object = object.AssociatedShipmentsResponse;
		if (object && object.successful && object.associatedShipmentList) {
			for (var x in object.associatedShipmentList) {

				var anObject = object.associatedShipmentList[x];
				if (anObject.isSuccessful) {
					var trackingNbr = decodeURIComponent(anObject.trackingNbr);
					if (delivery.items && delivery.items[0] && (
						decodeURIComponent(anObject.trackingQualifier) == delivery.items[0].matchNo ||
						trackingNbr == delivery.no.replace(/\s+/g,''))) {

						delivery.items[0].title = deliveryTitle(delivery.no,delivery.name,
							trackingNbr,object.associatedShipmentList.length);

					} else {

						var item = resetItem();

						item.title = deliveryTitle(delivery.no,delivery.name,
							trackingNbr,object.associatedShipmentList.length);

						var status = decodeURIComponent(anObject.keyStatus);
						if (anObject.delivered) status = 'Complete';
						if (status) item.status = status;

						var shipDate = decodeURIComponent(anObject.displayShipDt);
						var deliverDate = (anObject.displayActDeliveryDt) ? decodeURIComponent(anObject.displayActDeliveryDt) : 
							decodeURIComponent(anObject.displayEstDeliveryDt);
						if (shipDate) item.shipSaved = cleanUpDate(shipDate,false,delivery.from);
						if (deliverDate) item.deliverSaved = cleanUpDate(deliverDate,false,delivery.from);

						var count = delivery.items.push(item);
						var service = setService(false,'www.fedex.com',trackingNbr);
						if (service) delivery.startUpdate(service,count-1);

					}
				}

			}
		}
		delivery.count = delivery.items.length;

	}

	delivery.reqComplete++;
	delivery.updateItems();
	return;

}

function getGoogle () {

	var delivery = this.delivery;
	delivery.tries++;

	if (this.responseText && !manualSignIn[delivery.from+'-'+delivery.extra]) {

		var output = stripWhiteSpace(this.responseText);

		if (delivery.tries == 0 && (result = output.match(/<div class="b">There was an error transmitting your data\. Please try again\./i))) {

			// Wrong account, need to log out
			var url = 'https://checkout.google.com/m/confirm?action=LOGOUT_USER&skip=true&continueUrl=https://checkout.google.com/m/main&cancelUrl=https://checkout.google.com/m/main';
			delivery.loadCookiePage(url,getGoogle,false,false);

		} else if (delivery.tries <= 3 && output.match(/<form id="verify-form"[^>]*>/i)) {

			manualSignIn[delivery.from+'-'+delivery.extra] = true;
			delivery.count = 0;
			delivery.notFound();

		} else if (delivery.tries <= 3 && (result = output.match(/<a href="(https?:\/\/accounts.google.com\/ServiceLogin[^"]*)"[^>]*>/i))) {

			// Login links
			var url = result[1].replace(/&amp;/g,'&');
			delivery.loadCookiePage(url,getGoogle,false,false);

		} else if (delivery.tries <= 3 && (result = output.match(/<form.*?id="gaia_loginform".*?action= ?"([^"]*)"/i))) {

			// Login form
			if (missingPassword(delivery)) {
				delivery.count = 0;
				delivery.notFound();
			} else {
				delivery.tries++;
				var url = result[1].replace(/&amp;/g,'&');
				if (url.charAt(0) == '/') {
					url = 'https://accounts.google.com'+url;
				} else if (url.charAt(0) != 'h') {
					url = 'https://accounts.google.com/'+url;
				}	

				result = output.match(/<input type="hidden".*?name="GALX".*?value="([^"]*)"/i);
				if (result) var GALX = result[1];

				postData = 'service=sierra&continue=https%3A%2F%2Fcheckout.google.com%2Fm%2Fview%2Freceipt%3Ft%3D'+encodeURIComponent(delivery.no)+
					'%26upgrade%3Dtrue&nui=5&skipvpage=true&rm=hide&ltmpl=mobilec&btmpl=mobile&Email='+
					encodeURIComponent(delivery.extra)+'&Passwd='+encodeURIComponent(delivery.password)+'&GALX='+GALX;

				delivery.loadCookiePage(url,getGoogle,postData,false);
			}

		} else if (delivery.tries <= 3 && !output.match(/<ul class="progress"><li><b>([^<]*)<\/b> <span class="nb">(.*?)<\/span><\/li>/i)) {

			// Some other page that's not the order page
			delivery.tries++;
			var url = 'https://checkout.google.com/m/view/receipt?t='+encodeURIComponent(delivery.no);
			delivery.loadCookiePage(url,getGoogle,false,false);

		} else {

			delivery.items = [];
			delivery.tries = 0;

			var sections = false;
			var result = false;
			var lastResult = false;
			var status = false;
			var details = {};
			var x = 0;
			var y = 0;

			var statusRegEx = /<ul class="progress"><li><b>([^<]*)<\/b> <span class="nb">(.*?)<\/span><\/li>/i
			var itemRegEx = /<tr><td class="item">(.*?)<\/tr>/gi

			// Get the main order status and date
			result = output.match(statusRegEx);
			if (result && result[1]) {
				details.date = cleanUpDate(result[1],false,delivery.from);
				details.status = status = result[2];
				details.location = '';
				details.mapLocation = '';
			}

			// Get each section of the order
			sections = output.match(itemRegEx);
			for (y in sections) {

				var item = resetItem();
				item.details = details;

				result = sections[y].match(/<td class="item">(.*?)<\/td>/i);
				if (result && result[1] && !result[1].match(/^(Shipping|Tax):/i)) {

					item.title = (delivery.name) ? htmlEntities(delivery.name)+": "+result[1] : result[1];
					if (x == 0) delivery.items = [];

					// Get the tracking number for shipped items
					result = item.details.status.match(/<a[^>]*href="([^"]*)"[^>]*>Track/i);
					if (result && result[1]) {
						trackingUrl = removeHtmlEntities(result[1]);
						var args = setArgs(false,x);
						result = trackingUrl.match(/https?:\/\/([^\/]*)/i);
						if (result && result[1]) {
							if (result[1] == 'wwwapps.ups.com') {
								args.site = 'UPS';
								delivery.loadPage(trackingUrl,getTracker,false,args);
							} else if (result[1] == 'www.fedex.com') {
								var data = getData(trackingUrl);
								var service = false;
								if (data['tracknumbers']) service = setService(service,'www.fedex.com',data['tracknumbers']);
								if (service) delivery.startUpdate(service,x);
							}
						}
					}

					if (x == 0) delivery.items = [];
					delivery.items[x] = item;
					x++;
				}
	
			}

			delivery.count = x;
			if (!delivery.items[0] || delivery.items[0].title == translate('Unknown Item')) delivery.count = 0;
			if (delivery.count == 0) {
				// Check for an error message
				result = output.match(/(?:<div[^>]*class="errormsg"[^>]*>|<div id="verifyText" class="text smaller">)([^[<]*)/i);
				if (result && result[1]) {
					delivery.notFound(result[1]);
				} else delivery.notFound();
			} else if (iPhone) {
				delivery.html = output;
			}

		}

	} else {
		if (manualSignIn[delivery.from+'-'+delivery.extra]) {
			delivery.count = 0;
		} else if (!delivery.count) {
			logRequest(1,this);
			delivery.count = -1;
		}
		delivery.notFound();
	}

	delivery.reqComplete++;
	delivery.updateItems();
	return;

}

function getHongkong () {

	var delivery = this.delivery;
	var output = stripWhiteSpace(this.responseText);
	var result = output.match(/<!-- #[a-z]* --> ?<tr> ?<td> ?<a href="([^"]*)">/i);
	if (result && result[1]) {

		delivery.url = result[1].replace(/&amp;/g,'&');
		var args = setArgs('HongkongPost',false);
		args.type = 1;
		delivery.loadPage(delivery.url,getTracker,false,args);

	} else {

		this.args = setArgs('HongkongPost',false);
		this.args.type = 0;
		delivery.reqCount++;
		this.getTracker();

	}

	delivery.reqComplete++;
	delivery.updateItems();
	return;

}

function getJSON () {

	var delivery = this.delivery;
	var result = false;
	var site = this.args.site;
	var type = this.args.type;
	var childNo = this.args.childNo;
	var isChild = this.args.isChild;

	var output = trim(this.responseText);
	// Comes wrapped in a function, unwrap it
	if (site == 'HLG') output = output.replace(/^[a-z0-9_]*\((.*?)\);$/,'$1');

	if ((this.status == 200 || this.status == 0 || site == 'GLS') && output) {

		var from = (this.args.service) ? this.args.service.from : delivery.from;
		var deliveredString = /Delivered/i;
		var connect = true;
		var success = true;
		var status;
		var details = {};
		var shipDate; // Ship date
		var deliverDate; // Delivery date
		var matchNo;
		var errorText;
		var multipleItems;

		if (!isChild) {
			var item = resetItem();
			item.title = (delivery.name) ? htmlEntities(delivery.name) : htmlEntities(delivery.no);
			delivery.items = [];
			delivery.items[childNo] = item;
		}

		try {
			if (site == 'FedEx') output = output.replace(/\\x/g,'%');
			object = JSON.parse(output);
		} catch(err) {
			logMessage(1,err);
			logRequest(1,this);
			object = {};
			success = false;
		}

		if (site == 'FedEx') {

			object = object.TrackPackagesResponse;
			if (object && object.successful && object.packageList) {
				for (var x in object.packageList) {
					var anObject = object.packageList[x];
					if (anObject.isSuccessful) {

						status = anObject.mainStatus;
						if (anObject.isDelivered) status = 'Delivered';

						details = {};
						details.status = status;
						var detailObject = anObject.scanEventList[0];
						if (detailObject) {
							if (detailObject.status) details.status = decodeURIComponent(detailObject.status);
							if (detailObject.scanDetails) details.status += ': '+decodeURIComponent(detailObject.scanDetails);
							details.date = decodeURIComponent(detailObject.date);
							details.location = decodeURIComponent(detailObject.scanLocation);
						}

						shipDate = decodeURIComponent(anObject.displayShipDt);
						deliverDate = (anObject.displayActDeliveryDt) ? decodeURIComponent(anObject.displayActDeliveryDt) : 
							decodeURIComponent(anObject.displayEstDeliveryDt);
						matchNo = decodeURIComponent(anObject.trackingQualifier);

						if (!isChild && anObject.totalPieces > 1 && anObject.associationInfoList && anObject.associationInfoList[0]) {
							var associatedObject = anObject.associationInfoList[0];
							var url = 'https://www.fedex.com/trackingCal/track';
							var jsonData = JSON.stringify({
								"AssociatedShipmentRequest":{
									"appType":"WTRK",
									"uniqueKey":"",
									"processingParameters":{"anonymousTransaction":true,"clientId":"WTRK","returnDetailedErrors":true,"returnLocalizedDateTime":false},
									"masterTrackingNumberInfo":{
										"trackingNumberInfo":{
											"trackingNumber":decodeURIComponent(associatedObject.trackingNumberInfo.trackingNumber),
											"trackingQualifier":decodeURIComponent(associatedObject.trackingNumberInfo.trackingQualifier),
											"trackingCarrier":decodeURIComponent(associatedObject.trackingNumberInfo.trackingCarrier)
										},
										"associatedType":decodeURIComponent(associatedObject.associatedType)
									}
								}
							});
							var postData = 'data='+jsonData+'&action=getAssociatedShipments&locale=en_US&format=json&version=99';
							delivery.loadPage(url,getFedExMultiple,postData,false);
							break;
						}
						if (object.packageList.length > 1) {
							if (!multipleItems) multipleItems = [];
							multipleItems[x] = {};
							multipleItems[x].title = decodeURIComponent(anObject.trackingNbr);
							multipleItems[x].status = status;
							multipleItems[x].details = details;
							multipleItems[x].shipDate = shipDate;
							multipleItems[x].deliverDate = deliverDate;
						}

					} else {
						if (anObject.errorList && anObject.errorList[0]) errorText = decodeURIComponent(anObject.errorList[0].message);
						success = false;
					}
				}

			} else {
				connect = false;
				success = false;
			}

		} else if (site == 'GLS') {

			if (object && object.tuStatus) {
				object = object.tuStatus[0];
				if (object.progressBar.statusInfo) status = object.progressBar.statusInfo;
				if (object.history && object.history[0]) {
					var detailObject = object.history[0];
					details.date = detailObject.date;
					details.status = detailObject.evtDscr;
					if (detailObject.address) {
						var city = detailObject.address.city;
						var country = detailObject.address.countryDescription;
						if (city) details.location = city;
						if (country) {
							if (city) {
								details.location += ', '+country;
							} else details.location = country;
						}
					}
				}
			} else if (object.exceptionText) {
				errorText = clearEmptyString(stripHTML(object.exceptionText));
				success = false;
			} else {
				connect = false;
				success = false;
			}
			deliveredString = /^DELIVERED/i;

		} else if (site == 'HLG') {

			if (object && object.status) {
				object = object.status[0];
				details.date = object.statusDate;
				details.status = object.statusDescription;
			} else success = false;
			deliveredString = /delivered|zugestellt/i;

		} else if (site == 'LaPoste') {

			success = object.status;
			if (object.link) delivery.url = trim(object.link);
			details.date = object.date;
			details.status = object.message;
			deliveredString = /Votre colis est livré|Livraison effectuée|Votre colis a été remis au gardien ou à l'accueil/i;
			if (!success) errorText = object.message;

		} else if (site == 'LaserShip') {

			var event = object.Events;
			if (event) event = event[0];
			if (!event && object.ErrorMessage) {
				success = false;
				errorText = object.ErrorMessage;
			} else {
				shipDate = object.ReceivedOn;
				details.date = event.DateTime;
				if (details.date) details.date = details.date.replace('T',' ');
				details.status = event.EventShortText;
				if (event.Location) details.status += ': '+event.Location;
				details.location = event.City+' '+event.State+' '+event.PostalCode+' '+event.Country;
			}

		}

		var itemCount = (!isChild && multipleItems) ? multipleItems.length : 1;
		for (var x = 0; x < itemCount; x++) {

			var itemNo = childNo;
			if (!isChild && multipleItems) {
				itemNo = x;
				if (!delivery.items[x]) delivery.items[x] = resetItem();
				delivery.items[x].title = deliveryTitle(delivery.no,delivery.name,multipleItems[x].title,multipleItems.length);
				status = multipleItems[x].status;
				details = multipleItems[x].details;
				shipDate = multipleItems[x].shipDate;
				deliverDate = multipleItems[x].deliverDate;
			}

			if (!status) status = details.status;
			if (status && status.match(deliveredString)) status = 'Complete';
			if (status == 'Complete' && !deliverDate) deliverDate = details.date;
			if (details.date) details.date = cleanUpDate(details.date,false,from);
			if (details.location == undefined) details.location = '';
			details.mapLocation = (details.location) ? cleanLocation(details.location,from) : '';

			if (success && delivery.items[itemNo]) {
				if (status) delivery.items[itemNo].status = status;
				if (details) delivery.items[itemNo].details = details;
				if (shipDate) delivery.items[itemNo].shipSaved = cleanUpDate(shipDate,false,from);
				if (deliverDate) delivery.items[itemNo].deliverSaved = cleanUpDate(deliverDate,false,from);
				if (matchNo) delivery.items[itemNo].matchNo = matchNo;
			}

		}

		if (isChild) {
			if (!connect) {
				if (delivery.previousItems) delivery.items = delivery.previousItems;
			}
		} else {
			if (!success) {
				logRequest(1,this);
				delivery.tries = 0;
				if (connect) {
					delivery.count = 0;
				} else if (delivery.count) {
					if (delivery.previousItems) delivery.items = delivery.previousItems;
				} else delivery.count = -1;
				delivery.notFound(errorText);
			} else delivery.count = itemCount;
		}

	} else if (isChild) {

		logRequest(1,this);
		if (delivery.previousItems) delivery.items = delivery.previousItems;
		delivery.notFound();

	} else {

		logRequest(1,this);
		if (!delivery.count) delivery.count = -1;
		delivery.notFound();

	}

	delivery.reqComplete++;
	delivery.updateItems();
	return;

}

function getMultiple () {

	var delivery = this.delivery;
	var sections = false;
	var site = this.args.site;
	var packageRegEx;
	var urlRegEx;
	var rootUrl;
	var labelRegEx;

	if ((this.status == 200 || this.status == 0) && this.responseText) {

		if (iPhone) delivery.html = cleanHTML(this.responseText,delivery.from);
		var output = stripWhiteSpace(this.responseText);

		if (site == 'DHL') {
			packageRegEx = /<div id="resolveDuplicate[0-9]"[^>]*>(.*?)<a[^>]*> ?Hide Details ?<\/a> ?<\/div>/gi
		} else if (site == 'DHL (Germany)') {
			packageRegEx = /<tr[^>]*> ?<th class="explorer_spezial">(.*?)<a class="dlLink"[^>]*>[^<]*<\/a> ?<\/td> ?<\/tr>/gi;
			labelRegEx = /<th[^>]*> ?(?:Packstücknummer|Package number) ([^<]*)/i;
		} else if (site == 'DPD UK') {
			packageRegEx = /<tr> <td[^>]*>[^<]*(<a href="\/tracking\/[^"]*"[^>]*>[^<]*<\/a>) ?<\/td>/gi;
			urlRegEx = /<a href="([^"]*)"[^>]*>/i;
			labelRegEx = /<a[^>]*>([^<]*)<\/a>/i;
			rootUrl = 'http://www.dpd.co.uk';
		} else if (site == 'HLG') {
			packageRegEx = /<tr> ?<td>[^<]*<\/td> ?<td>[^<]*<\/td> ?<td>[^<]*<\/td> ?<td>[^<]*<\/td> ?<td> ?<a[^>]*>[^<]*<\/a> ?<\/td>/gi;
			urlRegEx = /<a[^>]*href="\s*([^"]*)"[^>]*>/i;
			labelRegEx = /<tr> ?<td>[^<]*<\/td> ?<td>([^<]*)/i;
			rootUrl = 'https://www.myhermes.de';
		} else if (site == 'Parcelforce') {
			packageRegEx = /<dt> ?Parcel No ?<\/dt> ?<dd> ?<a href="([^"]*)">(.*?)<\/a> ?<\/dd>/gi;
			urlRegEx = /<a href="([^"]*)">/i;
			labelRegEx = /<a href="[^"]*">([^<]*)<\/a>/i;
			rootUrl = 'http://www2.parcelforce.com';
		} else if (site == 'TNT') {
			packageRegEx = /<a xmlns="" name="[^"]*">(.*?)<\/table> ?<\/td> ?<\/tr> ?<\/table>/gi;
			labelRegEx = /(?:Consignment|Reference) ?<\/td> ?<td[^>]*> ?<b>([^<]*)/i;
		} else if (site == 'UPS') {
			packageRegEx = /<!-- Begin Section Module --> ?<div class="secLvl[^"]*"> ?<fieldset> ?<form[^>]*>(.*?)<\/fieldset> ?<\/div> ?<!-- End Section Module -->/gi;
			labelRegEx = /<input[^>]*name="trackNums"[^>]*value="([^"]*)"[^>]*>/i;
		}

		if (packageRegEx && (sections = output.match(packageRegEx))) {
			for (var y in sections) {

				var item = resetItem();
				if (y == 0) delivery.items = [];

				var label = false;
				if (labelRegEx) {
					var result = sections[y].match(labelRegEx);
					if (result) label = trim(result[1]);
				}
				item.title = deliveryTitle(delivery.no,delivery.name,label,sections.length);
				delivery.items[y] = item;

				var args = setArgs(site,y);
				args.type = this.args.type;

				if (urlRegEx && (result = sections[y].match(urlRegEx))) {
					var url = result[1].replace(/&amp;/g,'&');
					if (url.charAt(0) == '/' && rootUrl) url = rootUrl+url;
					delivery.loadPage(url,getTracker,false,args);
				} else {
					delivery.loadSection(sections[y],args);
				}

			}
			delivery.count = delivery.items.length;
		} else {
			delivery.reqCount++;
			this.getTracker();
		}

	} else {
		delivery.reqCount++;
		this.getTracker();
	}

	delivery.reqComplete++;
	delivery.updateItems();
	return;

}

function getDetailPage () {

	var delivery = this.delivery;
	var site = this.args.site;
	var isChild = this.args.isChild;

	if (this.responseText) {

		var detailPageRegEx;
		var baseURL;

		switch (site) {
			case 'OnTrac':
				detailPageRegEx = /<a href="([^"]*)">DETAILS<\/a>/i;
				baseURL = 'https://www.ontrac.com/';
				break;
			case 'Poste-it':
				detailPageRegEx = /<iframe[^>]*src="([^"]*)"[^>]*>/i;
				baseURL = 'http://poste.it/';
				break;
		}

		var output = stripWhiteSpace(this.responseText);
		if (detailPageRegEx && (result = output.match(detailPageRegEx))) {

			var url = result[1];
			if (baseURL && !url.match(/^https?:\/\//i)) url = baseURL+url;
			if (!isChild) delivery.url = url;
			delivery.loadPage(url,getTracker,false,this.args);

		} else {
			delivery.reqCount++;
			this.getTracker();
		}

	} else {
		logRequest(1,this);
		if (!delivery.count) delivery.count = -1;
		delivery.notFound();
	}

	delivery.reqComplete++;
	delivery.updateItems();
	return;

}

function getTracker () {

	var delivery = this.delivery;
	var result = false;
	var site = this.args.site;
	var type = this.args.type;
	var childNo = this.args.childNo;
	var isChild = this.args.isChild;
	var ignore404 = [ 'DHL (Germany)' ];

	if ((this.status == 200 || this.status == 0 || 
		(this.status == 404 && ignore404.indexOf(site) != -1)) && this.responseText) {

		var from = (this.args.service) ? this.args.service.from : delivery.from;
		var statusRegEx;
		var statusNo = 1;
		var detailSection;
		var detailItemRegEx;
		var detailRegEx;
		var detailDateNo;
		var detailTimeNo;
		var detailLocationNo;
		var detailLocationNoExtra = -1;
		var detailStatusNo;
		var detailStatusNoExtra = -1;
		var detailDateRegEx;
		var detailLocRegEx;
		var ignoreStatus;
		var latestFirst = true;
		var sortItemsByDate = true;
		var shipDateRegEx;
		var deliverDateRegEx;
		var deliverLocRegEx;
		var deliverLocExtraRegEx;
		var updatedRegEx; // Used if there's a second, preferred delivery date
		var deliveredRegEx;
		var deliveredTodayString;
		var deliveredString = /Delivered/i;
		var errorRegEx;
		var connectRegEx;
		// var captchaRegEx;
		var checkForNo = false;
		var foundStatus = false;
		var status;
		var details;
		var shipDate;
		var deliverDate;
		var errorText;
		var useCache = true;
		var skipExtraOnError = false;
		var retryOnError = false;
		var output = stripWhiteSpace(this.responseText);

		if (site == 'AmazonTracker') {

			statusRegEx = /<div id="summaryLeft"[^>]*> ?<h2[^>]*>([^<]*)/i;
			if (output.match(statusRegEx)) {
				detailRegEx = /<tr> ?<td> ?<span[^>]*>([^<]*), ([^<]*)<\/span><\/td> ?<td> ?<span[^>]*>([^<]*)<\/span> ?<\/td> ?<\/tr>/i;
				detailDateNo = 1;
				detailLocationNo = 2;
				detailStatusNo = 3;
				deliverDateRegEx = /<span>[^<]*<\/span> ?<span[^>]*>([^<]*)<\/span>/i;
			} else {
				// No longer used?
				statusRegEx = /<div class="status"> ?<h2>([^<]*)/i;
				detailRegEx = /<tr scope="row"> ?<td valign=top>([^<]*)<\/td> ?<td valign=top>([^<]*)<\/td> ?<td valign=top>([^<]*)<\/td> ?<td valign=top>([^<]*)<\/td> ?<\/tr>/i;
				detailDateNo = 1;
				detailLocationNo = 3;
				detailStatusNo = 4;
				deliverDateRegEx = /<span class='statusDate'><strong>([^<]*)/i;
			}
			deliveredString = /^(Delivered|配達を完了しました|配達完了|Zugestellt|Entregado|Livré|Consegnato)/i; // Entregado is a guess
			// connectRegEx = /<font color="#AA0000"> ?<b>([^<]*)<\/b> ?<\/font>/i;

		} else if (site == 'Aramex') {

			detailRegEx = /<td[^>]*Title='(?!Not found)([^']*)'>[^<]*<\/td> ?<\/tr> ?<\/table>/i;
			detailStatusNo = 1;
			deliveredString = /(Delivered|Collected by Consignee)/i;
			useCache = false;

		} else if (site == 'AusPost') {

			detailRegEx = /<div[^>]*> ?<div[^>]*> ?<p>([^<]*)<\/p> ?<\/div> ?<div[^>]*> ?<p>([^<]*)<\/p> ?<\/div> ?<div[^>]*> ?<p>([^<]*)<\/p> ?<\/div> ?<\/div>/i;
			detailDateNo = 1;
			detailLocationNo = 3;
			detailStatusNo = 2;
			deliveredString = /(Delivered|Shipment Collected by Consignee)/i;
			errorRegEx = /<p id="invalid-error-message">([^<]*)/i;
			connectRegEx = /<p> ?The service is unavailable at this time. Please try again later. ?<\/p>/i;

		} else if (site == 'BridgePoint') {

			statusRegEx = detailRegEx = /<TR> ?<TD CLASS=text2[^>]*>([^<]*)<\/TD> ?<TD[^>]*>([^<]*)<\/TD> ?<\/TR>/i;
			statusNo = 1;
			detailDateNo = 2;
			detailStatusNo = 1;
			shipDateRegEx = /(?:Shipped to|Adresse d’expédition|Versendet an|Verzonden naar|Sendt til|Destino|Spedito a|Expedido para|Skickat till)<\/TD> ?<TD[^>]*>[^<]*<BR>([^<]*)/i;
			deliverDateRegEx = /<TD CLASS=large[^>]*>[^<]*<\/TD> ?<TD[^>]*>([^<]*)/i;
			deliverLocRegEx = /(?:Shipped to|Adresse d’expédition|Versendet an|Verzonden naar|Sendt til|Destino|Spedito a|Expedido para|Skickat till)<\/TD> ?<TD[^>]*>([^<]*)/i;
			deliveredString = /^(Delivered|Livré|Geliefert|Geleverd|Utlevert|Entregado|Consegnato|Entregue|Levererat)/i;
			connectRegEx = /<P> ?This service is currently unavailable, please try again later ?<\/P>/i;

			var sections = output.match(/<TABLE BORDER=0 ALIGN=CENTER CLASS=maxTable>(.*?)<TD CLASS=text3 VALIGN=TOP>[^<]*<\/TD> ?<\/TR> ?<\/TABLE>/gi);
			if (sections) {
				var found = false;
				if (this.args.matchDate) {
					var matchTime = this.args.matchDate.getTime();
					for (var x in sections) {
						// Try to find the right delivery based on the ship date
						var dateResult = sections[x].match(shipDateRegEx);
						if (dateResult) {
							var dateResult = dateFromString(cleanUpDate(dateResult[1],false,from));
							if (dateResult && dateResult.getTime() == matchTime) {
								output = sections[x];
								found = true;
								break;
							}
						}
					}
				}
				if (!found) output = sections[sections.length-1];
			}

		} else if (site == 'CanadaPost') {

			statusRegEx = detailRegEx = /<tr[^>]*> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)/i;
			statusNo = 4;
			detailDateNo = 1;
			detailLocationNo = 3;
			detailStatusNo = 4;
			deliverDateRegEx = /(?:Date de livraison selon les normes de service|Livraison prévue|Service Standard Delivery Date|Expected Delivery)[^<]*<\/strong>:? ?(?:<b>)?([^<]*)/i;
			updatedRegEx = /(?:Updated Delivery|Livraison mise à jour)[^<]*<\/strong>:? ?(?:<b>)?([^<]*)/i;
			deliveredString = /(Item successfully delivered|Article livré avec succès|Signature image recorded for Online viewing|Image de la signature enregistrée pour consultation en ligne|Item delivered to recipient's community mailbox|L'article a été livré à la boîte postale communautaire du destinataire)/i;
			connectRegEx = /<h[1-5] class="(warningMessage|errorPage)"[^>]*> ?(We&#39;re sorry|We're Sorry) ?<\/h[1-5]>/i;

		} else if (site == 'Chronopost') {

			statusRegEx = /<div class="onglet"> ?<div class="numeroColi2">[^<]*<br\/> ?"([^<"]*)/i;
			if (output.match(statusRegEx)) {
				detailRegEx = /<tr[^>]*> ?<td headers="envoisCol1">([^<]*)<br\/>([^<]*)<\/td> ?<td headers="envoisCol2">([^<]*)<br\/>([^<]*)<\/td>(.*?)<\/tr>/i;
			} else {
				statusRegEx = /<td class="event">([^<"]*)/i;
				detailRegEx = /<tr[^>]*> ?<th[^>]*>[^<]*<\/th> ?<td[^>]*>([^<]*)-([^<]*)<\/td> ?<\/tr> ?<tr> ?<th[^>]*>[^<]*<\/th> ?<td[^>]*>([A-Z\s-]*)([A-Z][^<]*)<\/td> ?<\/tr>/;
				useCache = false;
			}
			detailDateNo = 1;
			detailTimeNo = 2;
			detailLocationNo = 3;
			detailStatusNo = 4;
			deliveredString = /Delivered|Livraison effectuée|Livraison effectu&eacute;e/i;
			errorRegEx = /<Libelle nom="MSG_AUCUN_EVT">(.*?)<\/Libelle>/i;

		} else if (site == 'CityLink') {

			statusRegEx = detailRegEx = /<tbody> ?<tr[^>]*> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<td>([^<]*)/i;
			statusNo = 3;
			detailDateNo = 1;
			detailStatusNo = 3;
			deliverDateRegEx = /Planned Delivery Date<\/[^>]*> ?<[^>]*>(?:Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)([^<]*)/i;
			deliveredRegEx = /Current Status ?<\/span> ?<div> ?<h2>([^<]*)/i;
			deliveredString = /Delivered/i;
			errorRegEx = /<h4>Refine your search<\/h4> ?<p>(.*?) below to refine your search: ?<\/p>/i;
			connectRegEx = /<label for="recaptcha_response_field"> ?To verify your search, please complete the following:/i;

		} else if (site == 'DHL') {

			statusRegEx = detailRegEx = /<tr> ?<th[^>]*>([A-Z]+, ([^<]*))?<\/th> ?<th[^>]*>[^<]*<\/th> ?<th[^>]*>[^<]*<\/th> ?<th[^>]*>[^<]*<\/th> ?<\/tr> ?<\/thead> ?<tbody> ?<tr> ?<td[^>]*>[^<]*<\/td> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)/i;
			statusNo = 3;
			detailDateNo = 2;
			detailLocationNo = 4;
			detailStatusNo = 3;

		} else if (site == 'DHL GlobalMail') {

			statusRegEx = /<div class="status-info"> ?<h2>([^<]*)/i;
			detailRegEx = /<li class="timeline-date">([^<]*)<\/li> ?<li[^>]*> ?<div class="timeline-time"> ?<em>([^<]*)<\/em>([^<]*)<\/div> ?<div[^>]*> ?<\/div> ?<div[^>]*> ?<div[^>]*> ?<\/div> ?<div class="timeline-location"> ?<i[^>]*> ?<\/i>([^<]*)<\/div> ?<div class="timeline-description">([^<]*)<\/div>/i;
			detailDateNo = 1;
			detailLocationNo = 4;
			detailStatusNo = 5;
			deliveredString = /Delivered|Zugestellt|livré|Entregado|fornecido|доставлено|発送済み/i;

		} else if (site == 'DHL (Germany)') {

			detailRegEx = /<div class="list-item">([^<]*)<br>([^<]*)<\/div> ?<div class="content">/i;			
			if (output.match(detailRegEx)) {
				delivery.url = 'https://mobil.dhl.de/sendung?query=sv_paket&sv-method=query&packet_id='+encodeURIComponent(delivery.no);
				detailDateNo = 1;
				detailStatusNo = 2;
				detailLocRegEx = /\(([^)]*)\) ?$/i;
				deliveredRegEx = /<div class="progressnumber(?:[^"]*)"> ?([0-9]+%)/i;
				deliveredString = /100%/i;
				errorRegEx = /(?:<div class="error"> ?<h3>[^<]*<\/h3> ?<p>|<ul id="errorlist"> ?<li>|<div class="error"> ?<div class="red">)([^<]*)/i;
			} else {
				statusRegEx = /<td class="mm_bold text-right">[^<]*<\/td> ?<td colspan="2"[^>]*>[^<]*<br>([^<]*(<a[^>]*> ?<span[^>]*> ?<\/span>[^<]*<\/a>[^<]*)?)/i;
				detailRegEx = /<tr> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*(<a[^>]*> ?<span[^>]*> ?<\/span>[^<]*<\/a>[^<]*)?)<\/td> ?<\/tr> ?<\/tbody>/i;
				detailDateNo = 1;
				detailLocationNo = 2;
				detailStatusNo = 3;
				deliveredRegEx = /(<img src="assets\/img\/bg-delivered.png" alt="Zugestellt" \/>)/i;
				deliveredString = /.*/i;
				skipExtraOnError = true;
			}
			connectRegEx = /(<div class="error"> ?<div class="red"> ?Der Service ist kurzzeitig nicht verfügbar\. Bitte versuchen Sie es später erneut\.|<h3>Das System ist zur Zeit sehr ausgelastet!)/i; // unfortunately DHL Track &amp; Trace is currently unavailable\.|leider steht Ihnen die DHL Sendungsverfolgung zur Zeit nicht zur Verfügung\.

		} else if (site == 'DHL UK') {

			detailItemRegEx = /<tr class='enquiryTable'> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<\/tr>/gi;
			detailRegEx = /<tr class='enquiryTable'> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<\/tr>/i;
			detailDateNo = 1;
			detailTimeNo = 2;
			detailStatusNo = 3;
			latestFirst = false;
			detailLocRegEx = / (?:in|Location) ([A-Z,\- ]+)$/i;

		} else if (site == 'DPD') {

			detailRegEx = /<tr[^>]*> ?<td[^>]*>([^<]*)<br>[^<]*<\/td> ?<td[^>]*>[^<]*(?:<img[^>]*>[^<]*<a[^>]*><b>[^<]*<\/b><\/a>)?[^<]*<br>([^<]*)<\/td> ?<td[^>]*>[^<]*(?:<img[^>]*>[^<]*<a[^>]*><b>[^<]*<\/b><\/a>)?[^<]*<br>([^<]*)<\/td>/i;
			detailDateNo = 1;
			detailLocationNo = 2;
			detailStatusNo = 3;
			deliveredString = /^(Delivered|Zustellung)/i;

			var sections = output.match(/<tr[^>]*> ?<td[^>]*>([^<]*)<br>[^<]*<\/td> ?<td[^>]*>[^<]*(?:<img[^>]*>[^<]*<a[^>]*><b>[^<]*<\/b><\/a>)?[^<]*<br>([^<]*)<\/td> ?<td[^>]*>[^<]*(?:<img[^>]*>[^<]*<a[^>]*><b>[^<]*<\/b><\/a>)?[^<]*<br>([^<]*)<\/td>/gi);
			if (sections) detailSection = sections[sections.length-1];

		} else if (site == 'DPD UK') {

			statusRegEx = /<tr> <td[^>]*>[^<]*<a[^>]*>[^<]*<\/a> <\/td> <td[^>]*>[^<]*<\/td> <td[^>]*>[^<]*<a[^>]*>[^<]*<\/a> <\/td> <td[^>]*>[^<]*<\/td> <td[^>]*>[^<]*<\/td> <td[^>]*>[^<]*<\/td> <td[^>]*>([^<]*)<\/td> (<td[^>]*>[^<]*<\/td> )?<\/tr> <\/table>/i;
			detailRegEx = /<tr> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)(<BR>[^<]*)?<\/td> ?<td[^>]*>([^<]*)<\/td> ?<\/tr>/i;
			detailDateNo = 1;
			detailTimeNo = 2;
			detailLocationNo = 3;
			detailStatusNo = 4;
			deliveredRegEx = /var trackCode ?= ?'([A-Z]+)';/i;
			deliveredString = /^DEL$/i;
			// deliveredString = /(^Delivered|parcel has been delivered)/i;

		} else if (site == 'GLS') {

			statusRegEx = detailRegEx = /<tr class="resulthead">.*?<tr[^>]*> ?<td>([^<]*)<\/td> ?<td> ?(?:[a-z]{2} [0-9]{3} )?(?:, )?([^<]*)<\/td> ?<td>[^<]*<\/td> ?<td>([^<]*)/i;
			statusNo = 3;
			detailDateNo = 1;
			detailLocationNo = 2;
			detailStatusNo = 3;
			shipDateRegEx = /(?:Pick-Up Date|Abhol-Datum|Date enlèvement|Afhentningsdato): ?<\/td> ?<td class="value"> ?([^<]*)/i;
			deliverDateRegEx = /(?:Delivery Date|Zustell-Datum|Date livraison|Leveringsdato): ?<\/td> ?<td class="value"> ?([^<]*)/i;
			deliveredString = /^(Delivered|Zugestellt|LIVRE|Forsendelsen er leveret)/i;
			connectRegEx = /<h1> ?Temporarily out of order ?<\/h1>/i;

		} else if (site == 'HLG') {

			detailRegEx = /<tr> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<\/tr>/i;
			detailDateNo = 1;
			detailStatusNo = 3;
			deliveredRegEx = /<div class="([^"]*)"> ?Zugestellt ?<\/div>/i;
			deliveredString = /shipment_icon_past/i;
			deliverLocRegEx = /<tbody> ?<tr> ?<td>([^<]*)<\/td>/i;
			errorRegEx = /<p id="shipmentID.errors" class="form_error">([^<]*)<\/p>/i;
			connectRegEx = /The Track and Trace System is now busy, please try later./i;

		} else if (site == 'HongkongPost') {

			if (type == 1) {

				statusRegEx = detailRegEx = /<tr> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<\/tr> ?<\/table> ?<!-- #[a-z]* -->/i
				statusNo = 3;
				detailDateNo = 1;
				detailStatusNo = 3;
				detailLocationNo = 2;

			} else {

				statusRegEx = detailRegEx = /<!-- #[a-z]* --> ?(<P[^>]*> ?<IMG[^>]*> ?<a[^>]*>[^<]*<\/a> ?<\/P> ?)?(<p>)?(<span class="textNormalBlack">[^<]*<\/span>[^<]*<\/p>)?(.*?)<br \/>/i;
				statusNo = 4;
				detailStatusNo = 4;
				shipDateRegEx = /<!-- #[a-z]* --> ?<p>.*on ([0-9]{1,2}-[a-z]+-[0-9]{4})/i;
				deliverDateRegEx = /was delivered on ([^<]*). ?<br \/>/i;

			}
			connectRegEx = /<p> ?The Track and Trace System is (temporarily out of service|now busy), please try later\./i;

		} else if (site == 'JapanPost') {

			detailItemRegEx = /<tr> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)<\/td> ?<\/tr> ?<tr> ?<td[^>]*>([^<]*)<\/td> ?<\/tr>/gi;
			detailRegEx = /<tr> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)<\/td> ?<\/tr> ?<tr> ?<td[^>]*>([^<]*)<\/td> ?<\/tr>/i;
			detailDateNo = 1;
			detailLocationNo = 4;
			detailLocationNoExtra = 5;
			detailStatusNo = 2;
			detailStatusNoExtra = 3;
			deliverDateRegEx = /(?:Scheduled delivery date:|配達予定日：) ?([^<]*)/i;
			deliveredString = /(Final delivery|お届け済み|お届け先にお届け済み|窓口でお渡し)/i;
			errorRegEx = /<td colspan="5">([^<]*)<\/td>/i;
			latestFirst = false;
			sortItemsByDate = false;

		} else if (site == 'MyTracking') {

			statusRegEx = /<span id="CurrentStatus"[^>]*>([^<]*)/i;
			detailRegEx = /<tr class="grid grid-item"> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<\/tr>/i;
			detailDateNo = 1;
			detailLocationNo = 4;
			detailStatusNo = 3;
			shipDateRegEx = /<span id="Tenderdate"[^>]*>([^<]*)/i;
			deliverDateRegEx = /<span id="ETA"[^>]*>([^<]*)/i;

		} else if (site == 'OnTrac') {

			statusRegEx = /Delivery Status:<\/b> ?<\/TD> ?<TD[^>]*>([^<]*)/i;
			detailRegEx = /<tr> ?<td[^>]*> ?<p>([^<]*)<br \/><\/p> ?<\/td> ?<td[^>]*> ?<p>([^<]*)<br \/> ?<\/p> ?<\/td> ?<td[^>]*> ?<p>([^<]*)/i;
			detailDateNo = 2;
			detailLocationNo = 3;
			detailStatusNo = 1;
			shipDateRegEx = /Ship Date:<\/b> ?<\/TD> ?<TD[^>]*>([^<]*)/i;
			deliverDateRegEx = /(?:Estimated Delivery Time|Service Commitment Time):<\/b> ?<\/TD> ?<TD[^>]*> ?([0-9\/]+)/i;
			deliverLocRegEx = /Deliver To:<\/b> ?<\/td> ?<td[^>]*>([^<]*)/i;
			updatedRegEx = /<b>Delivery Time:<\/b> ?<\/TD> ?<TD[^>]*>(?! ?n\/a)([^<]*)/i;

		} else if (site == 'Parcelforce') {

			statusRegEx = /<dt> ?Status ?<\/dt> ?<dd>([^<]*)<\/dd>/i;
			if (output.match(statusRegEx)) {
				detailRegEx = /<tr[^>]*> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<\/tr>/i;
				detailDateNo = 1;
				detailTimeNo = 2;
				detailLocationNo = 3;
				detailStatusNo = 4;
				deliverDateRegEx = /<dt> ?Delivered on ?<\/dt> ?<dd>([^<]*)<\/dd>/i;
			} else {
				statusRegEx = /<div id="tnt-results"> ?<h2[^>]*>([^<]*)/i;
				detailRegEx = /<div id="tnt-results"> ?<h2[^>]*>[^<]*<\/h2> ?<p>([^<]*)/i;
				detailStatusNo = 1;
			}
			errorRegEx = /<div class="messages error">([^<]*)/i;
			connectRegEx = /<p> ?(Our website is temporarily unavailable.|Because of very heavy site traffic, this page is currently unavailable.)/i;

		} else if (site == 'Post.at') {

			detailRegEx = /<li[^>]*> ?<p> ?<strong>[^:]+:([^<]*)<\/strong> ?<br \/> ?<span>[^:]+:([^<]*)<br \/>[^:]+:([^<]*)<br \/>[^:]+:([^<]*)<br \/> ?<\/span> ?<\/p> ?<\/li>/i;
			if (output.match(detailRegEx)) {
				detailItemRegEx = /<li[^>]*> ?<p> ?<strong>[^:]+:([^<]*)<\/strong> ?<br \/> ?<span>[^:]+:([^<]*)<br \/>[^:]+:([^<]*)<br \/>[^:]+:([^<]*)<br \/> ?<\/span> ?<\/p> ?<\/li>/gi;
				detailDateNo = 3;
				detailLocationNo = 2;
				detailStatusNo = 1;
			} else {
				detailRegEx = /<dt> ?Zustellzeit: ?<\/dt> ?<dd>([^<]*)<\/dd> ?<dt> ?(?:Status|status): ?<\/dt> ?<dd>([^<]*)<\/dd> ?<dt> ?(?:PLZ|postcode): ?<\/dt> ?<dd>([^<]*)<\/dd>/i;
				if (output.match(detailRegEx)) {
					detailDateNo = 1;
					detailLocationNo = 3;
					detailStatusNo = 2;
				} else {
					detailRegEx = /<tr[^>]*> ?<td>([^<]*)<\/td> ?<td> ?(<a[^>]*> ?<\/a>)? ?<\/td> ?<td> ?(<a[^>]*>)?([^<]*)(<\/a>)? ?<\/td> ?<td>([0-9.: ]*)<\/td> ?<td>([^<]*)<\/td> ?<\/tr> ?<\/table>/i;
					if (output.match(detailRegEx)) {
						detailDateNo = 6;
						detailLocationNo = 4;
						detailStatusNo = 1;
					} else {
						detailRegEx = /<tr[^>]*> ?<td>[^<]*<\/td> ?<td>[^<]*<\/td> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<\/tr>/i;
						detailDateNo = 1;
						detailLocationNo = 3;
						detailStatusNo = 2;
					}
				}
			}
			deliveredString = /(Item delivered|Sendung zugestellt|Item delivered to consignee|Sendung an Empfänger übergeben|Item delivered acc. to consignees instruction|Sendung laut Empfängervereinbarung zugestellt|Item delivered to flat mate|Sendung an Mitbewohner\/in zugestellt|Item delivered to alternative address|Sendung an Ersatzabgabestelle zugestellt|Item handed over to customer|Sendung an Kunden\/Auftraggeber übergeben)/i;
			connectRegEx = /<h4> ?Die Seite kann nicht angezeigt werden|<h3> ?DB Error/i;
			useCache = false;

		} else if (site == 'PostDanmark') {

			statusRegEx = /<h5 class="deliveryStatusLabel">([^<]*)<\/h5>/i;
			detailRegEx = /<tr[^>]*> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<\/tr>/i;
			detailDateNo = 1;
			detailLocationNo = 2;
			detailStatusNo = 3;
			deliverDateRegEx = /<span id="[^"]*ExpectedDeliveryValue">([^<]*)<\/span>/i;
			deliveredRegEx = /<div id="[^"]*StatusIcon" class="([^"]*)">/i;
			deliveredString = /^statusDelivered$/i;
			errorRegEx = /<h3 class="searchResult?sHeader">([^<]*)<\/h3>/i;
			connectRegEx = /<div id="[^"]*SearchResults"> ?<a id="res" name="res"> ?<\/a> ?<\/div>/i;

		} else if (site == 'Poste-it') {

			statusRegEx = /<li class="statoOn">(.*?)<\/li>/i;
			if (output.match(statusRegEx)) {

				detailRegEx = /<ul> ?<li>([^<]*)<\/li> ?<\/ul>/i;
				detailStatusNo = 1;
				detailDateRegEx = /in data ([0-9]+-[A-Z]+-[0-9]+)/i;
				detailLocRegEx = /(?!a|di) ([A-Z\s]+) in data/;
				deliveredString = /consegnato al destinatario/i;

			} else {

				statusRegEx = detailRegEx = /<tr[^>]*> ?<td>([^<]*)<\/td> ?<\/tr> ?<\/div> ?<\/table>/i;
				if (output.match(statusRegEx)) {

					detailStatusNo = 1;
					detailDateRegEx = /in data ([0-9]+-[A-Z]+-[0-9]+)/i;
					detailLocRegEx = /(?!a|di) ([A-Z\s]+) in data/;
					deliveredString = /^consegnat[oai]/i;
				
				} else {

					statusRegEx = detailRegEx = /<tr[^>]*> ?<td><font[^>]*>(<b>)?([^<]+)(<\/b>)?<\/font><\/td><td><font size=1>(<b>)?([^<]+)(<\/b>)?<\/font><\/td><td><font[^>]*>(<b>)?([^<]+)(<\/b>)?<\/font><\/td> ?<\/tr>/i;
					if (output.match(statusRegEx)) {
						statusNo = 5;
						detailDateNo = 2;
						detailLocationNo = 8;
						detailStatusNo = 5;
					} else {
						statusRegEx = detailRegEx = /<tr[^>]*> ?<td><font size=1>(<b>)?([^<]+)(<\/b>)?<\/font><\/td> ?<td><font[^>]*>(<b>)?([^<]+)(<\/b>)?<\/font><\/td> ?<td><font[^>]*>(<b>)?([^<]+)(<\/b>)?<\/font><\/td> ?<td><font[^>]*>(<b>)?([^<]+)(<\/b>)?<\/font><\/td> ?<\/tr>/i;
						statusNo = 8;
						detailDateNo = 2;
						detailLocationNo = 11;
						detailStatusNo = 8;
					}
					deliveredString = /consegnat[oai]/i;

				}
			}
			connectRegEx = /(<strong>Si \? verificato un errore inatteso\. Riprova in un secondo momento\.|^\s*<BR>)/i;

		} else if (site == 'Posten-no') {

			statusRegEx = /<div class="sporing-sendingandkolli-latestevent-text"> ?<strong>(.*?)<\/strong>/i;
			statusRegEx = detailRegEx = /<tbody> ?<tr> ?<td> ?<div class="sporing-sendingandkolli-latestevent-text">(.*?)<\/div>(.*?)<\/td> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<\/tr>/i;
			detailDateNo = 3;
			detailLocationNo = 4;
			detailStatusNo = 1;
			deliverDateRegEx = /<span id="sporing-sendingandkolli--latestevent-deliverydate"> ?<strong>([^<]*)/i;
			deliveredString = /(Package has been delivered|Sendingen er utlevert)/i;
			errorRegEx = /<span class="sporing-windowsize-warning-link">([^<]+)<\/span>/
			connectRegEx = /(<div class="sporing-error-text">|<span class="sporing-windowsize-warning-link">) ?(The service is too busy at the moment.|An error has occurred.|Tjenesten er ikke tilgjengelig for øyeblikket.|En feil har oppstått.|The result may be incomplete because one of our systems is temporarily unavailable.|Resultatet kan være ufullstendig siden et av våre systemer er utilgjengelig for øyeblikket.)/i;

		} else if (site == 'Posten-se') {

			statusRegEx = /<h5 class="deliveryStatusLabel">([^<]*)<\/h5>/i;
			detailRegEx = /<tr[^>]*> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<\/tr>/i;
			detailDateNo = 1;
			detailLocationNo = 2;
			detailStatusNo = 3;
			deliverDateRegEx = /<span id="[^"]*ExpectedDeliveryValue">([^<]*)<\/span>/i;
			deliveredRegEx = /<div id="[^"]*StatusIcon" class="([^"]*)">/i;
			deliveredString = /^statusDelivered$/i;
			errorRegEx = /<h3 class="searchResult?sHeader">([^<]*)<\/h3>/i;
			connectRegEx = /<div id="[^"]*SearchResults"> ?<a id="res" name="res"> ?<\/a> ?<\/div>/i;

		} else if (site == 'PostNL') {

			statusRegEx = detailRegEx = /<div class="status"> ?<div[^>]*> ?<p> ?<span[^>]*>[^<]*<\/span> ?<br[^>]*> ?<\/p> ?<p> ?<img[^>]*> ?<\/p> ?<p>([^<]*)/i;
			detailStatusNo = 1;
			deliverDateRegEx = /<div class="block-verwacht pointer"[^>]*>(.*?)(<br[^>]*>|<\/span>)/i;
			deliverLocRegEx = /<div class="block-bezorgadres pointer"[^>]*> ?<p> ?<span[^>]*>[^<]*<br[^>]*>([^<]*(<br[^>]*>)?[^<]*)/i;
			deliveredRegEx = /<div class="status"> ?<div[^>]*> ?<p> ?<span[^>]*>[^<]*<\/span> ?<br[^>]*> ?<\/p> ?<p> ?<img[^>]*src="[a-z\/]*status([0-9]+)\.[a-z]*"[^>]*>/i;
			deliveredString = /4/i;

		} else if (site == 'Purolator') {

			statusRegEx = /"status" ?: ?'([^']*)'/i;
			detailRegEx = /\[ ?'([^']*)', ?'([^']*)', ?'([^']*)', ?'([^']*)' ?\]/i;
			detailDateNo = 1;
			detailLocationNo = 3;
			detailStatusNo = 4;
			deliverDateRegEx = /"deliverBy" ?: ?"([^"]*)"/i;
			deliveredString = /^Delivered/;
			connectRegEx = /<title>Purolator - Tracking Details/i;

		} else if (site == 'RoyalMail') {

			checkForNo = true;
			detailRegEx = /<tr[^>]*> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<\/tr>/i;
			detailDateNo = 1;
			detailTimeNo = 2;
			detailStatusNo = 3;
			detailLocationNo = 4;
			deliveredString = /^(DELIVERED|COLLECTED FROM)/i;
			connectRegEx = /<title> ?Royal Mail Web Site Unavailable ?<\/title>/i;

			output = output.replace(/(COLLECTED FROM|DESPATCHABLE TO|DESPATCHED TO|UNDELIVERED)/g,'$1 ');

		} else if (site == 'Sagawa') {

			output = decodeDecimalEntities(output);

			statusRegEx = detailRegEx = /詳細表示 ?<\/TD> ?<TD[^>]*> ?(?:⇒&nbsp;)?([0-9]+年[0-9]+月[0-9]+日)? ?([0-9]+:[0-9]+)? ?([^↑<]*)/i;
			statusNo = 3;
			detailDateNo = 1;
			detailStatusNo = 3;
			shipDateRegEx = /出荷日 ?<\/TD> ?<TD[^>]*> ?([0-9]+年[0-9]+月[0-9]+日)/i;
			deliveredString = /(配達は終了致しました。|配達終了)/i;

		} else if (site == 'SwissPost') {

			detailItemRegEx = /<tr[^>]*> ?<td[^>]*>(<span[^>]*>[^<]*<\/span>)?([^<]*)<\/td> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*> ?(<span[^>]*>[^<]*<\/span>)?([^<]*) ?(<img[^>]*> ?)?<\/td> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)<\/td> ?<\/tr>/gi;
			detailRegEx = /<tr[^>]*> ?<td[^>]*>(<span[^>]*>[^<]*<\/span>)?([^<]*)<\/td> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*> ?(<span[^>]*>[^<]*<\/span>)?([^<]*) ?(<img[^>]*> ?)?<\/td> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)<\/td> ?<\/tr>/i;
			statusNo = 5;
			detailDateNo = 2;
			detailLocationNo = 7;
			detailLocationNoExtra = 8;
			detailStatusNo = 5;
			deliveredString = /(Delivered|Zugestellt|Distribué|Distribuito|Recapitato)/i;
			latestFirst = false;

		} else if (site == 'TNT') {

			statusRegEx = detailRegEx = /<tr vAlign="top"><td noWrap="true">([^<]*)<\/td><td>([^<]*)<\/td><td>([^<]*)<\/td><td>([^<]*)/i;
			statusNo = 4;
			detailDateNo = 1;
			detailLocationNo = 3;
			detailStatusNo = 4;
			shipDateRegEx = /(?:Pick ?up date|提貨日期) ?<\/td> ?<td[^>]*> ?<b>([a-z0-9\s]*)/i;
			deliverDateRegEx = /(?:Delivery Date|Estimated due date|送貨日期) ?<\/td> ?<td[^>]*> ?<b>(?:[0-9]+\:[0-9]+, )?([^<]*)/i;
			deliveredString = /^(Delivered|Shipment Delivered|Consignment Delivered)/i;
			connectRegEx = /TNT web services are temporarily unavailable/i;

			if (isChild) {
				// If there are multiple shipments, find the one that was shipped most recently
				var sections = output.match(/<a[^>]*><br[^>]*><\/a><table[^>]*>(.*?)<\/table><\/td><\/tr><\/table>/gi);
				var latestDate = 0;
				for (y in sections) {
					result = sections[y].match(shipDateRegEx);
					if (result) {
						var dateResult = dateFromString(cleanUpDate(result[1],false,from));
						if (dateResult) {
							dateResult = dateResult.getTime();						
							if (dateResult > latestDate) {
								output = sections[y];
								latestDate = dateResult;
							}
						}
					} else if (latestDate == 0) {
						output = sections[y];
					}
				}
			}

		} else if (site == 'TNT Express') {

			detailItemRegEx = /<tr[^>]*> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td>/gi;
			detailRegEx = /<tr[^>]*> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td>/i;
			detailDateNo = 2;
			detailTimeNo = 3;
			detailLocationNo = 4;
			detailStatusNo = 1;
			deliverDateRegEx = /<td class='strong'>Estimated Delivery by:([^<]*)/i;
			deliveredString = /(^Delivered|^Dlvrd|^Proof of Delivery Image$|Agent Collected \(Full\)$)/i;
			ignoreStatus = /^Closed for Holidays$/i;
			latestFirst = false;

		} else if (site == 'USPS') {

			detailRegEx = /<tr class="detail-wrapper latest-detail"> ?<td class="date-time"> ?<p>([^<]*)<\/p> ?<\/td> ?<td class="status"> ?<p class="clearfix"> ?<a[^>]*> ?<\/a> ?<span class="info-text">([^<]*)<\/span> ?<input[^>]*> ?<\/p> ?<\/td> ?<td class="location"> ?<p>([^<]*)<\/p> ?<\/td> ?<\/tr>/i;
			detailDateNo = 1;
			detailLocationNo = 3;
			detailStatusNo = 2;
			deliverDateRegEx = /<span class="label">Scheduled Delivery Day:<\/span> ?<span class="value">([^<]*)<\/span>/i;
			delivredRegEx = /<div class="progress-indicator"> ?<h2 class="hide-fromsighted">([^<]*)<\/h2> ?<\/div>/i;
			errorRegEx = /<div class="progress-details"> ?<ul> ?<li> ?<span>([^<]*)/i;
			connectRegEx = /(To learn about integrating the free Postal Service&reg; Address and Tracking API's into your application, please visit|This service is currently unavailable|USPS.com is temporarily unavailable.|Sorry, the tracking system is having technical difficulties. Please try your search again later.)/i;

		} else if (site == 'UPS') {

			statusRegEx = /<h4> ?<span> ?<a[^>]*>([^<]*)/i;
			// The ending </tr> is important to make sure flight information isn't matched
			// The optional </td> is for UPS Mail Innovations
			detailRegEx = /<tr[^>]*class="(?:odd|sec-row-od)"> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)<\/td> ?(?:<td[^>]*>([^<]*)<\/td> ?)?<td[^<]*>(.*?)(<\/td>)? ?(<td[^<]*>[^<]*<\/td>)? ?<\/tr>/i;
			detailDateNo = 2;
			detailLocationNo = 1;
			detailStatusNo = 4;
			shipDateRegEx = /Shipped&#047;Billed On: ?<\/label> ?<\/dt> ?<dd[^>]*>([^<]*)/i;
			deliverDateRegEx = /(?:Scheduled Delivery|Schedule Delivery|Scheduled Delivery Updated To|Schedule Delivery Updated To|Scheduled For Early Delivery On|Delivered On|Next Delivery Attempt|Estimated Delivery|Estimated Arrival): ?<\/label> ?<\/dt> ?<dd> ?(?:[a-z]*, ?&nbsp; ?)?([0-9\/]+)/i;
			deliverLocRegEx = /To: ?<\/label> ?<br[^>]*> ?<strong>([^<]*)/i;
			deliverLocExtraRegEx = /Left At: ?<\/label> ?<\/dt> ?<dd>([^<]*)/i;
			deliveredTodayString = /^(On Vehicle for Delivery Today)$/i;
			deliveredString = /^(Delivered|Delivered by Local Post Office)$/i;
			connectRegEx = /(<span class="error">Not Available<\/span>|<p class="error">&gt;&gt;&gt;&nbsp;Not all tracking information is available at this time\. Please try again later\.<br><\/p>|<!-- SearchBodyStart --> ?<!-- SearchBodyEnd -->)/i;

		} else if (site == 'UPS Mail Innovations') {

			detailRegEx = /<tr> ?<td class="LeftD_BottomL"[^>]*>(.*?)<\/td> ?<td class="LeftL_Bottom[^"]*"[^>]*>(.*?)<\/td> ?<td class="LeftL_Bottom[^"]*"[^>]*>(.*?)<\/td> ?<\/tr>/i;
			detailItemRegEx = /<tr> ?<td class="LeftD_BottomL"[^>]*>(.*?)<\/td> ?<td class="LeftL_Bottom[^"]*"[^>]*>(.*?)<\/td> ?<td class="LeftL_Bottom[^"]*"[^>]*>(.*?)<\/td> ?<\/tr>/g;
			statusNo = 2;
			detailDateNo = 1;
			detailLocationNo = 3;
			detailStatusNo = 2;
			shipDateRegEx = /<tr> ?<td[^>]*>[^<]*<\/td> ?<td[^>]*>(Mail Retrieved From Shipper|Package received for processing)/i;
			deliverDateRegEx = /<span id="[a-z0-9_]*ProjDelDate">([^<]*)/i;

		} else if (site == 'Yamato') {

			statusRegEx = /<a name="AA00"\/>.*?<td class="font14">([^<]*)/i;
			detailRegEx = /<tr[^>]*> ?<td[^>]*> ?<img[^>]*> ?<\/td> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<td>([^<]*)<\/td> ?<td>(?:<a[^>]*>)?([^<]*)(?:<\/a>)?<\/td> ?<td>([^<]*)<\/td> ?<\/tr> ?<\/table>/i;
			detailDateNo = 2;
			detailLocationNo = 4;
			detailStatusNo = 1;
			deliverDateRegEx = /(?:お届け予定日時<\/th> ?<\/tr> ?<tr> ?<td[^>]*>[^<]*<br> ?<\/td> ?<td[^>]*>|<tr> ?<td>[^<]*<\/td> ?<td>[^<]*(?:<br>)?<\/td> ?<td>[^<]*(?:<br>)?<\/td> ?<td>(?:<a[^>]*>)?[^<]*(?:<\/a>)?<\/td> ?<td>[^<]*<\/td> ?<td>)([0-9]{1,2}\/[0-9]{1,2})/i;
			deliveredString = /^(配達完了|投函完了)/i;

		} else if (site == 'Yodel') {

			statusRegEx = /Current status:[^<]*<\/span> ?<span[^>]*>([^<]*)/i;
			// detailItemRegEx = /<tr> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)<\/td> ?<\/tr>/gi;
			detailRegEx = /<tr> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)<\/td> ?<td[^>]*>([^<]*)<\/td> ?<\/tr>/i;
			detailDateNo = 3;
			detailTimeNo = 4;
			detailLocationNo = 2;
			detailStatusNo = 1;
			deliverDateRegEx = /Delivery expected by:<\/span>([^<]*)/i;
			errorRegEx = /<div (?:class="error"|id="notice")> ?<ul> ?<li>([^<]*)/i;

		}

		if (!isChild) {
			if (useCache && iPhone) delivery.html = cleanHTML(this.responseText,from);
			var item = resetItem();
			item.title = (delivery.name) ? htmlEntities(delivery.name) : htmlEntities(delivery.no);
			delivery.items = [];
			delivery.items[childNo] = item;
		}

		// If checkForNo is set, and the details are found, but not the number, force an error
		if (checkForNo && output.match(detailRegEx)) {
			var noMatch = new RegExp(delivery.no.replace(/ /g,' ?'),'i');
			if (!output.match(noMatch)) output = '';
		}

		// Get the ship date
		if (shipDateRegEx) {
			result = output.match(shipDateRegEx);
			if (result && result[1]) shipDate = result[1];
			if (shipDate == '--') shipDate = false;
		}

		// Get the delivery date  
		result = output.match(deliverDateRegEx);
		if (updatedRegEx) {
			thisResult = output.match(updatedRegEx);
			if (thisResult) result = thisResult;
		}
		if (result && result[1]) {
			deliverDate = result[1];
			if (deliverDate == '--') deliverDate = false;
		}

		function getDetails (input) {
			var detailItem = false;
			var result;
			if (input) result = input.match(detailRegEx);
			if (result) {
				detailItem = {};
				var detailResult = result[detailStatusNo];
				if (site == 'Posten-no') detailResult = detailResult.replace(/\&lt;/g,'<');
				detailItem.status = clearEmptyString(stripHTML(detailResult));

				if (detailStatusNoExtra >= 0) {
					var extra = trim(result[detailStatusNoExtra]);
					if (extra) detailItem.status += ': '+result[detailStatusNoExtra];
				}
				if (detailDateNo) {
					detailItem.date = result[detailDateNo];
					if (detailTimeNo && result[detailTimeNo]) detailItem.date += ' '+result[detailTimeNo];
				} else if (detailDateRegEx && (dateResult = detailItem.status.match(detailDateRegEx))) {
					detailItem.date = dateResult[1];
				}
				if (detailLocationNo) {
					detailItem.location = result[detailLocationNo];
					if (detailLocationNoExtra >= 0 && result[detailLocationNoExtra]) detailItem.location += ' '+result[detailLocationNoExtra];
				} else if (detailLocRegEx && (locationResult = detailItem.status.match(detailLocRegEx))) {
					detailItem.location = locationResult[1];
				}
				detailItem.location = clearEmptyString(detailItem.location); // Also takes care of undefined
				if (ignoreStatus && detailItem.status.match(ignoreStatus)) detailItem = false;
			}
			return detailItem;
		}

		// Find all the items in the details list, or just get the current details
		if (detailItemRegEx && (result = output.match(detailItemRegEx))) {
			var detailItems = [];
			for (x in result) {
				var detailItem = getDetails(result[x]);
				if (detailItem) {
					var dateResult = dateFromString(cleanUpDate(detailItem.date,true,from));
					if (dateResult) detailItem.dateStamp = dateResult.getTime();
					detailItem.index = x;
					detailItems.push(detailItem);
				}
			}
			detailItems.sort(function(a,b){
				// Most recent first, or preserve the order if the dates match
				var difference = (sortItemsByDate) ? b.dateStamp - a.dateStamp : 0;
				if (difference == 0) difference = (latestFirst) ? a.index - b.index : b.index - a.index;
				return difference;
			});
			details = detailItems[0];
		} else {
			details = (detailSection) ? getDetails(detailSection) : getDetails(output);
		}

		// Get the current status if it's separate, or use the detail status
		if (statusRegEx) {
			if (result = output.match(statusRegEx)) {
				if (result[statusNo]) {
					foundStatus = true;
					status = result[statusNo];
				}			
				status = clearEmptyString(stripHTML(status));
			}
		} else if (details) {
			status = details.status;
		}

		if (!status && details) status = details.status;
		if (deliveredRegEx) {
			thisResult = output.match(deliveredRegEx);
			if (thisResult && thisResult[1] && thisResult[1].match(deliveredString)) status = 'Complete';
		} else if (status && status.match(deliveredString)) {
			status = 'Complete';
		}
		if (deliveredTodayString && status && status.match(deliveredTodayString)) {
			var date = new Date();
			deliverDate = (date.getMonth()+1)+'/'+(date.getDate())+'/'+(date.getFullYear());
		}

		if (details) {
			if (status == 'Complete') {
				if (!deliverDate) deliverDate = details.date;
				if (deliverLocRegEx) {
					result = output.match(deliverLocRegEx);
					if (result && result[1]) details.location = result[1];
				}
				// If there's additional location info (front door), add it to the status
				if (deliverLocExtraRegEx) {
					result = output.match(deliverLocExtraRegEx);
					if (result && result[1]) details.status += ': '+result[1];
				}
			}
			if (site == 'HongkongPost' && type == 0) {
				details.date = shipDate;
				shipDate = false;		
			} else if (site == 'Parcelforce') {
				if (status && !details.status) details.status = status;
			}
		}

		if (details.date) details.date = cleanUpDate(details.date,false,from);
		details.mapLocation = (details.location) ? cleanLocation(details.location,from) : '';

		if (delivery.items[childNo]) {
			if (status) delivery.items[childNo].status = status;
			if (details) delivery.items[childNo].details = details;
			if (shipDate) delivery.items[childNo].shipSaved = cleanUpDate(shipDate,false,from);
			if (deliverDate) delivery.items[childNo].deliverSaved = cleanUpDate(deliverDate,false,from);
		}

		if (isChild) {
			if (retryOnError && !delivery.retry && this.args.service) {
				this.args.service.retry = true;
				delivery.startUpdate(this.args.service,childNo);
			} else if (connectRegEx && output.match(connectRegEx)) {
				if (delivery.previousItems) delivery.items = delivery.previousItems;
				status = details = shipDate = deliverDate = false;
				delivery.notFound();
			}
		} else {
			if (!foundStatus && !shipDate && !deliverDate && !details) {
				logRequest(1,this);
				if ((skipExtraOnError && this.args.extra) || (retryOnError && !delivery.retry)) {
					delivery.html = '';
					if (retryOnError) delivery.retry = true;
					if (skipExtraOnError) delivery.skipExtra = true;
					delivery.startUpdate(delivery,false);
				} else if ((connectRegEx && output.match(connectRegEx)) || (checkForNo && !output)) {
					if (!delivery.count) {
						delivery.count = -1;
					} else delivery.items = delivery.previousItems;
					delivery.notFound();
				/* } else if (captchaRegEx && output.match(captchaRegEx)) {
					manualSignIn[delivery.from+'-'+delivery.extra] = true;
					delivery.count = 0;
					delivery.notFound(); */
				} else {
					delivery.tries = 0;
					delivery.count = 0;
					if (errorRegEx) {
						result = output.match(errorRegEx);
						if (result) errorText = stripHTML(result[1]);
					}
					delivery.notFound(errorText);
				}
			} else delivery.count = 1;
		}

	} else if (isChild) {

		logRequest(1,this);
		if (delivery.previousItems) delivery.items = delivery.previousItems;
		delivery.notFound();

	} else {

		logRequest(1,this);
		var connectRegEx = '';
		switch (site) {
			case 'UPS':
				connectRegEx = /Tracking information is not available at this time\. Please try again later\./i;
				break;
			case 'Posten-no':
				connectRegEx = /<h1>Feilmelding: Feil i underliggende system<\/h1>/i;
				break;
		}
		if (this.status >= 500) {
			if (!delivery.count) delivery.count = -1;
		} else if (connectRegEx && this.responseText) {
			output = stripWhiteSpace(this.responseText);
			if (output.match(connectRegEx)) {
				if (!delivery.count) delivery.count = -1;
			} else delivery.count = 0;
		} else if (!delivery.count) {
			delivery.count = -1;
		}
		delivery.notFound();

	}

	delivery.reqComplete++;
	delivery.updateItems();
	return;

}

function retryTracker () {
	var delivery = this.delivery;
	var onComplete = getTracker;
	if (this.args.site == 'DPD UK') onComplete = getMultiple;
	delivery.loadPage(delivery.url,onComplete,false,this.args);
	delivery.reqComplete++;
	delivery.updateItems();
	return;
}

function notSupported () {

	this.count = -1;
	this.items = [];
	this.items[0] = resetItem();

	this.items[0].icon = 'transit';
	this.items[0].title = (this.name) ? htmlEntities(this.name) : htmlEntities(this.no);

	if (iPhone) {
		this.items[0].shipText = translate('Tap “view details online” to view this delivery');
	} else this.items[0].shipText = 'Click to view this delivery';
	this.items[0].deliverText = translate('This shipment can only be viewed online');
	this.items[0].shipBold = true;
	this.items[0].deliverBold = false;

	this.success = 1;
	this.displayed = 0;

}

function deliveryTitle ( no, name, label, count ) {
	var title = '';
	if (name) {
		if (count > 1 && label) {
			title = htmlEntities(name)+': '+label;
		} else title = htmlEntities(name);
	} else if (label) {
		title = label;
	} else title = htmlEntities(no);
	return title;
}

function getFromName (from,translateName,dropDown) {

	switch(from) {

		case 'www.adobe.com':
			var name = 'Adobe';
			if (dropDown) name += ' – '+translate('US and Canada');
			break;
		case 'www.apple.com':
		case 'www.apple.com/zip':
			var name = 'Apple';
			break;
		case 'www.apple.com/japan':
		case 'www.apple.com/japanzip':
			var name = 'Apple';
			if (dropDown) name += ' – '+translate('Japan');
			break;
		case 'www.apple.com/hk':
			var name = 'Apple';
			if (dropDown) name += ' – '+translate('Hong Kong');
			break;
		case 'www.aramex.com':
			var name = 'Aramex';
			break;
		case 'auspost.com.au':
			var name = 'Australia Post';
			break;
		case 'em.canadapost.ca':
			var name = (translateName) ? translate('Canada Post') : 'Canada Post';
			break;
		case 'www.chronopost.fr':
			var name = 'Chronopost';
			if (dropDown) name += ' – '+translate('France');
			break;
		case 'www.city-link.co.uk':
			var name = 'City Link';
			break;			
		case 'www.dhl.com':
		case 'track.dhl-usa.com':
			var name = 'DHL';
			if (dropDown) name += ' – Express';
			break;
		case 'www.dhlglobalmail.com':
			var name = 'DHL';
			if (dropDown) name += ' – '+translate('US')+' GlobalMail';
			break;
		case 'nolp.dhl.de':
		case 'nolp.dhl.de/int':
			var name = 'DHL';
			if (dropDown) name += ' – '+translate('Germany');
			break;
		case 'www.dhl.co.uk':
			var name = 'DHL';
			if (dropDown) name += ' – '+translate('UK Domestic');
			break;
		case 'www.dpd.com':
			var name = 'DPD';
			if (dropDown) name += ' – '+translate('Germany');
			break;
		case 'www.dpd.co.uk':
			var name = 'DPD';
			if (dropDown) name += ' – '+translate('UK');
			break;
		case 'www.fedex.com':
		case 'spportal.fedex.com':
			var name = 'FedEx';
			break;
		case 'www.gls-germany.com':
			var name = 'GLS';
			break;
		case 'checkout.google.com':
			var name = 'Google Checkout';
			break;
		case 'www.hlg.de':
			var name = 'Hermes Logistik Gruppe';
			if (dropDown) name += ' – '+translate('Germany');
			break;
		case 'www.hongkongpost.com':
			var name = 'Hongkong Post';
			break;
		case 'www.japanpost.jp/ems':
		case 'www.japanpost.jp/m10':
		case 'www.japanpost.jp/reg':
		case 'www.japanpost.jp/yupack':
			var name = (translateName) ? translate('Japan Post') : 'Japan Post';
			break;
		case 'www.laposte.fr':
			var name = 'La Poste';
			if (dropDown) name += ' – '+translate('France');
			break;
		case 'www.lasership.com':
			var name = 'LaserShip';
			break;
		case 'www.ontrac.com':
			var name = 'OnTrac';
			break;
		case 'www.parcelforce.com':
			var name = 'Parcelforce';
			break;
		case 'www.post.at':
			var name = (translateName)?'Post':'Post.at';
			if (dropDown) name += ' – '+translate('Austria');
			break;
		case 'www.postdanmark.dk':
			var name = 'Post Danmark';
			break;
		case 'www.poste.it':
		case 'www.poste.it/posta1':
		case 'www.poste.it/pacco1':
		case 'www.poste.it/maxi':
		case 'www.poste.it/pacco':
		case 'www.poste.it/ems':
			var name = (translateName) ? 'Poste Italiane' : 'Poste.it';
			break;
		case 'www.posten.no':
			var name = (translateName) ? 'Posten' : 'Posten.no';
			if (dropDown) name += ' – '+translate('Norway');
			break;
		case 'www.posten.se':
			var name = (translateName) ? 'Posten' : 'Posten.se';
			if (dropDown) name += ' – '+translate('Sweden');
			break;
		case 'www.postnl.nl':
		case 'www.tntpost.nl':
			var name = 'PostNL';
			break;
		case 'www.purolator.com':
			var name = 'Purolator';
			break;
		case 'www.royalmail.com':
			var name = 'Royal Mail';
			break;
		case 'www.sagawa-exp.co.jp':
			var name = (translateName) ? translate('Sagawa Express') : 'Sagawa';
			break;
		case 'www.post.ch':
			var name = (translateName) ? translate('Swiss Post') : 'Swiss Post';
			break;
		case 'www.tnt.com':
			var name = 'TNT';
			if (dropDown) name += ' – '+translate('by consignment number');
			break;
		case 'www.tnt.com/ref':
			var name = 'TNT';
			if (dropDown) name += ' – '+translate('by reference number');
			break;
		case 'www.tntexpress.com.au':
			var name = 'TNT Express';
			if (dropDown) name += ' – '+translate('Australia');
			break;
		case 'www.ups.com':
			var name = 'UPS';
			break;
		case 'www.ups-mi.net':
			var name = 'UPS Mail Innovations';
			break;
		case 'www.usps.com':
			var name = 'US Postal Service';
			break;
		case 'www.kuronekoyamato.co.jp':
			var name = (translateName) ? translate('Yamato Transport') : 'Yamato Transport';
			break;
		case 'www.yodel.co.uk':
			var name = 'Yodel';
			break;
		case 'www.amazon.com':
		case 'www.amazon.ca':
		case 'www.amazon.co.uk':
		case 'www.amazon.co.jp':
		case 'www.amazon.de':
		case 'www.amazon.at':
		case 'www.amazon.es':
		case 'www.amazon.fr':
		case 'www.amazon.it':
			var name = 'A'+from.substring(5);
			break;
		case 'other':
			var name = (translateName) ? translate('Other') : 'Other';
			break;
		default:
			var name = from;
			break;

	}
	return name;

}

function cleanUpDate (input,time,from) {

	var output;
	if (input) {

		if (!from) from = this.from;
		var year = new Date().getFullYear();

		input = input.toString();
		// Get rid of the time if necessary
		if (!time) input = input.replace(/(, |, by )?([0-9]{2}:[0-9]{2}:[0-9]{2}|[0-9]{1,2}:[0-9]{2} ?(A\.?M\.?|P\.?M\.?|Uhr|Hours|h)?)/i,'');
		while (input.indexOf('&nbsp;') != -1) input = input.replace('&nbsp;',' ');
		input = trim(input);
		output = input;

		// Add the year if it's missing, needed for Apple store shipping estimates, Google status updates
		if (output.match(/^[a-z]* [0-9]{1,2}$/i)) output = output+' '+year;

		// Fix international dates
		output = output.replace(/([0-9]{4})-([0-9]{2})-([0-9]{2})/i,'$2/$3/$1');

		switch (from) {
			case 'www.amazon.co.jp':
			case 'www.sagawa-exp.co.jp':
				output = output.replace(/([0-9]+)年([0-9]+)月([0-9]+)日/i,'$2/$3/$1');
				break;
			case 'www.amazon.de':
			case 'www.amazon.at':
				output = cleanGermanDate(output);
				break;
			case 'www.amazon.es':
				output = cleanSpanishDate(output);
				break;
			case 'www.amazon.fr':
				output = cleanFrenchDate(output);
				break;
			case 'www.amazon.it':
				output = cleanItalianDate(output);
				break;
			case 'www.apple.com':
			case 'www.apple.com/japan':
			case 'www.apple.com/hk':
				output = output.replace(/^(?:by )?([a-z]+) ([0-9]{1,2})[a-z]{2}$/i,'$1 $2,'+year);
				output = output.replace(/^([0-9]{1,2}) ([a-z]+)$/i,'$2 $1,'+year);
				output = output.replace(/^([0-9]{1,2})\/([0-9]{1,2})$/i,'$1/$2/'+year);
				if (from == 'www.apple.com/hk') output = output.replace(/^([0-9]+)年([0-9]+)月([0-9]+)日$/i,'$2/$3/$1');
				break;
			case 'auspost.com.au':
			case 'www.hlg.de':
			case 'www.laposte.fr':
			case 'www.postdanmark.dk':
				output = flexibleInternationalDate(output);
				break;
			case 'www.chronopost.fr':
				if (translate('xx') == 'fr') output = flexibleInternationalDate(output); // French desktop
				var frenchDateRegEx = /^[a-z]* ([0-9]{1,2} [a-z]*)$/i;
				if (output.match(frenchDateRegEx)) {
					output = output.replace(frenchDateRegEx,'$1,'+year); // French mobile
					output = cleanFrenchDate(output);
				} else output = output.replace(/^[a-z]*, ([a-z]* [0-9]{1,2})$/i,'$1,'+year); // English mobile
				break;
			case 'www.city-link.co.uk':
			case 'www.tntexpress.com.au':
				output = flexibleInternationalDate(output);
				output = output.replace(/([0-9]{1,2})[a-z]+ ([a-z]+)/i,'$2 $1, '+year);
				break;
			case 'nolp.dhl.de':
				output = output.replace(/^([a-z]+\.,)/i,'');
				output = flexibleInternationalDate(output);
				break;
			case 'www.dhlglobalmail.com':
				switch(translate('xx')) {
					case 'de': output = cleanGermanDate(output); break;
					case 'fr': output = cleanFrenchDate(output); break;
					case 'ja': 
						output = output.replace(/^([0-9]+)\s+([0-9]+),\s+([0-9]+)$/i,'$1/$2/$3');
						break;
					default: break;
				}
				break;
			case 'www.royalmail.com':
			case 'www.parcelforce.com':
			case 'www.posten.no':
				// Could be DD/MM/YY (RoyalMail, Parcelforce), DD.MM.YYYY (Posten), or YYYY-MM-DD. The latter was fixed above.
				if (input == output) output = flexibleInternationalDate(output);
				break;
			case 'www.posten.se':
				result = output.match(/([0-9]{1,2}) ([a-z]*)/i);
				if (result) output = getSwedishMonth(result[2])+'/'+result[1]+'/'+year;
				break;
			case 'www.postnl.nl':
			case 'www.tntpost.nl':
				if (output.match(/vandaag/i)) {
					output = new Date().toDateString();
				} else output = cleanDutchDate(output);
				break;
			case 'www.japanpost.jp/ems':
			case 'www.japanpost.jp/m10':
			case 'www.japanpost.jp/reg':
			case 'www.japanpost.jp/yupack':
				output = output.replace(/([0-9]{1,2})月([0-9]{1,2})日/i,'$1/$2/'+year);
				break;
			case 'www.post.at':
				// Only reorder if periods are used
				output = output.replace(/([0-9]{2})\.([0-9]{2})\.([0-9]{2,4})/i,'$2/$1/$3');
				break;
			case 'www.poste.it':
			case 'www.poste.it/posta1':
			case 'www.poste.it/pacco1':
			case 'www.poste.it/maxi':
			case 'www.poste.it/pacco':
			case 'www.poste.it/ems':
				output = output.replace(/([0-9]{2})\-([0-9]{2})\-([0-9]{4})/i,'$2/$1/$3');
				break;
			case 'www.post.ch':
				output = output.replace(/([0-9]{2})\.([0-9]{2})\.([0-9]{4})/i,'$2/$1/$3');
				break;
			case 'www.kuronekoyamato.co.jp':
				output += '/'+year;
				break;
			case 'www.yodel.co.uk':
				output = output.replace(/^([0-9]+)([a-z]+)? ([a-z]+) ([0-9]{4})/i,'$1 $3 $4');
				break;
		}

	}
	return output;

}

function reorderInternationalDate (input) {
	return (input) ? input.replace(/([0-9]{2})\/([0-9]{2})\/([0-9]{4})/i,'$2/$1/$3') : '';
}

function flexibleInternationalDate (input) {
	// Might be safe to replace reorderInternationalDate with this?
	return (input) ? input.replace(/([0-9]{2})(?:\/|-|\.)([0-9]{2})(?:\/|-|\.)([0-9]{2,4})/i,'$2/$1/$3') : '';
}

function dateFromString (string) {
	var date = false;
	if (string) {
		date = new Date(string);
		if (new String(date.getDate()) == 'NaN') date = false;
	}
	return date;
}

function cleanLocation (string,from) {
	if (string) {
		if (!from) from = this.from; // Remove once 4.6 is dropped
		string = stripHTML(string);
		string = string.replace(/ (Hub|Depot|Distribution|Distributionsbasis|Paketzentrum|Centre Colis|Base de distribution)$/i,'');
		switch (from) {
			case 'auspost.com.au':
				string = string.replace(/ (LPO|BUSINESS HUB),/i,'');
				break;
			case 'www.chronopost.fr':
				string = string.replace(/ (CHRONOPOST)/i,'');
				break;				
			case 'www.dhl.com':
				string = string.replace(/ (HUB|GATEWAY),/i,'');
				string = string.replace(/^(.*?) - \1$/,'$1');
				break;
			case 'www.dhl.co.uk':
				string = string.replace(/ (SERVICE CENTRE|HOME DELIVERY)$/i,'');
				break;
			case 'nolp.dhl.de':
				string = string.replace(/^HUB /i,'');
				break;
			case 'www.dpd.co.uk':
				string = string.replace(/^Hub [0-9]+ - /i,'');
				break;
			case 'www.fedex.com':
				string = string.replace(/^FEDEX SMARTPOST /i,'');
				string = string.replace(/(.*?), \1$/i,'$1');
				break;
			case 'www.ontrac.com':
				string = string.replace(/^San([A-Z])/,'San $1');
				break;
			case 'www.parcelforce.com':
				string = string.replace(/^Delivery Agent - /i,'');
				string = string.replace(/ DEFAULT$/i,'');
				string = string.replace(/^(National|International)$/i,''); // Hub already removed
				break;
			case 'www.post.ch':
				string = string.replace(/ (Zustellung|Filiale di distribuzione)$/i,'');
				string = string.replace(/^[0-9]+ /,'');
				break;
			case 'www.posten.no':
				string = string.replace(/^[0-9]+ /,'');
				break;
			case 'www.posten.se':
				string = string.replace(/^(Posten ?Företag|Posten)\b ?/,'');
				break;
			case 'www.purolator.com':
				string = string.replace(/ Sort Ctr\/ctr Tri/i,'');
				break;
			case 'www.royalmail.com':
				string = string.replace(/ (MAIL CENTRE|CENTRAL MAIL CENTR|PDO)$/i,'');
				break;
			case 'www.tntexpress.com.au':
				string = string.replace(/ (Priority|Riteway)$/i,'');
				break;
			case 'www.usps.com':
				string = string.replace(/ \(USPS\)$/i,'');
				break;
			case 'www.yodel.co.uk':
				string = string.replace(/(Customer| service centre| hub| depot| van| home delivery)$/i,'');
				break;
		}
	}
	return string;
}

function removeHtmlEntities (string) {
	if (typeof string == 'string') {
		var entities = {
			'amp':'&',
			'quot':'"',
			'nbsp':' ',
			'ndash':'–',
			'mdash':'—',

			'auml':'ä',
			'euml':'ë',
			'iuml':'ï',
			'ouml':'ö',
			'uuml':'ü',
			'Auml':'Ä',
			'Euml':'Ë',
			'Iuml':'Ï',
			'Ouml':'Ö',
			'Uuml':'Ü',

			'aacute':'á',
			'eacute':'é',
			'iacute':'í',
			'oacute':'ó',
			'uacute':'ú',
			'Aacute':'Á',
			'Eacute':'É',
			'Iacute':'Í',
			'Oacute':'Ó',
			'Uacute':'Ú',

			'agrave':'à',
			'egrave':'è',
			'igrave':'ì',
			'ograve':'ò',
			'ugrave':'ù',
			'Agrave':'À',
			'Egrave':'È',
			'Igrave':'Ì',
			'Ograve':'Ò',
			'Ugrave':'Ù',

			'acirc':'â',
			'ecirc':'ê',
			'icirc':'î',
			'ocirc':'ô',
			'ucirc':'û',
			'Acirc':'Â',
			'Ecirc':'Ê',
			'Icirc':'Î',
			'Ocirc':'Ô',
			'Ucirc':'Û',

			'agrave':'à',
			'egrave':'è',
			'igrave':'ì',
			'ograve':'ò',
			'ugrave':'ù',
			'Agrave':'À',
			'Egrave':'È',
			'Igrave':'Ì',
			'Ograve':'Ò',
			'Ugrave':'Ù',

			'ntilde':'ñ',
			'atilde':'ã',
			'otilde':'õ',
			'Ntilde':'Ñ',
			'Atilde':'Ã',
			'Otilde':'Õ',

			'aring':'å',
			'Aring':'Å',

			'oslash':'ø',
			'Oslash':'Ø',
		
			'copy':'©',
			'trade':'™',
			'reg':'®'
		};
		return string.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, function(whole,parens) {
			if (parens[0] === "#") {
				var charCode = parens[1].toLowerCase() === 'x' ? parseInt(parens.substr(2),16) : parseInt(parens.substr(1),10);
				return String.fromCharCode(charCode);
			} else return entities.hasOwnProperty(parens) ? entities[parens] : whole;
		});
	}
	return string;
}

function cleanHTML (string,from) {
	// Not currently used!
	return string;
}

function guessFrom (no,correctNo) {

	var from = false;
	var newNo = false;
	no = no.replace(/ /g,'');

	if (no.match(/^1Z[0-9A-Z]{16}$/i)) {
		from = ['www.ups.com'];
	} else if (matches = no.match(/^([A-Z]{2})[0-9]{9}([A-Z]{2})$/i)) {
		var country = matches[2].toUpperCase();
		switch (country) {
			case 'AT': from = ['www.post.at']; break;
			case 'AU': from = ['auspost.com.au']; break;
			case 'CA': from = ['em.canadapost.ca']; break;
			case 'CH': from = ['www.post.ch']; break;
			case 'DK': from = ['www.postdanmark.dk']; break;
			case 'FR': from = ['www.chronopost.fr','www.laposte.fr']; break;
			case 'GB': from = ['www.royalmail.com','www.parcelforce.com']; break;
			case 'HK': from = ['www.hongkongpost.com']; break;
			case 'IT': from = ['www.poste.it']; break;
			case 'JB': from = ['www.chronopost.fr','www.laposte.fr']; break;
			case 'JP': from = ['www.japanpost.jp/yupack']; break;
			case 'NL': from = ['www.postnl.nl']; break;
			case 'NO': from = ['www.posten.no']; break;
			case 'SE': from = ['www.posten.se']; break;
			case 'US': from = ['www.usps.com']; break;
		}
	} else if (no.match(/^96(11|12|13)[0-9]{18}$/)) { // && checkFedEx15(no.substring(7))) { // 22 digits, last digit is a check
		from = ['www.fedex.com'];
	} else if (no.match(/^(420[0-9]{5})?9[0-9]{21,25}$/)) { // 22, 26, 30, or 34 digits
		// (420xxxxx)?9102xxxxxxxxxxxxxxxxxx is usually www.dhlglobalmail.com or www.ups-mi.net?
		from = ['www.usps.com','www.dhlglobalmail.com','www.ups-mi.net'];
	} else if (no.match(/^0034043[0-9]{13}$/)) { // 20 digits
		from = ['nolp.dhl.de'];
	} else if (no.match(/^J?JD[0-9]{2}\.?[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\.?([0-9]{3,10})?$/i)) {
		from = ['nolp.dhl.de','www.dhl.co.uk','www.dhl.com','www.yodel.co.uk'];
	} else if (no.match(/^0[1-3][0-9]{18}$/)) { // 20 digits
		from = ['www.usps.com'];
	} else if (no.match(/^70[0-9]{18}$/)) { // 20 digits, Certified Mail
		from = ['www.usps.com'];
	} else if (no.match(/^[0-9]{15}$/)) { // 15 digits
		from = ['www.hlg.de','www.dpd.com','www.dpd.co.uk','checkout.google.com'];
		if (checkFedEx15(no)) from.unshift('www.fedex.com');
	} else if (no.match(/^[0-9]{12}$/)) { // 12 digits, including UPS InfoNotice
		from = ['nolp.dhl.de','www.kuronekoyamato.co.jp','www.sagawa-exp.co.jp','www.hlg.de',
			'www.japanpost.jp/yupack','www.gls-germany.com'];
		if (checkFedEx12(no)) {
			from.unshift('www.fedex.com');
		} else from.push('www.ups.com');
	} else if (no.match(/^DT[0-9]{12}$/)) { // DT followed by 12 digits, FedEx delivery notice number
		from = ['www.fedex.com'];
	} else if (no.match(/^(00)?37[0-9]{16}$/)) { // 18 or 20 digits
		from = ['www.posten.no','www.posten.se','www.postdanmark.dk'];
		if (no.match(/^[0-9]{18}$/)) from.push('www.dhl.com'); // 18 digits, odds are low
	} else if (no.match(/^(98|99)\.?[0-9]{2}\.?[0-9]{6}\.?[0-9]{8}$/)) { // 18 digits possibly with periods
		from = ['www.post.ch'];
		if (no.match(/^[0-9]{18}$/)) from.push('www.dhl.com'); // 18 digits, odds are low
	} else if (no.match(/^[0-9]{18}$/)) { // 18 digits
		from = ['www.dhl.com'];
	} else if (no.match(/^([0-9]{10}|[0-9]{18})$/)) { // 10 digits
		// www.tnt.com/ref always starts with 8? apple always starts with 71?
		from = ['www.dhl.com','www.aramex.com','www.tnt.com/ref','www.apple.com','www.apple.com/zip',
			'www.apple.com/japan','www.apple.com/japanzip','www.apple.com/hk'];
	} else if (no.match(/^P[0-9]{12}$/i)) { // P plus 12 digits
		from = ['nolp.dhl.de'];
	} else if (no.match(/^[0-9]{3}-[0-9]{7}-[0-9]{7}$/)) {
		from = ['www.amazon.com','www.amazon.co.jp','www.amazon.de','www.amazon.co.uk','www.amazon.fr',
			'www.amazon.ca','www.amazon.it','www.amazon.es','www.amazon.at'];
	} else if (no.match(/^WR?[0-9]{8,9}$/i)) {
		from = ['www.apple.com','www.apple.com/zip','www.apple.com/japan','www.apple.com/japanzip',
			'www.apple.com/hk'];
	} else if (no.match(/^7[0-9]{16}$/)) { // 17 digits
		from = ['www.posten.no'];
	} else if (no.match(/^[0-9]{4}-[0-9]{4}-[0-9]{4}$/)) { // 12 digits with dashes
		from = ['www.kuronekoyamato.co.jp','www.sagawa-exp.co.jp','www.japanpost.jp/yupack'];
	} else if (no.match(/^[0-9]{3}-[0-9]{2}-[0-9]{5}-[0-9]{1}$/)) { // 11 digits with dashes
		from = ['www.japanpost.jp/yupack'];
	} else if (no.match(/^[0-9]{11}$/)) { // 11 digits
		from = ['www.gls-germany.com','www.japanpost.jp/yupack','www.dhlglobalmail.com'];
	} else if (no.match(/^[0-9]{14}[A-Z]$/i)) { // 14 digits plus letter
		from = ['www.dpd.com','www.dpd.co.uk'];
	} else if (no.match(/^[0-9]{14}$/)) { // 14 digits
		from = ['www.dpd.com','www.dpd.co.uk','www.hlg.de','www.posten.se'];
	} else if (no.match(/^000[0-9]{4}0530800815[0-9]{4}101[0-9]{3}[A-Z0-9]$/i)) {
		from = ['www.dpd.com'];
	} else if (no.match(/^[0-9]{16}$/)) { // 16 digits
		from = ['em.canadapost.ca','www.hlg.de'];
	} else if (no.match(/^[0-9]{9}$/)) { // 9 digits, UPS freight PRO number
		from = ['www.tnt.com','www.ups.com'];
	} else if (no.match(/^[0-9]{2}.[0-9]{3}.[0-9].[0-9]{2}.[0-9]{5}.[0-9]$/)) { // 14 digits with periods
		from = ['www.hlg.de'];
	} else if (no.match(/^(C10|C11|D10)[0-9]{12}$/i)) { // 1 letter and 14 digits
		from = ['www.ontrac.com'];
	} else if (no.match(/^L[A-Z][0-9]{8}$/i)) {
		from = ['www.lasership.com'];
	} else if (no.match(/^3S[A-Z]{4}[0-9]{6,9}$/i)) {
		from = ['www.postnl.nl'];
	} else if (no.match(/^[0-9]{5}\.[0-9]{2}\.([0-9]{4}|[0-9]{6})$/)) { // 11 or 13 digits with periods
		from = ['www.gls-germany.com'];
	} else if (no.match(/^([A-Z]{3}[0-9]{5})$/i)) { // 8 characters, 3 letters and 5 digits
		from = ['www.city-link.co.uk','www.gls-germany.com'];
	} else if (no.match(/^([0-9]{1}[A-Z90-9]{5}|[A-Z][0-9A-Z]{7})$/i) && no.match(/[0-9]/)) { // 6 or 8 characters
		from = ['www.gls-germany.com'];
	} else if (no.match(/^(PB[A-Z]{2}[0-9]{7}001|TW[A-Z]{2}[0-9]{7}GB|[A-Z]{2}[0-9]{7})$/i)) {
		from = ['www.parcelforce.com'];
	} else if (no.match(/^[A-Z]{3}[0-1]00[0-9]{6}$/i)) {
		from = ['www.purolator.com'];
	} else if (no.match(/^[A-Z][A-Z0-9]{2}[0-9]{5}$/i)) {
		from = ['www.city-link.co.uk'];
	} else if (no.match(/^[0-9][A-Z][0-9]{11}$/i)) { // 13 characters, second is a letter
		from = ['www.laposte.fr'];
	} else if (no.match(/^[0-9]{11}DK$/i)) {
		from = ['www.postdanmark.dk'];
	} else if (no.match(/^101[0-9]{19}$/i)) { // 22 digits
		from = ['www.post.at'];
	} else if (no.match(/^L[A-Z]{2}000[0-9]{4}([0-9]{6})?$/i)) { // 10 or 16 digits
		from = ['auspost.com.au'];
	} else if (no.match(/^APK[0-9]{7}$/)) { // 10 digits, starting with APK
		from = ['www.tntexpress.com.au'];
	} else if (no.match(/^AD[0-9]{9}[A-Z]{0,4}$/i)) {
		from = ['www.adobe.com'];
	} else if (no.match(/^[0-9]{32}$/) && checkFedEx12(no.substring(16,28))) { // 32 digits, 12 digits inside a barcode
		from = ['www.fedex.com'];
		newNo = no.substring(16,28);
	} else if (no.match(/^[0-9]{34}$/) && checkFedEx12(no.substring(22,34))) { // 34 digits, 12 digits at the end of a barcode
		from = ['www.fedex.com'];
		newNo = no.substring(22,34);
	} else if (no.match(/^[0-9][A-Z]{3}[0-9]{24}$/)) { // 28 digits, 16 digits inside a barcode
		from = ['em.canadapost.ca'];
		newNo = no.substring(7,23);
	}

	if (correctNo && from) from.unshift(newNo);
	return from;

}

function checkFedEx12 (no) {
	// Expects a string
	var checkDigit = ((no[0]*3)+(no[1]*1)+
		(no[2]*7)+(no[3]*3)+(no[4]*1)+
		(no[5]*7)+(no[6]*3)+(no[7]*1)+
		(no[8]*7)+(no[9]*3)+(no[10]*1)) % 11;
	if (checkDigit == 10) checkDigit = 0;
	return (checkDigit == no[11]) ? true : false;
}

function checkFedEx15 (no) {
	// Expects a string
	var checkDigit = 10 - ((((
		parseInt(no[13])+parseInt(no[11])+
		parseInt(no[9])+parseInt(no[7])+
		parseInt(no[5])+parseInt(no[3])+parseInt(no[1])) * 3)+
		(parseInt(no[12])+parseInt(no[10])+
		parseInt(no[8])+parseInt(no[6])+
		parseInt(no[4])+parseInt(no[2])+parseInt(no[0]))) % 10);
	if (checkDigit == 10) checkDigit = 0;
	return (checkDigit == no[14]) ? true : false;
}

function logRequest (level,request) {
	if (typeof logLevel == 'undefined') return;
	if (logLevel >= level && request) {
		var message = '';
		if (request.url) message += request.url+'\n';
		message += 'Status: '+request.status+'\n';
		message += 'Ready State: '+request.readyState+'\n';
		if (request.getAllResponseHeaders) message += request.getAllResponseHeaders()+'\n';
		if (message) message += '\n';
		alert(message+request.responseText);
	}
}

function logMessage (level,message) {
	if (typeof logLevel == 'undefined') return;
	if (logLevel >= level) alert(message);
}

// Once defs stop supporting 4.6 sync:
// Move to Common.js: manualSignIn, logRequest, logMessage, deliveryTitle, notSupported, getFromName, dateFromString
// Remove removeHtmlEntities and these:
function sessionAdobe () {}
function getHermes () {}
function getOnTrac () {}
function getParcelforce () {}
function getTNT () {}
function cleanDate (string) {
	var date = (string) ? dateFromString(string) : false;
	return [ string, date ];
}