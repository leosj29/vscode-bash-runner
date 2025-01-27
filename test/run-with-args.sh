#!/bin/bash

count=0
mkdir -p out
for arg in "$@"; do
    echo "$count-$arg"
    ((count++))
done >out/run-with-args.txt
