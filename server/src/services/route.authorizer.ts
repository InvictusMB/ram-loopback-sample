import {
  AuthorizationContext,
  AuthorizationMetadata,
  AuthorizationDecision,
} from '@loopback/authorization';

export async function routeAuthorization(
  authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata,
): Promise<AuthorizationDecision> {
  const [principal] = authorizationCtx.principals;
  if (principal.id === authorizationCtx.invocationContext.args[0]) {
    return AuthorizationDecision.ABSTAIN;
  }

  return AuthorizationDecision.DENY;
}
