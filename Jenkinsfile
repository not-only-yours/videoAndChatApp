pipeline {
    agent any


    stages {
        stage('git pull') {
            steps {
                node('VideoChat') {
                    script {
                    def buff = env.BRANCH_NAME.split('/')
                    def BRANCH = buff[1]
                    echo BRANCH
                    }
                    git branch: env.BRANCH_NAME, url: 'https://github.com/not-only-yours/videoAndChatApp.git'
                    sh "cd /opt/application/workspace/VideoChat_features_${BRANCH}"
                    sh "sh /opt/nginx/script.sh ${BRANCH}"
                    sh "docker-compose up -d --force-recreate"
                }
            }
        }
    }
}
