import React, { useState } from 'react';

// Define a type for the form data, can be expanded
interface DiaryFormData {
  title: string;
  content: string;
  category: string;
  imageFile: File | null;
  videoFile: File | null;
}

const DiaryCreateForm: React.FC = () => {
  const [formData, setFormData] = useState<DiaryFormData>({
    title: '',
    content: '',
    category: '',
    imageFile: null,
    videoFile: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual submission logic
    // This would involve uploading files (if any) and then saving the diary entry data
    console.log('Form submitted:', formData);
    alert('Diary entry submitted (see console for data). File upload not yet implemented.');
    // Reset form after submission (optional)
    setFormData({
      title: '',
      content: '',
      category: '',
      imageFile: null,
      videoFile: null,
    });
    // Clear file inputs
    const imageInput = document.getElementById('imageFile') as HTMLInputElement;
    if (imageInput) imageInput.value = '';
    const videoInput = document.getElementById('videoFile') as HTMLInputElement;
    if (videoInput) videoInput.value = '';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg shadow-md border border-border">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-card-foreground mb-1">
          Title
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground"
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-card-foreground mb-1">
          Content
        </label>
        <textarea
          name="content"
          id="content"
          rows={6}
          value={formData.content}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-card-foreground mb-1">
          Category (Optional)
        </label>
        <input
          type="text"
          name="category"
          id="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground"
        />
      </div>

      {/* File Inputs - based on Figma nodes 88:477 (photo) and 88:473 (video) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="imageFile" className="block text-sm font-medium text-card-foreground mb-1">
            Upload Image (Optional)
          </label>
          <input
            type="file"
            name="imageFile"
            id="imageFile"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
          />
        </div>
        <div>
          <label htmlFor="videoFile" className="block text-sm font-medium text-card-foreground mb-1">
            Upload Video (Optional)
          </label>
          <input
            type="file"
            name="videoFile"
            id="videoFile"
            accept="video/*"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
          />
        </div>
      </div>
      
      {(formData.imageFile || formData.videoFile) && (
        <div className="mt-4 p-3 bg-muted/50 rounded-md">
            <p className="text-sm font-medium text-muted-foreground">Selected files:</p>
            {formData.imageFile && <p className="text-xs text-muted-foreground">Image: {formData.imageFile.name}</p>}
            {formData.videoFile && <p className="text-xs text-muted-foreground">Video: {formData.videoFile.name}</p>}
        </div>
      )}

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-colors"
        >
          Create Diary Entry
        </button>
      </div>
    </form>
  );
};

export default DiaryCreateForm; 