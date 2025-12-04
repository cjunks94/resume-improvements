#!/bin/bash
# Umami Analytics Database Backup Script
# Author: Chris Junker
# Usage: ./backup.sh

set -e

DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="./backups"
BACKUP_FILE="$BACKUP_DIR/umami-$DATE.sql"

# Create backups directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Run pg_dump inside the container
echo "🔄 Backing up Umami database..."
docker exec umami-db pg_dump -U umami umami > "$BACKUP_FILE"

# Compress the backup
echo "📦 Compressing backup..."
gzip "$BACKUP_FILE"

echo "✅ Backup complete: ${BACKUP_FILE}.gz"
echo "📊 Size: $(du -h ${BACKUP_FILE}.gz | cut -f1)"

# Optional: Keep only last 7 days of backups
echo "🧹 Cleaning up old backups (keeping last 7 days)..."
find "$BACKUP_DIR" -name "umami-*.sql.gz" -mtime +7 -delete

echo "🎉 Backup process complete!"
