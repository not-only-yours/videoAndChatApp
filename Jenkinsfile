pipeline {
    agent any
    
    stages {
        stage('git pull') {
            steps {
                node('VideoChat') {
                    script {
                    env.BRANCH_LOVERCASE = env.BRANCH_NAME.split('/')[1].toLowerCase()
                    }
                    git branch: env.BRANCH_NAME, url: 'https://github.com/not-only-yours/videoAndChatApp.git'
                    sh "cd /opt/application/workspace/VideoChat_features_${BRANCH_LOVERCASE}"
                    sh "sh /opt/nginx/script.sh ${BRANCH_LOVERCASE}"
                    sh 'mkdir -p /etc/letsencrypt/live/current && cp /etc/letsencrypt/live/${BRANCH_LOVERCASE}.nikitasdomain.tk/fullchain.pem /etc/letsencrypt/live/current/'
                    sh 'cp /etc/letsencrypt/live/${BRANCH_LOVERCASE}.nikitasdomain.tk/privkey.pem /etc/letsencrypt/live/current'
                    sh "docker-compose up -d --force-recreate"
                }
            }
        }
    }
}
