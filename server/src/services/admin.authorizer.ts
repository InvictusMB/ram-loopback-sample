import {
  AuthorizationContext,
  AuthorizationDecision,
} from '@loopback/authorization';

export async function adminAuthorization(
  authorizationCtx: AuthorizationContext,
): Promise<AuthorizationDecision> {
  const [principal] = authorizationCtx.principals;
  const roles = principal?.roles;
  if (!roles) {
    return AuthorizationDecision.ABSTAIN;
  }
  if (roles.includes('admin')) {
    return AuthorizationDecision.ALLOW;
  }

  return AuthorizationDecision.ABSTAIN;
}
