"""Process a fixture without the UI. Evaluation key is used only by the caller."""
import argparse
import json
from pathlib import Path
from .engine import Engine


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--inputs', required=True)
    parser.add_argument('--state', required=True)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    target = Path(args.output)
    if target.exists():
        parser.error('Output already exists; choose a new file')
    engine = Engine(args.inputs, args.state)
    result = engine.process()
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open('x') as f:
        json.dump(result, f, indent=2)
    print(json.dumps({'documents': len(result['documents']), 'missing_documents': len(result['missing_documents']),
                      'drafts': len(engine.snapshot()['drafts']), 'outbox': len(engine.snapshot()['outbox']),
                      'audit_chain_valid': engine.verify_log()}, indent=2))


if __name__ == '__main__':
    main()
