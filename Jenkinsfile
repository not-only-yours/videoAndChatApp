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
                    sh 'cd /opt/application/workspace/VideoChat_$BRANCH_NAME'
                    sh 'docker-compose up -d --force-recreate'
                    sh 'docker ps | grep nginx && docker stop nginx && docker rm nginx'
                    sh 'docker-compose up -d -f proxy-compose.yaml'
                }
            }
        }
    }
}
