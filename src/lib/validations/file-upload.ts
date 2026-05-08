/**
 * File Upload Security Validation
 * Prevents malicious file uploads by validating type, size, and extension
 */

// Allowed MIME types by category
const ALLOWED_MIME_TYPES = {
  avatar: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  contract: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  lesson: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/webm',
    'application/x-chess-pgn',
    'text/plain', // PGN files may be detected as text
  ],
} as const;

// Allowed extensions by category
const ALLOWED_EXTENSIONS = {
  avatar: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  contract: ['pdf', 'doc', 'docx'],
  lesson: ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'webm', 'pgn'],
} as const;

// Maximum file sizes in bytes
const MAX_FILE_SIZES = {
  avatar: 5 * 1024 * 1024,      // 5MB
  contract: 10 * 1024 * 1024,   // 10MB
  lesson: 100 * 1024 * 1024,    // 100MB (for videos)
  lessonImage: 10 * 1024 * 1024, // 10MB for images
  lessonVideo: 100 * 1024 * 1024, // 100MB for videos
} as const;

export type FileCategory = keyof typeof ALLOWED_MIME_TYPES;

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedName?: string;
}

/**
 * Validates a file for upload security
 */
export function validateFileUpload(
  file: File,
  category: FileCategory
): FileValidationResult {
  // 1. Check if file exists and has content
  if (!file || file.size === 0) {
    return { valid: false, error: 'File is empty or missing' };
  }

  // 2. Validate file extension
  const extension = getFileExtension(file.name);
  if (!extension) {
    return { valid: false, error: 'File must have an extension' };
  }

  const allowedExtensions = ALLOWED_EXTENSIONS[category] as readonly string[];
  if (!allowedExtensions.includes(extension.toLowerCase())) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${allowedExtensions.join(', ')}`,
    };
  }

  // 3. Validate MIME type
  const allowedMimeTypes = ALLOWED_MIME_TYPES[category] as readonly string[];
  // Allow empty MIME type for PGN files (browser may not recognize)
  const isPgnFile = extension.toLowerCase() === 'pgn';
  if (!isPgnFile && !allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file format. File type "${file.type}" is not allowed`,
    };
  }

  // 4. Validate file size
  const maxSize = getMaxFileSize(file, category);
  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSizeMB}MB`,
    };
  }

  // 5. Check for double extensions (security risk)
  if (hasDoubleExtension(file.name)) {
    return {
      valid: false,
      error: 'File name contains suspicious double extension',
    };
  }

  // 6. Sanitize filename
  const sanitizedName = sanitizeFileName(file.name);

  return {
    valid: true,
    sanitizedName,
  };
}

/**
 * Gets the file extension safely
 */
export function getFileExtension(fileName: string): string | null {
  const parts = fileName.split('.');
  if (parts.length < 2) return null;
  return parts[parts.length - 1].toLowerCase();
}

/**
 * Checks for double extensions (e.g., document.pdf.exe)
 */
function hasDoubleExtension(fileName: string): boolean {
  const dangerousExtensions = ['exe', 'bat', 'cmd', 'sh', 'ps1', 'vbs', 'js', 'msi', 'dll'];
  const parts = fileName.toLowerCase().split('.');

  if (parts.length <= 2) return false;

  // Check if any middle part is a dangerous extension
  for (let i = 1; i < parts.length - 1; i++) {
    if (dangerousExtensions.includes(parts[i])) {
      return true;
    }
  }

  return false;
}

/**
 * Gets maximum file size based on file type
 */
function getMaxFileSize(file: File, category: FileCategory): number {
  if (category === 'lesson') {
    if (file.type.startsWith('video/')) {
      return MAX_FILE_SIZES.lessonVideo;
    }
    return MAX_FILE_SIZES.lessonImage;
  }
  return MAX_FILE_SIZES[category];
}

/**
 * Sanitizes filename to prevent path traversal and special characters
 */
export function sanitizeFileName(fileName: string): string {
  // Remove path components
  const name = fileName.split(/[/\\]/).pop() || fileName;

  // Remove special characters except dots and hyphens
  const sanitized = name
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^[.-]+/, '');

  // Ensure filename is not empty
  if (!sanitized || sanitized === '.') {
    return `file_${Date.now()}`;
  }

  return sanitized;
}

/**
 * Generates a secure random filename
 */
export function generateSecureFileName(originalName: string): string {
  const extension = getFileExtension(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return extension ? `${timestamp}-${random}.${extension}` : `${timestamp}-${random}`;
}

/**
 * Validates image dimensions (optional, for avatars)
 */
export async function validateImageDimensions(
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<FileValidationResult> {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve({ valid: true }); // Not an image, skip dimension check
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      if (img.width > maxWidth || img.height > maxHeight) {
        resolve({
          valid: false,
          error: `Image dimensions too large. Maximum: ${maxWidth}x${maxHeight}px`,
        });
      } else {
        resolve({ valid: true });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ valid: false, error: 'Failed to load image for validation' });
    };

    img.src = url;
  });
}
