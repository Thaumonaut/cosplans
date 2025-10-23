/**
 * Photo Service
 *
 * Handles photo uploads, compression, and storage for all resource types.
 * Provides unified interface for photo operations across costumes, crew, equipment, props, and locations.
 */

import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import imageCompression from 'browser-image-compression'
import type { ResourcePhoto } from '$lib/types/resources'

export interface PhotoUploadOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
}

export interface PhotoUploadResult {
  success: boolean
  photos: ResourcePhoto[]
  errors: string[]
}

export class PhotoService {
  private supabase: SupabaseClient

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase
  }

  /**
   * Upload photos for a resource with compression
   */
  async uploadPhotos(
    resourceType: 'costume' | 'crew_member' | 'equipment' | 'prop' | 'location',
    resourceId: string,
    files: File[],
    options: PhotoUploadOptions = {}
  ): Promise<PhotoUploadResult> {
    const result: PhotoUploadResult = {
      success: true,
      photos: [],
      errors: []
    }

    // Default compression options
    const compressionOptions = {
      maxSizeMB: options.maxSizeMB ?? 1,
      maxWidthOrHeight: options.maxWidthOrHeight ?? 1920,
      useWebp: options.format === 'webp' || true,
      quality: options.quality ?? 0.85,
      ...options
    }

    try {
      // Get current photo count for this resource
      const { data: existingPhotos, error: countError } = await this.supabase
        .from('resource_photos')
        .select('id')
        .eq('resource_type', resourceType)
        .eq('resource_id', resourceId)

      if (countError) {
        result.errors.push(`Failed to check existing photos: ${countError.message}`)
        result.success = false
        return result
      }

      // Check if adding these photos would exceed limit (10 max)
      if (existingPhotos && existingPhotos.length + files.length > 10) {
        result.errors.push(`Maximum 10 photos allowed per resource. Current: ${existingPhotos.length}, trying to add: ${files.length}`)
        result.success = false
        return result
      }

      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        try {
          // Compress image
          const compressedFile = await this.compressImage(file, compressionOptions)

          // Generate unique filename
          const fileExtension = compressionOptions.useWebp ? 'webp' : file.name.split('.').pop()?.toLowerCase() || 'jpg'
          const timestamp = Date.now()
          const randomId = Math.random().toString(36).substring(2, 15)
          const filename = `${resourceType}_${resourceId}_${timestamp}_${randomId}.${fileExtension}`

          // Upload to Supabase Storage
          const { data: uploadData, error: uploadError } = await this.supabase.storage
            .from('resource-photos')
            .upload(`${resourceId}/${filename}`, compressedFile, {
              cacheControl: '3600',
              upsert: false
            })

          if (uploadError) {
            result.errors.push(`Upload failed for ${file.name}: ${uploadError.message}`)
            continue
          }

          // Get public URL
          const { data: urlData } = this.supabase.storage
            .from('resource-photos')
            .getPublicUrl(uploadData.path)

          // Get current user
          const { data: { user } } = await this.supabase.auth.getUser()

          if (!user) {
            result.errors.push('User not authenticated')
            result.success = false
            continue
          }

          // Create database record
          const photoData = {
            resource_type: resourceType,
            resource_id: resourceId,
            storage_path: urlData.publicUrl,
            filename: filename,
            file_size: compressedFile.size,
            mime_type: compressedFile.type,
            width: undefined as number | undefined, // Could be determined server-side
            height: undefined as number | undefined,
            display_order: existingPhotos ? existingPhotos.length + i : i,
            caption: null,
            is_primary: existingPhotos?.length === 0 && i === 0, // First photo is primary
            uploaded_by: user.id
          }

          const { data: photoRecord, error: insertError } = await this.supabase
            .from('resource_photos')
            .insert(photoData)
            .select()
            .single()

          if (insertError) {
            result.errors.push(`Database error for ${file.name}: ${insertError.message}`)
            continue
          }

          result.photos.push(photoRecord)

        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          result.errors.push(`Processing failed for ${file.name}: ${errorMessage}`)
        }
      }

      // Update success status
      result.success = result.photos.length > 0

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      result.errors.push(`Upload service error: ${errorMessage}`)
      result.success = false
    }

    return result
  }

  /**
   * Delete a photo
   */
  async deletePhoto(photoId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Get photo record first
      const { data: photo, error: fetchError } = await this.supabase
        .from('resource_photos')
        .select('storage_path')
        .eq('id', photoId)
        .single()

      if (fetchError) {
        return { success: false, error: `Failed to fetch photo: ${fetchError.message}` }
      }

      // Delete from storage
      if (photo.storage_path) {
        const path = photo.storage_path.split('/').pop()
        if (path) {
          await this.supabase.storage
            .from('resource-photos')
            .remove([path])
        }
      }

      // Delete from database
      const { error: deleteError } = await this.supabase
        .from('resource_photos')
        .delete()
        .eq('id', photoId)

      if (deleteError) {
        return { success: false, error: `Failed to delete photo: ${deleteError.message}` }
      }

      return { success: true }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: `Delete failed: ${errorMessage}` }
    }
  }

  /**
   * Update photo metadata (caption, order, primary status)
   */
  async updatePhoto(
    photoId: string,
    updates: {
      caption?: string
      display_order?: number
      is_primary?: boolean
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from('resource_photos')
        .update(updates)
        .eq('id', photoId)

      if (error) {
        return { success: false, error: `Failed to update photo: ${error.message}` }
      }

      return { success: true }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: `Update failed: ${errorMessage}` }
    }
  }

  /**
   * Get photos for a resource
   */
  async getPhotos(
    resourceType: 'costume' | 'crew_member' | 'equipment' | 'prop' | 'location',
    resourceId: string
  ): Promise<{ success: boolean; photos?: ResourcePhoto[]; error?: string }> {
    try {
      const { data: photos, error } = await this.supabase
        .from('resource_photos')
        .select('*')
        .eq('resource_type', resourceType)
        .eq('resource_id', resourceId)
        .order('display_order', { ascending: true })

      if (error) {
        return { success: false, error: `Failed to fetch photos: ${error.message}` }
      }

      return { success: true, photos: photos || [] }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      return { success: false, error: `Fetch failed: ${errorMessage}` }
    }
  }

  /**
   * Compress image using browser-image-compression
   */
  private async compressImage(file: File, options: PhotoUploadOptions): Promise<File> {
    try {
      const compressionOptions = {
        maxSizeMB: options.maxSizeMB ?? 1,
        maxWidthOrHeight: options.maxWidthOrHeight ?? 1920,
        useWebp: options.format === 'webp' || true,
        quality: options.quality ?? 0.85,
        fileType: options.format === 'webp' ? 'image/webp' : undefined
      }

      const compressedFile = await imageCompression(file, compressionOptions)
      return compressedFile

    } catch (error) {
      console.error('Image compression failed:', error)
      // Return original file if compression fails
      return file
    }
  }

  /**
   * Generate thumbnail for list views
   */
  private async generateThumbnail(file: File, maxSize: number = 400): Promise<string> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calculate thumbnail dimensions
        let { width, height } = img
        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height
            height = maxSize
          }
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height)
        canvas.toBlob((blob) => {
          if (blob) {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(blob)
          } else {
            reject(new Error('Failed to generate thumbnail'))
          }
        }, 'image/jpeg', 0.8)
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }
}

// Export singleton instance (will be initialized in +layout.server.ts)
export let photoService: PhotoService | null = null

// Initialize service with Supabase client
export function initializePhotoService(supabase: SupabaseClient) {
  photoService = new PhotoService(supabase)
  return photoService
}
