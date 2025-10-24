<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import imageCompression from 'browser-image-compression'
  import CosplansLogo from '$lib/components/icons/CosplansLogo.svelte'

  interface Props {
    maxPhotos?: number
    maxFileSize?: number // in MB
    acceptedTypes?: string[]
    compressionOptions?: {
      maxSizeMB?: number
      maxWidthOrHeight?: number
      useWebp?: boolean
      quality?: number
    }
    class?: string
    disabled?: boolean
  }

  let {
    maxPhotos = 10,
    maxFileSize = 5,
    acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    compressionOptions = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebp: true,
      quality: 0.85
    },
    class: className = '',
    disabled = false
  }: Props = $props()

  const dispatch = createEventDispatcher<{
    photosUploaded: { files: File[], compressedFiles: File[] }
    photoRemoved: { index: number }
    error: { message: string }
  }>()

  let uploadedFiles: { file: File; preview: string; compressed?: File }[] = []
  let isCompressing = false
  let dragOver = false

  // Handle file selection
  async function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement
    const files = Array.from(target.files || [])

    if (files.length === 0) return

    await processFiles(files)
  }

  // Handle drag and drop
  function handleDragOver(event: DragEvent) {
    event.preventDefault()
    dragOver = true
  }

  function handleDragLeave(event: DragEvent) {
    event.preventDefault()
    dragOver = false
  }

  async function handleDrop(event: DragEvent) {
    event.preventDefault()
    dragOver = false

    const files = Array.from(event.dataTransfer?.files || [])
    const imageFiles = files.filter(file => acceptedTypes.includes(file.type))

    if (imageFiles.length === 0) {
      dispatch('error', { message: 'Please upload only image files (JPEG, PNG, WebP)' })
      return
    }

    await processFiles(imageFiles)
  }

  // Process and compress files
  async function processFiles(files: File[]) {
    if (disabled) return

    // Check if adding these files would exceed maxPhotos
    if (uploadedFiles.length + files.length > maxPhotos) {
      dispatch('error', {
        message: `Maximum ${maxPhotos} photos allowed. You tried to add ${files.length} photos.`
      })
      return
    }

    // Check file sizes
    const oversizedFiles = files.filter(file => file.size > maxFileSize * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      dispatch('error', {
        message: `Some files are too large. Maximum file size is ${maxFileSize}MB.`
      })
      return
    }

    isCompressing = true

    try {
      const processedFiles: { file: File; preview: string; compressed?: File }[] = []

      for (const file of files) {
        // Generate preview
        const preview = await generatePreview(file)

        // Compress image
        const compressedFile = await compressImage(file)

        processedFiles.push({
          file,
          preview,
          compressed: compressedFile
        })
      }

      // Add to uploaded files
      uploadedFiles = [...uploadedFiles, ...processedFiles]

      // Dispatch event with both original and compressed files
      const compressedFiles = processedFiles.map(p => p.compressed!).filter(Boolean)
      dispatch('photosUploaded', {
        files: processedFiles.map(p => p.file),
        compressedFiles
      })

    } catch (error) {
      console.error('Error processing files:', error)
      dispatch('error', {
        message: 'Failed to process images. Please try again.'
      })
    } finally {
      isCompressing = false
    }
  }

  // Generate preview URL for file
  function generatePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Compress image using browser-image-compression
  async function compressImage(file: File): Promise<File> {
    try {
      const compressedFile = await imageCompression(file, compressionOptions)
      return compressedFile
    } catch (error) {
      console.error('Compression error:', error)
      // Return original file if compression fails
      return file
    }
  }

  // Remove photo
  function removePhoto(index: number) {
    uploadedFiles = uploadedFiles.filter((_, i) => i !== index)
    dispatch('photoRemoved', { index })
  }

  // Clear all photos
  function clearAll() {
    uploadedFiles = []
  }

  // Format file size for display
  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
</script>

<div class="space-y-4 {className}">
  <!-- Upload area -->
  <div
    class="relative border-2 border-dashed rounded-lg p-8 text-center transition-colors {dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'}"
    class:border-blue-400={dragOver}
    class:bg-blue-50={dragOver}
    style="border-color: var(--theme-sidebar-border); background: var(--theme-background);"
    on:dragover={handleDragOver}
    on:dragleave={handleDragLeave}
    on:drop={handleDrop}
  >
    <!-- Hidden file input -->
    <input
      type="file"
      multiple
      accept={acceptedTypes.join(',')}
      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      onchange={handleFileSelect}
      {disabled}
    />

    <!-- Upload content -->
    <div class="space-y-4">
      <div class="mx-auto h-12 w-12 rounded-lg" style="background: var(--theme-sidebar-hover); color: var(--theme-sidebar-accent);">
        <CosplansLogo size="w-6 h-6" color="currentColor" />
      </div>

      <div>
        <p class="text-lg font-medium" style="color: var(--theme-foreground);">
          {#if isCompressing}
            Compressing images...
          {:else}
            Drop photos here or click to browse
          {/if}
        </p>
        <p class="text-sm mt-1" style="color: var(--theme-sidebar-muted);">
          Supports JPEG, PNG, WebP • Max {maxFileSize}MB per file • Up to {maxPhotos} photos
        </p>
        <p class="text-xs mt-1" style="color: var(--theme-sidebar-muted);">
          Images will be compressed to optimize storage and loading speed
        </p>
      </div>

      {#if disabled}
        <div class="text-sm font-medium" style="color: var(--theme-sidebar-muted);">
          Upload disabled
        </div>
      {/if}
    </div>
  </div>

  <!-- Upload progress -->
  {#if isCompressing}
    <div class="flex items-center justify-center gap-3 py-4" style="color: var(--theme-sidebar-muted);">
      <div class="animate-spin rounded-full h-6 w-6 border-2 border-current border-t-transparent"></div>
      <span class="text-sm">Compressing images...</span>
    </div>
  {/if}

  <!-- Uploaded photos preview -->
  {#if uploadedFiles.length > 0}
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h4 class="font-medium" style="color: var(--theme-foreground);">
          Uploaded Photos ({uploadedFiles.length}/{maxPhotos})
        </h4>
        <button
          type="button"
          class="text-sm font-medium transition-colors hover:text-[var(--theme-error)]"
          style="color: var(--theme-sidebar-muted);"
          onclick={clearAll}
        >
          Clear all
        </button>
      </div>

      <!-- Photo grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {#each uploadedFiles as file, index}
          <div class="relative group">
            <img
              src={file.preview}
              alt="Preview {index + 1}"
              class="aspect-square w-full rounded-lg object-cover border"
              style="border-color: var(--theme-sidebar-border);"
            />

            <!-- Remove button -->
            <button
              type="button"
              class="absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 text-white hover:bg-black/70"
              onclick={() => removePhoto(index)}
              aria-label="Remove photo"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <!-- File info -->
            <div class="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 rounded-b-lg">
              <div class="truncate">{file.file.name}</div>
              <div>{formatFileSize(file.file.size)}</div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  /* Ensure proper drag and drop styling */
  .border-dashed {
    border-style: dashed;
  }

  /* Photo preview styling */
  img {
    transition: transform 0.2s ease;
  }

  img:hover {
    transform: scale(1.05);
  }
</style>
