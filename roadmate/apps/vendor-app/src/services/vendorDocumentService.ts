export interface SimulatedUploadResult {
  fileName: string;
  success: boolean;
  error?: string;
}

export const uploadDocumentMock = async (
  key: string,
  fileUri: string,
  fileName: string,
  fileSize: number, // in bytes
  onProgress: (progress: number) => void
): Promise<SimulatedUploadResult> => {
  // Check for large file (e.g. > 10MB limit)
  const MAX_SIZE_MB = 10;
  if (fileSize > MAX_SIZE_MB * 1024 * 1024) {
    return {
      fileName,
      success: false,
      error: `File is too large. Max allowed size is ${MAX_SIZE_MB}MB.`,
    };
  }

  // Check for invalid file type
  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
  const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    return {
      fileName,
      success: false,
      error: 'Invalid file format. Only PDF, Word, and images (JPG/PNG) are accepted.',
    };
  }

  // Simulate progress callbacks
  const steps = 5;
  for (let i = 1; i <= steps; i++) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    onProgress((i / steps) * 100);
  }

  // Simulating intermittent network failure placeholder (1% chance or simulate offline if requested)
  if (!navigator.onLine) {
    return {
      fileName,
      success: false,
      error: 'Network connection error. Check your internet connection.',
    };
  }

  return {
    fileName: `verified_${Date.now()}_${fileName}`,
    success: true,
  };
};
