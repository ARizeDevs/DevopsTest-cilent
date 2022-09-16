#!groovy
pipeline {
    agent any
        environment {
        IMAGE_VERSION = "${env.BUILD_NUMBER}"
        LAST_CLOUD_RUN_REVISION = "DevopsTest-cilent-${currentBuild.previousBuild.getNumber()}"
        IMAGE_NAME = "gcr.io/tripleearplatform/DevopsTest-cilent:${IMAGE_VERSION}"
        PREVIOUS_IMAGE_NAME = "gcr.io/tripleearplatform/DevopsTest-cilent:${currentBuild.previousBuild.getNumber()}"
    }
    stages{
       stage("Build new docker image"){
            steps{
                sh "docker build --tag=${IMAGE_NAME} . --file=Dockerfile"
            }
        }
          stage("Push to Google Container Registry"){
            steps{
                sh "docker push ${IMAGE_NAME}"
            }
        }
    }
      
}
