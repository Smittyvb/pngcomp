#!/usr/bin/env bash
# Regenerates list of files to grab from Commons.

curl "https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch=hastemplate%3A%22Convert%20to%20SVG%22%20filemime%3Aimage%2Fpng%20filew%3A%3C1005%20fileh%3A%3C1005&srnamespace=6&srlimit=100&srqiprofile=popular_inclinks" | jq -r ".query.search[].title" | sed "s%^%https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/%" | sed "s/&/%26/g" > commons.urls
curl "https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch=-hastemplate%3A%22Convert%20to%20SVG%22%20filemime%3Aimage%2Fpng%20filew%3A%3C1005%20fileh%3A%3C1005&srnamespace=6&srlimit=100&srqiprofile=popular_inclinks" | jq -r ".query.search[].title" | sed "s%^%https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/%" | sed "s/&/%26/g" >> commons.urls
