﻿(function () {

	var widget = {

		timerThread: {},

		displayCount: 3,

		schedule: {},

		start: function () {

			fetch("js/schedule.js").then(response => response.text())
				.then(response => {
					widget.schedule = JSON.parse(response, JSON.dateParser).sessions;
					widget.updateSchedule();
					timerThread = window.setInterval(widget.updateSchedule, 30000);
			});

		},

		sessions: [],

		updateSchedule: function () {

			var dt = new Date();
			// for (var item of widget.sessions) {
			// 	if (item.start < dt) {
					widget.sessions = [];
			// 		break;
			// 	}
			// }


			var added = false;
			for (var item of widget.schedule) {

				if (item.start > dt && widget.sessions.length < widget.displayCount) {
					widget.sessions.push(item);
					added = true;
				}

			}
			if (added) {
				widget.updateUI();
			}

		},

		updateUI: function () {
			var next = document.getElementById("widget");
			if (next.children.length > 0) {
				while (next.childNodes.length > 0) {
					next.removeChild(next.lastChild);
				}
			} 

			SetNow();

			//console.log(`Adding items [${widget.sessions.length}]`);
			for (var item of widget.sessions) {

				AddItem(next, item);

			}

			function AddItem(ui, item, showTime = true) {

				var el = document.createElement("p");
				var t = document.createElement("b");
				t.textContent = item.title
				el.appendChild(t);
				var s = document.createElement("span");
				s.textContent = item.speaker

				if (showTime) {
					var u = document.createElement("u");
					u.textContent = moment(item.start).fromNow()
					s.appendChild(u);
				}
				el.appendChild(s);
				ui.appendChild(el);

			}

			function SetNow() {

				var n = document.getElementById("now");
				while (n.childNodes.length > 0) {
					n.removeChild(n.lastChild);
				}

				var dt = new Date();
				for (var item of widget.schedule) {
					if (item.start < dt && moment(item.start).add(25,'m').toDate() >= dt) {
						AddItem(n, item, false);
						return;
					}
				}


			}
		}


	};

	window.widget = widget;

	// JSON date handling
	if (window.JSON && !window.JSON.dateParser) {
		var reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
		var reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;

		JSON.dateParser = function (key, value) {
			if (typeof value === 'string') {
				var a = reISO.exec(value);
				if (a)
					return new Date(value);
				a = reMsAjax.exec(value);
				if (a) {
					var b = a[1].split(/[-+,.]/);
					return new Date(b[0] ? +b[0] : 0 - +b[1]);
				}
			}
			return value;
		};

	}

	widget.start();

})();
