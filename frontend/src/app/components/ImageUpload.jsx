import { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, Lightbulb } from 'lucide-react';

export function ImageUpload({ images = [], onChange, maxImages = 10, maxSizeMB = 5 }) {
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  // Initialize previews from images prop
  useEffect(() => {
    if (images && images.length > 0) {
      // Convert string URLs to preview objects
      const initialPreviews = images.map((img, index) => {
        if (typeof img === 'string') {
          return {
            id: `existing-${index}-${img.substring(0, 20)}`,
            url: img,
            name: `Image ${index + 1}`,
            isExisting: true
          };
        }
        return img;
      });
      setPreviews(initialPreviews);
    }
  }, []);

  // Notify parent component when previews change
  useEffect(() => {
    // Send back URLs only
    const urls = previews.map(p => p.url);
    onChange(urls);
  }, [previews]);

  const handleFileSelect = (files) => {
    setError('');
    const fileArray = Array.from(files);
    
    // Validate number of images
    if (previews.length + fileArray.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed. You can upload ${maxImages - previews.length} more.`);
      return;
    }

    // Validate and process each file
    const validFiles = [];
    for (const file of fileArray) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not an image file.`);
        continue;
      }

      // Check file size
      if (file.size > maxSizeBytes) {
        setError(`${file.name} is too large. Maximum size is ${maxSizeMB}MB.`);
        continue;
      }

      validFiles.push(file);
    }

    // Create previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreview = {
          id: Date.now() + Math.random(),
          url: reader.result,
          name: file.name,
          file: file
        };

        setPreviews((prev) => [...prev, newPreview]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeImage = (id) => {
    const updated = previews.filter((img) => img.id !== id);
    setPreviews(updated);
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs sm:text-sm font-medium text-gray-700">
          Upload Images <span className="text-red-500">*</span>
        </label>
        <span className="text-xs text-gray-500">
          {previews.length}/{maxImages} images
        </span>
      </div>

      {/* Drag and Drop Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
      >
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          disabled={previews.length >= maxImages}
        />
        
        <label
          htmlFor="image-upload"
          className={`cursor-pointer ${previews.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm sm:text-base text-gray-700 font-medium mb-1">
            Click to upload or drag and drop
          </p>
          <p className="text-xs sm:text-sm text-gray-500">
            PNG, JPG, JPEG up to {maxSizeMB}MB each
          </p>
          {previews.length >= maxImages && (
            <p className="text-xs text-red-600 mt-2">
              Maximum images reached
            </p>
          )}
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Image Previews Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {previews.map((img) => (
            <div
              key={img.id}
              className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
            >
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-full object-cover"
              />
              
              {/* Remove Button */}
              <button
                onClick={() => removeImage(img.id)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg cursor-pointer"
                title="Remove image"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>

              {/* Image Name Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-xs text-white truncate">{img.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-900 flex items-center gap-1">
          <Lightbulb className="w-3 h-3" />
          <strong>Tips for great photos:</strong>
        </p>
        <ul className="text-xs text-blue-800 mt-1 space-y-1 ml-4 list-disc">
          <li><strong>Use landscape (horizontal) photos for best display</strong></li>
          <li>Take photos in good lighting (natural daylight is best)</li>
          <li>Show the bedroom, bathroom, common areas, and amenities</li>
          <li>Include multiple angles of each room</li>
          <li>Keep the space clean and organized</li>
          <li>First image will be used as the main thumbnail</li>
        </ul>
      </div>
    </div>
  );
}