pipeline {
    agent any

    tools {
        nodejs 'Node.js 18.x'
    }

    environment {
        GIT_REPO = 'https://github.com/realtimeOnline/PwBookStoreApi.git'
        GIT_CREDS = credentials('git-credentials')
    }

    stages {
        stage('Checkout') {
            steps {
                git(
                    url: env.GIT_REPO,
                    branch: 'main',
                    credentialsId: 'git-credentials'
                )
            }
        }

        stage('Install Dependencies') {
            steps {
                powershell '''
                    npm install
                    npx playwright install --with-deps
                '''
            }
        }

        stage('Run Tests') {
            steps {
                powershell 'npm run test'
            }
        }

        stage('Generate Allure Report') {
            steps {
                powershell 'npm run report'
            }
        }
    }

    post {
        always {
            allure([
                includeProperties: false,
                jdk: '',
                properties: [],
                reportBuildPolicy: 'ALWAYS',
                results: [[path: 'allure-results']]
            ])
        }
        success {
            echo 'Tests completed successfully!'
        }
        failure {
            echo 'Tests failed! Check the logs for details.'
        }
    }
}
