(function(w, $) {
    w.O_o = {};

    O_o.lang = {
        alert_close: 'Close',
        confirm_yes: 'Yes',
        confirm_no: 'No',
        prompt_send: 'Send',
        prompt_cancel: 'Cancel',
        month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        short_month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    };

    O_o.domain = function() {
        return window.location.host;
    };

    O_o.url = function(new_url) {
        if (new_url == undefined) {
            return location.href;
        } else {
            location.href = new_url;
        }
    };


    O_o.hash = function(new_hash) {
        if (new_hash == undefined) {
            return location.hash.substr(1);
        } else {
            return location.hash = new_hash;
        }

    };

    O_o.hashParams = function() {
        var attrs = [],
            params = [],
            attrMap = [],
            url = location.hash;
        if (url != '') {
            attrs = (url.substr(1)).split('&'); // разделяем переменные
            for (var i = 0; i < attrs.length; i++) {
                params = attrs[i].split('='); // массив param будет содержать
                attrMap[params[0]] = params[1]; // пары ключ(имя переменной)->значение
            }
        }
        return attrMap;
    };

    O_o.getParams = function (url) {
        var attrs = [],
            params = [],
            attrMap = [],
            url = url == undefined ? location.search : url;
        if (url != '') {
            attrs = (url.substr(1)).split('&'); // разделяем переменные
            for (var i = 0; i < attrs.length; i++) {
                params = attrs[i].split('='); // массив param будет содержать
                attrMap[params[0]] = params[1]; // пары ключ(имя переменной)->значение
                if (params[0].match(/\[.+\]/)) {
                    property = params[0].replace(/\[.+\]/, '');
                    key_id = params[0].replace(/\w+\[(.+)\]/, "$1");
                    val = params[1];
                    if (attrMap[property] === undefined) {
                        attrMap[property] = [];
                    }
                    attrMap[property][key_id] = val;
                }
            }
        }
        return attrMap;
    };

    O_o.getParam = function (key_name, url) {
        var params = O_o.getParams(url);
        if (typeof params[key_name] == 'function')
            params[key_name] = undefined

        if (params[key_name] != undefined)
            return params[key_name];
        return false;
    };

    O_o.scrollTop = function(set_position) {
        if (set_position == undefined)
            set_position = 0;
            $("html:not(:animated),body:not(:animated)").animate({
                scrollTop: set_position
            }, 1000);
        };

        O_o.scrollBottom = function() {
        var document_height = $(document).height();
        O_o.scrollTop(document_height);
    };

    O_o.scrollElement = function(selector) {
        var positions = $(selector).offset();
        $("html:not(:animated),body:not(:animated)").animate({
            scrollTop: positions.top,
            scrollLeft: positions.left
        }, 1000);
    };

    O_o.unserialize = function(form, data) {
        var form = $(form);
        for (var i in data) {
            $(form).find('[name=' + i + ']').val(data[i]);
        }
    };

    O_o.parseJson = function(data) {
        if (typeof data === 'object') {
            return data;
        }
        return (new Function("return " + data))();
    };

    O_o.stringJson = function(data) {
        if (data instanceof Object) {
            var sOutput = "";
            if (data.constructor === Array) {
                for (var nId = 0; nId < data.length; sOutput += this.stringify(data[nId]) + ",", nId++);
                return "[" + sOutput.substr(0, sOutput.length - 1) + "]";
            }
            if (data.toString !== Object.prototype.toString) {
                return "\"" + data.toString().replace(/"/g, "\\$&") + "\"";
            }
            for (var sProp in data) {
                sOutput += "\"" + sProp.replace(/"/g, "\\$&") + "\":" + this.stringify(data[sProp]) + ",";
            }
            return "{" + sOutput.substr(0, sOutput.length - 1) + "}";
        }
        return typeof data === "string" ? "\"" + data.replace(/"/g, "\\$&") + "\"" : String(data);
    };

    O_o.isset = function(object, search_value) {
        return (object.indexOf(search_value) > -1);
    };

    O_o.alert = function(message_text, result) {
        if (result == undefined)
            result = 'success';
        $('body').prepend(
            '<div class="O_o-disable_window"><div class="alert">\
				<button class="close close_alert" type="button">×</button>\
				<div class="O_o-alert_message">' + message_text + '</div>\
				<div class="buttons">\
					<a class="btn btn-' + result + ' close_alert">' + O_o.lang.alert_close + '</a>\
				</div>\
			</div></div>');

        $('.close_alert').click(function() {
            $('.O_o-disable_window').remove();
        });
    };

    O_o.confirm = function(message_text, positive, negative) {
        $('body').prepend(
            '<div class="O_o-disable_window"><div class="alert">\
				<button class="close close_alert" type="button">×</button>\
				<div class="O_o-alert_message">' + message_text + '</div>\
				<div class="buttons">\
					<a id="O_O-confirm-ok" class="btn btn-success close_alert">' + O_o.lang.confirm_yes + '</a>\
					<a id="O_O-confirm-not-ok" class="btn btn-inverse close_alert">' + O_o.lang.confirm_no + '</a>\
				</div>\
			</div></div>');

        if (positive != undefined) {
            $('#O_O-confirm-ok').click(function() {
                positive();
            });
        }

        if (negative != undefined) {
            $('#O_O-confirm-not-ok').click(function() {
                negative();
            });
        }

        $('.close_alert').click(function() {
            $('.O_o-disable_window').remove();
        });
    };

    O_o.prompt = function(message_text, form_action, prompt_area, callback) {
        $('body').prepend(
            '<div class="O_o-disable_window"><div class="alert">\
				<form class="prompt_form" action="' + form_action + '" method="post">' +
            '<button class="close close_alert" type="button">×</button>' +
            message_text +
            '<textarea class="prompt_area" name="' + prompt_area + '"></textarea>' +
            '<div class="buttons">' +
            '<input type="submit" value="' + O_o.lang.prompt_send + '" class="btn btn-success"> ' +
            '<input type="reset" value="' + O_o.lang.prompt_cancel + '" class="btn btn-inverse close_alert"> ' +
            '</div>' +
            '</form></div></div>');

        if (callback != undefined) {
            $('.prompt_form').submit(function() {
                $('.close_alert').click();
                return callback($(this));
            });
        }

        $('.close_alert').click(function() {
            $('.O_o-disable_window').remove();
        });
    };

    O_o.date = function(date, format) {
        if (typeof date === 'object') {
            var s = O_o.zerofill(date.getSeconds()),
                i = date.getMinutes(),
                h = O_o.zerofill(date.getHours()),
                d = O_o.zerofill(date.getDate()),
                m = O_o.zerofill(date.getMonth() + 1),
                y = date.getFullYear();

            date = y + '-' + m + '-' + d + ' ' + h + ':' + i + ':' + s;
        }

        if (!date.match(/\d{4}-\d{2}-\d{2}/) && !date.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/))
            return date;

        var dater = {};
        spliter = date.split(' '),
        date_split = spliter[0].split('-');

        // Day
        dater.d = date_split[2];
        dater.j = parseInt(dater.d);

        // Month
        dater.m = date_split[1];
        dater.n = parseInt(dater.m);
        dater.F = O_o.lang.month[O_o._month_id(dater.n)];
        dater.M = O_o.lang.short_month[O_o._month_id(dater.n)];

        // Year
        dater.Y = date_split[0];
        dater.y = dater.Y.substr(2);

        if (spliter.length > 1) {
            time_split = spliter[1].split(':');

            // Hour
            dater.H = time_split[0];
            dater.G = parseInt(dater.H);
            dater.g = (dater.G < 12) ? dater.G : dater.G - 12;
            dater.h = O_o.zerofill(dater.g);

            // Part of Day
            dater.a = (dater.h > 12) ? 'pm' : 'am';
            dater.A = (dater.h > 12) ? 'PM' : 'AM';

            // Minutes
            dater.i = time_split[1];

            // Seconds
            dater.s = time_split[2];

        }

        for (var i in dater) {
            format = format.replace('$' + i, dater[i]);
        }

        return format;

    };

    O_o._month_id = function(month_id) {
        return month_id - 1;
    };

    O_o.template = function(class_clone, holder_element, data) {

        var clone = $('.' + class_clone).clone(true);
        clone.show().removeClass(class_clone);

        O_o._template_insert(clone, data);

        $(holder_element).append(clone);
    };

    O_o._template_insert = function(clone, data, pre) {

        if (pre === undefined) {
            pre = '';
        }

        for (var ins in data) {
            if (data[ins] instanceof Object) {
                O_o._template_insert(clone, data[ins], pre + ins + '.');
            } else {
                clone.html(clone.html().replace('${' + pre + ins + '}', data[ins]));
            }
        }
    };

    O_o.linkInsert = function(some_text) {
        return some_text.replace(/((https?:\/\/)|(www\.))[^\s]*/g,
            function(link) {
                return '<a href="' + link + '" target="_blank">' + link + '</a>';
            }
        );
    };

    O_o.zerofill = function(num, length) {
        if (length == undefined)
            length = 2;

        length -= num.toString().length;
        if (length > 0) {
            return new Array(length + (/\./.test(num) ? 2 : 1)).join('0') + num;
        }
        return num + "";
    };

    O_o.keyCode = function(e) {
        return e.keyCode ? e.keyCode : e.which;
    };

    O_o.capsLock = function() {
        return {
            enabled: null,
            getChar: function(event) {
                if (event.which == null) {
                    if (event.keyCode < 32) return null;
                    return String.fromCharCode(event.keyCode);
                }

                if (event.which != 0 && event.charCode != 0) {
                    if (event.which < 32) return null;
                    return String.fromCharCode(event.which);
                }

                return null;
            },
            toggleLabel: function(elem) {
                label = $(elem).parent().children('.check_caps');
                if (this.enabled)
                    label.fadeIn('fast');
                else
                    label.fadeOut('fast');
            }
        };
    };

})(window, jQuery);
