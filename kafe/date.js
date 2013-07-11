window.kafe.bonify({name:'date', version:'1.2', obj:(function(kafe,undefined){
	var
		$ = kafe.dependencies.jQuery,

		// dictionary
		_dict = {
			fr: {
				m:  ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
				m3: [0,0,0,0,0,'Jun','Jul'],
				w:  ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
				d:  ['1er'],
				r:  ['en ce moment',"il y a moins d'une minute",'il y a environ une minute','il y a %n minutes','il y a environ une heure','il y a %n heures','hier','avant-hier','il y a %n jours','la semaine passée','il y a %n semaines','le mois passé','il y a %n mois']
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
		},

		// get a valid lang
		_lang = function(lang) {
			return kafe.fn.lang(_dict,lang);
		},

		// get the 3-char month abbreviation
		_m3 = function(month, lang) {
			var d = _dict[_lang(lang)];
			return (d.m3 && d.m3[month]) ? d.m3[month] : d.m[month].toString().substring(0,3);
		},

		// get the 3-char weekday abbreviation
		_w3 = function(weekday, lang) {
			var d = _dict[_lang(lang)];
			return (d.w3 && d.w3[weekday]) ? d.w3[weekday] : d.w[weekday].toString().substring(0,3);
		},

		// trim every element of the array
		_trim = function(list, nb) {
			var d = [];
			for (var i in list) {
				d.push(list[i].toString().substr(0,nb));
			}
			return d;
		}
	;



	/**
	* ### Version 1.2
	* Additionnal methods for date manipulation
	*
	* @module kafe
	* @class kafe.date 
	*/
	var date = {

		/**
		* Number of milliseconds in a second (1000 ms per second)
		*
		* @property SECOND 
		* @type Number
		**/
		SECOND:1000,

		/**
		* Number of milliseconds in a minute (60 seconds per minute)
		*
		* @property MINUTE 
		* @type Number
		**/
		MINUTE:60000,

		/**
		* Number of milliseconds in an hour (60 minutes per hour)
		*
		* @property HOUR 
		* @type Number
		**/
		HOUR:3600000,

		/**
		* Number of milliseconds in a day (24 hours per day)
		*
		* @property DAY 
		* @type Number
		**/
		DAY:86400000,

		/**
		* Number of milliseconds in a week (7 days per week)
		*
		* @property WEEK 
		* @type Number
		**/
		WEEK:604800000,

		/**
		* Number of milliseconds in a month (4.348121428571429 weeks per month)
		*
		* @property MONTH 
		* @type Number
		**/
		MONTH:2629743840,

		/**
		* Number of milliseconds in a year (365.2422 days per year)
		*
		* @property YEAR 
		* @type Number
		**/
		YEAR:31556926080
	};


	/**
	* Get the day of the year
	*
	* @method getDayYear
	* @param {Date} d The date
	* @return {Number} The day of the year
	*/
	date.getDayYear = function(d) {
		var
			max = this.getMaxMonth(d.getFullYear()),
			m   = d.getMonth(),
			total = -1
		;

		for (var i=0; i<m; ++i) {
			total += max[i];
		}

		return total+d.getDate();
	};


	/**
	* Is it a leap year ?
	*
	* @method isLeapYear
	* @param {Number} year The year 
	* @return {Boolean} If it is a leap year
	*/
	date.isLeapYear = function(year) {
		return ((year%4 === 0 && year%400 !== 0) || year == 2000);
	};


	/**
	* Get number of days in the months for a year
	*
	* @method getMaxMonth
	* @param {Number} year The year 
	* @return {Array} The number of days in the months of the year
	*/
	date.getMaxMonth = function(year) {
		return [31, (this.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	};


	/**
	* Get the month names
	*
	* @method getMonthNames
	* @param {String} [lang=CURRENT_ENV_LANG] The language
	* @return {Array} The months names
	*/
	date.getMonthNames = function(lang) {
		return _dict[_lang(lang)].m;
	};


	/**
	* Get the 1-char month abbreviations
	*
	* @method getMonth1Names
	* @param {String} [lang=CURRENT_ENV_LANG] The language
	* @return {Array} The 1-char months abbreviations
	*/
	date.getMonth1Names = function(lang) {
		return _trim(_dict[_lang(lang)].m,1);
	};


	/**
	* Get the 2-char month abbreviations
	*
	* @method getMonth2Names
	* @param {String} [lang=CURRENT_ENV_LANG] The language
	* @return {Array} The 2-char months abbreviations
	*/
	date.getMonth2Names = function(lang) {
		lang = _lang(lang);
		return (_dict[lang].m2) ? _dict[lang].m2 : _dict.multi.m2;
	};


	/**
	* Get the 3-char month abbreviations
	*
	* @method getMonth3Names
	* @param {String} [lang=CURRENT_ENV_LANG] The language
	* @return {Array} The 3-char months abbreviations
	*/
	date.getMonth3Names = function(lang) {
		var d = [];
		for (var i=0; i<12; ++i) {
			d.push(_m3(i, lang));
		}
		return d;
	};


	/**
	* Get the weekday names
	*
	* @method getWeekdayNames
	* @param {String} [lang=CURRENT_ENV_LANG] The language
	* @return {Array} The weekdays names
	*/
	date.getWeekdayNames = function(lang) {
		return _dict[_lang(lang)].w;
	};


	/**
	* Get the 1-char weekday abbreviations
	*
	* @method getWeekday1Names
	* @param {String} [lang=CURRENT_ENV_LANG] The language
	* @return {Array} The 1-char weekdays abbreviations
	*/
	date.getWeekday1Names = function(lang) {
		return _trim(_dict[_lang(lang)].w,1);
	};


	/**
	* Get the 2-char weekday abbreviations
	*
	* @method getWeekday2Names
	* @param {String} [lang=CURRENT_ENV_LANG] The language
	* @return {Array} The 2-char weekdays abbreviations
	*/
	date.getWeekday2Names = function(lang) {
		return _trim(_dict[_lang(lang)].w,2);
	};


	/**
	* Get the 3-char weekday abbreviations
	*
	* @method getWeekday3Names
	* @param {String} [lang=CURRENT_ENV_LANG] The language
	* @return {Array} The 3-char weekdays abbreviations
	*/
	date.getWeekday3Names = function(lang) {
		var d = [];
		for (var i=0; i<7; ++i) {
			d.push(_w3(i, lang));
		}
		return d;
	};


	/**
	* Get the month day clean representation
	*
	* @method getDayNames
	* @param {String} [lang=CURRENT_ENV_LANG] The language
	* @return {Array} The days clean representations
	*/
	date.getDayNames = function(lang) {
		var
			d = _dict[_lang(lang)].d,
			l = d.length
		;
		for (var i=l; i<31; ++i) {
			d[i] = i+1;
		}
		return d;
	};


	/**
	* Get a formatted date
	*
	* @method format
	* @param {String} format The format with %- keys 
	* @param {Date} [date=NOW] The date to format
	* @param {String} [lang=CURRENT_ENV_LANG] The language
	* @return {String} The formatted date
	*/
	date.format = function(format, date, lang) {
		date = (date) ? date : new Date();
		lang = _lang(lang);

		var
			pad  = function() { return ('0'+arguments[0].toString()).slice(-2); },
			d    = _dict[lang],

			year      = date.getFullYear(),
			month     = date.getMonth()+1,
			day       = date.getDate(),
			weekday   = date.getDay(),
			hours     = date.getHours(),
			minutes   = date.getMinutes(),
			seconds   = date.getSeconds(),
			hours12   = ((hours % 12) === 0) ? 12 : (hours % 12),
			hoursAmPm = Math.floor(hours/12),

			//                                                                 2011-01-02 15:04:05
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


	/**
	* Get a relative time expression
	*
	* @method formatRelative
	* @param {Date} time The datetime we want 
	* @param {Date} [now=NOW] The datetime from which it is relative to
	* @param {String} [lang=CURRENT_ENV_LANG] The language
	* @return {String} The relative time expression
	*/
	date.formatRelative = function(time, now, lang) {
		now = (now) ? now : new Date();

		var
			d     = _dict[_lang(lang)].r,
			delta = now.getTime() - time.getTime()
		;

		if (delta <= 0) {
			return d[0];
		} else if (delta < date.MINUTE) {
			return d[1];
		} else if(delta < 2*date.MINUTE) {
			return d[2];
		} else if(delta < date.HOUR) {
			return d[3].replace('%n', Math.floor(delta/date.MINUTE));
		} else if(delta < 2*date.HOUR) {
			return d[4];
		} else if(delta < date.DAY) {
			return d[5].replace('%n', Math.floor(delta/date.HOUR));
		} else if(delta < 2*date.DAY) {
			return d[6];
		} else if(delta < 3*date.DAY) {
			return d[7];
		} else if(delta < date.WEEK) {
			return d[8].replace('%n', Math.floor(delta/date.DAY));
		} else if(delta < 2*date.WEEK) {
			return d[9];
		} else if(delta < date.MONTH) {
			return d[10].replace('%n', Math.floor(delta/date.WEEK));
		} else if(delta < 2*date.MONTH) {
			return d[11];
		} else {
			return d[12].replace('%n', Math.floor(delta/date.MONTH));
		}
	};


	/**
	* Parses a datetime string into a date object
	*
	* @method parse
	* @param {String} dtstring The datetime string 
	* @return {Date} The date object
	*/
	date.parse = function(dtstring) {

		var ts = Date.parse(dtstring);

		if (isNaN(ts)) {

			var
				y2y4 = function(year) {
					if (year > 69 && year < 100) {
						return Number(year) + 1900;
					} else if (year < 69) {
						return Number(year) + 2000;
					} else {
						return year;
					}
				},
				m = date.getMonth3Names('en'),
				year, month, day, hour, minute, second, delta, e, d
			;

			// 2011-03-08 09:25:15
			if ((e = new RegExp('^([0-9]{2,4})\\-([0-9]{2})\\-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$','gi').exec(s))) {
				year   = y2y4(e[1]);
				month  = e[2];
				day    = e[3];
				hour   = e[4];
				minute = e[5];
				second = e[6];

			// Sat, 30 Oct 10 13:51:32 +0000
			} else if ((e = new RegExp('^([a-z]{3}), ([0-9]{2}) ([a-z]{3}) ([0-9]{2,4}) ([0-9]{2}):([0-9]{2}):([0-9]{2}) ([\\+\\-][0-9]{4})$','gi').exec(s))) {
				year   = y2y4(e[4]);
				month  = $.inArray(e[3], m)+1;
				day    = e[2];
				hour   = e[5];
				minute = e[6];
				second = e[7];
				delta  = e[8]/100;

			// Mon Nov 01 01:49:22 +0000 2010
			} else if ((e = new RegExp('^([a-z]{3}) ([a-z]{3}) ([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2}) ([\\+\\-][0-9]{4}) ([0-9]{2,4})$','gi').exec(s))) {
				year   = y2y4(e[8]);
				month  = $.inArray(e[2], m)+1;
				day    = e[3];
				hour   = e[4];
				minute = e[5];
				second = e[6];
				delta  = e[7]/100;

			// 2012-08-08T12:18:00.000-04:00
			} else if ((e = new RegExp('^([0-9]{2,4})\\-([0-9]{2})\\-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})\\.([0-9]{3})([\\+\\-])([0-9]{2})\\:([0-9]{2})$','gi').exec(s))) {
				year   = y2y4(e[1]);
				month  = e[2];
				day    = e[3];
				hour   = e[4];
				minute = e[5];
				second = e[6];
				delta  = (Number(e[9]) + (Number(e[10])/60)) * ((e[8] == '-') ? -1 : 1);
			}

			d = new Date(year, month-1, day, hour, minute, second, 0);
			return (delta !== undefined) ? new Date(d - ( (d.getTimezoneOffset() + (Number(delta)*60) ) * 60 * 1000)) : d;

		} else {
			return new Date(ts);
		}
	};


	/**
	* Refresh a day dropdown depending of the month-year combination
	*
	* @method refreshSelectDays
	* @param {DOMElement} obj The &lt;select&gt; element
	* @param {Number} month The month 
	* @param {Number} year The year
	*/
	date.refreshSelectDays = function(obj, month, year) {

		// if a title in the dropdown
		var
			dp = (Number(obj.options[0].value)) ? 0 : 1,
			dn = -dp,
			nb = this.getMaxMonth(year)[month-1]
		;

		// if there are less day in the new month
		if (obj.length+dn > nb) {

			// if a impossible day for the new days is selected
			if (obj.selectedIndex+1 > nb+dn) {
				obj.selectedIndex = nb-1+dp;
			}
			obj.length = nb+dp;

		// if there are more days in the new month
		} else if ( obj.length+dn < nb ) {

			var curr = obj.length;
			obj.length = nb+dp;

			// rebuild the new days
			for (var i=curr; i<nb+dp; ++i) {
				obj.options[i].text = i+1+dn;
				obj.options[i].value = i+1+dn;
			}
		}
	};


	/**
	* Make a html table containg the monthly calendar
	*
	* @method makeMonthCalendar
	* @param {Number} year The year
	* @param {Number} month The month 
	* @param {Object} [links] The links by date
	*	@param {Array} links.YYYY-MM-DD The links
	* @return {String} The rendered HTML
	*/
	date.makeMonthCalendar = function(year, month, links) {
		links = links || {};
		--m;

		var
			i,
			weekdays = date.getWeekday3Names(),
			max      = date.getMaxMonth(year)[month],
			firstDay = new Date(year,month,1).getDay(),
			week     = 0,
			today    = date.format('%Y-%M-%D', new Date()),
			html     = '<table data-month="'+date.format('%Y-%M', new Date(year,month,1))+'"><caption>'+date.getMonthNames()[month]+' '+year+'</caption><thead><tr>'
		;

		// weekdays
		for (i in weekdays) {
			html += '<th>'+weekdays[i]+'</th>';
		}

		html += '</thead><tbody><tr>';

		// start padding
		for (i=0; i<firstDay; ++i) {
			html += '<td>&nbsp;</td>';
			++week;
		}

		// days
		for (i=1; i<=max; ++i) {
			if (week == 7) {
				html += '</tr><tr>';
				week = 0;
			}

			var thisDate = date.format('%Y-%M-%D', new Date(year,month,i));
			html += '<td data-date="'+thisDate+'"'+((thisDate == today) ? ' class="Today"' : '')+'>' + ((links[thisDate]) ? '<a href="'+links[thisDate]+'">'+i+'</a>' : '<span>'+i+'</span>') + '</td>';
			++week;
		}

		// end padding
		for (i=week; i<7; ++i) {
			html += '<td>&nbsp;</td>';
		}

		return html+'</tr></tbody></table>';
	};

	return date;

})(window.kafe)});