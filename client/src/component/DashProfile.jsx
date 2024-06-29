import { useSelector } from 'react-redux';
import { TextInput ,Button, FileInput, Alert } from 'flowbite-react'
import { useState ,useRef ,useEffect ,useCallback } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase.js';
import Swal from 'sweetalert2'
import { HiInformationCircle } from 'react-icons/hi';
import { FaCamera } from "react-icons/fa";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';




export const DashProfile = () => {
    const currentUser = useSelector(state=>state.user.currentUser);
    const [imageFile,SetImageFile] = useState(null);
    const [imageFileUrl,SetImageFileUrl] = useState(null);
    const [imageFileUploadProgress,setImageFileUploadProgress] = useState(null);
    const [imageFilleUploadError,setImageFileUploadError] = useState(null);
    const filePickerRef = useRef();

    const [toastIcon, setToastIcon] = useState('');
    const [toastMessage, setToastMessage] = useState('');


    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
        }
    });

    useEffect(() => {
        if (toastIcon && toastMessage) {
            Toast.fire({
                icon: toastIcon,
                title: toastMessage
            });
        }
    }, [toastIcon, toastMessage, Toast]);
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        // เงื่อนไขตรวจสอบขนาดไฟล์ก่อนจะเริ่มทำการอัปโหลดไฟล์
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setImageFileUploadError('could not upload image (File must be less than 2MB)');
            } else {
                SetImageFile(file);
                SetImageFileUrl(URL.createObjectURL(file));
                setImageFileUploadError(null); // Clear any previous errors
            }
        }
    }

    useEffect(() => {
        if(imageFile){
            uploadImage();
        }},[imageFile]
    );

    const uploadImage = useCallback(async () => {
        // service firebase.storage {
        //     match /b/{bucket}/o {
        //       match /{allPaths=**} {
        //         allow read;
        //         allow write: if
        //         request.resource.size < 2 * 1024 * 1024 &&
        //         request.resource.contentType.matches("image/.*");
        //       }
        //     }
        //   }
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile.name;
        const storageRef = ref(storage,fileName);
        const uploadTask = uploadBytesResumable(storageRef,imageFile);
        uploadTask.on('state_changed',
            (snapshot) =>{
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setImageFileUploadProgress(progress.toFixed(0));
            },() => {
                setImageFileUploadError('could not upload image,please try again later');
            },() => {
                getDownloadURL(uploadTask.snapshot.ref).then((dowloadUrl) => {
                    SetImageFileUrl(dowloadUrl);
                    setToastIcon('success');
                    setToastMessage('Image uploaded successfully');
                    setImageFileUploadProgress(null);
                });
            }
        );
    },[imageFile]);


  return (
    <div className='max-w-lg mx-auto p-4 w-full'>
    <h1 className='my-7 text-center text-3xl font-semibold uppercase'>Profile</h1>
    <form className='flex flex-col gap-4'>
            <FileInput accept='image/*' onChange={handleImageChange}  ref={filePickerRef} className='hidden'/>
        <div className="relative h-32 w-32 self-center cursor-pointer shadow-md  rounded-full" onClick={() => filePickerRef.current.click()}>
            {imageFileUploadProgress && (
                <CircularProgressbar 
                value={imageFileUploadProgress || 0}
                text={`${imageFileUploadProgress}%`}
                strokeWidth={3}
                styles={{
                    root: {
                        position : 'absolute',
                        top : '0',
                        left : '0',
                        width : '100%',
                        height : '100%',
                        color:'white'
                    },
                    path: {
                        stroke:`rgba(41, 216, 53, ${imageFileUploadProgress / 100})`,
                    },
                    text: {
                        fill: '#fff',
                        fontSize: '18px',
                      }
                }}
                />
            )}
            <span className='absolute bottom-2 right-2  text-white bg-gray-900 dark:text-black  dark:bg-gray-200  w-8 h-8 rounded-full z-10 flex justify-center items-center'>
                <FaCamera/>
            </span>
            <img src={imageFileUrl || currentUser.profilePicture || 'fallback-image-url'} alt="User Profile Picture"  className='rounded-full w-full h-full object-cover border-4 border-[lightgray]'/>
        </div>

        {imageFilleUploadError ? (
            <Alert color="failure" icon={HiInformationCircle}>
                <span>{imageFilleUploadError}</span>
            </Alert>
        ) : (null)}
        
        <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username}  autoComplete="current-password"/>
        <TextInput type='text' id='email' placeholder='email' defaultValue={currentUser.email}  autoComplete="current-password"/>
        <TextInput type='password' id='password' placeholder='password'autoComplete="current-password"/>
        <Button type='submit' color='blue' className='font-bold'>Update</Button>
    </form>
    <div className="text-red-500 mt-5 flex justify-end  underline ">
        <span className=''>
            Delete Account
        </span>
    </div>
    </div>
  )
}
