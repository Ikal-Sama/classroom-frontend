import { ALLOWED_TYPES, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET, MAX_FILE_SIZE } from '@/constants';
import { UploadWidgetValue } from '@/types';
import { UploadCloud } from 'lucide-react';
import { useEffect, useRef, useState } from 'react'

const UploadWidget = ({ value = null, onChange, disabled = false }) => {
    const widgetRef = useRef<CloudinaryWidget | null>(null)
    const onChangeRef = useRef(onChange)

    const [preview, setPreview] = useState<UploadWidgetValue | null>(value);
    const [deleteToken, setDeleteToken] = useState<string | null>(null);
    const [isRemoving, setIsRemoving] = useState(false);

    useEffect(() => {
        setPreview(value);
        if (!value) setDeleteToken(null);
    }, [value])

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange])

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const initializeWidget = () => {
            if (!window.cloudinary || widgetRef.current) return false;

            widgetRef.current = window.cloudinary.createUploadWidget({
                cloudName: CLOUDINARY_CLOUD_NAME,
                uploadPreset: CLOUDINARY_UPLOAD_PRESET,
                multiple: false,
                folder: 'uploads',
                maxFileSize: MAX_FILE_SIZE,
                clientAllowedFormats: ALLOWED_TYPES,
                return_delete_token: true,
            }, (error, result) => {
                if (!error && result.event === 'success') {
                    const payload: UploadWidgetValue = {
                        url: result.info.secure_url,
                        publicId: result.info.public_id
                    }
                    setPreview(payload);
                    setDeleteToken(result.info.delete_token ?? null)
                    onChangeRef.current?.(payload)
                }
            });

            return true;
        }
        if (initializeWidget()) return;

        const intervalId = window.setInterval(() => {
            if (initializeWidget()) {
                window.clearInterval(intervalId)
            }
        }, 500)

        return () => window.clearInterval(intervalId);
    }, [])

    const openWidget = () => {
        if (!disabled) widgetRef.current?.open()
    }

    const removeFromCloudinary = async () => {
        if (!deleteToken) {
            setPreview(null);
            onChangeRef.current?.(null);
            return;
        }

        setIsRemoving(true);
        try {
            const formData = new FormData();
            formData.append('token', deleteToken);

            const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/delete_by_token`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to remove file from Cloudinary');
            }

            setPreview(null);
            setDeleteToken(null);
            onChangeRef.current?.(null);
        } catch (error) {
            console.error('Error removing file from Cloudinary:', error);
        } finally {
            setIsRemoving(false);
        }
    }

    return (
        <div className='space-y-2'>
            {preview ? (
                <div className='upload-preview'>
                    <img src={preview.url} alt='Uploaded file' />
                    <button type='button' onClick={removeFromCloudinary} disabled={isRemoving}>
                        {isRemoving ? 'Removing...' : 'Remove'}
                    </button>
                </div>
            ) : <div className='upload-dropzone' role='button' tabIndex={0}
                onClick={openWidget} onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault()
                        openWidget();
                    }
                }}
            >
                <div className='upload-prompt'>
                    <UploadCloud className='icon' />
                    <div>
                        <p>Click to upload photo</p>
                        <p>PNG, JPG up to 5MB</p>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default UploadWidget