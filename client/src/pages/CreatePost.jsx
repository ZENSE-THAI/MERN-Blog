import { TextInput, Textarea, FileInput, Label, Checkbox, Button } from "flowbite-react";
import { useState , useRef} from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { app } from "../firebase.js";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';




export const CreatePost = () => {

    const quillRef = useRef(null);
    const [file,setFile] = useState(null);
    const [imageProgress,setImageProgress] = useState(null);
    const [imageUploadError,setImageUploadError] = useState(null);
    const [fromData,setFromData] = useState({});

    console.log(imageProgress);
    console.log(imageUploadError);
    console.log(fromData);

    const handleUploadImage = async () => {
        try {
            if(!file) {
                setImageUploadError('Please select a file to upload');
                return;
            }
            setImageUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime()+'-'+file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageProgress(progress.toFixed(0));
                },() => {
                    setImageUploadError('Upload error');
                    setImageProgress(null);
                },() => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setImageUploadError(null);
                        setImageProgress(null);
                        setFromData({...fromData,image:downloadURL});
                        
                    });
                }
            );
        } catch (error) {
            setImageUploadError('Image Upload failed!');
            setImageProgress(null);
        }

    }
    

    return (
        <div className="p-3 max-w-3xl mx-auto min-h-screen">
            <h1 className="font-semibold text-2xl md:text-4xl text-center my-7">CreatePost</h1>
            <form className="flex flex-col gap-4" >
                <div className="flex flex-col gap-4 sm:flex-row justify-between items-center">
                    <TextInput type="text" placeholder='Title' className="w-full flex-1" required autoComplete="true" color='gray' />
                    <div className="flex flex-wrap">
                        <div className="flex items-center gap-2">
                            <Checkbox id="accept-react" value='react' defaultChecked />
                            <Label htmlFor="accept-react" className="flex">
                                React
                            </Label>
                            <Checkbox id="accept-javascript" value='javascript' />
                            <Label htmlFor="accept-javascript" className="flex">
                                JavaScript
                            </Label>
                            <Checkbox id="accept-nodejs" value='nodejs' />
                            <Label htmlFor="accept-nodejs" className="flex">
                                Nodejs
                            </Label>
                            <Checkbox id="accept-htmlcss" value='html&css' />
                            <Label htmlFor="accept-htmlcss" className="flex">
                                Html&Css
                            </Label>
                            <Checkbox id="accept-flowbite" value='flowbite' />
                            <Label htmlFor="accept-flowbite" className="flex">
                                Flowbite
                            </Label>
                        </div>
                    </div>
                </div>
                <Textarea className="flex-1" type="text" placeholder='Description' required autoComplete="true" />
                <label htmlFor="fileUpload">Header Picture</label>
                <div className="w-full rounded-lg border-dashed border-2 p-2 flex flex-row  items-center justify-between">
                    <FileInput id="file" onChange={(e) => setFile(e.target.files[0])}/>
                    <Button color="blue"  onClick={handleUploadImage} disabled={imageProgress}>
                        {imageProgress ? (
                           <div className="w-16 h-16">
                                <CircularProgressbar 
                                    value={imageProgress} 
                                    text={`${imageProgress}%`} 
                                />
                           </div>
                        ) : 
                        ("Upload")}
                    </Button>
                </div>
                {imageUploadError ? (
                    <span className="text-red-500 text-sm">
                        {imageUploadError}
                    </span>
                ) : (null)}

                {fromData.image ? (
                    <img 
                        src={file ? URL.createObjectURL(file) : ""} 
                        alt="้header picture" 
                        className="w-full h-64 object-cover" 
                    />
                    ) : (null)}
                <ReactQuill
                    ref={quillRef}
                    theme="snow"
                    placeholder="Write something...."
                    className="h-72 mb-12 text-gray-900 dark:text-gray-100"
                    required
                />
                <Button color='blue' type='submit'>Publish</Button>
            </form>
        </div>
    );
}

export default CreatePost;
