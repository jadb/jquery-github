/**
 * GitHub jQuery plugin
 *
 * @copyright (c)2005-2010, WDT Media Corp (http://wdtmedia.net)
 * @license http://www.opensource.org/licenses/mit-license.php The MIT License
 * @link http://github.com/jadb/jquery-tab-slider
 * @author jadb
 */
(function($){
	$.fn.github = function(args) {
		// available api calls
		var apis = {
			repo: 'http://github.com/api/v2/json/repos/show/%user%/%repo%',
			repos: 'http://github.com/api/v2/json/repos/show/%user%',
		};
		// structure of data returned for every api call
		var data = {
			repo: [],
			repos: ['description', 'fork', 'forks', 'homepage', 'name', 'open_issues', 'owner', 'url', 'watchers'],
		}
		// options
		var defaults = {
			api: 'repos',
			max: 0,
			repo: null,
			filters: [],
			forks: false,
			tpl: '<li><div><h3><a href="%url%">%name%</a></h3><p>%description%</p><span>Forks: %forks% | Watchers: %watchers% | Homepage: %homepage%</span></div></li>',
			user: null,
		};
		// merge args and defaults
		var opts = $.extend(true, defaults, args);
		// build api's url
		var url = apis[opts.api].replace('%user%', opts.user).replace('%repo%', opts.repo);

		var html = '';
		var container = this;

		$.getJSON(url, 'callback=?', function(response, textStatus) {
			$.each(response.repositories, function(i, repo) {

				// filter forks out
				if (!opts.forks && true === repo.fork) {
					return;
				}

				// regex filter repos by name
				for (var i in opts.filters) {
					if (repo.name.match(opts.filters[i])) {
						return;
					}
				}

				html = html + opts.tpl;
				$.each(data[opts.api], function(i, field) {
					var value = repo[field];
					if (typeof value == 'string') {
						value = value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
					}
					html = html.replace('%' + field + '%', value);
				});
			});
			container.html(html);
		});
	}
})(jQuery);