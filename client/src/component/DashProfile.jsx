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
import { updateStart,updateSuccess,updateFailure } from '../redux/user/userSlice.js'
import { useDispatch  } from 'react-redux';
    



export const DashProfile = () => {

    const currentUser = useSelector(state=>state.user.currentUser);

    const [imageFile,SetImageFile] = useState(null);
    const [imageFileUrl,SetImageFileUrl] = useState(null);
    const [imageFileUploadProgress,setImageFileUploadProgress] = useState(null);
    const [imageFilleUploadError,setImageFileUploadError] = useState(null);
    const [formData,setFormData] = useState({});

    const dispatch = useDispatch();

    const filePickerRef = useRef();


    const [inputErrorMsg,setInputErrorMsg] = useState('');
    const [inputErrorIcon,setInputErrorIcon] = useState('gray');

    // console.log(inputErrorMsg);


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
                    setImageFileUploadProgress(null);
                    setFormData({...formData,profilePicture:dowloadUrl});
                });
            }
        );
    },[imageFile]);


    const handleChange = (e) => {
        setFormData({...formData,[e.target.id]:e.target.value});
    }

    const handleSumbit = async(e) => {

        e.preventDefault();
        if(Object.keys(formData).length === 0) {
            return;
        }

        try {

            dispatch(updateStart());
            const res  = await fetch(`/api/user/update/${currentUser._id}`,{
        
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(formData),
            });
            // console.log(res);
            const data = await res.json();
            if(!res.ok){
                setInputErrorMsg(data.message);
                dispatch(updateFailure(data.message));
            }
            else{
                dispatch(updateSuccess(data));
                setInputErrorIcon('gray');
                Swal.fire({
                    title: "Success",
                    text:  "Update Successful!",
                    icon:  'success',
                    confirmButtonText:"Ok",
                  });
            }
        } catch (error) {
            setInputErrorMsg(error.message);
            dispatch(updateFailure(error.message));
        }
    }

  return (
    <div className='max-w-lg mx-auto p-4 w-full'>
    <h1 className='my-7 text-center text-3xl font-semibold uppercase'>Profile</h1>
    <form className='flex flex-col gap-4' onSubmit={handleSumbit} >
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
                        color:'white',
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
            <img 
            src={imageFileUrl || currentUser.profilePicture || 'fallback-image-url'} 
            alt="User Profile Picture"  
            className={`rounded-full w-full h-full object-cover border-4 border-[lightgray]
             ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'} `}/>
        </div>

        {imageFilleUploadError ? (
            <Alert color="failure" icon={HiInformationCircle}>
                <span>{imageFilleUploadError}</span>
            </Alert>
        ) : (null)}
        <div className="">
            <TextInput 
                type='text' 
                id='username'
                placeholder='username' 
                defaultValue={currentUser.username}  
                autoComplete="current-password"
                onChange={handleChange}
                color={inputErrorMsg.includes('Username') ? 'failure' : inputErrorIcon}

            />
           <label className='text-red-600'>
                {inputErrorMsg.includes('Username') ? (
                    inputErrorMsg
                ) : ( null)}
            </label>
        </div>


        {/* color="failure"
           
            } */}
        <TextInput 
            type='email' 
            id='email' 
            placeholder='email' 
            defaultValue={currentUser.email}  
            autoComplete="current-password"
            onChange={handleChange}
        />
        <div className="">
        <TextInput 
            type='password' 
            id='password' 
            placeholder='password'
            autoComplete="current-password"
            onChange={handleChange}
            color={inputErrorMsg.includes('Password') ? 'failure' : inputErrorIcon}
        />
            <label className='text-red-600'>
                {inputErrorMsg.includes('Password') ? (
                    inputErrorMsg
                ) : ( null)}
            </label>
        </div>
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

