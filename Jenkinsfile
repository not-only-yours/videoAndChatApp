pipeline {
    agent any
    
    environment {
        def (BRANCH_FOLDER, BRANCH) = env.BRANCH_NAME.split('/')
        
    }

    stages {
        stage('git pull') {
            steps {
                node('VideoChat') {
                    git branch: env.BRANCH_NAME, url: 'https://github.com/not-only-yours/videoAndChatApp.git'
                    sh "cd /opt/application/workspace/VideoChat_features_${BRANCH}"
                    sh "sh /opt/nginx/script.sh ${BRANCH}"
                    sh "docker-compose up -d --force-recreate"
                }
            }
        }
    }
}
