"""Generate a deterministic synthetic logistics job. No network or third-party packages."""
import argparse
import hashlib
import json
import random
import sqlite3
from pathlib import Path

SCHEMA_VERSION = 1
JOB = "synthetic-logistics-001"
REQUIRED = {"BOL": ["shipment_id", "carrier", "pieces", "weight_lb"],
            "POD": ["shipment_id", "carrier", "pieces", "received_by"]}


def dump(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def pdf_bytes(lines):
    """Small text PDF with real text operators; deterministic, dependency-free."""
    commands = ["BT /F1 10 Tf 48 750 Td 15 TL"]
    for line in lines:
        escaped = line.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")
        commands.append(f"({escaped}) Tj T*")
    commands.append("ET")
    stream = "\n".join(commands).encode("ascii")
    objects = [b"<< /Type /Catalog /Pages 2 0 R >>",
               b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
               b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
               b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
               b"<< /Length " + str(len(stream)).encode() + b" >>\nstream\n" + stream + b"\nendstream"]
    result = bytearray(b"%PDF-1.4\n")
    offsets = [0]
    for number, obj in enumerate(objects, 1):
        offsets.append(len(result))
        result.extend(f"{number} 0 obj\n".encode() + obj + b"\nendobj\n")
    start = len(result)
    result.extend(f"xref\n0 {len(objects)+1}\n0000000000 65535 f \n".encode())
    for offset in offsets[1:]:
        result.extend(f"{offset:010d} 00000 n \n".encode())
    result.extend(f"trailer\n<< /Size {len(objects)+1} /Root 1 0 R >>\nstartxref\n{start}\n%%EOF\n".encode())
    return bytes(result)


def generate(output, seed=42):
    output = Path(output)
    # Exclusive creation prevents overwriting a previous job or unrelated files.
    output.mkdir(parents=True, exist_ok=False)
    rng = random.Random(seed)
    shipments = []
    for number in range(1, 51):
        shipments.append({"shipment_id": f"SYN-SHP-{number:04d}", "job_id": JOB,
                          "shipper": f"Fictional Shipper {number:02d}",
                          "consignee": f"Fictional Receiver {number:02d}",
                          "carrier": f"Synthetic Carrier {rng.randrange(1, 5)}",
                          "pieces": rng.randrange(2, 41), "weight_lb": rng.randrange(100, 9001),
                          "status": "delivered", "delivered_at": "2026-01-15T12:00:00Z",
                          "contact_email": f"operations{number:02d}@example.invalid"})
    inputs = output / "inputs"
    inputs.mkdir()
    dump(inputs / "shipments.json", shipments)
    db = sqlite3.connect(inputs / "records.sqlite")
    db.execute("CREATE TABLE shipments (shipment_id TEXT PRIMARY KEY, job_id TEXT NOT NULL, shipper TEXT NOT NULL, consignee TEXT NOT NULL, carrier TEXT NOT NULL, pieces INTEGER NOT NULL, weight_lb INTEGER NOT NULL, status TEXT NOT NULL, delivered_at TEXT NOT NULL, contact_email TEXT NOT NULL)")
    db.executemany("INSERT INTO shipments VALUES (:shipment_id,:job_id,:shipper,:consignee,:carrier,:pieces,:weight_lb,:status,:delivered_at,:contact_email)", shipments)
    db.commit()
    db.close()
    train = [s["shipment_id"] for i, s in enumerate(shipments, 1) if i % 5]
    heldout = [s["shipment_id"] for i, s in enumerate(shipments, 1) if not i % 5]
    dump(output / "evaluation" / "split.json", {"train": train, "heldout": heldout,
         "policy": "Group by shipment, including duplicates. Do not tune on heldout documents or labels."})
    inbox, oracle = [], []

    def add(kind, fields, match, defects=(), duplicate_of=None, unreadable=False):
        doc_id = f"DOC-{len(inbox)+1:03d}"
        split = "heldout" if match in heldout or fields.get("shipment_id") in heldout else "train"
        if match is None and len(inbox) >= 36:
            split = "heldout"  # unknown references and unreadable are robustness holdouts
        path = f"documents/{doc_id}.pdf"
        payload = pdf_bytes(["SYNTHETIC DEMO - NOT A REAL SHIPPING DOCUMENT", kind,
                             f"Document ID: {doc_id}", ""] +
                            [f"{key}: {value}" for key, value in fields.items()])
        if unreadable:
            payload = b"%PDF-1.4\nSYNTHETIC INTENTIONALLY TRUNCATED DOCUMENT\n"
        if duplicate_of:
            original = next(d for d in inbox if d["document_id"] == duplicate_of)
            payload = (inputs / original["attachment"]).read_bytes()
        dest = inputs / path
        dest.parent.mkdir(exist_ok=True)
        dest.write_bytes(payload)
        inbox.append({"document_id": doc_id, "job_id": JOB, "attachment": path,
                      "received_at": f"2026-01-16T09:{len(inbox):02d}:00Z",
                      "from": "synthetic-inbox@example.invalid",
                      "subject": "Synthetic shipping document received"})
        oracle.append({"document_id": doc_id, "split": split, "type": kind if not unreadable else None,
                       "shipment_id": match, "expected_fields": fields if not unreadable else {},
                       "findings": list(defects), "duplicate_of": duplicate_of,
                       "sha256": hashlib.sha256(payload).hexdigest(),
                       "clean": not defects and not duplicate_of and not unreadable})
        return doc_id

    for index, shipment in enumerate(shipments[:18], 1):
        for kind in ["BOL", "POD"]:
            fields = {k: shipment[k] for k in ["shipment_id", "carrier", "pieces"]}
            if kind == "BOL":
                fields["weight_lb"] = shipment["weight_lb"]
            else:
                fields["received_by"] = f"Fictional Receiver {index:02d}"
            defects = []
            match = shipment["shipment_id"]
            if (index, kind) == (3, "BOL"):
                fields["pieces"] += 7
                defects.append("mismatch:pieces")
            if (index, kind) == (5, "POD"):
                fields["carrier"] = "Synthetic Wrong Carrier"
                defects.append("mismatch:carrier")
            if (index, kind) == (8, "BOL"):
                fields["weight_lb"] += 500
                defects.append("mismatch:weight_lb")
            if (index, kind) == (10, "POD"):
                del fields["received_by"]
                defects.append("missing_field:received_by")
            if (index, kind) == (12, "BOL"):
                del fields["carrier"]
                defects.append("missing_field:carrier")
            if (index, kind) == (15, "POD"):
                del fields["shipment_id"]
                match = None
                defects.extend(["missing_field:shipment_id", "unmatched"])
            add(kind, fields, match, defects)
            # A missing ID must stay in its originating shipment's heldout split.
            if index == 15 and kind == "POD":
                oracle[-1]["split"] = "heldout"
    for kind in ["BOL", "POD"]:
        fields = {"shipment_id": "SYN-UNKNOWN-9999", "carrier": "Synthetic Carrier 1", "pieces": 5}
        fields.update({"weight_lb": 700} if kind == "BOL" else {"received_by": "Fictional Receiver"})
        add(kind, fields, None, ["unmatched"])
    original = oracle[0]
    add("BOL", original["expected_fields"].copy(), original["shipment_id"], ["duplicate"], "DOC-001")
    add("BOL", {}, None, ["unreadable"], unreadable=True)
    # Presence and validity are separate: an identified but defective POD is present,
    # and its field defect must still be flagged. Duplicates never fill missing slots.
    present = {(d["shipment_id"], d["type"]) for d in oracle if d["shipment_id"] and not d["duplicate_of"]}
    missing = [{"shipment_id": s["shipment_id"], "document_type": kind,
                "finding": "missing_document", "split": "heldout" if s["shipment_id"] in heldout else "train"}
               for s in shipments for kind in ["BOL", "POD"] if (s["shipment_id"], kind) not in present]
    dump(inputs / "inbox.json", inbox)
    dump(inputs / "job.json", {"job_id": JOB, "synthetic": True, "as_of": "2026-01-17T00:00:00Z",
         "required_documents": ["BOL", "POD"], "required_fields": REQUIRED,
         "matching_policy": "Exact shipment ID within this job; missing or unknown IDs require review.",
         "outbound_policy": "Disabled for fixture generation. Future delivery must use a local fake outbox and require explicit human approval."})
    dump(output / "evaluation" / "expected.json", {"documents": oracle, "missing_documents": missing})
    manifest = {"schema_version": SCHEMA_VERSION, "seed": seed, "synthetic": True,
                "counts": {"shipments": len(shipments), "documents": len(inbox),
                           "clean_documents": sum(d["clean"] for d in oracle),
                           "missing_documents": len(missing),
                           "document_findings": sum(len(d["findings"]) for d in oracle)},
                "inputs": {str(p.relative_to(inputs)): hashlib.sha256(p.read_bytes()).hexdigest()
                           for p in sorted(inputs.rglob("*")) if p.is_file()}}
    dump(output / "manifest.json", manifest)
    return manifest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True, help="New directory; existing paths are never overwritten")
    parser.add_argument("--seed", type=int, default=42)
    args = parser.parse_args()
    try:
        result = generate(args.output, args.seed)
    except FileExistsError:
        parser.error("Output already exists. Choose a new directory; nothing was overwritten.")
    print(json.dumps(result["counts"], indent=2))


if __name__ == "__main__":
    main()
