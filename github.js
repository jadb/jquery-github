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
			commits: 'http://github.com/api/v2/json/commits/list/%user%/%repo%/%branch%',
			repo: 'http://github.com/api/v2/json/repos/show/%user%/%repo%',
			repos: 'http://github.com/api/v2/json/repos/show/%user%',
			watched: 'http://github.com/api/v2/json/repos/watched/%user%',
		};
		// structure of data returned for every api call
		var data = {
			commits: ['author', 'authored_date', 'id', 'committed_date', 'committer', 'message', 'parents', 'tree', 'url'],
			repo: [],
			repos: ['description', 'fork', 'forks', 'homepage', 'name', 'open_issues', 'owner', 'url', 'watchers'],
			watched: ['description', 'fork', 'forks', 'homepage', 'name', 'open_issues', 'owner', 'url', 'watchers'],
		}
		// options
		var defaults = {
			api: 'repos',
			branch: 'master',
			max: 0,
			repo: null,
			filters: [],
			footer: '<li class="footer"><a>Show all (%total%)</a></li>',
			forks: false,
			owner: true,
			tpl: '<li><div><h3><a href="%url%">%name%</a></h3><p>%description%</p><span>Forks: %forks% | Watchers: %watchers% | Homepage: %homepage%</span></div></li>',
			user: null,
		};

		// object returned by API
		var obj = 'repositories';
		if ('commits' == args.api) {
			obj = 'commits';
			// overwrite default template when using `commits` API
			defaults.tpl = '<li><a href="mailto:%author_email%">%author_name%</a> on <span>%authored_date%</span>: <p>%message%</p></li>';
		}

		// merge args and defaults
		var opts = $.extend(true, defaults, args);

		var html = '';
		var container = this;

		// filter owned repos from watched ones
		if ('watched' == opts.api) {
			opts.owner = false;
			opts.tpl = (opts.tpl).replace('%name%', '%owner%/%name%');
		} else if ('forked' == opts.api) {
			opts.api = 'repos';
			opts.forks = true;
			opts.owner = false;
		}

		// build api's url
		var url = apis[opts.api].replace('%user%', opts.user).replace('%repo%', opts.repo).replace('%branch%', opts.branch);

		$.ajaxSetup({cache:true});
		$.getJSON(url, 'callback=?', function(response, textStatus) {

			$.each(response[obj], function(i, repo) {
				if ('commits' != opts.api) {
					if (
						// filter forks out
						(!opts.forks && true === repo.fork)
						// filter owned repos from watched ones
						|| (!opts.owner && opts.user === repo.owner && 'watched' == opts.api)
						// filter for only forked repos
						|| (!opts.owner && opts.forks && !repo.fork)
						) {
						return;
					}

					// regex filter repos by name
					for (var i in opts.filters) {
						if (typeof opts.filters[i] == 'string') {
							opts.filters[i] = new RegExp(opts.filters[i]);
						}
						if (repo.name.match(opts.filters[i], "i")) {
							return;
						}
					}
				}

				html = html + opts.tpl;
				$.each(data[opts.api], function(i, field) {
					var value = repo[field];
					if ('commits' == opts.api && ('author' == field || 'committer' == field)) {
						html = html.replace('%' + field + '_name%', value['name']);
						html = html.replace('%' + field + '_email%', value['email']);
					} else {
						if (typeof value == 'string') {
							value = value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
						}
						html = html.replace('%' + field + '%', value);
					}
				});
			});
			container.html(html);

			// only if max limit is set
			if (opts.max > 0) {
				var total = 0;
				// loop through all container's children
				container.children().each(function(i) {
					if (i >= opts.max) {
						// hide the extra
						$(this).hide();
						// update total
						total = i;
					}
				});
				if (total > 0) {
					// add a `show all` link
					container.append((opts.footer).replace('%total%', total));
					// and add an onClick event to show all hidden children
					$(container.selector + ' *.footer').click(function() {
						container.children().each(function(i) {
							$(this).show();
						})
						// hide the `show all` link
						$(this).hide();
					});
					// add href to link
					$(container.selector + ' *.footer a').attr('href', container.selector);
				}
			}
		});
	}
})(jQuery);