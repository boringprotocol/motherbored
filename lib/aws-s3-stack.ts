// /lib/aws-s3-stack.ts
import * as iam from "aws-cdk-lib/aws-iam";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

interface AwsS3StackProps extends cdk.StackProps {
  bucketName: string;
  region: string;
}

export class AwsS3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AwsS3StackProps) {
    super(scope, id, props);

    const bucket = s3.Bucket.fromBucketName(this, "Bucket", props.bucketName);

    bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal("lambda.amazonaws.com")],
        actions: ["s3:GetObject"],
        resources: [`${bucket.bucketArn}/*`],
      })
    );

    bucket.policy?.document.addStatements(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal("lambda.amazonaws.com")],
        actions: ["s3:GetBucketTagging"],
        resources: [bucket.bucketArn],
      })
    );
  }
}
