#!groovy
pipeline {
    agent any
        environment {
        IMAGE_VERSION = "${env.BUILD_NUMBER}"
        LAST_CLOUD_RUN_REVISION = "test-${currentBuild.previousBuild.getNumber()}"
        IMAGE_NAME = "gcr.io/tripleearplatform/test:${IMAGE_VERSION}"
        PREVIOUS_IMAGE_NAME = "gcr.io/tripleearplatform/test:${currentBuild.previousBuild.getNumber()}"
    }
    stages{
       stage("Build new docker image"){
            steps{
                sh "docker build --tag=${IMAGE_NAME} . --file=Dockerfile"
            }
        }
