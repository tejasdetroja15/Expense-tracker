import React from 'react'
import { useState, useRef } from 'react';
import { LuUser , LuUpload , LuTrash} from "react-icons/lu";

const ProfilePhotoSelector = ({image, setImage}) => { 
    const inputRef = useRef (null); 
    const [previewUrl, setPreviewUrl] = useState(null); 
    
    const handleImageChange = (event) => { 
    const file = event.target.files[0]; 
    if (file) { 
    // Update the image state  
        setImage(file); 
    // Generate preview URL from the file 
        const preview = URL.createObjectURL(file); 
        setPreviewUrl(preview); 
        } 
    }; 
    const handleRemoveImage = () => { 
        setImage(null); 
        setPreviewUrl(null); 
    }; 

    const onChooseFile = () => { 
        inputRef.current.click(); 
    }; 
    
    return (
        <div className='flex justify-center mb-6'>
            <input 
                type='file' 
                accept='image/*' 
                ref={inputRef} 
                onChange={handleImageChange} 
                className='hidden' 
            />

            {!image ? (
                <div className='flex flex-col items-center'>
                    <LuUser className='text-gray-500 text-4xl mb-2' />
                    <button 
                        type='button' 
                        className='bg-blue-500 text-white px-4 py-2 rounded-md' 
                        onClick={onChooseFile}
                    >
                        <LuUpload className='inline mr-2' /> Upload Photo
                    </button>
                </div>
            ) : (
                <div className='relative'>
                    <img 
                        src={previewUrl} 
                        alt='Profile Photo' 
                        className='w-32 h-32 object-cover rounded-full border border-gray-300' 
                    />
                    <button 
                        type='button' 
                        className='absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full' 
                        onClick={handleRemoveImage}
                    >
                        <LuTrash className='text-lg' />
                    </button>
                </div>
            )}
        </div>
    );
};


export default ProfilePhotoSelector;
