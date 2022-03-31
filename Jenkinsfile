pipeline {
    agent {
        label '!windows'
    }

    environment {
        def BRANCH_NAME = 'main'
    }


    stages {
        stage('git pull main') {
            steps {
                node('VideoChat') {
                    git branch: BRANCH_NAME, url: 'https://github.com/not-only-yours/videoAndChatApp.git'
                    sh 'cd /opt/application/workspace/VideoChat_$BRANCH'
                    sh 'docker-compose up -d --force-recreate'
                    sh 'docker stop nginx'
                    sh 'docker rm nginx'
                    sh 'docker-compose up -d -e BRANCH=$BRANCH -f proxy-compose.yaml'
                }
            }
        }
    }
}
