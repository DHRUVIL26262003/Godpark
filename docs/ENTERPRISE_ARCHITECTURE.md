# Whitelines: Federal-Level Enterprise Threat Platform

**Current Status**: Whitelines is currently a high-fidelity frontend simulation of a consumer-grade threat detection dashboard. It visualizes simulated threats but lacks deeper architectural definition.

---

## 🏗️ Layer 1: Enterprise Architecture Enhancement

Based on the federal mandate for enhanced cybersecurity posture (EO 14028), we are upgrading the architecture to a Zero Trust framework with strict segmentation.

### 1. Updated Network Architecture Diagram

```ascii
                                INTERNET (UNTRUSTED)
                                       |
                                [Cloudflare WAF / DDoS Protection]
                                       |
+--------------------------------------v--------------------------------------+
| DMZ (Demilitarized Zone) - Public Facing Services                           |
|                                                                             |
|  +----------------+      +----------------+      +------------------+       |
|  | Load Balancer  | ---> |   Web Server   | ---> |  API Gateway     |       |
|  +----------------+      | (React Front)  |      | (Rate Limiting)  |       |
|           |              +----------------+      +---------+--------+       |
|           |                      |                         |                |
|           v                      v                         v                |
|  +----------------+      +----------------+      +------------------+       |
|  |  Bastion Host  |      |   Honeypot     |      | Auth/IdP Proxy   |       |
|  | (Jump Box)     |      | (Deception)    |      | (MFA Enforced)   |       |
|  +----------------+      +----------------+      +------------------+       |
+--------------------------------------|--------------------------------------+
                                       | (Firewall: Allow Necessary Only)
+--------------------------------------v--------------------------------------+
| APP TIER (Internal Logic) - No Direct Internet Access                       |
|                                                                             |
|  +----------------+      +----------------+      +------------------+       |
|  |  App Server 1  |      |  App Server 2  |      | Threat Analysis  |       |
|  | (Business L.)  |      | (Business L.)  |      | Engine (AI/ML)   |       |
|  +-------+--------+      +-------+--------+      +---------+--------+       |
|          |                       |                         |                |
+----------|-----------------------|-------------------------|----------------+
           | (Firewall: SQL/Data Ports Only)                 |
+----------v-----------------------v-------------------------v----------------+
| DATA TIER (Restricted Subnet) - Highly Secured                              |
|                                                                             |
|  +----------------+      +----------------+      +------------------+       |
|  | Primary DB     |      | Read Replica   |      |  SIEM / Log      |       |
|  | (Encrypted)    |      | (Encrypted)    |      |  Aggregator      |       |
|  +----------------+      +----------------+      +------------------+       |
|                                                                             |
|  +----------------+                                                         |
|  | Domain Ctrl    |                                                         |
|  | (Active Dir)   |                                                         |
|  +----------------+                                                         |
+-----------------------------------------------------------------------------+
```

### 2. Component Justification & Security Rationale

| Component | Security function | Justification (Federal Standard) |
| :--- | :--- | :--- |
| **Cloudflare WAF** | DDoS Mitigation, Bot Protection | First line of defense against volumetric attacks. |
| **DMZ Segmentation** | Network Isolation | Ensures compromise of public web server does not grant direct access to sensitive data (NIST SP 800-207). |
| **Bastion Host** | Secure Administration | Only entry point for SSH/RDP. MFA enforced. Logs all admin sessions. |
| **API Gateway** | Traffic Control | Enforces rate limiting, input validation, and JWT verification before traffic hits app servers. |
| **Honeypot** | Deception Technology | Lures attackers away from real assets and generates high-fidelity alerts. |
| **Active Directory** | Identity Management | Centralized authentication policies (Kerberos/LDAP). Single point of control for user access. |
| **SIEM Aggregator** | Audit & Forensics | Immutable log storage for compliance (CISA Logging Requirements). Centralized visibility. |
| **AI Threat Engine** | Advanced Analytics | Detects anomalies in behavior that static rules might miss (e.g., Insider Threat). |

### 3. Threat Model Overview (STRIDE)

*   **Spoofing**: Mitigated by strict mTLS between services and MFA for all user/admin access.
*   **Tampering**: Immutable logs on the SIEM server; file integrity monitoring (FIM) on web servers.
*   **Repudiation**: Comprehensive audit trails for every API call and database query.
*   **Information Disclosure**: Data encrypted at rest (AES-256) and in transit (TLS 1.3). No PII in logs.
*   **Denial of Service**: WAF at edge; auto-scaling app tier; rate limiting at API Gateway.
*   **Elevation of Privilege**: Role-Based Access Control (RBAC) enforced by Active Directory; minimizing service account capabilities.

### 4. Implementation Steps (To Be Simulated)

1.  **Dashboard Upgrade**: Add "Network Topology" view to visualize the segmented architecture.
2.  **Simulation Data Enhancement**: Update `ThreatSimulationService` to generate logs from specific network segments (e.g., "Blocked connection from DMZ to Data Tier").
3.  **Authentication Hardening**: Simulate AD-style login policies (lockouts, password complexity).
4.  **SIEM Interface**: Build a log aggregation UI to display cross-component events.
