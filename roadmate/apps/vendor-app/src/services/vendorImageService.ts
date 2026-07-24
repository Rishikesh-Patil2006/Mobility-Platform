export interface SimulatedImageUploadResult {
  imageUrl: string;
  success: boolean;
  error?: string;
}

export const uploadImageMock = async (
  fileUri: string,
  fileName: string,
  fileSize: number, // in bytes
  onProgress: (progress: number) => void
): Promise<SimulatedImageUploadResult> => {
  // Check for large file (e.g. > 5MB limit for images)
  const MAX_SIZE_MB = 5;
  if (fileSize > MAX_SIZE_MB * 1024 * 1024) {
    return {
      imageUrl: '',
      success: false,
      error: `Image file size exceeds ${MAX_SIZE_MB}MB limit.`,
    };
  }

  // Check for invalid image type
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    return {
      imageUrl: '',
      success: false,
      error: 'Invalid image format. Only JPG, PNG, and WebP are allowed.',
    };
  }

  // Simulate progress
  const steps = 4;
  for (let i = 1; i <= steps; i++) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    onProgress((i / steps) * 100);
  }

  // Mock standard Unsplash image or use local asset uri
  const mockImages = [
    'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=600',
    'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?w=600',
    'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600',
    'https://images.unsplash.com/photo-1619642e1cd6c?w=600',
  ];
  const selectedImage = mockImages[Math.floor(Math.random() * mockImages.length)];

  return {
    imageUrl: selectedImage,
    success: true,
  };
};
