pipeline {
    agent any


    stages {
        stage('git pull') {
            steps {
                node('VideoChat') {
                    BRANCH_NAME = BRANCH_NAME.substring(9,BRANCH_NAME.length())
                    git branch: env.BRANCH_NAME, url: 'https://github.com/not-only-yours/videoAndChatApp.git'
                    sh 'cd /opt/application/workspace/VideoChat_features_$BRANCH_NAME'
                    sh 'sh /opt/nginx/script.sh $BRANCH_NAME'
                    sh 'docker-compose up -d --force-recreate'
                }
            }
        }
    }
}
