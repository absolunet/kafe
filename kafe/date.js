//-------------------------------------------
// kafe.date
//-------------------------------------------
kafe.bonify({name:'date', version:'1.1', obj:(function(K,undefined){
	var $ = K.jQuery;
	
	// dictionary
	var _dict = {
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

	// _lang ([lang])
	// get a valid lang
	//-------------------------------------------
	function _lang(lang) {
		return K.fn.lang(_dict,lang);
	}

	// _m3 (month, [lang])
	// get the 3-char month abbreviation
	//-------------------------------------------
	function _m3(month, lang) {
		var d = _dict[_lang(lang)];
		return (d.m3 && d.m3[month]) ? d.m3[month] : d.m[month].toString().substring(0,3);
	}

	// _w3 (weekday, [lang])
	// get the 3-char weekday abbreviation
	//-------------------------------------------
	function _w3(weekday, lang) {
		var d = _dict[_lang(lang)];
		return (d.w3 && d.w3[weekday]) ? d.w3[weekday] : d.w[weekday].toString().substring(0,3);
	}

	// _trim (list, nb)
	// trim every element of the array
	//-------------------------------------------
	function _trim(list,nb) {
		var d = [];
		for (var i in list) {
			d.push(list[i].toString().substr(0,nb));
		}
		return d;
	}



	//-------------------------------------------
	// PUBLIC
	//-------------------------------------------
	var date = {};

	// constants
	//-------------------------------------------
	K.fn.setReadOnlyProperties(date,{
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
		return _dict[_lang(lang)].m;
	};

	// getMonth1Names ([lang])
	// get the 1-char month abbreviation
	//-------------------------------------------
	date.getMonth1Names = function(lang) {
		return _trim(_dict[_lang(lang)].m,1);
	};

	// getMonth2Names ([lang])
	// get the 2-char month abbreviation
	//-------------------------------------------
	date.getMonth2Names = function(lang) {
		lang = _lang(lang);
		return (_dict[lang].m2) ? _dict[lang].m2 : _dict.multi.m2;
	};

	// getMonth3Names ([lang])
	// get the 3-char month abbreviation
	//-------------------------------------------
	date.getMonth3Names = function(lang) {
		var d = [];
		for (var i=0; i<12; ++i) {
			d.push(_m3(i, lang));
		}
		return d;
	};

	// getWeekdayNames ([lang])
	// get the weekday names
	//-------------------------------------------
	date.getWeekdayNames = function(lang) {
		return _dict[_lang(lang)].w;
	};

	// getWeekday1Names ([lang])
	// get the 1-char weekday abbreviation
	//-------------------------------------------
	date.getWeekday1Names = function(lang) {
		return _trim(_dict[_lang(lang)].w,1);
	};

	// getWeekday2Names ([lang])
	// get the 2-char weekday abbreviation
	//-------------------------------------------
	date.getWeekday2Names = function(lang) {
		return _trim(_dict[_lang(lang)].w,2);
	};

	// getWeekday3Names ([lang])
	// get the 3-char weekday abbreviation
	//-------------------------------------------
	date.getWeekday3Names = function(lang) {
		var d = [];
		for (var i=0; i<7; ++i) {
			d.push(_w3(i, lang));
		}
		return d;
	};
	
	// getDayNames ([lang])
	// get the month day clean representation
	//-------------------------------------------
	date.getDayNames = function(lang) {
		var d = _dict[_lang(lang)].d;
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
			lang = _lang(lang),
			d    = _dict[lang],

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
			data = {                                                        // -------------------
				Y: year,                                                    // year           2011
				y: year.toString().substring(2),                            // year             11
				M: pad(month),                                              // month            01
				m: month,                                                   // month             1
				A: d.m[month-1],                                            // month       January
				a: d.m[month-1].toLowerCase(),                              // month       january
				B: this.getMonth3Names(lang)[month-1],                      // month           Jan
				b: this.getMonth3Names(lang)[month-1].toLowerCase(),        // month           jan
				C: this.getMonth2Names(lang)[month-1].toUpperCase(),        // month            JA
				c: this.getMonth2Names(lang)[month-1],                      // month            Ja
				D: pad(day),                                                // day              02
				d: day,                                                     // day               2
				e: this.getDayNames(lang)[day-1],                           // day             2nd
				W: d.w[weekday],                                            // weekday      Sunday
				w: d.w[weekday].toLowerCase(),                              // weekday      sunday
				X: this.getWeekday3Names(lang)[weekday],                    // weekday         Sun
				x: this.getWeekday3Names(lang)[weekday].toLowerCase(),      // weekday         sun
				Z: this.getWeekday2Names(lang)[weekday],                    // weekday          Su
				z: this.getWeekday2Names(lang)[weekday].toLowerCase(),      // weekday          su
				H: pad(hours),                                              // hour             15
				h: hours,                                                   // hour             15
				K: pad(hours12),                                            // hour             03 
				k: hours12,                                                 // hour              3
				p: (hoursAmPm) ? 'pm' : 'am',                               // hour             pm
				I: pad(minutes),                                            // minute           04
				i: minutes,                                                 // minute            4
				S: pad(seconds),                                            // second           05
				s: seconds                                                  // second            5
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
			d     = _dict[_lang(lang)].r,
			delta = now.getTime() - time.getTime()
		;
	
		if (delta <= 0) {
			return d[0];
		} else if (delta < this.MINUTE) {
			return d[1];
		} else if(delta < 2*this.MINUTE) {
			return d[2];
		} else if(delta < this.HOUR) {
			return d[3].replace('%n', Math.floor(delta/this.MINUTE));
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

	// parse (string)
	// parses a string into a date obj
	//-------------------------------------------
	date.parse = function(s) {

		function y2y4(year) {
			if (year > 69 && year < 100) {
				return Number(year) + 1900;
			} else if (year < 69) {
				return Number(year) + 2000;
			} else {
				return year;
			}
		};
		
		var ts = Date.parse(s);
		if (isNaN(ts)) {

			var m = date.getMonth3Names('en');
			var year, month, day, hour, minute, second, delta, e;

			// 2011-03-08 09:25:15
			if (e = new RegExp('^([0-9]{2,4})\-([0-9]{2})\-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$','gi').exec(s)) {
				year   = y2y4(e[1]);
				month  = e[2];
				day    = e[3];
				hour   = e[4];
				minute = e[5];
				second = e[6];

			// Sat, 30 Oct 10 13:51:32 +0000
			} else if (e = new RegExp('^([a-z]{3}), ([0-9]{2}) ([a-z]{3}) ([0-9]{2,4}) ([0-9]{2}):([0-9]{2}):([0-9]{2}) ([\+\-][0-9]{4})$','gi').exec(s)) {
				year   = y2y4(e[4]);
				month  = $.inArray(e[3], m)+1;
				day    = e[2];
				hour   = e[5];
				minute = e[6];
				second = e[7];
				delta  = e[8]/100;

			// Mon Nov 01 01:49:22 +0000 2010
			} else if (e = new RegExp('^([a-z]{3}) ([a-z]{3}) ([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2}) ([\+\-][0-9]{4}) ([0-9]{2,4})$','gi').exec(s)) {
				year   = y2y4(e[8]);
				month  = $.inArray(e[3], m)+1;
				day    = e[3];
				hour   = e[4];
				minute = e[5];
				second = e[6];
				delta  = e[7]/100;
			}

			var d = new Date(year, month-1, day, hour, minute, second, 0);
			return (delta) ? new Date(d - ( (d.getTimezoneOffset() + (Number(delta)*60) ) * 60 * 1000)) : d;

		} else {
			return new Date(ts);
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

	// makeMonthCalendar (month,year,links)
	// refresh a day dropdown depending of the month-year
	//-------------------------------------------
	date.makeMonthCalendar = function(y,m,links) {
		--m;
		
		var 
			links    = links || {},
			weekdays = date.getWeekday3Names(),
			max      = date.getMaxMonth(y)[m],
			firstDay = new Date(y,m,1).getDay(),
			week     = 0,
			html     = '<table data-month="'+date.format('%Y-%M', new Date(y,m,1))+'"><caption>'+date.getMonthNames()[m]+' '+y+'</caption><thead><tr>'
		;
		
		// weekdays
		for (var i in weekdays) {
			html += '<th>'+weekdays[i]+'</th>'
		}

		html += '</thead><tbody><tr>'

		// start padding
		for (var i=0; i<firstDay; ++i) {
			html += '<td>&nbsp;</td>';
			++week;
		}

		// days
		for (var i=1; i<=max; ++i) {
			if (week == 7) {
				html += '</tr><tr>';
				week = 0;
			}
			
			var thisDate = date.format('%Y-%M-%D', new Date(y,m,i));
			html += '<td data-date="'+thisDate+'">' + ((links[thisDate]) ? '<a href="'+links[thisDate]+'">'+i+'</a>' : '<span>'+i+'</span>') + '</td>';
			++week;
		}

		// end padding
		for (var i=week; i<7; ++i) {
			html += '<td>&nbsp;</td>';
		}

		return html+'</tr></tbody></table>';
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

})(kafe)});
