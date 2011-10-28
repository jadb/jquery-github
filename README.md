# jQuery GitHub ![Project status](http://stillmaintained.com/jadb/jquery-github.png)

Allows you to painlessly work with [GitHub][1]'s [API][2]

The [Badges][3] and [Example][4] pages are pulled every hour.

## Requirements

* jQuery 1.3.2 (or above)

## Installation

Copy/paste the following in the `<head>` part of your HTML:

	<script src="/path/to/github/github.js" type="text/javascript"></script>
   <script type="text/javascript" charset="utf-8">
      $(document).ready(function() {
         $('ol#list-id').github({user:'defunkt'});
      });
   </script>

## Configuration

None implemented yet. Still in pre-alpha.

## Patches & Features

* Fork
* Mod, fix
* Test - this is important, so it's not unintentionally broken
* Commit - do not mess with license, todo, version, etc. (if you do change any, bump them into commits of their own that I can ignore when I pull)
* Pull request - bonus point for topic branches

## Bugs & Feedback

http://github.com/jadb/jquery-github

[1]: http://github.com
[2]: http://develop.github.com
[3]: http://demo.loudbaking.com/jquery-github/badges.html
[4]: http://demo.loudbaking.com/jquery-github/example.html