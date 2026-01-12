pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/varshitjain01/REPO.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                bat 'docker build -t sand-backend ./backend'
            }
        }

        stage('Build Frontend Image') {
            steps {
                bat 'docker build -t sand-frontend ./frontend'
            }
        }

        stage('Deploy Containers') {
            steps {
                bat '''
                docker stop sand-backend sand-frontend || exit 0
                docker rm sand-backend sand-frontend || exit 0

                docker run -d -p 5000:5000 --name sand-backend sand-backend
                docker run -d -p 3000:80 --name sand-frontend sand-frontend
                '''
            }
        }
    }

    post {
        success {
            echo 'Deployment successful'
        }
        failure {
            echo 'Deployment failed'
        }
    }
}
