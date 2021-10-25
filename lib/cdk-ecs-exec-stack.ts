import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';

export class CdkEcsExecStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    
    const vpc = ec2.Vpc.fromLookup(this, "VPC", {
      isDefault: true,
    });
    
    const kmsKey = new kms.Key(this, 'KmsKey');
    
    const logGroup = new logs.LogGroup(this, 'LogGroup', {
      encryptionKey: kmsKey,
    });
    
    const execBucket = new s3.Bucket(this, 'EcsExecBucket', {
      encryptionKey: kmsKey,
    });
    
    const cluster = new ecs.Cluster(this, 'FargateCluster', {
      vpc,
      executeCommandConfiguration: {
        kmsKey,
        logConfiguration: {
          cloudWatchLogGroup: logGroup,
          cloudWatchEncryptionEnabled: true,
          s3Bucket: execBucket,
          s3EncryptionEnabled: true,
          s3KeyPrefix: 'exec-output',
        },
        logging: ecs.ExecuteCommandLogging.OVERRIDE,
      },
    });
    
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      memoryLimitMiB: 1024,
      cpu: 512,
    });
    
    const linuxParameters = new ecs.LinuxParameters(this, "LinuxParameters", {
      initProcessEnabled: true,
    });
    
    taskDefinition.addContainer('cdk666777888999111', {
      image: ecs.ContainerImage.fromRegistry('contino/aws-cdk'),
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'EventDemo666777888999111' }),
      command: ['bash', '-c', 'echo hello; sleep 86400; echo bye'],
      linuxParameters,
      essential: true
    });
    
    new ecs.FargateService(this, 'FargateService', {
      cluster,
      taskDefinition,
      enableExecuteCommand: true
    });
    
  }
}
