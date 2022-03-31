pipeline {
    agent any

    environment {
        def BRANCH_NAME = 'main'
    }


    stages {
        stage('git pull main') {
            steps {
                node('VideoChat') {
                    git branch: BRANCH_NAME, url: 'https://github.com/not-only-yours/videoAndChatApp.git'
                    sh 'cd /opt/application/workspace/VideoChat'
                    sh 'docker-compose up -d --force-recreate'
                    sh 'docker exec -it nginx nginx -s reload'
                }
            }
        }
    }
}
