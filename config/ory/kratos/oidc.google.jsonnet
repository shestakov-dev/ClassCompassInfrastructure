local claims = {
  email_verified: false,
} + std.extVar('claims');

{
  identity: {
    traits: {
      [if 'email' in claims && claims.email_verified then 'email' else null]: claims.email,
	  [if 'given_name' in claims then 'firstName' else null]: claims.given_name,
	  [if 'family_name' in claims then 'lastName' else null]: claims.family_name,
	},
	verified_addresses: std.prune([
      // Carry over verified status from Social Sign-In provider.
      if 'email' in claims && claims.email_verified then { via: 'email', value: claims.email },
    ]),
  },
}