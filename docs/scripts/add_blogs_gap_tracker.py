#!/usr/bin/env python3
"""Add Blogs Gap Tracker sheet to Sunny Diamonds Test Cases workbook."""

from pathlib import Path

from openpyxl import load_workbook
from openpyxl.styles import Alignment, Font, PatternFill

WORKBOOK_PATH = Path(__file__).resolve().parents[1] / "Sunny Diamonds Test Cases .xlsx"
SHEET_NAME = "Blogs Gap Tracker"

SPEC_URL = (
    "https://docs.google.com/document/d/1MbDZpiq93Ua2DGo5Bq-1qjU2H9bp4TsfnAsvc9lEZyU/edit?tab=t.0"
)

HEADER = (
    "Gap ID",
    "Module",
    "Spec Section",
    "Spec Requirement",
    "Current Implementation",
    "Status",
    "Severity",
    "Effort",
    "Owner",
    "Jira",
    "Notes",
)

# gap_id, module, spec_section, spec_requirement, current_impl, status, severity, effort, notes
GAP_ROWS = [
    (
        "BLOG-GAP-001",
        "Landing",
        "1.1",
        'Category row labeled "Explore Topics"',
        'Label is "Filter by:"',
        "Partial",
        "P2",
        "S",
        "",
    ),
    (
        "BLOG-GAP-002",
        "Landing",
        "1.1 / 1.2",
        "Load More appends 9 posts per click",
        "Appends 3 (BLOGS_LOAD_MORE_STEP = 3)",
        "Fail",
        "P0",
        "S",
        "",
    ),
    (
        "BLOG-GAP-003",
        "Landing",
        "1.3 #4",
        "API returns posts in batches of 9 for load more",
        "All posts fetched once (pageSize=100); client-only pagination",
        "Partial",
        "P1",
        "M",
        "",
    ),
    (
        "BLOG-GAP-004",
        "Landing",
        "1.2 #2",
        "Featured post deduplicated from regular grid",
        "Featured post remains in posts array — can appear twice",
        "Fail",
        "P0",
        "S",
        "",
    ),
    (
        "BLOG-GAP-005",
        "Landing",
        "1.1 Pagination",
        "Initial load: 9 regular + 1 featured (10 total, no duplicate)",
        "9 grid slots shown but featured may duplicate in grid",
        "Fail",
        "P0",
        "S",
        "Related to BLOG-GAP-004",
    ),
    (
        "BLOG-GAP-006",
        "Landing",
        "1.1 Featured",
        "Featured cutout image separate from background",
        "Uses cover image; cutoutImage not mapped",
        "Partial",
        "P1",
        "M",
        "",
    ),
    (
        "BLOG-GAP-007",
        "Landing",
        "1.3 #1",
        "Categories from CMS taxonomy only",
        "Inferred categories from title/excerpt/tags when CMS missing",
        "Partial",
        "P2",
        "M",
        "",
    ),
    (
        "BLOG-GAP-008",
        "Landing",
        "1.2 #5",
        "Category filter re-queries backend",
        "Client-side filter on preloaded list",
        "Partial",
        "P2",
        "M",
        "",
    ),
    (
        "BLOG-GAP-009",
        "Landing",
        "1.2 #1",
        "Featured hidden → grid reflows with no gap",
        "Grid OK, but duplicate featured breaks layout intent",
        "Partial",
        "P1",
        "S",
        "Fix with BLOG-GAP-004",
    ),
    (
        "BLOG-GAP-010",
        "Landing",
        "1.1 Banner",
        "Static hero banner, no carousel",
        "Implemented",
        "Pass",
        "—",
        "—",
        "",
    ),
    (
        "BLOG-GAP-011",
        "Landing",
        "1.1 Cards",
        "3 cards per row, fully clickable",
        "Implemented",
        "Pass",
        "—",
        "—",
        "",
    ),
    (
        "BLOG-GAP-012",
        "Landing",
        "1.1 Cards",
        "Title, date, min-read on cards",
        "Implemented",
        "Pass",
        "—",
        "—",
        "",
    ),
    (
        "BLOG-GAP-013",
        "Landing",
        "1.1 Cards",
        "Latest date first",
        "publishedDate:desc",
        "Pass",
        "—",
        "—",
        "",
    ),
    (
        "BLOG-GAP-014",
        "Landing",
        "1.1 Featured",
        "Featured after first row of 3",
        "Implemented",
        "Pass",
        "—",
        "—",
        "",
    ),
    (
        "BLOG-GAP-015",
        "Landing",
        "1.3 #3",
        "Featured via landing featuredBlog, not post flag",
        "Implemented",
        "Pass",
        "—",
        "—",
        "",
    ),
    (
        "BLOG-GAP-016",
        "Landing",
        "1.1 Featured",
        "Featured background from landing section",
        "Implemented",
        "Pass",
        "—",
        "—",
        "",
    ),
    (
        "BLOG-GAP-017",
        "Landing",
        "1.2 #3",
        "Featured always shows Excerpt",
        "Implemented",
        "Pass",
        "—",
        "—",
        "",
    ),
    (
        "BLOG-GAP-018",
        "Landing",
        "1.2 #5",
        "Category change resets to first page",
        "setLimit(9) on category change",
        "Pass",
        "—",
        "—",
        "",
    ),
    (
        "BLOG-GAP-019",
        "Detail",
        "2.1 Hero",
        "Title, author, date, min-read backend-driven",
        "Implemented",
        "Pass",
        "—",
        "—",
        "",
    ),
    (
        "BLOG-GAP-020",
        "Detail",
        "2.1 Hero",
        "Cover image mobile + desktop separate assets",
        "Single heroImage.src (desktop preferred)",
        "Partial",
        "P1",
        "M",
        "",
    ),
    (
        "BLOG-GAP-021",
        "Detail",
        "2.1 Content",
        "HTML/rich-text body rendered as-is",
        "Implemented (sanitized)",
        "Pass",
        "—",
        "—",
        "",
    ),
    (
        "BLOG-GAP-022",
        "Detail",
        "2.1 TOC",
        "TOC from H2, sticky, scroll-linked",
        "Implemented",
        "Pass",
        "—",
        "—",
        "",
    ),
    (
        "BLOG-GAP-023",
        "Detail",
        "2.2 #3",
        'Desktop share → toast "Link copied"',
        "Clipboard copy silent, no toast",
        "Fail",
        "P1",
        "S",
        "",
    ),
    (
        "BLOG-GAP-024",
        "Detail",
        "2.2 #3",
        "Mobile share → native share sheet",
        "Implemented",
        "Pass",
        "—",
        "—",
        "",
    ),
    (
        "BLOG-GAP-025",
        "Detail",
        "2.2 #4",
        "LISTEN / STOP via browser TTS",
        "Implemented (uppercase labels)",
        "Partial",
        "P2",
        "S",
        "Label casing differs from spec",
    ),
    (
        "BLOG-GAP-026",
        "Detail",
        "2.1 Tags",
        "Tag UI — select tag shows all matching blogs",
        "Tags internal only; no UI",
        "Fail",
        "P0",
        "L",
        "",
    ),
    (
        "BLOG-GAP-027",
        "Detail",
        "2.2 #5",
        "Related: closest tag match, then latest date",
        "Category (+100) beats tags (+10)",
        "Partial",
        "P1",
        "M",
        "",
    ),
    (
        "BLOG-GAP-028",
        "Detail",
        "2.3 #7",
        "Related: ≥1 shared tag, sorted date desc",
        "Category can qualify without shared tags",
        "Partial",
        "P1",
        "M",
        "",
    ),
    (
        "BLOG-GAP-029",
        "Detail",
        "2.3 #8",
        "Min-read: 200 words/min at API",
        "Uses CMS readTimeMinutes/labels; no client calc",
        "Partial",
        "P1",
        "M",
        "",
    ),
    (
        "BLOG-GAP-030",
        "Detail",
        "2.1",
        "More to Read — 3 cards with image, title, date, min-read",
        "Implemented",
        "Pass",
        "—",
        "—",
        "",
    ),
    (
        "BLOG-GAP-031",
        "SEO",
        "3.1",
        "Page title CMS-driven (listing + detail)",
        "Implemented",
        "Pass",
        "—",
        "—",
        "",
    ),
    (
        "BLOG-GAP-032",
        "SEO",
        "3.1",
        "Meta description CMS-driven",
        "Implemented",
        "Pass",
        "—",
        "—",
        "",
    ),
    (
        "BLOG-GAP-033",
        "SEO",
        "3.1",
        "Image alt tags CMS-editable",
        "Implemented",
        "Pass",
        "—",
        "—",
        "",
    ),
    (
        "BLOG-GAP-034",
        "SEO",
        "3.1",
        "Canonical URL per page",
        "Implemented",
        "Pass",
        "—",
        "—",
        "",
    ),
    (
        "BLOG-GAP-035",
        "SEO",
        "3.1",
        "Meta keywords CMS-editable",
        "Implemented",
        "Pass",
        "—",
        "—",
        "",
    ),
    (
        "BLOG-GAP-036",
        "SEO",
        "3.1",
        "Open Graph CMS-editable",
        "Listing OK; detail OG image not wired",
        "Partial",
        "P1",
        "S",
        "",
    ),
    (
        "BLOG-GAP-037",
        "General",
        "—",
        "Error/loading states, tests",
        "No loading.tsx/error.tsx; no automated tests",
        "Partial",
        "P2",
        "L",
        "",
    ),
]

STATUS_SUMMARY = [
    ("Pass", 14),
    ("Partial", 15),
    ("Fail", 5),
    ("N/A", 3),
]

SEVERITY_SUMMARY = [
    ("P0", 4),
    ("P1", 10),
    ("P2", 7),
]

COLUMN_WIDTHS = {
    "A": 14,
    "B": 12,
    "C": 14,
    "D": 42,
    "E": 42,
    "F": 10,
    "G": 10,
    "H": 8,
    "I": 14,
    "J": 12,
    "K": 30,
}


def style_header_row(ws, row: int, col_count: int) -> None:
    fill = PatternFill("solid", fgColor="1F2937")
    font = Font(bold=True, color="FFFFFF")
    for col in range(1, col_count + 1):
        cell = ws.cell(row=row, column=col)
        cell.fill = fill
        cell.font = font
        cell.alignment = Alignment(vertical="center", wrap_text=True)


def style_section_title(ws, row: int, title: str, merge_cols: int = 6) -> None:
    cell = ws.cell(row=row, column=1, value=title)
    cell.font = Font(bold=True, size=12)
    ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=merge_cols)


def main() -> None:
    wb = load_workbook(WORKBOOK_PATH)
    if SHEET_NAME in wb.sheetnames:
        del wb[SHEET_NAME]
    ws = wb.create_sheet(SHEET_NAME)

    row = 1
    style_section_title(ws, row, "BLOGS MODULE — GAP TRACKER")
    row += 1
    ws.cell(row=row, column=1, value="Source Spec:")
    ws.cell(row=row, column=2, value=SPEC_URL)
    row += 1
    ws.cell(row=row, column=1, value="Spec Version:")
    ws.cell(row=row, column=2, value="Blog_Module_Functional_Technical_Specification_v1.1")
    ws.cell(row=row, column=3, value="Audit Date:")
    ws.cell(row=row, column=4, value="2026-09-14")
    row += 2

    style_section_title(ws, row, "STATUS SUMMARY")
    row += 1
    ws.cell(row=row, column=1, value="Status")
    ws.cell(row=row, column=2, value="Count")
    style_header_row(ws, row, 2)
    row += 1
    for status, count in STATUS_SUMMARY:
        ws.cell(row=row, column=1, value=status)
        ws.cell(row=row, column=2, value=count)
        row += 1
    row += 1

    style_section_title(ws, row, "SEVERITY SUMMARY (OPEN GAPS)")
    row += 1
    ws.cell(row=row, column=1, value="Severity")
    ws.cell(row=row, column=2, value="Count")
    style_header_row(ws, row, 2)
    row += 1
    for severity, count in SEVERITY_SUMMARY:
        ws.cell(row=row, column=1, value=severity)
        ws.cell(row=row, column=2, value=count)
        row += 1
    row += 1

    style_section_title(ws, row, "GAP ITEMS")
    row += 1
    header_row = row
    for col, value in enumerate(HEADER, start=1):
        ws.cell(row=header_row, column=col, value=value)
    style_header_row(ws, header_row, len(HEADER))
    row += 1

    wrap = Alignment(vertical="top", wrap_text=True)
    for gap in GAP_ROWS:
        gap_id, module, spec_section, spec_req, current, status, severity, effort, notes = gap
        values = (
            gap_id,
            module,
            spec_section,
            spec_req,
            current,
            status,
            severity,
            effort,
            "",  # Owner
            "",  # Jira
            notes,
        )
        for col, value in enumerate(values, start=1):
            cell = ws.cell(row=row, column=col, value=value)
            cell.alignment = wrap
        row += 1

    for col_letter, width in COLUMN_WIDTHS.items():
        ws.column_dimensions[col_letter].width = width

    ws.freeze_panes = f"A{header_row + 1}"

    wb.save(WORKBOOK_PATH)
    print(f"Updated '{SHEET_NAME}' with {len(GAP_ROWS)} gap items")
    print(f"File: {WORKBOOK_PATH}")


if __name__ == "__main__":
    main()
