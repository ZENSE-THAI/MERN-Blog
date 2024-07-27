import { useSelector } from 'react-redux';
import { TextInput ,Button, FileInput, Alert ,Spinner} from 'flowbite-react'
import { useState ,useRef ,useEffect ,useCallback } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from '../firebase.js';
import Swal from 'sweetalert2'
import { HiInformationCircle } from 'react-icons/hi';
import { FaCamera } from "react-icons/fa";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { updateStart,updateSuccess,updateFailure , deleteStart ,deleteSuccess,deleteFailure } from '../redux/user/userSlice.js'
import { useDispatch  } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";


// 


export const DashProfile = () => {

    const { currentUser, loading  } = useSelector(state => state.user);


    const [imageFile,SetImageFile] = useState(null);
    const [imageFileUrl,SetImageFileUrl] = useState(null);
    const [imageFileUploadProgress,setImageFileUploadProgress] = useState(null);
    const [imageFilleUploadError,setImageFileUploadError] = useState(null);
    const [formData,setFormData] = useState({});
    // const [showModal, setShowModal] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const filePickerRef = useRef();


    const [inputErrorMsg,setInputErrorMsg] = useState('');
    const [inputErrorIcon,setInputErrorIcon] = useState('gray');

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
                    position: "center",
                    icon: "success",
                    text:"update successfully",
                    title: "Success",
                    showConfirmButton: false,
                    timer: 1500
                  });

            }
        } catch (error) {
            setInputErrorMsg(error.message);
            dispatch(updateFailure(error.message));
        }
    }


    const handleDelete = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be delete account?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#009900',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteAccount();
            }
        });
    };

    const deleteAccount = async () => {

        try {
            dispatch(deleteStart());
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {method: 'DELETE'});
            const data = await res.json();

            if (!res.ok) {
                dispatch(deleteFailure(data.message))
            }
            else{
                dispatch(deleteSuccess(data));
                navigate('/sign-in')

            }
            Swal.fire({
                title: 'Deleted!',
                text: 'Your account has been deleted.',
                icon: 'success'
            });
        } catch (error) {
            dispatch(deleteFailure(error.message));
        }
    };



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
        <Button type='submit' color='blue' className='font-bold'>
        <FaRegEdit  className="mr-2 h-5 w-5"/>
        {
              loading ? (
                <div className='flex items-center gap-2 justify-center cursor-wait' >
                  <Spinner size='md' /> 
                  <span>Loading...</span>
                </div>
              ) : 'Update'
            }
        </Button>
        {/* {currentUser.isAdmin ? (
            <Link to='/create-post'>
                <Button  type='button' color='blue' outline className='font-bold w-full flex flex-wrap gap-2'>
                    <BsPostcard className="mr-2 h-5 w-5"/>  Create Post
                </Button>
            </Link>
        ) : (null)} */}
    </form>

    {currentUser.isAdmin ? (null) : (
        <div className='text-red-500 flex justify-end mt-2'>
            <span onClick={handleDelete} className='cursor-pointer'>
             Delete Account
            </span>
        </div>
    )}
        
      
      {/* {error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
      )} */}
      {/* <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete your account?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteUser}>
                Yes, I&apos;m sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal> */}
    </div> 
  )
}

