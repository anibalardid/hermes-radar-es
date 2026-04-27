#!/usr/bin/env python3
"""Mark cron job as run in jobs.json"""
import json
import sys

if len(sys.argv) < 5:
    print("Usage: mark_cron_job.py <jobs.json> <job_id> <timestamp> <status> [error]", file=sys.stderr)
    sys.exit(1)

jobs_file = sys.argv[1]
job_id = sys.argv[2]
now = sys.argv[3]
last_status = sys.argv[4]
last_error = sys.argv[5] if len(sys.argv) > 5 else None

with open(jobs_file, 'r') as f:
    data = json.load(f)

for job in data.get('jobs', []):
    if job.get('id') == job_id:
        job['last_run_at'] = now
        job['last_status'] = last_status
        if last_error:
            job['last_error'] = last_error
        print(f"Updated job {job_id}: last_run_at={now}, last_status={last_status}")
        break

with open(jobs_file, 'w') as f:
    json.dump(data, f, indent=2)