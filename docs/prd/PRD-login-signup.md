# Login and Signup PRD

**Sunny Diamonds | Version 1.0 | 3 October 2026**

**Status:** Ready for review as an implementation baseline. Production readiness remains unverified.

**Audience:** Product, storefront engineering, Magento engineering, QA and operations.

**Product owner:** Open Question Q-01: no owner supplied.

**Decision record:** The user requested documentation of the implemented login/signup flow and a status check against `sunnydiamond-store`. This PRD records current behavior; proposals below require a separate decision. No product changes were requested or made.

## 1. Executive Summary

Sunny Diamonds implements a shared passwordless login and signup journey. Customers enter a mobile number or email address, verify a six-digit code, and either sign in to an existing account or provide details to create one. Google and Apple paths are implemented behind configuration. The web application handles presentation and session cookies; Magento's CustomerAuth module verifies identity, creates accounts and issues customer tokens.

The two local repositories contain both sides of the OTP contract. Operational readiness is incomplete in the store repository's go-live checklist: Google remains marked Testing, Apple credentials are missing, and international SMS needs provider approval and handset validation. These are recorded checklist states, not fresh environment checks. The most consequential implemented business rule is that proving an unverified email through login claims its existing account and retires earlier credentials, including verified-phone login. This needs explicit product/support review before release certification. [E1-E6]

## 2. Problem Statement

Customers need to enter or recover their shopping account while preserving their shopping context. New customers need an account without choosing a password. Existing customers need access through a proven identifier, with clear recovery when delivery, verification or account creation fails.

These jobs are inferred from the implementation. No interviews, support volumes, funnel analytics or conversion baseline were supplied. The documentation problem is established: the implemented flow spans two repositories, while code availability, environment configuration and release status require separate evidence.

### Evidence and repository status

| Source | Finding | Evidence limit |
| --- | --- | --- |
| sunnydiamond-web, HEAD d990f25b, 2 Oct 2026, "Form Fixes" | Working tree reported clean before this document was added. OTP UI, API adapters and session handling present. | Local checkout only; no remote fetch or deployed commit check. |
| sunnydiamond-store, HEAD 5a23f48, 1 Oct 2026 | Commit describes email claim releasing verified phone, 10-minute email codes and atomic OTP attempts. CustomerAuth resolvers and schema present. | Existing Makefile modification was present and left untouched. |
| Store go-live checklist, customer auth section [E6] | SMS reported working on dev; production setup and provider gates remain listed. | Checklist statements were not reproduced against live services. |
| Verification performed for this PRD | Read relevant UI, API, resolver, configuration, lifecycle and release-document sources. | No application build, browser test, API call, SMS/email send or production check performed. |

Git status completed with warnings that the global ignore file was inaccessible. The status statements above describe the reported output under that limitation.

### Intended change

Create a traceable reference for the existing product and its outstanding release decisions. Acceptance criteria in Section 7 describe the implemented baseline unless marked **Proposal**. They are planned verification, not evidence of passed tests.

## 3. Target Users and Personas

| User | Job | Relevant constraint |
| --- | --- | --- |
| Returning customer | Resume shopping in an existing account | Must prove an email address or verified phone, or use an enabled social provider. |
| New customer | Create an account and continue shopping | OTP signup requires name, email and the displayed terms checkbox. |
| International customer | Sign in from a supported country | SMS depends on the country allowlist and delivery provider; email may be available. |
| Customer completing verification in Profile | Add a proven phone or verify the account email | Signed-in verification has different credential effects from an email ownership claim at login. |
| Support and operations | Diagnose failed access and account claims | Need masked logs, configuration visibility and an approved ownership policy. |

## 4. Strategic Context

The implemented product supports access without password entry and continuity between guest and signed-in shopping. Its commercial effect has not been measured in the supplied evidence. No business target, delivery deadline or launch owner was provided.

The immediate value of this PRD is a common acceptance baseline for the web and store teams. Release decisions must account for provider activation, account ownership and configuration propagation. Success measures are proposed in Section 6; no conversion uplift is claimed.

## 5. Solution Overview

### Implemented scope and status

| Capability | Web status | Store status / operational limitation |
| --- | --- | --- |
| Email OTP login/signup | Shared flow and request/verify adapters present | Resolver, delivery, email verification state and 600-second default TTL present. Live delivery unverified. |
| Mobile OTP login/signup | Country selection, validation and OTP screens present | Verified phone ownership, MSG91 delivery and 120-second default TTL present. Checklist reports dev success. |
| Google | Credential exchange and conditional button present | Provider verification and provisioning present. Checklist says consent screen Testing. |
| Apple | Conditional flow; modal transfers to standalone login | Resolver and verifier present. Checklist says credentials missing. |
| International SMS | Country restrictions and email fallback present | Additional-country allowlist defaults empty; provider approval and real handset test outstanding. |
| Profile verification | Phone-link and email-verification service calls present | Corresponding authenticated resolvers present; full Profile UI outside this focused review. |
| Session/logout and shopping continuity | Cookie, logout and post-login synchronization present | Magento customer token issued/revoked; runtime behavior unverified. |

### User journeys

| Journey | Trigger and action | Response and next state | Completion / recovery |
| --- | --- | --- | --- |
| J-01 Existing customer | Open login page/modal, enter identifier, request code, enter six digits | Known verified phone or existing email resolves to an account after proof | Session established; shopping synchronization attempted; return navigation. |
| J-02 New email account | Verify an unknown email | Enter Details opens with verified email read-only | Submit valid name and terms; account created with verified email. Default destination is /profile. |
| J-03 New phone account | Verify an unknown phone | Enter Details requests name and email | Unique email accepted; phone verified, email initially unverified. Existing email is rejected. |
| J-04 Social | Choose an enabled/configured provider | Provider identity is checked; existing account found or new account provisioned | Complete sign-in; new account defaults to /profile. Provider errors remain in sign-in flow. |
| J-05 Recovery | Invalid code, expired code, delivery failure or changed identifier | Error shown; edit/back returns to identifier; resend respects cooldown | Request a new code when allowed. Returning to identifier clears OTP target and proof state. |
| J-06 Email ownership claim | Prove an existing, previously unverified email through OTP/social login | Email becomes verified; prior tokens/password and verified phone credential are retired | New session issued. Phone can be verified again in Profile. Requires support/product review Q-02. |
| J-07 Logout | Signed-in customer logs out | Backend revocation attempted; browser cookie cleared even if revocation fails | Browser session ends; remote revocation failure requires operational handling. |

The shared state sequence is **Sign In -> Enter Code -> existing account: complete / new account: Enter Details -> complete**. A sent OTP is required to reach Enter Code; accepted proof is required to reach Enter Details. `/sign-up` redirects to `/login`, preserving the sanitized return URL. Closing/resetting the flow removes its transient state. [E1, E7]

Standalone completion uses history replacement; modal completion uses navigation that retains the originating page in history. A default returning login goes to `/`; a default new signup goes to `/profile`; an explicit accepted return path wins. The current sanitizer requires an initial slash and rejects `//`; broader redirect edge cases still need QA. [E7]

### Screens and design evidence

The inspected implementation defines Sign In, Enter Code and Enter Details in `LoginModalContent`, `LoginOtpContent`, `LoginCreateAccountContent` and the shared flow hook. These support FR-01 through FR-05. No Figma file or screenshot was supplied, and these screens were not visually inspected in a browser. Visual fidelity, responsive layout and assistive-technology behavior remain unverified.

### Business rules

- Only proven phone ownership is eligible for SMS sign-in. A typed contact number alone does not confer access. [E2]
- Email signup proves its email. Phone signup collects an initially unverified email and refuses an email already in use. [E2]
- Email login can claim an existing unverified email account. The resolver's opening comment still says this case is refused, but executable code allows it. This PRD follows the executable path and records the conflict. [E2, E3]
- Default OTP values are SMS 120 seconds, email 600 seconds, resend 60 seconds and five failed attempts. A verified registration code has a 600-second registration grace window. Runtime overrides were not inspected. [E4]
- All login methods default disabled in module configuration. UI availability depends on store flags; social buttons also require frontend configuration. Flag-fetch failure defaults closed; a legacy-field query fallback is present. [E4, E8]
- Terms acceptance gates the signup UI. No terms acceptance value or marketing preference is sent in the OTP registration request. The helper accepts a `marketingOptIn` argument but does not use it. Consent persistence and social-signup parity are open decisions Q-03. [E1, E9]

## 6. Success Metrics

All metrics below are **Proposals**. Baselines, targets and accountable owners are unknown (Q-04).

| Metric | Definition and window | Proposed source | Target / owner |
| --- | --- | --- | --- |
| Primary: authentication completion | Journeys obtaining a usable session within 15 minutes / journeys starting sign-in; report weekly by channel | Correlated start and session-established events | Open Q-04 |
| Signup completion | New-user detail steps producing a usable session within 15 minutes / new-user detail steps opened; weekly | Registration-required and completion events | Open Q-04 |
| Delivery-request failure | Failed delivery requests / all delivery requests; daily by channel and country | Backend/provider outcomes; acceptance does not prove receipt | Open Q-04 |
| Verification failure guardrail | Failed verification attempts / all verification attempts; daily, distinguish expiry and lockout | Masked backend outcome counters | Open Q-04 |
| Continuity guardrail | Failed cart/wishlist/address sync tasks / attempted tasks; daily | Post-login sync outcomes | Open Q-04 |

Instrumentation should use a short-lived journey identifier and channel/outcome fields. Do not collect OTPs, customer tokens or raw identifiers in analytics. Existing logs include OTP login, social login and ownership claims, but a complete funnel and dashboards were not established by this review. The 15-minute attribution window is a measurement proposal, independent of OTP expiry.

## 7. User Stories and Requirements

### Epic hypothesis

Providing access through a proven email, mobile number or enabled social provider should let customers resume shopping and let new users create an account with fewer credential-management steps. Validate this hypothesis through authentication and signup completion after instrumentation and targets are agreed.

### US-01: Start and receive a code

As a customer, I want to request a code for my identifier so I can prove access.

- **FR-01 Entry and configuration:** Use the shared flow from modal or standalone login. Given `/sign-up`, when opened, redirect to `/login` with the accepted return path. Given all methods unavailable, show the unavailable state. Disabled channels must be rejected by the backend as well as gated in the UI. [E1, E7, E8]
- **FR-02 Validation and delivery:** Require valid email or a country-appropriate phone. Given invalid input, Continue shows an error without sending a code. Given successful delivery request, store the exact target and returned channel/destination; open Enter Code. Given an unsupported SMS country, prevent submission. An international SMS send failure offers email fallback when enabled. [E1, E4, E9]

### US-02: Verify and recover

As a customer, I want to verify, resend or correct a code so I can recover from entry and delivery failures.

- **FR-03 OTP verification:** Require six digits in the UI. Given a valid existing identifier and accepted code, establish a customer session; given a new identifier, open Enter Details without claiming login success. Invalid/expired/locked codes show a recoverable error. [E1, E2, E4]
- **FR-04 Resend and replay:** Disable resend while the server-provided cooldown remains. Invalid entry does not bypass it. Given resend success, clear code inputs and restart the returned timer. Given Edit/Back, clear the target and verification state. A consumed code must not be accepted as fresh proof; pending-registration reuse is restricted to completion. Concurrent and boundary cases require execution in QA. [E1, E4]

### US-03: Complete signup

As a new customer, I want to submit account details once my identifier is proven so I can continue shopping.

- **FR-05 Details:** Require a trimmed full name of 2-80 characters, valid email and accepted terms in the UI. Names permit Unicode letters, spaces, apostrophes, periods and hyphens. Email is read-only after email OTP; phone signup requires editable email. Missing/invalid fields prevent submission and receive field errors. [E1, E9]
- **FR-06 Provisioning:** Resubmit the verified code with details. Email signup creates a verified-email account; phone signup creates a verified-phone account with unverified email. Given a duplicate account email on phone signup, display the backend conflict without linking that phone to the existing account. Given failed final session creation, show failure rather than navigate as signed in. Expired registration proof requires a fresh code. [E2, E4, E9]
- **FR-07 Consent gap:** Current acceptance is a client UI condition only. **Proposal:** decide whether a versioned terms record is required and how social signup obtains it. Any marketing choice must be separately defined before persistence is added. This is not implemented acceptance coverage. [E9; Q-03]

### US-04: Use social identity or establish email ownership

As a customer, I want an enabled identity provider or email proof to give me access to the corresponding account.

- **FR-08 Social:** Show a provider only when enabled and configured. Given an accepted provider identity, find/create the email account and issue a session. Given provider rejection, remain in a recoverable sign-in state. Apple started in a modal transfers to the standalone provider flow. Real provider success remains unverified. [E1, E5]
- **FR-09 Ownership claim:** Given an existing unverified email, successful email OTP/social proof marks it verified and retires the earlier password, sessions and verified-phone sign-in before the new login completes. The contact phone remains available for later verification. Given signed-in Profile email verification, confirm email without retiring those credentials. This is implemented behavior, not newly approved policy. [E2, E3, E5; Q-02]

### US-05: Resume shopping and end the session

As a customer, I want shopping context to survive sign-in and logout to end browser access.

- **FR-10 Continuity:** After session creation, attempt guest cart merge, guest wishlist upload and address synchronization. A rejected task must not reject authentication. Wishlist storage is cleared only after successful upload. The caller awaits all tasks but does not surface their failure booleans; a visible retry mechanism is not established. [E10; Q-05]
- **FR-11 Session and navigation:** Store the customer token in an HttpOnly, SameSite=Lax cookie, Secure in production, with seven-day browser lifetime. Actual Magento token lifetime must match. Apply the documented return-path behavior and reset standalone auth state on restored browser history. [E7, E11]
- **FR-12 Logout:** Attempt token revocation and always clear the cookie. Given revocation failure, browser logout still completes; server-side token invalidation must not be assumed. [E11]

### Cross-cutting requirements and planned acceptance

| ID | Area | Baseline or proposal | Acceptance condition |
| --- | --- | --- | --- |
| NFR-01 | Abuse controls | Server-side TTL, cooldown, attempts and rate caps implemented | Expired/replayed codes fail; sixth wrong attempt cannot authenticate; configured limits hold under parallel requests. |
| NFR-02 | Privacy | Hashed OTP storage and masked auth logs present | Inspect controlled test logs/storage for absence of plaintext codes/tokens; production test sender disabled. |
| NFR-03 | Accessibility | Proposal: verify keyboard and assistive-technology operation | All steps, errors, dialog focus and close controls usable without pointer; errors associated with fields. |
| NFR-04 | Reliability | Separate creation, OTP consumption, token issuance and synchronization stages | Simulated failure at each stage yields recoverable outcome without duplicate accounts or false success. |
| NFR-05 | Performance | Proposal: measure request, verify and post-login navigation latency | Record p50/p95 by channel; agree thresholds before certification. No latency target supplied. |
| NFR-06 | Redirect safety | Current slash-based filter implemented; full adversarial coverage missing | External/protocol-relative, backslash and encoded redirect inputs cannot escape approved origin. |

### Failure and recovery behavior

| Failure | Current outcome | Recovery / unresolved point |
| --- | --- | --- |
| Delivery rejected | Identifier screen remains with error | Retry; international SMS can offer email. |
| Wrong or expired code | OTP error; no successful session | Correct code or resend after cooldown. |
| Details submitted after grace expires | Form-level failure | Return to identifier and request fresh proof. |
| Account created but token fails | Authentication can fail after account persistence | Fresh login may recover; fault-injection validation required. Creation plus login is not promised atomic. |
| Sync task rejected | Authentication continues after tasks settle | Failure values are not exposed by the auth hook; Q-05 covers recovery UX and observability. |
| Feature query fails | Methods default unavailable after fallback fails | Restore backend/schema/configuration and refresh feature cache. |

### Planned QA matrix

No scenarios below were executed for this PRD.

| Scenario | IDs | Expected result | Priority |
| --- | --- | --- | --- |
| Existing email and verified-phone login | FR-02/03/11 | Correct account and usable cookie; correct return page | P0 |
| New email / new phone signup | FR-05/06 | Correct verification flags; duplicate email rejected | P0 |
| Incorrect, expired, replayed and concurrent OTPs | FR-03/04, NFR-01 | No unauthorized session; attempt/cooldown limits hold | P0 |
| Expired registration and token-issuance failure | FR-06, NFR-04 | Clear failure, fresh-login recovery, no duplicate account | P0 |
| Unverified-email claim and Profile verification | FR-09 | Credential retirement only on ownership-claim path | P0 |
| All methods disabled; feature-cache refresh | FR-01 | Clear unavailable state; settings propagate | P0 |
| Google/Apple production configuration | FR-08 | Enabled provider succeeds; rejected/cancelled flow recoverable | P0 when enabled |
| Guest shopping sync failure | FR-10 | Auth succeeds; data not silently discarded | P1 |
| Logout with backend unavailable | FR-12 | Cookie cleared; revocation failure observable | P1 |
| Return URL and restored browser history | FR-11, NFR-06 | Approved destination; completed signup not restored | P0 |
| International phone validation and real handset | FR-02 | Web/backend agree; provider delivers | P0 when enabled |
| Mobile layout, keyboard, screen reader | NFR-03 | All steps and errors usable | P1 |

## 8. Out of Scope

This documentation task excludes product implementation, deployment, provider activation and a general security audit. Password login/register APIs remain in source as legacy/QA paths, but password UI is outside the shared storefront journey. Password recovery redesign, account deletion, order/checkout redesign and full Profile management are excluded. Profile verification is described only where it changes sign-in identity or ownership behavior.

No future feature or launch date is committed by this PRD.

## 9. Dependencies and Risks

### Release dependencies

| Dependency | Current evidence | Gate |
| --- | --- | --- |
| Magento schema and data patches | Email/phone verification attributes and backfills present | Deploy store before web; verify customer query accepts sd_email_verified. |
| Email transport and MSG91 | Delivery integrations present; dev SMS success reported in checklist | Prove real delivery on target environment; keep TTL consistent with message template. |
| Google / Apple | Google Testing; Apple credentials missing per checklist | Publish/configure Google; enable Apple only after credentials and end-to-end validation. |
| Country availability | Additional SMS countries default empty | Provider route approval and real handset check before enabling each intended country. |
| Auth flags | Cached flags with revalidation endpoint | Refresh /api/revalidate/auth-features after configuration changes; checklist warns of up to one-hour staleness. |
| Abuse configuration | Defaults present; checklist says dev IP caps relaxed for QA | Restore production caps, verify trusted client IP behavior, disable test SMS sender. |
| Existing customer identifiers | Checklist reports dev email audit, requests production audit | Check production addresses against strict validation before cutover. |

Owners for these gates were not supplied. [E4, E6, E8]

### Risks and product implications

| Risk | Impact | Proposed response and production signal |
| --- | --- | --- |
| Ownership claim transfers access to an account created with unproven email | New mailbox owner can gain account access; old phone credentials are retired | Confirm policy/support handling Q-02; monitor email_ownership_claimed events and access complaints. |
| Consent is not persisted by OTP path | UI acceptance cannot establish a server-side consent record | Decide Q-03; verify persistence before making consent claims. |
| Registration commits before session completion | Customer may exist despite visible signup failure | Test retry/fault behavior; count created-account/no-session outcomes. |
| Country validation differs | UI may admit numbers backend rejects; e.g. +1 prefix and UK length rules differ | Align or explicitly communicate constraints; monitor validation rejects by country. |
| Sync results ignored by caller | Customer can log in while shopping data failed to transfer | Decide retry UX Q-05; record task failures and retained guest state. |
| Misconfigured provider/schema/flags | One or all login methods unavailable | Deploy compatibility gates and channel-specific synthetic checks; alert on session-completion drop. |

### Release sequence, monitoring and rollback

**Proposal:** first deploy compatible store schema/module changes and required data patches, validate identity invariants and configured channels, then deploy the web build. Refresh auth feature flags. Execute P0 scenarios in the intended environment and record deployed revisions, configuration and actual results. Release certification remains open until these gates have evidence.

Monitor request failures, verification failures/lockouts, successful session establishment, ownership claims and post-login sync errors by channel. Use masked identifiers only. Alert thresholds and responsible operators are Q-04; no current dashboard is claimed.

If a channel causes verified login failures or incorrect account access, disable it in Magento and invalidate storefront auth flags while preserving another verified channel where available. If the web build is incompatible, restore a known compatible web release. Keep additive identity schema/data available until compatibility is established. Do not automatically reverse ownership claims, re-enable revoked credentials or delete newly created accounts; these persistent changes need case review. Confirm rollback builds and operator ownership before rollout. This is a proposed runbook, not a tested rollback.

## 10. Open Questions

| ID | Question | Impact / blocking status | Owner / resolve by |
| --- | --- | --- | --- |
| Q-01 | Who owns this baseline and release decision? | Does not block documentation; blocks accountable sign-off | Unassigned / before release review |
| Q-02 | Is current unverified-email ownership transfer approved, including account history access and phone credential retirement? | Blocks policy/release certification; implementation already exists | Product and security roles, unassigned / before certification |
| Q-03 | Must terms acceptance be recorded server-side, and how do social signup and marketing consent work? | Blocks any claim of complete consent implementation | Product/privacy roles, unassigned / before consent sign-off |
| Q-04 | What are metric targets, monitoring thresholds and owners? | Blocks measurable outcome and operational certification | Product/operations, unassigned / before rollout |
| Q-05 | Should failed cart/wishlist/address sync be surfaced or retried? | Follow-up decision; auth works independently of rejected tasks | Product/engineering, unassigned / before continuity acceptance |
| Q-06 | Which revisions, enabled channels and provider credentials are live? | Blocks deployed-status claim | Operations, unassigned / before production status report |
| Q-07 | What are approved visual/accessibility expectations and international country coverage? | Blocks final UX/country acceptance | Design/product, unassigned / before QA sign-off |

### Assumptions to validate

The local checkouts are assumed to represent the implementation the user wants documented. Validate against intended release revisions; if different, update this baseline. The store go-live checklist is used as reported operational evidence, but its unchecked items may be stale. Validate them against deployment records and authorized environment tests. No customer pain, conversion target or product approval is inferred from code.

### Document diagnostic and next step

The strongest section is the cross-repository flow and identity-rule mapping, supported by executable code. The weakest sections are measured outcomes and deployed readiness: neither analytics nor environment checks were supplied. The PRD is ready for baseline review. It is not release certification or an approved specification for proposed changes. Next, confirm the ownership/consent decisions and attach target-environment P0 results and provider readiness evidence.

### Evidence index

Paths are relative to `D:/sunnydiamonds`. Symbols identify the narrow evidence used. Repository revisions are recorded in Section 2.

- **E1:** `sunnydiamond-web/web/src/features/auth/hooks/useAuthFlow.ts` - shared state, handlers, completion, social entry and reset behavior.
- **E2:** `sunnydiamond-store/app/code/SunnyDiamonds/CustomerAuth/Model/Resolver/VerifyLoginOtp.php` - resolvePhoneLogin, resolveEmailLogin, completeLogin; opening comment conflicts with email claim implementation.
- **E3:** `sunnydiamond-store/app/code/SunnyDiamonds/CustomerAuth/Model/Customer/EmailVerificationState.php` - markVerified and confirmBySignedInCustomer.
- **E4:** `sunnydiamond-store/app/code/SunnyDiamonds/CustomerAuth/etc/config.xml`; `Model/Otp/OtpManager.php`; `Model/Otp/OtpCountries.php` under the same module - defaults, lifecycle, country rules.
- **E5:** `sunnydiamond-store/app/code/SunnyDiamonds/CustomerAuth/Model/Resolver/SocialLogin.php` - provider checks, provisioning and claim behavior.
- **E6:** `sunnydiamond-store/docs/PRODUCTION-GO-LIVE.md`, Section 5 (lines 164-202) - reported auth deployment gates; not live verification.
- **E7:** `sunnydiamond-web/web/src/features/auth/utils/authNavigation.ts`; `hooks/useRequestAuth.ts`; `web/src/app/(site)/sign-up/page.tsx` within the web repository - entry and return behavior.
- **E8:** `sunnydiamond-web/web/src/features/auth/services/authFeatures.server.ts` - flag lookup, cache and legacy fallback.
- **E9:** `sunnydiamond-web/web/src/features/auth/services/auth.service.ts`; `utils/authValidation.ts`; `web/src/shared/utils/formValidation.ts`; `web/src/app/api/auth/otp/verify/route.ts` within the web repository - request payloads, validation and session response handling.
- **E10:** `sunnydiamond-web/web/src/features/auth/services/postLoginSync.ts` - cart merge, wishlist/address sync and all-settled outcomes.
- **E11:** `sunnydiamond-web/web/src/services/auth/session.ts`; `web/src/app/api/auth/logout/route.ts` within the web repository - cookie policy and logout behavior.
