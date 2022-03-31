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
                    sh 'sudo cp /opt/application/workspace/VideoChat_$BRANCH_NAME/vhost.conf /opt/nginx/vhost.conf'
                    sh 'docker-compose up -d --force-recreate'
                    sh 'docker exec nginx nginx -s reload'
                }
            }
        }
    }
}
