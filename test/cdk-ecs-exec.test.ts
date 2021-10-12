import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as CdkEcsExec from '../lib/cdk-ecs-exec-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new CdkEcsExec.CdkEcsExecStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
