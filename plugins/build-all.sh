#!/bin/bash

root="$(pwd)";
for dir in */; do
	echo "[$dir] Building...";
	cd "$(pwd)/$dir";
	
	npm run build;

	echo "[$dir] Done";

	cd "$root"
done
