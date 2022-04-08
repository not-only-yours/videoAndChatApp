#!/bin/bash

cd /opt/application/workspace/VideoChat_features_firstFeature

function containers () {
 docker ps --format "{{.ID}}:{{.Image}}" | sed 's/:[^:]*//' | sed 's/\..*//'
}

function branches () {
 git branch -a | grep 'remotes/origin/features/' | rev | sed 's/\/.*//' | rev
}

function getContainerId () {
 echo "$1" | sed 's/\:.*//'
}

function getProxyConfigFileName () {
 echo "$1" | cut -d ":" -f2 | tr '[:upper:]' '[:lower:]'
}

for CONTAINER in $(containers); do
        isBranch=false
        for BRANCH in $(branches); do
                if [[ "$CONTAINER" = *"$BRANCH"* ]]; then
                echo "equals: $CONTAINER $BRANCH"
                isBranch=true
                fi
        done

        if [ $isBranch == false ] && [[ $CONTAINER = *"nginx"* ]]; then
                echo $(getContainerId $CONTAINER)
                docker stop $(getContainerId $CONTAINER)
                docker rm $(getContainerId $CONTAINER)
                rm -f /opt/nginx/certificates/$(getProxyConfigFileName $CONTAINER).conf
        fi
done

docker image prune -a -f

docker container restart nginx

