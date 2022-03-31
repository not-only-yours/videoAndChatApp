pipeline {
    agent {
        label '!windows'
    }

    environment {
        def BRANCH_NAME = 'main'
        def inspectExitCode = sh script: "docker ps | grep videochat_app_1 && echo service-exists"
    }


    stages {
        stage('git pull main') {
            steps {
                node('VideoChat') {
                    git branch: BRANCH_NAME, url: 'https://github.com/not-only-yours/videoAndChatApp.git'
                    sh 'cd /opt/application/workspace/VideoChat_$BRANCH_NAME'
                    sh 'docker-compose up -d --force-recreate'
                    echo inspectExitCode
                    if (inspectExitCode == 'service-exists') {
                    sh 'docker stop nginx'
                    sh 'docker rm nginx'
                    } 
                    sh 'docker-compose up -d -f proxy-compose.yaml'
                }
            }
        }
    }
}
