pipeline {
    agent any
    
    stages {
        stage('git pull') {
            steps {
                node('VideoChat') {
                    script {
                   env.BRANCH = env.BRANCH_NAME.split('/')[1]
        
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
