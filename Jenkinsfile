#!/usr/bin/env groovy
@Library('pipelineTemplate') _

def exchangeDeploymentParam = new DeploymentParam()
exchangeDeploymentParam.kubernetesNamespace = "wakanda"
exchangeDeploymentParam.kubernetesController = "deployments"

def deploymentParams = new ArrayList<>()
deploymentParams.add(exchangeDeploymentParam)

def stagesToSkip = new StagesToSkip()
stagesToSkip.unitTest = true
stagesToSkip.intTestThenDeploy = true

pipelineTemplate("wakanda-api", stagesToSkip, deploymentParams, "JDK 8")