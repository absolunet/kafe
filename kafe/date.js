//-------------------------------------------
// kafe.date
//-------------------------------------------
kafe.import({name:'date', version:'1.0', obj:(function($,K,undefined){

	// dictionary
	var __dict = {
		fr: {
			m:  ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
			m3: [0,0,0,0,0,'Jun','Jul'],
			w:  ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
			d:  ['1er'],
			r:  ['en ce moment','il y a moins d\'une minute','il y a environ une minute','il y a %n minutes','il y a environ une heure','il y a %n heures','hier','avant-hier','il y a %n jours','la semaine passée','il y a %n semaines','le mois passé','il y a %n mois']
		},
		en: {
			m:  ['January','February','March','April','May','June','July','August','September','October','November','December'],
			w:  ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
			d:  ['1st','2nd','3rd','4th','5th','6th','7th','8th','9th','10th','11th','12th','13th','14th','15th','16th','17th','18th','19th','20th','21st','22nd','23rd','24th','25th','26th','27th','28th','29th','30th','31st'],
			r:  ['now','less than a minute ago','about a minute ago','%n minutes ago','about an hour ago','%n hours ago','yesterday','day before yesterday','%n days ago','last week','%n weeks ago','last month','%n months ago']
		},
		multi: {
			m2: ['Ja','Fe','Mr','Al','Ma','Jn','Jl','Au','Se','Oc','No','De']
		}
	};

	// __lang ([lang])
	// get a valid lang
	//-------------------------------------------
	function __lang(lang) {
		lang = (lang) ? lang : K.env('lang');
		return (__dict[lang]) ? lang : 'en';
	}

	// __m3 (month, [lang])
	// get the 3-char month abbreviation
	//-------------------------------------------
	function __m3(month, lang) {
		var d = __dict[__lang(lang)];
		return (d.m3 && d.m3[month]) ? d.m3[month] : d.m[month].substring(0,3);
	}

	// __w3 (weekday, [lang])
	// get the 3-char weekday abbreviation
	//-------------------------------------------
	function __w3(weekday, lang) {
		var d = __dict[__lang(lang)];
		return (d.w3 && d.w3[weekday]) ? d.w3[weekday] : d.w[weekday].substring(0,3);
	}



	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var date = {};

	// constants
	//-------------------------------------------
	K.setReadOnlyProperties(date,{
		SECOND:  1000,        // 1000 ms per second
	    MINUTE:  60000,       // 60 seconds per minute
	    HOUR:    3600000,     // 60 minutes per hour
	    DAY:     86400000,    // 24 hours per day
	    WEEK:    604800000,   // 7 days per week
	    MONTH:   2629743840,  // 4.348121428571429 weeks per month
	    YEAR:    31556926080  // 365.2422 days per year
	});

	// getDayYear (date)
	// get the day of the year
	//-------------------------------------------
	date.getDayYear = function(d) {
		var max = this.getMaxMonth(d.getFullYear());
		var m   = d.getMonth();
		var total = -1;
		
		for (var i=0; i<m; ++i) {
			total += max[i];
		}
		
		return total+d.getDate();
	};

	// isLeapYear (year)
	// is a leap year
	//-------------------------------------------
	date.isLeapYear = function(y) {
		return ((y%4 == 0 && y%400 != 0) || y == 2000);
	};

	// getMaxMonth (year)
	// get number of days in the months for a year
	//-------------------------------------------
	date.getMaxMonth = function(y) {
		return [31, (this.isLeapYear(y) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	};
	
	// getMonthNames ([lang])
	// get the month names
	//-------------------------------------------
	date.getMonthNames = function(lang) {
		return __dict[__lang(lang)].m;
	};

	// getMonth2Names ([lang])
	// get the 2-char month abbreviation
	//-------------------------------------------
	date.getMonth2Names = function(lang) {
		lang = __lang(lang);
		return (__dict[lang].m2) ? __dict[lang].m2 : __dict.multi.m2;
	};

	// getMonth3Names ([lang])
	// get the 3-char month abbreviation
	//-------------------------------------------
	date.getMonth3Names = function(lang) {
		var d = [];
		for (var i=0; i<12; ++i) {
			d.push(__m3(i, lang));
		}
		return d;
	};

	// getWeekdayNames ([lang])
	// get the weekday names
	//-------------------------------------------
	date.getWeekdayNames = function(lang) {
		return __dict[__lang(lang)].w;
	};

	// getWeekday3Names ([lang])
	// get the 3-char weekday abbreviation
	//-------------------------------------------
	date.getWeekday3Names = function(lang) {
		var d = [];
		for (var i=0; i<7; ++i) {
			d.push(__w3(i, lang));
		}
		return d;
	};

	// getDayNames ([lang])
	// get the month day clean representation
	//-------------------------------------------
	date.getDayNames = function(lang) {
		var d = __dict[__lang(lang)].d;
		var l = d.length;
		for (var i=l; i<31; ++i) {
			d[i] = i+1;
		}
		return d;
	};

	// format (format, date, [lang])
	// get a formatted date string
	//-------------------------------------------
	date.format = function(format,date,lang) {
		
		function pad() { return ('0'+arguments[0].toString()).slice(-2); }
		
		var 
			lang = __lang(lang),
			d    = __dict[lang],

			year      = date.getFullYear(),
			month     = date.getMonth()+1,
			day       = date.getDate(),
			weekday   = date.getDay(),
			hours     = date.getHours(),
			minutes   = date.getMinutes(),
			seconds   = date.getSeconds(),
			hours12   = ((hours % 12) == 0) ? 12 : (hours % 12),
			hoursAmPm = Math.floor(hours/12),
		                                                                      // 2011-01-02 15:04:05
			data = {                                                          // -------------------
				Y: year,                                                      // year           2011
				y: year.toString().substring(2),                              // year             11
				M: pad(month),                                                // month            01
				m: month,                                                     // month             1
				A: d.m[month-1],                                              // month       January
				a: d.m[month-1].toLowerCase(),                                // month       january
				B: this.getMonth3Names(lang)[month-1],                        // month           Jan
				b: this.getMonth3Names(lang)[month-1].toLowerCase(),          // month           jan
				C: this.getMonth2Names(lang)[month-1].toUpperCase(),          // month            JA
				c: this.getMonth2Names(lang)[month-1],                        // month            Ja
				D: pad(day),                                                  // day              02
				d: day,                                                       // day               2
				e: this.getDayNames(lang)[day-1],                             // day             2nd
				W: d.w[weekday-1],                                            // weekday      Sunday
				w: d.w[weekday-1].toLowerCase(),                              // weekday      sunday
				X: this.getWeekday3Names(lang)[weekday-1],                    // weekday         Sun
				x: this.getWeekday3Names(lang)[weekday-1].toLowerCase(),      // weekday         sun
				H: pad(hours),                                                // hour             15
				h: hours,                                                     // hour             15
				K: pad(hours12),                                              // hour             03 
				k: hours12,                                                   // hour              3
				p: (hoursAmPm) ? 'pm' : 'am',                                 // hour             pm
				I: pad(minutes),                                              // minute           04
				i: minutes,                                                   // minute            4
				S: pad(seconds),                                              // second           05
				s: seconds                                                    // second            5
			}
		;	

		for (var i in data) {
			format = format.replace(new RegExp('%'+i,'g'),data[i]);
		}

		return format;
	};

	// formatRelative (time, [now], [lang])
	// get a formatted relative date string
	//-------------------------------------------
	date.formatRelative = function (time,now,lang) {
		now = (now) ? now : new Date();

		var 
			d     = __dict[__lang(lang)].r,
			delta = (now.getTime() - time.getTime()) / 1000
		;
	
		if (delta <= 0) {
			return d[0];
		} else if (delta < this.MINUTE) {
			return d[1];
		} else if(delta < 2*this.MINUTE) {
			return d[2];
		} else if(delta < this.HOUR) {
			return d[3].replace('%n', Math.floor(delta/this.MIN));
		} else if(delta < 2*this.HOUR) {
			return d[4];
		} else if(delta < this.DAY) {
			return d[5].replace('%n', Math.floor(delta/this.HOUR));
		} else if(delta < 2*this.DAY) {
			return d[6];
		} else if(delta < 3*this.DAY) {
			return d[7];
		} else if(delta < this.WEEK) {
			return d[8].replace('%n', Math.floor(delta/this.DAY));
		} else if(delta < 2*this.WEEK) {
			return d[9];
		} else if(delta < this.MONTH) {
			return d[10].replace('%n', Math.floor(delta/this.WEEK));
		} else if(delta < 2*this.MONTH) {
			return d[11];
		} else {
			return d[12].replace('%n', Math.floor(delta/this.MONTH));
		}
	};

	// refreshSelectDays (object, month, year)
	// refresh a day dropdown depending of the month-year
	//-------------------------------------------
	date.refreshSelectDays = function(o,m,y) {

		// if a title in the dropdown
		var dp = (Number(o.options[0].value)) ? 0 : 1;
		var dn = -diffp;
		
		var nb = this.getMaxMonth(y)[m-1];
		
		// if there are less day in the new month
		if (o.length+dn > nb) {

			// if a impossible day for the new days is selected
			if (o.selectedIndex+1 > nb+dn) {
				o.selectedIndex = nb-1+dp;
			}
			o.length = nb+dp;

		// if there are more days in the new month
		} else if ( o.length+dn < nb ) {

			var curr = o.length;
			o.length = nb+dp;

			// rebuild the new days
			for (var i=curr; i<nb+dp; ++i) {
				o.options[i].text = i+1+dn;
				o.options[i].value = i+1+dn;
			}
		}
	};








	//-------------------------------------------
	// NATIVE
	//-------------------------------------------
	var Native = {};
	
	// getDayYear ()
	// get the day of the year
	//-------------------------------------------
	Native.getDayYear = function() {
		return date.getDayYear(this.get());
	};

	// isLeapYear ()
	// is a leap year
	//-------------------------------------------
	Native.isLeapYear = function() {
		return date.isLeapYear(this.get().getFullYear());
	};

	// getMaxMonth (year)
	// get number of days in the month
	//-------------------------------------------
	Native.getMaxMonth = function() {
		return date.getMaxMonth(this.get().getFullYear())[this.get().getMonth()];
	};

	// format (format, [lang])
	// get a formatted date string
	//-------------------------------------------
	Native.format = function(format,lang) {
		return date.format(format,this.get(),lang);
	};

	// formatRelative ([now], [lang])
	// get a formatted relative date string
	//-------------------------------------------
	Native.formatRelative = function(now,lang) {
		return date.formatRelative(this.get(),now,lang);
	};

	date.Native = Native;



	return date;

})(jQuery,kafe)});
