<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Report extends Model
{
    use SoftDeletes;

    /**
     * Valid statuses for reports.
     */
    public const STATUSES = [
        'diterima',
        'diverifikasi',
        'diproses',
        'selesai',
        'ditolak',
        'diteruskan',
    ];

    /**
     * Valid priorities for reports.
     */
    public const PRIORITIES = [
        'rendah',
        'sedang',
        'tinggi',
        'mendesak',
    ];

    /**
     * Human-readable status labels.
     */
    public const STATUS_LABELS = [
        'diterima'     => 'Diterima',
        'diverifikasi' => 'Diverifikasi',
        'diproses'     => 'Diproses',
        'selesai'      => 'Selesai',
        'ditolak'      => 'Ditolak',
        'diteruskan'   => 'Diteruskan',
    ];

    /**
     * Human-readable priority labels.
     */
    public const PRIORITY_LABELS = [
        'rendah'   => 'Rendah',
        'sedang'   => 'Sedang',
        'tinggi'   => 'Tinggi',
        'mendesak' => 'Mendesak',
    ];

    /**
     * Valid types for reports.
     */
    public const TYPES = [
        'pengaduan',
        'aspirasi',
        'permintaan_informasi',
    ];

    /**
     * Human-readable type labels.
     */
    public const TYPE_LABELS = [
        'pengaduan'            => 'Pengaduan',
        'aspirasi'             => 'Aspirasi',
        'permintaan_informasi' => 'Permintaan Informasi',
    ];

    protected $fillable = [
        'ticket_number',
        'type',
        'title',
        'description',
        'category_id',
        'unit_id',
        'user_id',
        'assigned_to',
        'status',
        'priority',
        'is_anonymous',
        'is_secret',
        'guest_name',
        'guest_email',
        'guest_phone',
        'location',
        'incident_date',
        'deadline',
        'resolved_at',
        'rejection_reason',
    ];

    protected function casts(): array
    {
        return [
            'is_anonymous'  => 'boolean',
            'is_secret'     => 'boolean',
            'incident_date' => 'date',
            'deadline'      => 'date',
            'resolved_at'   => 'datetime',
        ];
    }

    // ──────────────────────────────────────────────
    // Boot
    // ──────────────────────────────────────────────

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (Report $report) {
            if (empty($report->ticket_number)) {
                $report->ticket_number = static::generateTicketNumber();
            }
        });
    }

    // ──────────────────────────────────────────────
    // Ticket Number Generation
    // ──────────────────────────────────────────────

    /**
     * Generate a unique ticket number in format LAPOR-YYYYMMDD-XXXXX.
     */
    public static function generateTicketNumber(): string
    {
        $date = Carbon::now()->format('Ymd');
        $prefix = "LAPOR-{$date}-";

        // Find the latest ticket for today
        $latest = static::withTrashed()
            ->where('ticket_number', 'like', $prefix . '%')
            ->orderBy('ticket_number', 'desc')
            ->value('ticket_number');

        if ($latest) {
            $lastNumber = (int) substr($latest, -5);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return $prefix . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);
    }

    // ──────────────────────────────────────────────
    // Relationships
    // ──────────────────────────────────────────────

    /**
     * The user who created this report.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The category of this report.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * The unit this report is assigned to.
     */
    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    /**
     * The operator assigned to this report.
     */
    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    /**
     * Attachments for this report.
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(ReportAttachment::class);
    }

    /**
     * Comments on this report.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(ReportComment::class);
    }

    /**
     * Status change logs for this report.
     */
    public function statusLogs(): HasMany
    {
        return $this->hasMany(ReportStatusLog::class);
    }

    // ──────────────────────────────────────────────
    // Accessors
    // ──────────────────────────────────────────────

    /**
     * Get human-readable status label.
     */
    public function getStatusLabelAttribute(): string
    {
        return self::STATUS_LABELS[$this->status] ?? $this->status;
    }

    /**
     * Get human-readable priority label.
     */
    public function getPriorityLabelAttribute(): string
    {
        return self::PRIORITY_LABELS[$this->priority] ?? $this->priority;
    }

    /**
     * Get human-readable type label.
     */
    public function getTypeLabelAttribute(): string
    {
        return self::TYPE_LABELS[$this->type] ?? $this->type;
    }

    /**
     * Check if the report is overdue.
     */
    public function getIsOverdueAttribute(): bool
    {
        if (!$this->deadline || in_array($this->status, ['selesai', 'ditolak'])) {
            return false;
        }

        return Carbon::now()->greaterThan($this->deadline);
    }

    // ──────────────────────────────────────────────
    // Scopes
    // ──────────────────────────────────────────────

    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    public function scopePriority($query, string $priority)
    {
        return $query->where('priority', $priority);
    }

    public function scopeForUnit($query, int $unitId)
    {
        return $query->where('unit_id', $unitId);
    }

    public function scopeOverdue($query)
    {
        return $query->whereNotNull('deadline')
            ->where('deadline', '<', Carbon::now())
            ->whereNotIn('status', ['selesai', 'ditolak']);
    }
}
