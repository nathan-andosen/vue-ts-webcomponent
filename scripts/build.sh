#!/bin/bash

env NODE_ENV=dev webpack --config ./config/webpack.config.js
env NODE_ENV=production webpack --config ./config/webpack.config.js