#!/bin/bash

function containers () {
 docker ps --format "{{.ID}}:{{.Image}}" | sed 's/:[^:]*//' | sed 's/\..*//'
}

function branches () {
 git branch -a | grep 'remotes/origin/features/' | rev | sed 's/\/.*//' | rev
}

function getContainerId () {
 echo "$1" | sed 's/\:.*//'
}

for CONTAINER in $(containers); do
        isBranch=false
        for BRANCH in $(branches); do
                if [[ "$CONTAINER" = *"$BRANCH"* ]]; then
                #echo $CONTAINER
                #echo $BRANCH
                $isBranch=true
                fi
        done

        if [ $isBranch == false ]; then
                echo $(getContainerId $CONTAINER)
                docker stop $(getContainerId $CONTAINER)
                docker rm $(getContainerId $CONTAINER)
        fi
done

docker image prune -a -f
