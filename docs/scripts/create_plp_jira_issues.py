#!/usr/bin/env python3
"""Create PLP Jira issues in SD project. Requires JIRA_EMAIL and JIRA_API_TOKEN env vars."""

from __future__ import annotations

import json
import os
import sys
import urllib.request

JIRA_BASE = "https://bluelupin.atlassian.net"
PROJECT = "SD"
VERSION_ID = "12630"
ASSIGNEE_ID = "712020:b413b386-d0a9-428b-ac6e-bf9e5dba27e0"

PRIORITY_MAP = {"P0": "Blocker", "P1": "Critical", "P2": "Minor", "P3": "Trivial"}

ISSUES = [
    ("PLP-ISSUE-002", "Sort not persisted in URL",
     "PLP-ISSUE-002 (P1)\n\nSort value is React state only. Refresh/share URL resets to Featured.\n\nTest cases: PLP-064", "P1"),
    ("PLP-ISSUE-003", "URL-only filters not in drawer",
     "PLP-ISSUE-003 (P1)\n\noccasion, collection, diamondShape, fancyColour are URL-only.\n\nTest cases: PLP-054, PLP-055", "P1"),
    ("PLP-ISSUE-004", "Price filter total count inaccurate",
     "PLP-ISSUE-004 (P2)\n\nWhen price filter active, totalCount inaccurate.\n\nTest cases: PLP-067, PLP-074", "P2"),
    ("PLP-ISSUE-005", "noIndex on ?category= primary listing URLs",
     "PLP-ISSUE-005 (P2)\n\ngenerateMetadata sets noIndex when ?category= on /jewellery.\n\nTest case: PLP-094", "P2"),
    ("PLP-ISSUE-006", "Gift-finder entry skips SSR prefetch",
     "PLP-ISSUE-006 (P2)\n\nshouldSkipJewelleryListingPrefetch true for gift-finder params.\n\nTest case: PLP-101", "P2"),
    ("PLP-ISSUE-007", "Hero LCP preload not wired to PLP",
     "PLP-ISSUE-007 (P3)\n\npreloadPlpHeroLcpImages used on Contact but not jewellery PLP.\n\nTest case: PLP-114", "P3"),
    ("PLP-ISSUE-008", "Dead collection fetch helper",
     "PLP-ISSUE-008 (P3)\n\nfetchMagentoJewelleryCollectionPage() never called.\n\nTest case: PLP-113", "P3"),
    ("PLP-ISSUE-009", "Canonical URL points to CMS dev domain",
     "PLP-ISSUE-009 (P1)\n\nCanonical points to sunnydiamonds-cms-dev.on-forge.com/jewellery.\n\nTest case: PLP-092", "P1"),
]


def jira_request(method: str, path: str, body: dict | None = None) -> dict:
    email = os.environ.get("JIRA_EMAIL")
    token = os.environ.get("JIRA_API_TOKEN")
    if not email or not token:
        sys.exit("Set JIRA_EMAIL and JIRA_API_TOKEN environment variables.")

    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(
        f"{JIRA_BASE}{path}",
        data=data,
        method=method,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": f"Basic {__import__('base64').b64encode(f'{email}:{token}'.encode()).decode()}",
        },
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode()) if resp.length else {}


def create_issue(issue_id: str, title: str, description: str, priority: str) -> str:
    body = {
        "fields": {
            "project": {"key": PROJECT},
            "issuetype": {"name": "Bug"},
            "summary": f"[PLP] {title}",
            "description": {
                "type": "doc",
                "version": 1,
                "content": [{"type": "paragraph", "content": [{"type": "text", "text": description}]}],
            },
            "priority": {"name": PRIORITY_MAP[priority]},
            "labels": ["PLP"],
            "versions": [{"id": VERSION_ID}],
            "assignee": {"accountId": ASSIGNEE_ID},
        }
    }
    result = jira_request("POST", "/rest/api/3/issue", body)
    return result["key"]


def main() -> None:
    created = []
    for issue_id, title, desc, pri in ISSUES:
        key = create_issue(issue_id, title, desc, pri)
        url = f"{JIRA_BASE}/browse/{key}"
        created.append((issue_id, key, url))
        print(f"{issue_id} -> {key} {url}")
    print(f"\nCreated {len(created)} issues (SD-193 already exists for PLP-ISSUE-001)")


if __name__ == "__main__":
    main()
