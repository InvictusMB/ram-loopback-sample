// Based on loopback4-example-shopping

import {
  AuthorizationContext,
  AuthorizationMetadata,
  AuthorizationDecision,
} from '@loopback/authorization';

export async function basicAuthorization(
  authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata,
): Promise<AuthorizationDecision> {
  const [principal] = authorizationCtx.principals;
  const roles: string[] = principal?.roles;

  if (!roles) {
    return AuthorizationDecision.DENY;
  }

  const allowedRoles = metadata.allowedRoles;
  if (!allowedRoles) {
    return AuthorizationDecision.ALLOW;
  }

  const roleIsAllowed = roles.some(role => allowedRoles.includes(role));
  if (!roleIsAllowed) {
    return AuthorizationDecision.DENY;
  }

  // Allow access only to model owners
  if (principal.id === authorizationCtx.invocationContext.args[0]) {
    return AuthorizationDecision.ALLOW;
  }

  return AuthorizationDecision.DENY;
}
