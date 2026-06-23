/**
 * FileUploader Component
 *
 * Drag-and-drop file upload zone with file list preview.
 * Shows file name, size, type icon, and a remove button for each file.
 * Validates file count, size, and accepted MIME types.
 *
 * @param {Array} files - Currently selected File objects
 * @param {function} onFilesChange - Callback with updated files array
 * @param {number} maxFiles - Maximum number of files (default: 5)
 * @param {number} maxSize - Maximum file size in bytes (default: 10MB)
 * @param {string} accept - Accepted file types (default: 'image/*,.pdf,.doc,.docx')
 * @param {string} className - Additional CSS classes
 */

import { useState, useRef, useCallback } from 'react';

/**
 * Formats byte size into human-readable string.
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

/**
 * Returns an emoji icon based on file type.
 */
function getFileIcon(file) {
    const type = file.type || '';
    const name = file.name || '';

    if (type.startsWith('image/')) return '🖼️';
    if (type === 'application/pdf' || name.endsWith('.pdf')) return '📄';
    if (
        type === 'application/msword' ||
        type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        name.endsWith('.doc') ||
        name.endsWith('.docx')
    ) return '📝';
    if (type.startsWith('video/')) return '🎬';
    if (type.startsWith('audio/')) return '🎵';
    if (name.endsWith('.zip') || name.endsWith('.rar')) return '📦';
    return '📎';
}

/**
 * Validates a file against size and type constraints.
 * Returns an error message string or null if valid.
 */
function validateFile(file, maxSize, accept) {
    /* Size check */
    if (file.size > maxSize) {
        return `Ukuran file "${file.name}" melebihi batas ${formatFileSize(maxSize)}.`;
    }

    /* Type check (simplified — checks extension-based and MIME-based patterns) */
    if (accept) {
        const acceptedTypes = accept.split(',').map((t) => t.trim().toLowerCase());
        const fileType = file.type.toLowerCase();
        const fileExt = '.' + file.name.split('.').pop().toLowerCase();

        const isAccepted = acceptedTypes.some((accepted) => {
            if (accepted.endsWith('/*')) {
                /* Wildcard MIME, e.g., image/* */
                return fileType.startsWith(accepted.replace('/*', '/'));
            }
            if (accepted.startsWith('.')) {
                /* Extension-based, e.g., .pdf */
                return fileExt === accepted;
            }
            /* Exact MIME match */
            return fileType === accepted;
        });

        if (!isAccepted) {
            return `Tipe file "${file.name}" tidak diizinkan.`;
        }
    }

    return null;
}

export default function FileUploader({
    files = [],
    onFilesChange,
    maxFiles = 5,
    maxSize = 10 * 1024 * 1024,
    accept = 'image/*,.pdf,.doc,.docx',
    className = '',
}) {
    const [isDragging, setIsDragging] = useState(false);
    const [errors, setErrors] = useState([]);
    const inputRef = useRef(null);
    const dragCounter = useRef(0);

    /**
     * Process new files: validate and add to list.
     */
    const processFiles = useCallback(
        (newFileList) => {
            const newFiles = Array.from(newFileList);
            const validationErrors = [];
            const validFiles = [];

            /* Check max files limit */
            const remainingSlots = maxFiles - files.length;
            if (remainingSlots <= 0) {
                validationErrors.push(`Maksimum ${maxFiles} file sudah tercapai.`);
                setErrors(validationErrors);
                return;
            }

            const filesToProcess = newFiles.slice(0, remainingSlots);
            if (newFiles.length > remainingSlots) {
                validationErrors.push(
                    `Hanya ${remainingSlots} file lagi yang dapat ditambahkan.`
                );
            }

            filesToProcess.forEach((file) => {
                const error = validateFile(file, maxSize, accept);
                if (error) {
                    validationErrors.push(error);
                } else {
                    /* Check for duplicate file names */
                    const isDuplicate = files.some(
                        (f) => f.name === file.name && f.size === file.size
                    );
                    if (isDuplicate) {
                        validationErrors.push(`File "${file.name}" sudah ditambahkan.`);
                    } else {
                        validFiles.push(file);
                    }
                }
            });

            setErrors(validationErrors);

            if (validFiles.length > 0) {
                onFilesChange?.([...files, ...validFiles]);
            }
        },
        [files, maxFiles, maxSize, accept, onFilesChange]
    );

    /**
     * Remove a file by index.
     */
    const removeFile = (indexToRemove) => {
        const updated = files.filter((_, i) => i !== indexToRemove);
        onFilesChange?.(updated);
        setErrors([]);
    };

    /* Drag event handlers */
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            setIsDragging(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        dragCounter.current = 0;

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(e.dataTransfer.files);
        }
    };

    /* Click to browse */
    const handleBrowseClick = () => {
        inputRef.current?.click();
    };

    const handleInputChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(e.target.files);
            /* Reset input so the same file can be re-selected */
            e.target.value = '';
        }
    };

    const isMaxReached = files.length >= maxFiles;

    return (
        <div className={`file-uploader ${className}`.trim()}>
            {/* Drop zone */}
            <div
                className={`file-upload-zone ${isDragging ? 'file-upload-zone-dragging' : ''} ${isMaxReached ? 'file-upload-zone-disabled' : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={!isMaxReached ? handleBrowseClick : undefined}
                role="button"
                tabIndex={isMaxReached ? -1 : 0}
                onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !isMaxReached) {
                        handleBrowseClick();
                    }
                }}
                aria-label="Area upload file"
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="file-upload-input"
                    accept={accept}
                    multiple={maxFiles > 1}
                    onChange={handleInputChange}
                    tabIndex={-1}
                    aria-hidden="true"
                />

                <div className="file-upload-zone-content">
                    <span className="file-upload-zone-icon">
                        {isDragging ? '📂' : '📁'}
                    </span>
                    <p className="file-upload-zone-text">
                        {isMaxReached
                            ? `Maksimum ${maxFiles} file tercapai`
                            : isDragging
                              ? 'Lepaskan file di sini...'
                              : 'Seret & lepas file di sini, atau klik untuk memilih'}
                    </p>
                    <p className="file-upload-zone-hint">
                        Maks. {maxFiles} file, masing-masing {formatFileSize(maxSize)}
                    </p>
                </div>
            </div>

            {/* Validation errors */}
            {errors.length > 0 && (
                <div className="file-upload-errors">
                    {errors.map((error, i) => (
                        <p key={i} className="file-upload-error">
                            ⚠️ {error}
                        </p>
                    ))}
                </div>
            )}

            {/* File list */}
            {files.length > 0 && (
                <ul className="file-upload-list">
                    {files.map((file, index) => (
                        <li key={`${file.name}-${file.size}-${index}`} className="file-upload-item">
                            <span className="file-upload-item-icon">{getFileIcon(file)}</span>
                            <div className="file-upload-item-info">
                                <span className="file-upload-item-name" title={file.name}>
                                    {file.name}
                                </span>
                                <span className="file-upload-item-size">
                                    {formatFileSize(file.size)}
                                </span>
                            </div>
                            <button
                                type="button"
                                className="file-upload-item-remove"
                                onClick={() => removeFile(index)}
                                aria-label={`Hapus ${file.name}`}
                                title="Hapus file"
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
