pipeline {
    agent {
        label '!windows'
    }

    environment {
        def BRANCH_NAME = 'thirdFeature'
    }


    stages {
        stage('git pull main') {
            steps {
                node('VideoChat') {
                    git branch: BRANCH_NAME, url: 'https://github.com/not-only-yours/videoAndChatApp.git'
                    sh 'cd /opt/application/workspace/VideoChat'
                    sh 'docker-compose up -d --force-recreate'
                    sh 'docker exec nginx nginx -s reload'
                }
            }
        }
    }
}