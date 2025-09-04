import { NextResponse } from 'next/server';

export async function GET() {
  const securityTxt = `# Security Policy for Rightly

# Contact Information
Contact: mailto:security@rightly.com
Contact: https://rightly.com/security

# Encryption
Encryption: https://rightly.com/security/pgp-key.txt

# Disclosure Policy
Policy: https://rightly.com/security/disclosure-policy
Disclosure: https://rightly.com/security/report-vulnerability

# Acknowledgments
Acknowledgment: https://rightly.com/security/hall-of-fame

# Security Team
Preferred-Languages: en
Canonical: https://rightly.com/.well-known/security.txt

# Policy
Policy: https://rightly.com/security/bug-bounty

# Hiring
Hiring: https://rightly.com/careers

# Expires
Expires: 2025-12-31T23:59:59.000Z

# Additional Information
# For security researchers and bug bounty hunters
# We appreciate your responsible disclosure of security vulnerabilities
# Please report issues to security@rightly.com with detailed information
# We aim to respond within 24 hours and resolve critical issues within 72 hours`;

  return new NextResponse(securityTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
