#!/bin/bash
ACTION=facedet
CODE=$ACTION.js
IMAGE=glikson/nodejs6opencvaction

cat $CODE | sed 's/\\/\\\\/g' | sed 's/\"/\\\"/g' | tr '\n' '|' | sed 's/|/\\n/g' | echo -n "\"$(cat)\"" | jq "{namespace:\"_\", name:\"$ACTION\", exec:{kind:\"blackbox\", image:\"$IMAGE\", code:., binary:false, main:\"main\"}}" | curl -X PUT -H "Content-Type:application/json" -H Authorization:Basic\ $(wsk property get --auth | awk '{print $3}' | base64 --wrap=0) -d @- https://openwhisk.ng.bluemix.net/api/v1/namespaces/_/actions/$ACTION?overwrite=true

