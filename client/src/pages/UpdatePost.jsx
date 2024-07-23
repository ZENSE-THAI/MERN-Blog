import { TextInput, Alert, FileInput, Label, Checkbox, Button } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from "../firebase.js";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom'; 
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Breadcrumb } from "flowbite-react";
import { HiHome } from "react-icons/hi";

export const UpdatePost = ({ postId }) => { // !comment รับค่า postId ผ่าน props
    const quillRef = useRef(null);
    const [file, setFile] = useState(null);
    const [imageProgress, setImageProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({
        category: [],
        title: '',
        content: '',
        image: ''
    });
    const [publishError, setPiblishError] = useState(null);
    const currentUser = useSelector((state) => state.user.currentUser);
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/post/getpost?postId=${postId}`);
                const data = await res.json();
                if (!res.ok) {
                    setPiblishError(data.message);
                    return;
                }
                if (res.ok) {
                    setPiblishError(null);
                    setFormData({
                        ...data.posts[0],
                        category: data.posts[0].category || []
                    });
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchPost();
    }, [postId]);

    const handleUploadImage = async () => {
        try {
            if (!file) {
                setImageUploadError('Please select a file to upload');
                return;
            }
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageProgress(progress.toFixed(0));
                },
                () => {
                    setImageUploadError('Upload error');
                    setImageProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadError(null);
                        setImageProgress(null);
                        setFormData(prevState => ({
                            ...prevState,
                            image: downloadURL
                        }));
                    });
                }
            );
        } catch (error) {
            setImageUploadError('Image Upload failed!');
            setImageProgress(null);
        }
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prevState => {
            const category = checked
                ? [...prevState.category, value]
                : prevState.category.filter(cat => cat !== value);
            return { ...prevState, category };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to save the changes?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, update it!',
            cancelButtonText: 'No, cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const dataToUpdate = {
                        ...formData,
                        image: file ? formData.image : formData.image
                    };
                    const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(dataToUpdate)
                    });
                    const data = await res.json();
                    if (!res.ok) {
                        setPiblishError(data.message);
                        return;
                    }
                    if (res.ok) {
                        setPiblishError(null);
                        Swal.fire({
                            title: "Updated!",
                            text: "Your post has been updated.",
                            icon: "success"
                        }).then(() => {
                            navigate(`/dashboard?tab=posts`); // !comment ใช้ navigate เพื่อเปลี่ยนหน้าไปยังหน้า posts
                        });
                    }
                } catch (error) {
                    setPiblishError('Something went wrong!');
                }
            }
        });
    };

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <Breadcrumb aria-label="Default breadcrumb example">
                <Breadcrumb.Item href="/dashboard?tab=profile" icon={HiHome}>
                    Dashboard
                </Breadcrumb.Item>
                <Breadcrumb.Item href="/dashboard?tab=posts">Posts</Breadcrumb.Item>
                <Breadcrumb.Item>Update Post : {formData.title}</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="font-semibold text-2xl md:text-4xl text-center my-7">Update Post</h1>
            {publishError && (
                <Alert color="failure" className="mb-4">
                    {publishError}
                </Alert>
            )}
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 sm:flex-row justify-between items-center">
                    <TextInput
                        type="text"
                        placeholder='Title'
                        className="w-full flex-1"
                        required
                        autoComplete="true"
                        color='gray'
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        value={formData.title || ''}
                    />
                    <div className="flex flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap justify-center" required>
                            <div className="flex items-center gap-2">
                                <Checkbox id="accept-react" value='react' checked={formData.category.includes('react')} onChange={handleCheckboxChange} />
                                <Label htmlFor="accept-react" className="flex">
                                    React
                                </Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="accept-javascript" value='javascript' checked={formData.category.includes('javascript')} onChange={handleCheckboxChange} />
                                <Label htmlFor="accept-javascript" className="flex">
                                    JavaScript
                                </Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="accept-nodejs" value='nodejs' checked={formData.category.includes('nodejs')} onChange={handleCheckboxChange} />
                                <Label htmlFor="accept-nodejs" className="flex">
                                    Nodejs
                                </Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="accept-htmlcss" value='html&css' checked={formData.category.includes('html&css')} onChange={handleCheckboxChange} />
                                <Label htmlFor="accept-htmlcss" className="flex">
                                    Html&Css
                                </Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox id="accept-flowbite" value='flowbite' checked={formData.category.includes('flowbite')} onChange={handleCheckboxChange} />
                                <Label htmlFor="accept-flowbite" className="flex">
                                    Flowbite
                                </Label>
                            </div>
                        </div>
                    </div>
                </div>
                <label htmlFor="fileUpload">Header Picture</label>
                <div className="w-full rounded-lg border-dashed border-2 p-2 flex flex-row items-center justify-between">
                    <FileInput id="file" onChange={(e) => setFile(e.target.files[0])} />
                    <Button color="blue" onClick={handleUploadImage} disabled={imageProgress}>
                        {imageProgress ? (
                            <div className="w-16 h-16">
                                <CircularProgressbar
                                    value={imageProgress}
                                    text={`${imageProgress}%`}
                                />
                            </div>
                        ) : "Upload"}
                    </Button>
                </div>
                {imageUploadError && (
                    <span className="text-red-500 text-sm">
                        {imageUploadError}
                    </span>
                )}
                {formData.image && 
                    <img
                        src={formData.image}
                        alt="header picture"
                        className="w-full h-64 object-cover"
                    />
                }
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    placeholder="Write something...."
                    className="h-72 mb-12 text-gray-900 dark:text-gray-100"
                    required
                    onChange={(value) => setFormData(prevState => ({ ...prevState, content: value }))}
                    value={formData.content || ''}
                />
                <Button color='blue' type='submit'>Update</Button>
            </form>
        </div>
    );
}

export default UpdatePost;
